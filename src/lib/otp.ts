/**
 * Генерирует 6-значный OTP код
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Проверяет валидность OTP кода
 */
export function isValidOTP(code: string): boolean {
  return /^\d{6}$/.test(code);
}

/**
 * Генерирует время истечения OTP (по умолчанию 10 минут)
 */
export function getOTPExpiryTime(minutes: number = 10): Date {
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + minutes);
  return expiryTime;
}

