'use client'

import { useState, useEffect } from 'react'
import useFetchApi from '@/hooks/useFetchApi'
import { DataTable } from '@/components/custom/data-table/data-table'
import { columns } from '@/components/custom/course-sections/students/data-table-list-columns'
import { DataTableToolbar } from '@/components/custom/course-sections/students/data-table-list-toolbar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

/**
 * Attendance Tab Component
 *
 * Displays the students list for a course section within the Gradebook interface.
 * This component fetches and displays enrolled students in a data table with
 * search, filtering, and column visibility features.
 *
 * @param {Object} props - Component props
 * @param {string|number} props.courseSectionId - The ID of the course section
 * @returns {JSX.Element} The rendered attendance tab with students list
 */
export default function AttendanceTab({ courseSectionId }) {
  const { fetchData } = useFetchApi()
  const { toast } = useToast()
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statuses, setStatuses] = useState([])
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(true)
  const [statusesError, setStatusesError] = useState(null)

  /**
   * Fetch available student statuses from API
   */
  const fetchStatuses = async () => {
    try {
      setIsLoadingStatuses(true)
      setStatusesError(null)

      const response = await fetchData('/student-course-statuses', {
        method: 'GET'
      })

      console.log('Statuses API Response:', response)
      console.log('Statuses data:', response.data)
      setStatuses(response.data || [])
    } catch (err) {
      console.error('Error fetching statuses:', err)
      setStatusesError(err.message || 'Failed to load status options')
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load status options'
      })
    } finally {
      setIsLoadingStatuses(false)
    }
  }

  /**
   * Fetch students data from API
   */
  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetchData(
        `/course-section/${courseSectionId}/students`,
        {
          method: 'GET'
        }
      )

      console.log('Students API Response:', response)
      console.log('First student data:', response.data?.[0])
      setStudents(response.data || [])
    } catch (err) {
      console.error('Error fetching students:', err)
      setError(err.message || 'Failed to load students')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle status change for a student
   * Updates student status via API with optimistic UI pattern
   */
  const handleStatusChange = async (enrollmentId, newStatusId, oldStatusId) => {
    try {
      // Call API to update status
      await fetchData(`/course-enrollments/${enrollmentId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status_id: newStatusId })
      })

      // Update local students state on success
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === enrollmentId
            ? { ...student, statusId: newStatusId }
            : student
        )
      )

      // Show success notification
      toast({
        title: 'Success',
        description: 'Student status updated successfully'
      })
    } catch (err) {
      console.error('Error updating status:', err)

      // Handle specific HTTP status codes
      let errorMessage = 'Failed to update status'
      if (err.status === 403) {
        errorMessage =
          'Permission denied: You do not have permission to update student status'
      } else if (err.status === 404) {
        errorMessage = 'Enrollment not found'
      }

      // Show error notification
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage
      })

      // Re-throw error to trigger rollback in StatusSelectCell
      throw err
    }
  }

  /**
   * Effect to fetch students when component mounts or courseSectionId changes
   */
  useEffect(() => {
    if (!courseSectionId) {
      setIsLoading(false)
      return
    }

    fetchStudents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionId])

  /**
   * Effect to fetch statuses on component mount
   */
  useEffect(() => {
    fetchStatuses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Retry handler for error state
   */
  const handleRetry = () => {
    fetchStudents()
  }

  // Loading state - wait for both students and statuses to load
  if (isLoading || isLoadingStatuses) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="ml-4 text-muted-foreground">Loading students...</p>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={handleRetry} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Main render: DataTable with students data
  return (
    <div className="space-y-4">
      <DataTable
        data={students}
        columns={columns}
        toolbar={DataTableToolbar}
        error={error}
        columnVisibilityInitialState={{
          id: false,
          studentId: false,
          fatherName: false,
          major: false,
          email: false,
          campus: false
        }}
        meta={{
          statuses,
          onStatusChange: handleStatusChange
        }}
      />
      {/* Debug info */}
      <div className="text-xs text-muted-foreground">
        Statuses loaded: {statuses.length} | Loading:{' '}
        {isLoadingStatuses.toString()}
      </div>
    </div>
  )
}
