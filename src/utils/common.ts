/**
 * Delays execution until the next N-minute boundary
 * @param minutes The number of minutes to wait (e.g., 60 for hourly, 15 for quarter-hourly)
 * @returns Promise that resolves when the delay is complete
 */
export async function minutesDelay(minutes: number): Promise<void> {
    const now = new Date();
    const next = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      Math.ceil(now.getMinutes() / minutes) * minutes,
      0,
      0
    );
    
    const delay = next.getTime() - Date.now();
    await new Promise((resolve) => setTimeout(resolve, delay));
  }