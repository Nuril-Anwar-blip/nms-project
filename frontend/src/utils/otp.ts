/**
 * File: utils/otp.ts
 * Deskripsi: Utility untuk OTP (One Time Password) verification
 * 
 * Catatan: Ini adalah implementasi sederhana di frontend
 * Untuk production, sebaiknya OTP di-generate dan di-verify di backend
 */

/**
 * Simulasi generate OTP (untuk development)
 * Di production, ini harus dilakukan di backend
 */
export function generateOTP(): string {
  // Generate 6 digit random number
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Simulasi send OTP (untuk development)
 * Di production, ini harus mengirim email/SMS melalui backend
 */
export function simulateSendOTP(email?: string, phone?: string): string {
  const code = generateOTP();
  // Simpan ke localStorage untuk simulasi (dalam production, backend yang handle)
  const key = email ? `otp_email_${email}` : `otp_phone_${phone}`;
  localStorage.setItem(key, code);
  localStorage.setItem(`${key}_expiry`, (Date.now() + 5 * 60 * 1000).toString()); // 5 menit expiry
  
  // Simulasi delay
  console.log(`[DEV] OTP untuk ${email || phone}: ${code}`);
  console.log(`[DEV] Dalam production, ini akan dikirim via email/SMS`);
  
  return code;
}

/**
 * Verify OTP code
 */
export function verifyOTP(code: string, email?: string, phone?: string): boolean {
  const key = email ? `otp_email_${email}` : `otp_phone_${phone}`;
  const storedCode = localStorage.getItem(key);
  const expiry = localStorage.getItem(`${key}_expiry`);
  
  if (!storedCode || !expiry) {
    return false;
  }
  
  // Check expiry
  if (Date.now() > parseInt(expiry)) {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_expiry`);
    return false;
  }
  
  // Verify code
  if (code === storedCode) {
    // Clear OTP setelah berhasil
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_expiry`);
    return true;
  }
  
  return false;
}

/**
 * Clear OTP (untuk cleanup)
 */
export function clearOTP(email?: string, phone?: string): void {
  const key = email ? `otp_email_${email}` : `otp_phone_${phone}`;
  localStorage.removeItem(key);
  localStorage.removeItem(`${key}_expiry`);
}

