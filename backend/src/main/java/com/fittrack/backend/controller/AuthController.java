package com.fittrack.backend.controller;
import com.fittrack.backend.model.*;

import com.fittrack.backend.repository.DataStore;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    public record LoginRequest(String email, String password, String role) {}
    public record CheckEmailRequest(String email) {}

    public record RegisterRequest(
            String email,
            String password,
            String firstName,
            String lastName,
            String dateOfBirth,
            String sex,
            Integer age,
            Double weightKg,
            Double heightMeters,
            String primaryGoal,
            String membershipTier,
            String billingCycle,
            String referenceNumber
    ) {}

    public record AuthResponse(String id, String fullName, String email, String role) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        var found = DataStore.getInstance().users().findByEmail(req.email());
        if (found.isEmpty()
                || !found.get().verifyPassword(req.password())
                || !found.get().getRole().equalsIgnoreCase(req.role())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email, password, or role"));
        }
        return ResponseEntity.ok(toResponse(found.get()));
    }

    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestBody CheckEmailRequest req) {
        if (req.email() == null || req.email().trim().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        String cleanEmail = req.email().trim().toLowerCase();
        if (DataStore.getInstance().users().findByEmail(cleanEmail).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email is already registered"));
        }
        return ResponseEntity.ok(Map.of("available", true, "message", "Email is available"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        var store = DataStore.getInstance();
        String cleanEmail = req.email() != null ? req.email().trim().toLowerCase() : "";

        if (cleanEmail.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        if (store.users().findByEmail(cleanEmail).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Email already registered"));
        }

        String memberId = "M" + UUID.randomUUID().toString().substring(0, 8);
        String firstName = req.firstName() != null && !req.firstName().isBlank() ? req.firstName().trim() : "Member";
        String lastName = req.lastName() != null && !req.lastName().isBlank() ? req.lastName().trim() : "User";

        LocalDate dob = null;
        if (req.dateOfBirth() != null && !req.dateOfBirth().isBlank()) {
            try {
                dob = LocalDate.parse(req.dateOfBirth().trim());
            } catch (Exception ignored) {}
        }

        double height = req.heightMeters() != null && req.heightMeters() > 0
                ? (req.heightMeters() > 3.0 ? req.heightMeters() / 100.0 : req.heightMeters()) // converts cm to meters if needed
                : 1.75;
        double weight = req.weightKg() != null && req.weightKg() > 0 ? req.weightKg() : 70.0;
        String goal = req.primaryGoal() != null && !req.primaryGoal().isBlank() ? req.primaryGoal().trim() : "Build Muscle";
        String sex = req.sex() != null && !req.sex().isBlank() ? req.sex().trim() : "Unspecified";

        Member member = new Member(memberId, firstName, lastName, cleanEmail, req.password(),
                dob, sex, goal, height, weight);
        store.users().save(member);

        MembershipTier tier;
        try {
            tier = req.membershipTier() != null ? MembershipTier.valueOf(req.membershipTier().trim().toUpperCase()) : MembershipTier.BRONZE;
        } catch (IllegalArgumentException e) {
            tier = MembershipTier.BRONZE;
        }

        BillingCycle cycle;
        try {
            cycle = req.billingCycle() != null ? BillingCycle.valueOf(req.billingCycle().trim().toUpperCase()) : BillingCycle.MONTHLY;
        } catch (IllegalArgumentException e) {
            cycle = BillingCycle.MONTHLY;
        }

        String membershipId = "MS-" + UUID.randomUUID().toString().substring(0, 8);
        Membership membership = new Membership(membershipId, memberId, tier, cycle, LocalDate.now());
        store.memberships().save(membership);

        BodyMetric initialMetric = new BodyMetric(
                "BM-" + UUID.randomUUID().toString().substring(0, 8),
                memberId,
                null,
                LocalDate.now(),
                weight,
                18.0, // baseline placeholder
                Math.round(weight * 0.45 * 10.0) / 10.0, // estimated initial muscle mass
                height,
                "Initial Registration Check-in"
        );
        store.metrics().save(initialMetric);

        store.notifications().save(new Notification(
                "N-" + UUID.randomUUID().toString().substring(0, 8),
                memberId,
                Notification.Type.MEMBERSHIP_RENEWED,
                "Welcome to FitTrack!",
                "Your " + tier.name() + " membership is active. Welcome aboard!",
                LocalDateTime.now()
        ));

        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(member));
    }

    private AuthResponse toResponse(User u) {
        return new AuthResponse(u.getId(), u.getFullName(), u.getEmail(), u.getRole());
    }
}