import { Logger } from '@nestjs/common';

export default async function withRetry<T>(
  fn: () => Promise<T>,
  logger: Logger,
  retries = 5,
  delay = 1000,
): Promise<T> {
  let attempt = 0;

  while (attempt < retries) {
    try {
      const res = await fn();
      if (attempt > 0) logger.log('Retry succeeded');
      return res;
    } catch (error) {
      attempt++;
      logger.warn(error);
      logger.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);

      if (attempt >= retries) {
        logger.error(error);
        throw new Error(`Operation failed after ${retries} attempts: ${error}`);
      }

      await new Promise((res) => setTimeout(res, delay));
      delay *= 2; // Exponential backoff
    }
  }
  throw new Error('Unreachable'); // This should never happen
}
