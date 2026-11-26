// Dummy chart data: muscle mass (kg) per day, grouped by month.
const nov = [[1,69.4],[3,70.1],[5,70.8],[7,71.3],[10,71.8],[12,71.4],[14,70.9],[16,71.4],[17,71.6],[19,72.1],[21,72.7],[23,72.9],[25,73.2],[27,73.7],[28,73.9],[29,74.2],[30,74.5]];
const oct = [[1,66.9],[4,67.3],[7,67.6],[10,67.4],[13,67.9],[16,68.2],[19,68.0],[22,68.5],[25,68.9],[28,69.2],[31,69.4]];
const toPoints = (rows) => rows.map(([day, value]) => ({ day, value }));

export const progressByMonth = {
  "November 2026": { month: "Nov", xTicks: [1, 7, 14, 21, 28, 30], points: toPoints(nov) },
  "October 2026": { month: "Oct", xTicks: [1, 7, 13, 19, 25, 31], points: toPoints(oct) },
};

export const metrics = [
  { label: "Current Weight", value: 78.4, unit: "kg" },
  { label: "Body fat %", value: 15.2, unit: "%" },
  { label: "Muscle Mass", value: 63.1, unit: "kg" },
  { label: "BMI", value: 25.6, unit: "" },
];

export const latestSession = { title: "Upper body push", when: "Nov 20, 2026 · 9:00–10:00 AM", trainer: "John Smith" };
export const trainerMessage =
  "Consistency is the key. So far, you have been doing well and consistent with our workout plan; soon we will upgrade the intensity of your workout to hasten the progress of reaching your goal.";
