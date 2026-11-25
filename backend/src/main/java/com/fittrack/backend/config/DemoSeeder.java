package com.fittrack.backend.config;

import com.fittrack.backend.model.*;
import com.fittrack.backend.repository.DataStore;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DemoSeeder implements CommandLineRunner {

    static final String MEMBER_ID = "M-TEST-001";
    static final String MEMBER_EMAIL = "juan.cruz@test.co";
    static final String TRAINER_ID = "T-TEST-001";
    static final String TRAINER_EMAIL = "trainer.test@fittrack.com";

    @Override
    public void run(String... args) {
        DataStore store = DataStore.getInstance();

        seedTrainer(store);
        seedMember(store);
        seedMembership(store);
        seedSessions(store);
        seedMetrics(store);
    }

    private void seedTrainer(DataStore store) {
        if (store.users().findByEmail(TRAINER_EMAIL).isPresent()) return;

        Trainer trainer = new Trainer(
                TRAINER_ID, "John", "Smith", TRAINER_EMAIL, "TrainerTest123",
                "BS Exercise Science", "Strength & Conditioning", 5,
                "Let's build your best self, one rep at a time."
        );
        store.users().save(trainer);
        System.out.println("[DemoSeeder] Seeded trainer " + TRAINER_EMAIL);
    }

    private void seedMember(DataStore store) {
        if (store.users().findByEmail(MEMBER_EMAIL).isPresent()) return;

        Member member = new Member(
                MEMBER_ID, "Juan", "Cruz", MEMBER_EMAIL, "MemberTest123",
                LocalDate.of(1995, 4, 12), "Male", "Build muscle",
                1.78, 75.0
        );
        member.setPhoneNumber("09171234567");
        member.setAssignedTrainerId(TRAINER_ID);
        store.users().save(member);
        System.out.println("[DemoSeeder] Seeded member " + MEMBER_EMAIL);
    }

    private void seedMembership(DataStore store) {
        boolean exists = store.memberships().findAll().stream()
                .anyMatch(m -> MEMBER_ID.equals(m.getMemberId()));
        if (exists) return;

        // Started 20 days ago on a 30-day cycle, so 10 days remain
        LocalDate start = LocalDate.now().minusDays(20);
        store.memberships().save(
                new Membership("MS-TEST-001", MEMBER_ID, MembershipTier.GOLD, BillingCycle.MONTHLY, start)
        );
    }

    private void seedSessions(DataStore store) {
        boolean exists = store.sessions().findAll().stream()
                .anyMatch(s -> MEMBER_ID.equals(s.getMemberId()));
        if (exists) return;

        LocalDate today = LocalDate.now();
        LocalTime time = LocalTime.of(18, 0);

        // Past sessions (appear in Recent Workout Log)
        addSession(store, "S-TEST-001", today.minusDays(1),  "Upper Body Push", TrainingSession.Status.COMPLETED, "Push", 6, 6, 40.0);
        addSession(store, "S-TEST-002", today.minusDays(3),  "Legs",            TrainingSession.Status.COMPLETED, "Legs", 6, 6, 60.0);
        addSession(store, "S-TEST-003", today.minusDays(5),  "Upper Body Push", TrainingSession.Status.RESCHEDULED, "Push", 0, 6, 0.0);
        addSession(store, "S-TEST-004", today.minusDays(7),  "Upper Body Push", TrainingSession.Status.COMPLETED, "Push", 6, 6, 40.0);
        addSession(store, "S-TEST-005", today.minusDays(9),  "Back & Core",     TrainingSession.Status.COMPLETED, "Pull", 5, 6, 35.0);
        addSession(store, "S-TEST-006", today.minusDays(12), "Legs",            TrainingSession.Status.NO_SHOW,   "Legs", 0, 6, 0.0);

        // Upcoming session (appears in Schedule card)
        store.sessions().save(new TrainingSession(
                "S-TEST-007", MEMBER_ID, TRAINER_ID, "Legs",
                today.plusDays(2), time, 60,
                TrainingSession.Status.SCHEDULED, "Legs", 0, 6, 0.0
        ));
    }

    private void addSession(DataStore store, String id, LocalDate date, String title,
                            TrainingSession.Status status, String category,
                            int done, int total, double load) {
        store.sessions().save(new TrainingSession(
                id, MEMBER_ID, TRAINER_ID, title, date, LocalTime.of(18, 0), 45,
                status, category, done, total, load
        ));
    }

    private void seedMetrics(DataStore store) {
        boolean exists = store.metrics().findAll().stream()
                .anyMatch(m -> MEMBER_ID.equals(m.getMemberId()));
        if (exists) return;

        LocalDate today = LocalDate.now();
        double height = 1.78;

        // Muscle mass (kg) per check-in: rises overall, with dips along the way
        double[] muscle = { 69.4, 70.6, 70.1, 71.5, 71.0, 72.3, 71.2, 72.8, 73.4, 72.9, 74.5 };
        double[] weight = { 76.4, 76.9, 76.2, 77.1, 76.6, 77.3, 76.5, 77.0, 77.4, 76.8, 78.4 };
        double[] fat    = { 17.0, 16.8, 16.9, 16.4, 16.5, 16.1, 16.3, 15.9, 15.7, 15.8, 15.2 };
        int[] daysAgo   = { 60, 52, 46, 40, 34, 28, 22, 16, 10, 5, 0 };

        for (int i = 0; i < muscle.length; i++) {
            String note = (i == muscle.length - 1) ? "Solid progress. Keep the protein up." : null;

            store.metrics().save(new BodyMetric(
                    "BM-TEST-" + (i + 1), MEMBER_ID, TRAINER_ID,
                    today.minusDays(daysAgo[i]),
                    weight[i], fat[i], muscle[i],
                    height, note
            ));
        }
    }
}