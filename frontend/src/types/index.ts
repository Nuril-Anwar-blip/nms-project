/** AUTO-DOC: src/types/index.ts
 * Deskripsi: Komponen / modul frontend.
 * Catatan: Tambahkan deskripsi lebih lengkap sesuai kebutuhan.
 */

/**
 * File: types/index.ts
 * 
 * Definisi tipe data TypeScript untuk aplikasi NMS ZTE OLT
 * Berisi interface dan type untuk data OLT, ONU, Alarm, User, dll
 * yang digunakan di seluruh aplikasi frontend
 */

// Tipe data untuk User/Authentication
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'operator';
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Tipe data untuk OLT
export interface Olt {
  id: number;
  name: string;
  hostname?: string;
  ip_address: string;
  vendor: string;
  model?: string;
  firmware_version?: string;
  snmp_community: string;
  snmp_version: number;
  snmp_port: number;
  status: 'online' | 'offline' | 'unknown';
  cpu_usage?: number;
  memory_usage?: number;
  uptime?: number;
  temperature?: number;
  last_polled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface OltCreate {
  name: string;
  ip_address: string;
  model?: string;
  snmp_community?: string;
  snmp_version?: number;
  snmp_port?: number;
  ssh_username?: string;
  ssh_password?: string;
  api_endpoint?: string;
}

// Tipe data untuk ONU
export interface Onu {
  id: number;
  olt_id: number;
  pon_id?: number;
  serial_number: string;
  name?: string;
  pon_port: number;
  onu_id: number;
  status: 'online' | 'offline' | 'unknown';
  admin_status: 'enabled' | 'disabled';
  model?: string;
  mac_address?: string;
  ip_address?: string;
  rx_power?: number;
  tx_power?: number;
  rx_bytes: number;
  tx_bytes: number;
  service_profile?: string;
  location_id?: number;
  description?: string;
  provisioned_at?: string;
  last_seen_at?: string;
  last_status_change?: string;
  created_at: string;
  updated_at: string;
}

export interface OnuCreate {
  olt_id: number;
  serial_number: string;
  pon_port: number;
  onu_id: number;
  name?: string;
  model?: string;
  location_id?: number;
  description?: string;
}

// Tipe data untuk Alarm
export interface Alarm {
  id: number;
  olt_id?: number;
  onu_id?: number;
  severity: 'critical' | 'major' | 'minor' | 'warning' | 'info';
  type: string;
  message: string;
  details?: string;
  status: 'active' | 'cleared' | 'acknowledged';
  occurred_at: string;
  cleared_at?: string;
  acknowledged_at?: string;
  created_at: string;
  updated_at: string;
}

// Tipe data untuk Dashboard Stats
export interface DashboardStats {
  total_olts: number;
  online_olts: number;
  offline_olts: number;
  total_onus: number;
  online_onus: number;
  offline_onus: number;
  active_alarms: number;
  critical_alarms: number;
  major_alarms: number;
  minor_alarms: number;
}

export interface OltPerformance {
  id: number;
  name: string;
  ip_address: string;
  status: 'online' | 'offline' | 'unknown';
  cpu_usage?: number;
  memory_usage?: number;
  uptime?: number;
  temperature?: number;
  last_polled_at?: string;
}

// Tipe data untuk Activity Log
export interface ActivityLog {
  id: number;
  user_id?: number;
  activity_type: 'create' | 'update' | 'delete' | 'provision' | 'reboot' | 'reset' | 'login' | 'logout' | 'other';
  entity_type: string;
  entity_id?: number;
  description: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: User;
}

// Tipe data untuk PPPoE Account
export interface PppoeAccount {
  id: number;
  onu_id: number;
  username: string;
  password: string;
  service_name?: string;
  vlan_id?: string;
  status: 'active' | 'inactive' | 'suspended';
  download_speed?: number;
  upload_speed?: number;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

// Tipe data untuk Provisioning Request
export interface ProvisionOnuRequest {
  olt_id: number;
  serial_number: string;
  pon_port: number;
  onu_id: number;
  name?: string;
  model?: string;
  location_id?: number;
  description?: string;
  pppoe?: {
    username: string;
    password: string;
    vlan_id?: string;
    download_speed?: number;
    upload_speed?: number;
  };
  // Additional optional fields used by frontend provisioning form
  service_profile?: string;
  vlan_id?: number;
  create_pppoe_account?: boolean;
  pppoe_username?: string;
  pppoe_password?: string;
}

// Tipe data untuk API Response
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  total: number;
  skip: number;
  limit: number;
  data: T[];
}

