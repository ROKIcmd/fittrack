const trainingDiet = {
  kcal: "2,800",
  protein: "175g",
  carbs: "310g",
  meals: [
    { label: "Breakfast", items: "Oatmeal, Whey & Banana" },
    { label: "Pre-Workout", items: "Chicken Breast & Rice" },
    { label: "Post-Workout", items: "Whey Isolate Shake" },
    { label: "Dinner", items: "Grilled Salmon" },
  ],
};

const restDiet = {
  kcal: "2,400",
  protein: "160g",
  carbs: "240g",
  meals: [
    { label: "Breakfast", items: "Eggs, Toast & Avocado" },
    { label: "Lunch", items: "Tuna Rice Bowl" },
    { label: "Snack", items: "Greek Yogurt & Almonds" },
    { label: "Dinner", items: "Beef Stir-fry & Veggies" },
  ],
};

// status: "completed" | "rescheduled" | "no-show"
export const workoutLogs = [
  {
    id: 1, title: "Upper Body Push", date: "Nov 12, 2026", duration: "45 min", weight: "40kg",
    done: 6, total: 6, status: "completed", goal: "Chest & Shoulders",
    exercises: [
      { name: "Bench press", reps: 8, sets: 4 },
      { name: "Overhead press", reps: 10, sets: 3 },
      { name: "Triceps pushdown", reps: 12, sets: 3 },
    ],
    diet: trainingDiet,
  },
  {
    id: 2, title: "Leg Day", date: "Nov 10, 2026", duration: "50 min", weight: "60kg",
    done: 6, total: 6, status: "completed", goal: "Legs",
    exercises: [
      { name: "Quads", reps: 6, sets: 5 },
      { name: "Seated Curl", reps: 5, sets: 3 },
      { name: "Romanian deadlift", reps: 5, sets: 2 },
    ],
    diet: trainingDiet,
  },
  {
    id: 3, title: "Upper Body Pull", date: "Nov 8, 2026", duration: "--", weight: "--",
    done: 0, total: 6, status: "rescheduled", goal: "Back & Biceps",
    note: "Rescheduled by your trainer to Nov 15, 2026.",
    exercises: [
      { name: "Lat pulldown", reps: 10, sets: 4 },
      { name: "Seated row", reps: 10, sets: 3 },
      { name: "Barbell curl", reps: 12, sets: 3 },
    ],
    diet: restDiet,
  },
  {
    id: 4, title: "Core & Cardio", date: "Nov 6, 2026", duration: "35 min", weight: "--",
    done: 5, total: 5, status: "completed", goal: "Core Stability",
    exercises: [
      { name: "Plank", reps: 1, sets: 4 },
      { name: "Hanging leg raise", reps: 12, sets: 3 },
      { name: "Rowing machine", reps: 1, sets: 3 },
    ],
    diet: restDiet,
  },
  {
    id: 5, title: "Full Body Strength", date: "Nov 4, 2026", duration: "--", weight: "--",
    done: 0, total: 6, status: "no-show", goal: "Full Body",
    note: "Session missed. No workout was recorded for this day.",
    exercises: [
      { name: "Back squat", reps: 6, sets: 4 },
      { name: "Deadlift", reps: 5, sets: 3 },
      { name: "Pull-up", reps: 8, sets: 3 },
    ],
    diet: trainingDiet,
  },
  {
    id: 6, title: "Upper Body Push", date: "Nov 2, 2026", duration: "45 min", weight: "37.5kg",
    done: 6, total: 6, status: "completed", goal: "Chest & Shoulders",
    exercises: [
      { name: "Incline press", reps: 8, sets: 4 },
      { name: "Lateral raise", reps: 12, sets: 3 },
      { name: "Dips", reps: 10, sets: 3 },
    ],
    diet: trainingDiet,
  },
];