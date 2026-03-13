import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import StatsBar from '../components/StatsBar'
import FilterBar from '../components/FilterBar'
import ApplicationsTable from '../components/ApplicationsTable'
import AddJobModal from '../components/AddJobModal'

const API_URL = import.meta.env.VITE_API_URL

export default function Dashboard() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Fetch all applications when the page loads
  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      setLoading(true)
        const response = await axios.get(`${API_URL}/api/applications`)
        setApplications(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const handleApplicationAdded = (newApplication) => {
    setApplications(prev => [newApplication, ...prev])
    setShowAddModal(false)
    toast.success(`Added ${newApplication.role} at ${newApplication.company}`)
  }

  const handleApplicationUpdated = (updatedApplication) => {
    setApplications(prev =>
      prev.map(app => app.id === updatedApplication.id ? updatedApplication : app)
    )
    toast.success('Application updated')
  }

  const handleApplicationDeleted = (id) => {
    setApplications(prev => prev.filter(app => app.id !== id))
    toast.success('Application deleted')
  }

  // Filter applications based on search and status filter
  const filteredApplications = applications
    .filter(app => {
      const matchesSearch =
        app.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.role?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus =
        statusFilter === 'All' || app.status === statusFilter
      return matchesSearch && matchesStatus
    })

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Job Tracker</h1>
          <p className="text-gray-400 mt-1">Track your applications through every stage</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          + Add Application
        </button>
      </div>

      {/* Stats */}
      <StatsBar applications={applications} />

      {/* Filters */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Table */}
      <ApplicationsTable
        applications={filteredApplications}
        loading={loading}
        onUpdate={handleApplicationUpdated}
        onDelete={handleApplicationDeleted}
      />

      {/* Add Job Modal */}
      {showAddModal && (
        <AddJobModal
          onClose={() => setShowAddModal(false)}
          onAdded={handleApplicationAdded}
        />
      )}

    </div>
  )
}