import { Badge } from '@/components/ui/badge'

export function SemesterStatusChip({ status }) {
  if (status === 'in-progress') {
    return (
      <Badge>
        <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
        In progress
      </Badge>
    )
  }
  if (status === 'upcoming') {
    return <Badge className="bg-card">Upcoming</Badge>
  }
  return (
    <Badge variant="secondary" className="bg-muted">
      Ended
    </Badge>
  )
}
