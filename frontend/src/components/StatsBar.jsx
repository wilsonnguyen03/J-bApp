export default function StatsBar({ applications }) {

  const total = applications.length

  const active = applications.filter(app =>
    ['Applied', 'Phone Screen', 'Interview'].includes(app.status)
  ).length

  const interviewsThisWeek = applications.filter(app => {
    if (!app.interview_at) return false
    const interviewDate = new Date(app.interview_at)
    const now = new Date()
    const weekFromNow = new Date()
    weekFromNow.setDate(now.getDate() + 7)
    return interviewDate >= now && interviewDate <= weekFromNow
  }).length

  const offers = applications.filter(app => app.status === 'Offer').length
  const offerRate = total > 0 ? ((offers / total) * 100).toFixed(1) : 0

  const stats = [
    {
      label: 'Total Applications',
      value: total,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'Active',
      value: active,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      label: 'Interviews This Week',
      value: interviewsThisWeek,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
    {
      label: 'Offer Rate',
      value: `${offerRate}%`,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bg} rounded-xl p-4 border border-white/5`}
        >
          <p className="text-gray-400 text-sm">{stat.label}</p>
          <p className={`${stat.color} text-3xl font-bold mt-1`}>{stat.value}</p>
        </div>
      ))}
    </div>
  )
}