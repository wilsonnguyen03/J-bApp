import { useState, useEffect } from 'react'
import axios from 'axios'
import { format } from 'date-fns'

const API_URL = import.meta.env.VITE_API_URL

const STATUSES = [
  'Applied',
  'Phone Screen',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
  'Ghosted',
]

const STATUS_STYLES = {
  'Applied':      'bg-blue-400/10 text-blue-400',
  'Phone Screen': 'bg-yellow-400/10 text-yellow-400',
  'Interview':    'bg-purple-400/10 text-purple-400',
  'Offer':        'bg-emerald-400/10 text-emerald-400',
  'Rejected':     'bg-red-400/10 text-red-400',
  'Withdrawn':    'bg-gray-400/10 text-gray-400',
  'Ghosted':      'bg-orange-400/10 text-orange-400',
}

export default function EditDrawer({ application, onClose, onUpdate, onDelete }) {
  const [form, setForm] = useState({
    status: '',
    round: 0,
    round_notes: '',
    interview_at: '',
    notes: '',
    salary_asked: '',
  })
  const [loading, setLoading] = useState(false)

  // Populate the form with the current application data when drawer opens
  useEffect(() => {
    setForm({
      status: application.status || 'Applied',
      round: application.round || 0,
      round_notes: application.round_notes || '',
      interview_at: application.interview_at
        ? format(new Date(application.interview_at), "yyyy-MM-dd'T'HH:mm")
        : '',
      notes: application.notes || '',
      salary_asked: application.salary_asked || '',
    })
  }, [application])

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const payload = {
        ...form,
        round: parseInt(form.round),
        interview_at: form.interview_at || null,
      }
      const response = await axios.patch(
        `${API_URL}/api/applications/${application.id}`,
        payload
      )
      onUpdate(response.data)
    } catch (err) {
      console.error('Failed to update application', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${application.role} at ${application.company}?`)) return
    setLoading(true)
    try {
      await axios.delete(`${API_URL}/api/applications/${application.id}`)
      onDelete(application.id)
    } catch (err) {
      console.error('Failed to delete application', err)
    } finally {
      setLoading(false)
    }
  }

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      {/* Drawer panel — slides in from the right */}
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-gray-800 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {application.company || 'Unknown Company'}
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">{application.role}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-xl ml-4"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Status selector */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => update('status', status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    form.status === status
                      ? STATUS_STYLES[status]
                      : 'bg-gray-800 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Round */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Interview Round</label>
            <input
              type="number"
              min="0"
              value={form.round}
              onChange={(e) => update('round', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Round notes */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Round Notes</label>
            <textarea
              value={form.round_notes}
              onChange={(e) => update('round_notes', e.target.value)}
              placeholder="What happened in this round?"
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Interview date */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Interview Date & Time</label>
            <input
              type="datetime-local"
              value={form.interview_at}
              onChange={(e) => update('interview_at', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Salary asked */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Salary Asked</label>
            <input
              type="text"
              value={form.salary_asked}
              onChange={(e) => update('salary_asked', e.target.value)}
              placeholder="e.g. $85,000"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Personal notes */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Recruiter name, vibes, things to remember..."
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Job details — read only, from the scrape */}
          <div className="border-t border-gray-800 pt-6 space-y-3">
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
              Job Details
            </p>
            {[
              { label: 'Location', value: application.location },
              { label: 'Salary', value: application.salary },
              { label: 'Work Type', value: application.work_type },
              { label: 'Experience', value: application.experience },
              { label: 'Deadline', value: application.deadline },
            ].map(({ label, value }) => value ? (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-300">{value}</span>
              </div>
            ) : null)}
          </div>

          {/* Requirements */}
          {application.requirements?.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">
                Requirements
              </p>
              <div className="flex flex-wrap gap-2">
                {application.requirements.map((req, i) => (
                  <span
                    key={i}
                    className="bg-gray-800 text-gray-300 text-xs px-2.5 py-1 rounded-full"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {application.description && (
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">
                Summary
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                {application.description}
              </p>
            </div>
          )}

          {/* Original URL */}
          {application.url && (
            <a
              href={application.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors block"
            >
              View original listing
            </a>
          )}

        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-800">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Delete
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </div>
    </div>
  )
}