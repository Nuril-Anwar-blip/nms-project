/**
 * File: services/api.ts
 * Deskripsi: API service layer untuk komunikasi dengan backend
 * 
 * Fungsi:
 * - Authentication (login, logout, register, getCurrentUser)
 * - Dashboard (stats, OLT performance, recent alarms)
 * - Alarms (get, acknowledge, clear)
 * - Dan fungsi-fungsi API lainnya
 */

// Base URL untuk API
const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

/**
 * Fungsi: getAuthHeaders
 * Mendapatkan headers untuk request yang memerlukan autentikasi
 */
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

/**
 * Fungsi: handleResponse
 * Handle response dari API, throw error jika response tidak OK
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// ==================== Authentication API ====================

/**
 * Login ke sistem
 * @param credentials Email dan password
 * @returns Token dan user data
 */
export async function login(credentials: { email: string; password: string }): Promise<any> {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return handleResponse(response);
}

/**
 * Logout dari sistem
 */
export async function logout(): Promise<void> {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

/**
 * Mendapatkan informasi user saat ini
 * @returns User data
 */
export async function getCurrentUser(): Promise<any> {
  const response = await fetch(`${API_BASE}/api/auth/me`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

/**
 * Daftarkan user baru (register)
 *
 * Deskripsi:
 * Fungsi ini memanggil endpoint backend `POST /api/auth/register` untuk
 * membuat user baru. Backend pada implementasi saat ini mengharuskan
 * request dilakukan oleh administrator yang sudah terautentikasi.
 *
 * Payload yang dikirim: { name, email, password, role?, phone?, instansi?, province?, city?, district? }
 *
 * @param data Objek data pendaftaran
 * @returns Respons API (user yang dibuat)
 */
export async function registerUser(data: { 
  name: string; 
  email: string; 
  password: string; 
  role?: string;
  phone?: string;
  instansi?: string;
  province?: string;
  city?: string;
  district?: string;
}): Promise<any> {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(response)
}

/**
 * Mengirim kode verifikasi OTP ke email atau nomor telepon
 * @param email Email untuk verifikasi (opsional)
 * @param phone Nomor telepon untuk verifikasi (opsional)
 * @returns Response dari server
 */
export async function sendVerificationCode(email?: string, phone?: string): Promise<any> {
  const response = await fetch(`${API_BASE}/api/auth/send-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, phone })
  })
  return handleResponse(response)
}

/**
 * Memverifikasi kode OTP
 * @param code Kode OTP yang dimasukkan user
 * @param email Email yang digunakan (opsional)
 * @param phone Nomor telepon yang digunakan (opsional)
 * @returns Response dari server
 */
export async function verifyCode(code: string, email?: string, phone?: string): Promise<any> {
  const response = await fetch(`${API_BASE}/api/auth/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, email, phone })
  })
  return handleResponse(response)
}

// ==================== Dashboard API ====================

/**
 * Mendapatkan statistik dashboard
 * @returns Dashboard statistics
 */
export async function getDashboardStats(): Promise<any> {
  const response = await fetch(`${API_BASE}/api/dashboard/stats`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

/**
 * Mendapatkan performa OLT
 * @returns List performa OLT
 */
export async function getOltPerformance(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/api/dashboard/olt-performance`, {
    headers: getAuthHeaders()
  });
  return handleResponse<any[]>(response);
}

/**
 * Mendapatkan alarm terbaru
 * @param limit Jumlah alarm yang diambil
 * @returns List alarm
 */
export async function getRecentAlarms(limit: number = 10): Promise<any[]> {
  const response = await fetch(`${API_BASE}/api/dashboard/recent-alarms?limit=${limit}`, {
    headers: getAuthHeaders()
  });
  return handleResponse<any[]>(response);
}

// ==================== OLT API ====================

/**
 * Mendapatkan semua OLT
 * @returns List OLT
 */
export async function getOlts(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/api/olts`, {
    headers: getAuthHeaders()
  });
  return handleResponse<any[]>(response);
}

/**
 * Membuat OLT baru
 * @param data Data OLT yang akan dibuat
 * @returns OLT yang telah dibuat
 */
export async function createOlt(data: any): Promise<any> {
  const response = await fetch(`${API_BASE}/api/olts`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

/**
 * Update OLT
 * @param id ID OLT yang akan diupdate
 * @param data Data OLT yang akan diupdate
 * @returns OLT yang telah diupdate
 */
export async function updateOlt(id: number, data: any): Promise<any> {
  const response = await fetch(`${API_BASE}/api/olts/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

/**
 * Hapus OLT
 * @param id ID OLT yang akan dihapus
 */
export async function deleteOlt(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/api/olts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

// ==================== ONU API ====================

/**
 * Mendapatkan semua ONU
 * @param filters Filter opsional (olt_id, status)
 * @returns List ONU
 */
export async function getOnus(filters?: { olt_id?: number; status?: string }): Promise<any[]> {
  const params = new URLSearchParams();
  if (filters?.olt_id) params.append('olt_id', filters.olt_id.toString());
  if (filters?.status) params.append('status', filters.status);
  
  const url = `${API_BASE}/api/onus${params.toString() ? '?' + params.toString() : ''}`;
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });
  return handleResponse<any[]>(response);
}

/**
 * Mendapatkan ONU dari OLT tertentu
 * @param oltId ID OLT
 * @returns List ONU dari OLT tersebut
 */
export async function getOltOnus(oltId: number): Promise<any[]> {
  const response = await fetch(`${API_BASE}/api/monitoring/olt/${oltId}/onus`, {
    headers: getAuthHeaders()
  });
  return handleResponse<any[]>(response);
}

/**
 * Membuat ONU baru
 * @param data Data ONU yang akan dibuat
 * @returns ONU yang telah dibuat
 */
export async function createOnu(data: any): Promise<any> {
  const response = await fetch(`${API_BASE}/api/onus`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

/**
 * Update ONU
 * @param id ID ONU yang akan diupdate
 * @param data Data ONU yang akan diupdate
 * @returns ONU yang telah diupdate
 */
export async function updateOnu(id: number, data: any): Promise<any> {
  const response = await fetch(`${API_BASE}/api/onus/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

/**
 * Hapus ONU
 * @param id ID ONU yang akan dihapus
 */
export async function deleteOnu(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/api/onus/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

/**
 * Reboot ONU
 * @param id ID ONU yang akan di-reboot
 * @returns Response dari server
 */
export async function rebootOnu(id: number): Promise<any> {
  const response = await fetch(`${API_BASE}/api/provisioning/onu/${id}/reboot`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

/**
 * Test koneksi ke OLT
 * @param id ID OLT yang akan di-test
 * @returns Response dari server
 */
export async function testOltConnection(id: number): Promise<any> {
  const response = await fetch(`${API_BASE}/api/olts/${id}/test-connection`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

/**
 * Poll OLT untuk mendapatkan data terbaru
 * @param id ID OLT yang akan di-poll
 * @returns Data polling OLT
 */
export async function pollOlt(id: number): Promise<any> {
  const response = await fetch(`${API_BASE}/api/monitoring/olt/${id}/poll`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

/**
 * Sync ONU dari OLT ke database
 * @param id ID OLT yang akan di-sync
 * @returns Response dari server
 */
export async function syncOnus(id: number): Promise<any> {
  const response = await fetch(`${API_BASE}/api/monitoring/olt/${id}/sync-onus`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

/**
 * Provision ONU
 * @param data Data provisioning ONU
 * @returns Response dari server
 */
export async function provisionOnu(data: any): Promise<any> {
  const response = await fetch(`${API_BASE}/api/provisioning/onu`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

/**
 * Mendapatkan activity logs
 * @param filters Filter opsional (limit, skip, user_id, activity_type)
 * @returns List activity logs
 */
export async function getActivityLogs(filters?: {
  limit?: number;
  skip?: number;
  user_id?: number;
  activity_type?: string;
}): Promise<any[]> {
  const params = new URLSearchParams();
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.skip) params.append('skip', filters.skip.toString());
  if (filters?.user_id) params.append('user_id', filters.user_id.toString());
  if (filters?.activity_type) params.append('activity_type', filters.activity_type);
  
  const url = `${API_BASE}/api/activity-logs${params.toString() ? '?' + params.toString() : ''}`;
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });
  return handleResponse<any[]>(response);
}

/**
 * Mendapatkan OLT untuk map
 * @returns List OLT dengan koordinat untuk map
 */
export async function getMapOlts(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/api/maps/olts`, {
    headers: getAuthHeaders()
  });
  return handleResponse<any[]>(response);
}

/**
 * Mendapatkan ONU untuk map
 * @param filters Filter opsional (olt_id)
 * @returns List ONU dengan koordinat untuk map
 */
export async function getMapOnus(filters?: { olt_id?: number }): Promise<any[]> {
  const params = new URLSearchParams();
  if (filters?.olt_id) params.append('olt_id', filters.olt_id.toString());
  
  const url = `${API_BASE}/api/maps/onus${params.toString() ? '?' + params.toString() : ''}`;
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });
  return handleResponse<any[]>(response);
}

// ==================== Alarms API ====================

/**
 * Mendapatkan semua alarms
 * @returns List alarms
 */
export async function getAlarms(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/api/alarms`, {
    headers: getAuthHeaders()
  });
  return handleResponse<any[]>(response);
}

/**
 * Acknowledge alarm
 * @param alarmId ID alarm yang akan di-acknowledge
 * @returns Response dari server
 */
export async function acknowledgeAlarm(alarmId: number): Promise<any> {
  const response = await fetch(`${API_BASE}/api/alarms/${alarmId}/acknowledge`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

/**
 * Clear alarm
 * @param alarmId ID alarm yang akan di-clear
 * @returns Response dari server
 */
export async function clearAlarm(alarmId: number): Promise<any> {
  const response = await fetch(`${API_BASE}/api/alarms/${alarmId}/clear`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}
