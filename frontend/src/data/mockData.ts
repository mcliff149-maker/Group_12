import { WeeklyLog, Student, Placement, Notification } from '../types'

export const mockWeeklyLogs: WeeklyLog[] = [
  { id: 1, week: 1, date: '2024-01-08', activities: 'Onboarding and team introductions, environment setup', status: 'approved' },
  { id: 2, week: 2, date: '2024-01-15', activities: 'Completed tasks on authentication module', status: 'approved' },
  { id: 3, week: 3, date: '2024-01-22', activities: 'Worked on dashboard UI components', status: 'approved' },
  { id: 4, week: 4, date: '2024-01-29', activities: 'API integration and testing', status: 'pending' },
  { id: 5, week: 5, date: '2024-02-05', activities: 'Bug fixes and code review', status: 'pending' },
]

export const mockStudents: Student[] = [
  { id: 1, name: 'Alice Mwangi',   regNumber: 'CS/001/2021', program: 'BSc Computer Science',     company: 'TechCorp Ltd',        supervisor: 'Dr. Kamau',   status: 'active',    score: 82 },
  { id: 2, name: 'Brian Otieno',   regNumber: 'CS/002/2021', program: 'BSc Software Engineering', company: 'InnovateTech',        supervisor: 'Dr. Njoroge', status: 'active',    score: 75 },
  { id: 3, name: 'Carol Wanjiku',  regNumber: 'CS/003/2021', program: 'BSc Information Systems',  company: 'DataSystems Co.',     supervisor: 'Dr. Kamau',   status: 'completed', score: 91 },
  { id: 4, name: 'David Kiprotich',regNumber: 'CS/004/2021', program: 'BSc Computer Science',     company: 'CloudBase Inc.',      supervisor: 'Dr. Mwangi',  status: 'active',    score: 68 },
  { id: 5, name: 'Eva Chebet',     regNumber: 'CS/005/2021', program: 'BSc Software Engineering', company: 'Digital Solutions',   supervisor: 'Dr. Njoroge', status: 'suspended', score: 45 },
]

export const mockPlacements: Placement[] = [
  { id: 1, student: 'Alice Mwangi',    company: 'TechCorp Ltd',      startDate: '2024-01-08', endDate: '2024-06-28', status: 'active',    pendingLogs: 2 },
  { id: 2, student: 'Brian Otieno',    company: 'InnovateTech',      startDate: '2024-01-08', endDate: '2024-06-28', status: 'active',    pendingLogs: 1 },
  { id: 3, student: 'Carol Wanjiku',   company: 'DataSystems Co.',   startDate: '2023-07-03', endDate: '2023-12-22', status: 'completed', pendingLogs: 0 },
  { id: 4, student: 'David Kiprotich', company: 'CloudBase Inc.',    startDate: '2024-01-08', endDate: '2024-06-28', status: 'active',    pendingLogs: 3 },
  { id: 5, student: 'Eva Chebet',      company: 'Digital Solutions', startDate: '2024-01-08', endDate: '2024-06-28', status: 'suspended', pendingLogs: 0 },
]

export const mockNotifications: Notification[] = [
  { id: 1, message: 'Weekly log for Week 4 approved by supervisor', time: '2 hours ago',  type: 'success' },
  { id: 2, message: 'Reminder: Submit Week 5 log by Friday',        time: '1 day ago',   type: 'warning' },
  { id: 3, message: 'Mid-term evaluation scheduled for next week',  time: '3 days ago',  type: 'info'    },
]

export const mockStudentProfile = {
  name: 'Alice Mwangi',
  regNumber: 'CS/001/2021',
  program: 'BSc Computer Science',
  year: 3,
  company: 'TechCorp Ltd',
  companyAddress: 'Nairobi, Kenya',
  academicSupervisor: 'Dr. James Kamau',
  internshipSupervisor: 'Mr. Peter Odhiambo',
  startDate: '2024-01-08',
  endDate: '2024-06-28',
  currentScore: 78,
}
