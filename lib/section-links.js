// Course sections have no API endpoint of their own, so the pages under one
// (its overview, sessions, attendance, gradebook) get what they show about it
// from the query string these helpers build.

const SECTION_KEYS = ['code', 'section', 'name', 'time', 'room', 'semesterId', 'semester']

// From a course-sections list item and the semester it belongs to
export const sectionParams = (section, semester) => ({
  code: section.code,
  section: section.sectionCode,
  name: section.name,
  time: section.time,
  room: section.room,
  semesterId: semester?.id,
  semester: semester?.name
})

// Carry the section context of the current page's searchParams
export const pickSectionParams = (searchParams) =>
  Object.fromEntries(SECTION_KEYS.map((key) => [key, searchParams?.[key]]))

export const toQuery = (params) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value)
  })
  const text = query.toString()
  return text ? `?${text}` : ''
}

export const sectionLinks = (id, params) => {
  const query = toQuery(params)
  return {
    overview: `/admin/course-section/${id}${query}`,
    sessions: `/admin/course-section/${id}/sessions/list${query}`,
    gradebook: `/admin/course-section/${id}/gradebook${query}`,
    students: `/admin/course-section/${id}/gradebook${toQuery({ ...params, tab: 'attendance' })}`
  }
}

// A session's attendance page; the session's own date, time and room ride along
export const attendanceLink = (sessionId, sectionId, params, session) =>
  `/admin/session/${sessionId}/attendances/list${toQuery({
    ...params,
    sectionId,
    start: session.sessionStart,
    end: session.sessionEnd,
    room: session.room ?? params?.room
  })}`

// "2026-10-28 09:00:00" from the API, read as local time
export const toDateTime = (value) => new Date(String(value).replace(' ', 'T'))

export const sectionTitle = (params) =>
  [params?.code, params?.section].filter(Boolean).join(' · ')

// Breadcrumbs from the semester down to the section
export const sectionCrumbs = (id, params) => {
  const crumbs = [{ label: 'Semesters', href: '/admin/semesters/list' }]
  if (params?.semesterId && params?.semester) {
    crumbs.push({
      label: params.semester,
      href: `/admin/semester/${params.semesterId}/course-sections/list?semester=${encodeURIComponent(params.semester)}`
    })
  }
  crumbs.push({ label: sectionTitle(params) || 'Course section', href: sectionLinks(id, params).overview })
  return crumbs
}
