export function exportToCSV(data, filename = 'export.csv') {
  if (!Array.isArray(data) || data.length === 0) {
    return ''
  }

  const headers = Object.keys(data[0])
  const csvRows = []

  csvRows.push(headers.join(','))

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header]
      if (value === null || value === undefined) {
        return ''
      }
      const stringValue = String(value)
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    })
    csvRows.push(values.join(','))
  }

  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  return csvContent
}

export function exportCrossingsToCSV(crossings, filename = 'crossings.csv') {
  const data = crossings.map(c => ({
    Transaction_ID: c.id,
    Traveler: c.name,
    Card_ID: c.card,
    Time: c.time,
    Result: c.outcome,
    Reason: c.reason || ''
  }))
  return exportToCSV(data, filename)
}

export function exportTravelersToCSV(travelers, filename = 'travelers.csv') {
  const data = travelers.map(t => ({
    Card_ID: t.id,
    Full_Name: t.full_name,
    Nationality: t.nationality,
    Passport: t.passport_number,
    Date_of_Birth: t.date_of_birth,
    Status: t.status
  }))
  return exportToCSV(data, filename)
}

export function exportAuditLogsToCSV(logs, filename = 'audit_logs.csv') {
  const data = logs.map(l => ({
    Timestamp: new Date(l.timestamp).toLocaleString('en-GB'),
    User_ID: l.user_id,
    Action: l.action,
    Resource: l.resource,
    Resource_ID: l.resource_id || '',
    Details: l.details || ''
  }))
  return exportToCSV(data, filename)
}
