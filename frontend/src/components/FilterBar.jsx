const STATUSES = [
  'All',
  'Applied',
  'Phone Screen',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
  'Ghosted',
]

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center">

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by company or role..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
      />

      {/* Status filter buttons */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

    </div>
  )
}