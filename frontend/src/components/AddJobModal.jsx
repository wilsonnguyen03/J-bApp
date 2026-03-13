import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export default function AddJobModal({ onClose, onAdded }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [extracted, setExtracted] = useState(null)
  const [error, setError] = useState(null)

  // Step 1 — scrape and extract data from the URL
  const handleScrape = async () => {
    if (!url.trim()) return
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${API_URL}/api/scrape`, { url })
      setExtracted(response.data)
    } catch (err) {
      setError('Failed to scrape this URL. Try pasting the job description manually.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2 — save the extracted data to the database
  const handleSave = async () => {
    if (!extracted) return
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/api/applications`, extracted)
      onAdded(response.data)
    } catch (err) {
      setError('Failed to save application.')
    } finally {
      setLoading(false)
    }
  }

  return (
    // Backdrop — clicking outside closes the modal
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* Modal box — stop clicks from closing when clicking inside */}
      <div
        className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Add Application</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">

          {/* URL input */}
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              Job listing URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://seek.com.au/job/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                disabled={loading || !!extracted}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              />
              {!extracted && (
                <button
                  onClick={handleScrape}
                  disabled={loading || !url.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap"
                >
                  {loading ? 'Scraping...' : 'Import'}
                </button>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {/* Loading state */}
          {loading && !extracted && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-2xl mb-2">🔍</p>
              <p>Scraping job listing...</p>
              <p className="text-xs mt-1 text-gray-500">This can take up to 10 seconds</p>
            </div>
          )}

          {/* Extracted data preview */}
          {extracted && (
            <div className="space-y-3">
              <p className="text-sm text-emerald-400 font-medium">
                ✓ Job data extracted — review before saving
              </p>

              {/* Editable fields */}
              {[
                { label: 'Company', key: 'company' },
                { label: 'Role', key: 'role' },
                { label: 'Location', key: 'location' },
                { label: 'Salary', key: 'salary' },
                { label: 'Work Type', key: 'work_type' },
                { label: 'Experience', key: 'experience' },
                { label: 'Deadline', key: 'deadline' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                  <input
                    type="text"
                    value={extracted[key] || ''}
                    onChange={(e) => setExtracted(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              ))}

              {/* Requirements */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Requirements
                </label>
                <div className="flex flex-wrap gap-2">
                  {extracted.requirements?.map((req, i) => (
                    <span
                      key={i}
                      className="bg-gray-800 text-gray-300 text-xs px-2.5 py-1 rounded-full"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Summary
                </label>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {extracted.description}
                </p>
              </div>

            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          {extracted && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-2.5 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Saving...' : 'Save Application'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}