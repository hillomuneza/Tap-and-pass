export const roles = [
  { id: 1, name: 'administrator', description: 'Full system access' },
  { id: 2, name: 'supervisor', description: 'Monitor and manage operations' },
  { id: 3, name: 'officer', description: 'Process border crossings' },
  { id: 4, name: 'department_officer', description: 'Department-specific access' },
  { id: 5, name: 'traveler', description: 'Traveler portal access' }
]

export const departments = [
  { id: 1, name: 'Immigration', description: 'Immigration control' },
  { id: 2, name: 'Customs', description: 'Customs and excise' },
  { id: 3, name: 'Border Security', description: 'Border security' },
  { id: 4, name: 'Police', description: 'Border police' },
  { id: 5, name: 'Health', description: 'Health and quarantine' },
  { id: 6, name: 'Administration', description: 'Administrative support' }
]

export const checkpoints = [
  { id: 1, name: 'Gatuna', border_name: 'Rwanda-Uganda Border', country: 'Rwanda', location: 'Gatuna, Northern Province', device_id: 'DEV-001', status: 'OPEN' },
  { id: 2, name: 'Cyanika', border_name: 'Rwanda-Uganda Border', country: 'Rwanda', location: 'Cyanika, Northern Province', device_id: 'DEV-002', status: 'OPEN' },
  { id: 3, name: 'Kagitumba', border_name: 'Rwanda-Uganda Border', country: 'Rwanda', location: 'Kagitumba, Northern Province', device_id: 'DEV-003', status: 'OPEN' },
  { id: 4, name: 'Mirama Hills', border_name: 'Rwanda-Uganda Border', country: 'Rwanda', location: 'Mirama Hills, Northern Province', device_id: 'DEV-004', status: 'OPEN' },
  { id: 5, name: 'Nyungwe', border_name: 'Rwanda-Burundi Border', country: 'Rwanda', location: 'Nyungwe, Southern Province', device_id: 'DEV-005', status: 'OPEN' },
  { id: 6, name: 'Ruzizi', border_name: 'Rwanda-DRC Border', country: 'Rwanda', location: 'Ruzizi, Western Province', device_id: 'DEV-006', status: 'OPEN' },
  { id: 7, name: 'Bukavu', border_name: 'Rwanda-DRC Border', country: 'Rwanda', location: 'Bukavu, Western Province', device_id: 'DEV-007', status: 'OPEN' },
  { id: 8, name: 'Goma', border_name: 'Rwanda-DRC Border', country: 'Rwanda', location: 'Goma, Northern Province', device_id: 'DEV-008', status: 'OPEN' },
  { id: 9, name: 'Ishasha', border_name: 'Rwanda-DRC Border', country: 'Rwanda', location: 'Ishasha, Western Province', device_id: 'DEV-009', status: 'OPEN' },
  { id: 10, name: 'Buta', border_name: 'Rwanda-Burundi Border', country: 'Rwanda', location: 'Buta, Southern Province', device_id: 'DEV-010', status: 'OPEN' },
  { id: 11, name: 'Mukumba', border_name: 'Rwanda-Burundi Border', country: 'Rwanda', location: 'Mukumba, Southern Province', device_id: 'DEV-011', status: 'OPEN' },
  { id: 12, name: 'Mahagi', border_name: 'Rwanda-Uganda Border', country: 'Rwanda', location: 'Mahagi, Northern Province', device_id: 'DEV-012', status: 'OPEN' }
]

export const devices = [
  { id: 'DEV-001', device_name: 'Reader GT-01', device_type: 'NFC', serial_number: 'SN-001', checkpoint_id: 1, status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
  { id: 'DEV-002', device_name: 'Reader CY-02', device_type: 'NFC', serial_number: 'SN-002', checkpoint_id: 2, status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
  { id: 'DEV-003', device_name: 'Reader KG-03', device_type: 'NFC', serial_number: 'SN-003', checkpoint_id: 3, status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
  { id: 'DEV-004', device_name: 'Reader MH-04', device_type: 'NFC', serial_number: 'SN-004', checkpoint_id: 4, status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
  { id: 'DEV-005', device_name: 'Reader NW-05', device_type: 'NFC', serial_number: 'SN-005', checkpoint_id: 5, status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
  { id: 'DEV-006', device_name: 'Reader RZ-06', device_type: 'NFC', serial_number: 'SN-006', checkpoint_id: 6, status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
  { id: 'DEV-007', device_name: 'Reader BK-07', device_type: 'NFC', serial_number: 'SN-007', checkpoint_id: 7, status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
  { id: 'DEV-008', device_name: 'Reader GM-08', device_type: 'NFC', serial_number: 'SN-008', checkpoint_id: 8, status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
  { id: 'DEV-009', device_name: 'Reader IH-09', device_type: 'NFC', serial_number: 'SN-009', checkpoint_id: 9, status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
  { id: 'DEV-010', device_name: 'Reader BT-10', device_type: 'NFC', serial_number: 'SN-010', checkpoint_id: 10, status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
  { id: 'DEV-011', device_name: 'Reader MK-11', device_type: 'NFC', serial_number: 'SN-011', checkpoint_id: 11, status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' },
  { id: 'DEV-012', device_name: 'Reader MH-12', device_type: 'NFC', serial_number: 'SN-012', checkpoint_id: 12, status: 'online', last_seen: new Date().toISOString(), firmware_version: '1.2.0' }
]

export const users = [
  { id: 1, full_name: 'System Administrator', username: 'admin', email: 'admin@tapandpass.local', password_hash: '$2a$10$rQ8Q8Q8Q8Q8Q8Q8Q8Q8Q8O', role_id: 1, department_id: 6, checkpoint_id: null, status: 'active', last_login: new Date().toISOString() },
  { id: 2, full_name: 'Maya Kalu', username: 'officer', email: 'officer@tapandpass.local', password_hash: '$2a$10$rQ8Q8Q8Q8Q8Q8Q8Q8Q8Q8O', role_id: 3, department_id: 1, checkpoint_id: 3, status: 'active', last_login: new Date().toISOString() },
  { id: 3, full_name: 'Samuel Obi', username: 'supervisor', email: 'supervisor@tapandpass.local', password_hash: '$2a$10$rQ8Q8Q8Q8Q8Q8Q8Q8Q8Q8O', role_id: 2, department_id: 1, checkpoint_id: null, status: 'active', last_login: new Date().toISOString() },
  { id: 4, full_name: 'Fatima Bello', username: 'customs', email: 'customs@tapandpass.local', password_hash: '$2a$10$rQ8Q8Q8Q8Q8Q8Q8Q8Q8Q8O', role_id: 4, department_id: 2, checkpoint_id: 3, status: 'active', last_login: new Date().toISOString() }
]

export const travelers = [
  { id: 'TP-2026-00012345', full_name: 'Amara Okafor', date_of_birth: '1993-08-14', nationality: 'Nigeria', passport_number: 'NGA-8842106', passport_expiry: '2028-11-09', photo: 'https://i.pravatar.cc/300?img=1', status: 'active', created_at: '2026-01-15T00:00:00Z', updated_at: '2026-09-18T00:00:00Z' },
  { id: 'TP-2026-00012346', full_name: 'Jonas Mbeki', date_of_birth: '1988-03-06', nationality: 'Kenya', passport_number: 'KEN-4419082', passport_expiry: '2027-01-21', photo: 'https://i.pravatar.cc/300?img=3', status: 'active', created_at: '2026-02-20T00:00:00Z', updated_at: '2026-09-18T00:00:00Z' },
  { id: 'TP-2026-00012347', full_name: 'Lina Haddad', date_of_birth: '1997-11-29', nationality: 'Morocco', passport_number: 'MAR-7720164', passport_expiry: '2026-02-02', photo: 'https://i.pravatar.cc/300?img=5', status: 'active', created_at: '2026-03-10T00:00:00Z', updated_at: '2026-09-18T00:00:00Z' },
  { id: 'TP-2026-00012298', full_name: 'Chinonso Eze', date_of_birth: '1990-05-22', nationality: 'Nigeria', passport_number: 'NGA-9912345', passport_expiry: '2029-06-15', photo: 'https://i.pravatar.cc/300?img=8', status: 'active', created_at: '2026-04-05T00:00:00Z', updated_at: '2026-09-18T00:00:00Z' },
  { id: 'TP-2026-00012291', full_name: 'Nadia Mensah', date_of_birth: '1995-12-03', nationality: 'Ghana', passport_number: 'GHA-3344556', passport_expiry: '2028-03-20', photo: 'https://i.pravatar.cc/300?img=9', status: 'active', created_at: '2026-05-12T00:00:00Z', updated_at: '2026-09-18T00:00:00Z' },
  { id: 'TP-2026-00012287', full_name: 'Musa Diallo', date_of_birth: '1985-09-18', nationality: 'Senegal', passport_number: 'SEN-7788990', passport_expiry: '2027-09-18', photo: 'https://i.pravatar.cc/300?img=12', status: 'active', created_at: '2026-06-01T00:00:00Z', updated_at: '2026-09-18T00:00:00Z' }
]

export let borderCrossings = [
  { id: 'TP-20260918-00421', traveler_id: 'TP-2026-00012298', card_id: 'TP-2026-00012298', officer_id: 2, department_id: 1, checkpoint_id: 3, direction: 'entry', status: 'approved', decision_reason: 'Verified identity', created_at: '2026-09-18T09:14:32Z', decision_at: '2026-09-18T09:14:32Z' },
  { id: 'TP-20260918-00420', traveler_id: 'TP-2026-00012346', card_id: 'TP-2026-00012346', officer_id: 2, department_id: 1, checkpoint_id: 3, direction: 'entry', status: 'denied', decision_reason: 'Secondary inspection required', created_at: '2026-09-18T09:08:17Z', decision_at: '2026-09-18T09:08:17Z' },
  { id: 'TP-20260918-00419', traveler_id: 'TP-2026-00012291', card_id: 'TP-2026-00012291', officer_id: 2, department_id: 1, checkpoint_id: 3, direction: 'entry', status: 'approved', decision_reason: 'Verified identity', created_at: '2026-09-18T08:56:04Z', decision_at: '2026-09-18T08:56:04Z' },
  { id: 'TP-20260918-00418', traveler_id: 'TP-2026-00012287', card_id: 'TP-2026-00012287', officer_id: 2, department_id: 1, checkpoint_id: 3, direction: 'entry', status: 'approved', decision_reason: 'Verified identity', created_at: '2026-09-18T08:49:51Z', decision_at: '2026-09-18T08:49:51Z' }
]

export let auditLogs = [
  { id: 1, user_id: 2, action: 'LOGIN', resource: 'session', resource_id: null, ip_address: '10.0.1.45', timestamp: '2026-09-18T08:30:00Z', details: 'Officer login successful' },
  { id: 2, user_id: 2, action: 'CARD_SCANNED', resource: 'traveler', resource_id: 'TP-2026-00012298', ip_address: '10.0.1.45', timestamp: '2026-09-18T09:14:32Z', details: 'Card scanned at North Gate 03' },
  { id: 3, user_id: 2, action: 'TRAVELER_APPROVED', resource: 'crossing', resource_id: 'TP-20260918-00421', ip_address: '10.0.1.45', timestamp: '2026-09-18T09:14:32Z', details: 'Traveler approved for entry' }
]

export let alerts = [
  { id: 1, traveler_id: 'TP-2026-00012346', type: 'secondary_inspection', severity: 'warning', message: 'Secondary inspection required for Jonas Mbeki', status: 'open', created_at: '2026-09-18T09:08:17Z' },
  { id: 2, traveler_id: 'TP-2026-00012347', type: 'expired_document', severity: 'critical', message: 'Travel document expired for Lina Haddad', status: 'open', created_at: '2026-09-18T08:00:00Z' }
]
