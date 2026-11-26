// Date helpers (local time, so dates never shift because of time zones)
export const iso = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const parseIso = (s) => new Date(`${s}T00:00:00`);
export const fmtDate = (s, opts = { weekday: "short", month: "short", day: "numeric" }) =>
  parseIso(s).toLocaleDateString("en-US", opts);

export const TIME_SLOTS = ["6:00 AM", "8:00 AM", "10:00 AM", "4:00 PM", "6:00 PM", "8:00 PM"];

const trainingDiet = {
  kcal: "2,800", protein: "175g", carbs: "310g", water: "4.0L",
  meals: [
    { label: "Breakfast", items: "Oatmeal, Whey & Banana" },
    { label: "Pre-Workout", items: "Chicken Breast & Rice" },
    { label: "Post-Workout", items: "Whey Isolate Shake" },
    { label: "Dinner", items: "Grilled Salmon & Sweet Potato" },
  ],
};

const restDiet = {
  kcal: "2,400", protein: "160g", carbs: "240g", water: "3.0L",
  meals: [
    { label: "Breakfast", items: "Eggs, Toast & Avocado" },
    { label: "Lunch", items: "Tuna Rice Bowl" },
    { label: "Snack", items: "Greek Yogurt & Almonds" },
    { label: "Dinner", items: "Beef Stir-fry & Veggies" },
  ],
};

// Weekly template: 0 = Sunday ... 6 = Saturday. Days not listed are rest days.
const weekly = {
  1: { title: "Leg Day", goal: "Legs", time: "6:00 PM", exercises: [
    { name: "Quads", reps: 6, sets: 5 }, { name: "Seated Curl", reps: 5, sets: 3 }, { name: "Romanian deadlift", reps: 5, sets: 2 } ] },
  2: { title: "Upper Body Push", goal: "Chest & Shoulders", time: "6:00 PM", exercises: [
    { name: "Bench press", reps: 8, sets: 4 }, { name: "Overhead press", reps: 10, sets: 3 }, { name: "Triceps pushdown", reps: 12, sets: 3 } ] },
  4: { title: "Upper Body Pull", goal: "Back & Biceps", time: "6:00 PM", exercises: [
    { name: "Lat pulldown", reps: 10, sets: 4 }, { name: "Seated row", reps: 10, sets: 3 }, { name: "Barbell curl", reps: 12, sets: 3 } ] },
  5: { title: "Core & Cardio", goal: "Core Stability", time: "8:00 AM", exercises: [
    { name: "Plank", reps: 1, sets: 4 }, { name: "Hanging leg raise", reps: 12, sets: 3 }, { name: "Rowing machine", reps: 1, sets: 3 } ] },
  6: { title: "Full Body Strength", goal: "Full Body", time: "10:00 AM", exercises: [
    { name: "Back squat", reps: 6, sets: 4 }, { name: "Deadlift", reps: 5, sets: 3 }, { name: "Pull-up", reps: 8, sets: 3 } ] },
};

export function getPlan(dateIso) {
  const s = weekly[parseIso(dateIso).getDay()];
  return s ? { date: dateIso, ...s, diet: trainingDiet } : null;
}
export const getDiet = (dateIso) => getPlan(dateIso)?.diet ?? restDiet;
