declare module '../mockApi/workoutData.json' {
  interface WorkoutData {
    [key: string]: string[];
  }
  const data: WorkoutData;
  export default data;
} 