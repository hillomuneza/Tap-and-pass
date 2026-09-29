import { departments } from '../models/data.js'

const departmentPermissions = {
  Immigration: {
    canViewCrossings: true,
    canApproveDeny: true,
    canViewCustoms: false,
    canViewSecurity: false,
    canViewPolice: false,
    canViewHealth: false,
    canManageUsers: false,
    canViewAudit: false,
    canManageDevices: false,
    canExportReports: true
  },
  Customs: {
    canViewCrossings: true,
    canApproveDeny: false,
    canViewCustoms: true,
    canViewSecurity: false,
    canViewPolice: false,
    canViewHealth: false,
    canManageUsers: false,
    canViewAudit: false,
    canManageDevices: false,
    canExportReports: true
  },
  'Border Security': {
    canViewCrossings: true,
    canApproveDeny: true,
    canViewCustoms: true,
    canViewSecurity: true,
    canViewPolice: true,
    canViewHealth: false,
    canManageUsers: false,
    canViewAudit: true,
    canManageDevices: false,
    canExportReports: true
  },
  Police: {
    canViewCrossings: true,
    canApproveDeny: false,
    canViewCustoms: false,
    canViewSecurity: true,
    canViewPolice: true,
    canViewHealth: false,
    canManageUsers: false,
    canViewAudit: true,
    canManageDevices: false,
    canExportReports: false
  },
  Health: {
    canViewCrossings: true,
    canApproveDeny: false,
    canViewCustoms: false,
    canViewSecurity: false,
    canViewPolice: false,
    canViewHealth: true,
    canManageUsers: false,
    canViewAudit: false,
    canManageDevices: false,
    canExportReports: false
  },
  Administration: {
    canViewCrossings: true,
    canApproveDeny: true,
    canViewCustoms: true,
    canViewSecurity: true,
    canViewPolice: true,
    canViewHealth: true,
    canManageUsers: true,
    canViewAudit: true,
    canManageDevices: true,
    canExportReports: true
  }
}

export function getDepartmentPermissions(departmentName) {
  return departmentPermissions[departmentName] || departmentPermissions['Administration']
}

export function hasPermission(departmentName, permission) {
  const perms = getDepartmentPermissions(departmentName)
  return perms[permission] || false
}

export function requireDepartmentPermission(permission) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' })
    const userDepartment = departments.find(d => d.id === req.user.department_id)
    if (!userDepartment) return res.status(403).json({ error: 'No department assigned' })
    if (!hasPermission(userDepartment.name, permission)) {
      return res.status(403).json({ error: `Missing permission: ${permission}` })
    }
    next()
  }
}
