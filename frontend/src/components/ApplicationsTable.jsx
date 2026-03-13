import { useState } from 'react'
import { format } from 'date-fns'
import EditDrawer from './EditDrawer'

const STATUS_STYLES = {
  'Applied':      'bg-blue-400/10 text-blue-400',
  'Phone Screen': 'bg-yellow-400/10 text-yellow-400',
  'Interview':    'bg-purple-400/10 text-purple-400',
  'Offer':        'bg-emerald-400/10 text-emerald-400',
  'Rejected':     'bg-red-400/10 text-red-400',
  'Withdrawn':    'bg-gray-400/10 text-gray-400',
  'Ghosted':      'bg-orange-400/10 text-orange-400',
}

export default function ApplicationsTable({ applications, loading, onUpdate, onDelete }) {
  const [selectedApp, setSelectedApp] = useState(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Loading applications...
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p className="text-lg">No applications found</p>
        <p className="text-sm mt-1">Add your first application using the button above</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">

          {/* Table header */}
          <thead className="bg-gray-900 border-b border-gray-800">
            <tr>
              {['Company & Role', 'Location', 'Applied', 'Status', 'Interview', 'Round', 'Actions'].map(col => (
                <th key={col} className="text-left text-gray-400 font-medium px-4 py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table rows */}
          <tbody className="divide-y divide-gray-800">
            {applications.map((app) => (
              <tr
                key={app.id}
                className="bg-gray-900/50 hover:bg-gray-800/50 transition-colors cursor-pointer"
                onClick={() => setSelectedApp(app)}
              >
                {/* Company & Role */}
                <td className="px-4 py-3">
                  <p className="font-medium text-white">{app.company || '—'}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{app.role || '—'}</p>
                </td>

                {/* Location */}
                <td className="px-4 py-3 text-gray-400">
                  {app.location || '—'}
                </td>

                {/* Applied date */}
                <td className="px-4 py-3 text-gray-400">
                  {app.applied_date
                    ? format(new Date(app.applied_date), 'dd MMM yyyy')
                    : '—'}
                </td>

                {/* Status badge */}
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[app.status] || 'bg-gray-400/10 text-gray-400'}`}>
                    {app.status}
                  </span>
                </td>

                {/* Interview date */}
                <td className="px-4 py-3 text-gray-400">
                  {app.interview_at
                    ? <span className="text-yellow-400">
                        {format(new Date(app.interview_at), 'dd MMM, h:mm a')}
                      </span>
                    : '—'}
                </td>

                {/* Round */}
                <td className="px-4 py-3 text-gray-400">
                  {app.round > 0 ? `Round ${app.round}` : '—'}
                </td>

                {/* Actions */}
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="text-blue-400 hover:text-blue-300 text-xs mr-3 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(app.id)}
                    className="text-red-400 hover:text-red-300 text-xs transition-colors"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit drawer — renders when a row is clicked */}
      {selectedApp && (
        <EditDrawer
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdate={(updated) => {
            onUpdate(updated)
            setSelectedApp(null)
          }}
          onDelete={(id) => {
            onDelete(id)
            setSelectedApp(null)
          }}
        />
      )}
    </>
  )
}