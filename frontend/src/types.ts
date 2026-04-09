export type Role = 'student' | 'academic' | 'internship' | 'admin'

export interface WeeklyLog {
  id: number
  week: number
  date: string
  activities: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface Student {
  id: number
  name: string
  regNumber: string
  program: string
  company: string
  supervisor: string
  status: 'active' | 'completed' | 'suspended'
  score?: number
}

export interface Placement {
  id: number
  student: string
  company: string
  startDate: string
  endDate: string
  status: 'active' | 'completed' | 'suspended'
  pendingLogs: number
}

export interface Notification {
  id: number
  message: string
  time: string
  type: 'info' | 'warning' | 'success'
}
