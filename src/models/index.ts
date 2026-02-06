// Export all models and interfaces from a single entry point
export * from './models';

const today = new Date();
today.setHours(7, 0, 0, 0);
export const STARTIME = today.toISOString();
const endTime = new Date();
endTime.setHours(20, 0, 0, 0);
export const ENDTIME = endTime.toISOString(); 