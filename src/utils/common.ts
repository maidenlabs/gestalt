/**
 * Delays execution for the specified number of minutes
 * @param minutes The number of minutes to wait
 * @returns Promise that resolves when the delay is complete
 */
export async function minutesDelay(minutes: number): Promise<void> {
  const delay = minutes * 60 * 1000; // Convert minutes to milliseconds
  await new Promise((resolve) => setTimeout(resolve, delay));
}