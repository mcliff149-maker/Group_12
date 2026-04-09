import './StatCard.css'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  color: string
  icon: string
}

export default function StatCard({ title, value, subtitle, color, icon }: StatCardProps) {
  return (
    <div className="stat-card" style={{ background: color }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
    </div>
  )
}
