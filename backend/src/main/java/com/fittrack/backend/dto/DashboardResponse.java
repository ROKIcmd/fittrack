package com.fittrack.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record DashboardResponse(
        String memberId,
        String firstName,
        String primaryGoal,
        MembershipCard membership,
        List<PlanOption> plans,
        List<BillingItem> billingHistory,
        UpcomingSession upcomingSession,
        List<WorkoutLogItem> recentWorkouts,
        List<ProgressPoint> muscleGainProgress,
        BodyStats bodyStats,
        List<NotificationItem> notifications,
        TrainerCard trainer
) {
    public record MembershipCard(
            String tier,
            String cycle,
            boolean active,
            long daysRemaining,
            LocalDate renewalDate,
            int progressPercent,
            List<String> inclusions
    ) {}

    public record PlanOption(
            String tier,
            double monthlyPrice,
            List<String> inclusions,
            boolean current
    ) {}

    public record BillingItem(
            LocalDate date,
            String referenceNumber,
            String status,
            double amount
    ) {}

    public record UpcomingSession(
            String sessionId,
            String title,
            String routineCategory,
            LocalDate date,
            LocalTime startTime,
            int durationMinutes,
            String status
    ) {}

    public record WorkoutLogItem(
            String sessionId,
            String title,
            LocalDate date,
            int durationMinutes,
            double loadKg,
            int exercisesCompleted,
            int totalExercises,
            String status
    ) {}

    public record ProgressPoint(
            LocalDate date,
            double muscleMassKg
    ) {}

    public record BodyStats(
            LocalDate asOf,
            double weightKg,
            double bodyFatPercent,
            double muscleMassKg,
            double bmi,
            String trainerNote
    ) {}

    public record NotificationItem(
            String type,
            String title,
            String message,
            LocalDateTime createdAt,
            boolean read
    ) {}

    public record TrainerCard(
            String trainerId,
            String fullName,
            String education,
            String specialization,
            int yearsOfExperience,
            String shortMessage,
            int currentClients,
            String photoUrl
    ) {}
}