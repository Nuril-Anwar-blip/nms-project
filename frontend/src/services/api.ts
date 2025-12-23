/**
 * File: services/api.ts
 * 
 * Service untuk komunikasi dengan backend API
 * Menyediakan fungsi-fungsi untuk melakukan HTTP request ke endpoint backend
 * dengan handling authentication token dan error
 */

import type {
  LoginRequest,
  LoginResponse,
  User,
  Olt,
  OltCreate,
  Onu,
  OnuCreate,
  Alarm,
  DashboardStats,
  OltPerformance,
  ActivityLog,
  ProvisionOnuRequest,
  ApiResponse
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

/**
 * Mendapatkan header untuk request yang memerlukan authentication
 * @returns Object dengan Authorization header
 */
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

/**
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
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return handleResponse<LoginResponse>(response);
}

/**
 * Logout dari sistem
 */
export async function logout(): Promise<void> {
  const token = localStorage.getItem('token');
  if (token) {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
  }
}

/**
 * Mendapatkan informasi user saat ini
 * @returns User data
 */
export async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_BASE}/api/auth/me`, {
    headers: getAuthHeaders()
  });
  return handleResponse<User>(response);
}

// ==================== Dashboard API ====================

/**
 * Mendapatkan statistik dashboard
 * @returns Dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_BASE}/api/dashboard/stats`, {
    headers: getAuthHeaders()
  });
  return handleResponse<DashboardStats>(response);
}

/**
 * Mendapatkan performa OLT
 * @returns List performa OLT
 */
export async function getOltPerformance(): Promise<OltPerformance[]> {
  const response = await fetch(`${API_BASE}/api/dashboard/olt-performance`, {
    headers: getAuthHeaders()
  });
  return handleResponse<OltPerformance[]>(response);
}

/**
 * Mendapatkan alarm terbaru
 * @param limit Jumlah alarm yang diambil
 * @returns List alarm
 */
export async function getRecentAlarms(limit: number = 10): Promise<Alarm[]> {
  const response = await fetch(`${API_BASE}/api/dashboard/recent-alarms?limit=${limit}`, {
    headers: getAuthHeaders()
  });
  return handleResponse<Alarm[]>(response);
}

// ==================== OLT API ====================

/**
 * Mendapatkan semua OLT
 * @returns List OLT
 */
export async function getOlts(): Promise<Olt[]> {
  const response = await fetch(`${API_BASE}/api/olts`, {
    headers: getAuthHeaders()
  });
  return handleResponse<Olt[]>(response);
}

/**
 * Mendapatkan OLT by ID
 * @param id OLT ID
 * @returns OLT data
 */
export async function getOlt(id: number): Promise<Olt> {
  const response = await fetch(`${API_BASE}/api/olts/${id}`, {
    headers: getAuthHeaders()
  });
  return handleResponse<Olt>(response);
}

/**
 * Membuat OLT baru
 * @param data OLT data
 * @returns Created OLT
 */
export async function createOlt(data: OltCreate): Promise<Olt> {
  const response = await fetch(`${API_BASE}/api/olts`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<Olt>(response);
}

/**
 * Update OLT
 * @param id OLT ID
 * @param data OLT data to update
 * @returns Updated OLT
 */
export async function updateOlt(id: number, data: Partial<OltCreate>): Promise<Olt> {
  const response = await fetch(`${API_BASE}/api/olts/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<Olt>(response);
}

/**
 * Hapus OLT
 * @param id OLT ID
 */
export async function deleteOlt(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/api/olts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to delete OLT');
  }
}

// ==================== ONU API ====================

/**
 * Mendapatkan semua ONU dengan filter opsional
 * @param filters Filter parameters
 * @returns List ONU
 */
export async function getOnus(filters?: {
  olt_id?: number;
  status?: string;
}): Promise<Onu[]> {
  const params = new URLSearchParams();
  if (filters?.olt_id) params.append('olt_id', filters.olt_id.toString());
  if (filters?.status) params.append('status', filters.status);

  const response = await fetch(`${API_BASE}/api/onus?${params}`, {
    headers: getAuthHeaders()
  });
  return handleResponse<Onu[]>(response);
}

/**
 * Mendapatkan ONU by ID
 * @param id ONU ID
 * @returns ONU data
 */
export async function getOnu(id: number): Promise<Onu> {
  const response = await fetch(`${API_BASE}/api/onus/${id}`, {
    headers: getAuthHeaders()
  });
  return handleResponse<Onu>(response);
}

/**
 * Membuat ONU baru
 * @param data ONU data
 * @returns Created ONU
 */
export async function createOnu(data: OnuCreate): Promise<Onu> {
  const response = await fetch(`${API_BASE}/api/onus`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<Onu>(response);
}

/**
 * Update ONU
 * @param id ONU ID
 * @param data ONU data to update
 * @returns Updated ONU
 */
export async function updateOnu(id: number, data: Partial<OnuCreate>): Promise<Onu> {
  const response = await fetch(`${API_BASE}/api/onus/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<Onu>(response);
}

/**
 * Hapus ONU
 * @param id ONU ID
 */
export async function deleteOnu(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/api/onus/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to delete ONU');
  }
}

// ==================== Monitoring API ====================

/**
 * Poll OLT untuk mendapatkan status dan performa terbaru
 * @param oltId OLT ID
 * @returns Poll result
 */
export async function pollOlt(oltId: number): Promise<any> {
  const response = await fetch(`${API_BASE}/api/monitoring/olt/${oltId}/poll`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

/**
 * Sync ONU dari OLT ke database
 * @param oltId OLT ID
 * @returns Sync result
 */
export async function syncOnus(oltId: number): Promise<{
  synced: number;
  created: number;
  updated: number;
}> {
  const response = await fetch(`${API_BASE}/api/monitoring/olt/${oltId}/sync-onus`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

/**
 * Mendapatkan ONU untuk OLT tertentu
 * @param oltId OLT ID
 * @param status Filter by status (optional)
 * @returns List ONU
 */
export async function getOltOnus(oltId: number, status?: string): Promise<Onu[]> {
  const params = status ? `?status=${status}` : '';
  const response = await fetch(`${API_BASE}/api/monitoring/olt/${oltId}/onus${params}`, {
    headers: getAuthHeaders()
  });
  return handleResponse<Onu[]>(response);
}

// ==================== Provisioning API ====================

/**
 * Provision ONU baru
 * @param data Provisioning data
 * @returns Created ONU
 */
export async function provisionOnu(data: ProvisionOnuRequest): Promise<Onu> {
  const response = await fetch(`${API_BASE}/api/provisioning/onu`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse<Onu>(response);
}

/**
 * Update serial number ONU
 * @param onuId ONU ID
 * @param serialNumber New serial number
 * @returns Updated ONU
 */
export async function updateOnuSerial(onuId: number, serialNumber: string): Promise<Onu> {
  const response = await fetch(`${API_BASE}/api/provisioning/onu/${onuId}/serial`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ serial_number: serialNumber })
  });
  return handleResponse<Onu>(response);
}

/**
 * Update nama ONU
 * @param onuId ONU ID
 * @param name New name
 * @returns Updated ONU
 */
export async function updateOnuName(onuId: number, name: string): Promise<Onu> {
  const response = await fetch(`${API_BASE}/api/provisioning/onu/${onuId}/name`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name })
  });
  return handleResponse<Onu>(response);
}

/**
 * Reboot ONU
 * @param onuId ONU ID
 */
export async function rebootOnu(onuId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/api/provisioning/onu/${onuId}/reboot`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to reboot ONU');
  }
}

/**
 * Reset ONU ke factory default
 * @param onuId ONU ID
 */
export async function resetOnu(onuId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/api/provisioning/onu/${onuId}/reset`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to reset ONU');
  }
}

// ==================== Alarm API ====================

/**
 * Mendapatkan semua alarm dengan filter
 * @param filters Filter parameters
 * @returns List alarm
 */
export async function getAlarms(filters?: {
  status?: string;
  severity?: string;
  olt_id?: number;
  onu_id?: number;
}): Promise<Alarm[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.severity) params.append('severity', filters.severity);
  if (filters?.olt_id) params.append('olt_id', filters.olt_id.toString());
  if (filters?.onu_id) params.append('onu_id', filters.onu_id.toString());

  const response = await fetch(`${API_BASE}/api/alarms?${params}`, {
    headers: getAuthHeaders()
  });
  return handleResponse<Alarm[]>(response);
}

/**
 * Acknowledge alarm
 * @param alarmId Alarm ID
 */
export async function acknowledgeAlarm(alarmId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/api/alarms/${alarmId}/acknowledge`, {
    method: 'PUT',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to acknowledge alarm');
  }
}

// ==================== Activity Log API ====================

/**
 * Mendapatkan activity logs dengan filter
 * @param filters Filter parameters
 * @returns Activity logs dengan pagination
 */
export async function getActivityLogs(filters?: {
  skip?: number;
  limit?: number;
  activity_type?: string;
  entity_type?: string;
  user_id?: number;
}): Promise<{
  total: number;
  skip: number;
  limit: number;
  logs: ActivityLog[];
}> {
  const params = new URLSearchParams();
  if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.activity_type) params.append('activity_type', filters.activity_type);
  if (filters?.entity_type) params.append('entity_type', filters.entity_type);
  if (filters?.user_id) params.append('user_id', filters.user_id.toString());

  const response = await fetch(`${API_BASE}/api/activity-logs?${params}`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
}

