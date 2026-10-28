'use client'

import { useEffect, useRef, useState } from 'react'
import useFetchApi from '@/hooks/useFetchApi'

// Short enough to feel live, long enough to send one request when several
// cells are filled in a row
const DELAY_MS = 300

/**
 * The grades table as the API calculates it with the what-if grades, saving
 * nothing, plus each student's needed grade on one item.
 *
 * While a newer answer is on its way, the previous one from the same session
 * stays on screen and isUpdating is true.
 *
 * @param {Object} options
 * @param {string|number} options.courseSectionId
 * @param {boolean} options.enabled - Only fetch in what-if mode
 * @param {Array<{enrollmentId: number, gradeableItemId: number, gradeValue: number|null}>} options.grades
 * @param {number|null} options.neededItemId
 * @param {string} options.session - Changes when what-if mode restarts or the saved grades reload
 * @returns {{preview: Object|null, neededItemId: number|null, isUpdating: boolean, error: string|null}}
 */
export default function useGradesPreview({
  courseSectionId,
  enabled,
  grades,
  neededItemId,
  session
}) {
  const { fetchData } = useFetchApi()
  const [result, setResult] = useState(null)
  const latestKey = useRef(null)

  const requestKey = enabled
    ? JSON.stringify([courseSectionId, session, neededItemId, grades])
    : null

  useEffect(() => {
    latestKey.current = requestKey
    if (!requestKey) return

    const timer = setTimeout(async () => {
      let answer
      try {
        const response = await fetchData(
          `/course-sections/${courseSectionId}/grades/preview`,
          { method: 'POST', body: JSON.stringify({ grades, neededItemId }) }
        )
        answer = { data: response.data, neededItemId, error: null }
      } catch (err) {
        console.error('Error calculating the what-if grades:', err)
        answer = { data: null, neededItemId: null, error: "Couldn't calculate the results" }
      }
      // A slower, older answer must not replace a newer one
      if (latestKey.current !== requestKey) return
      setResult((previous) => {
        // On an error, keep showing the last results of this session
        const kept = previous?.session === session ? previous : null
        return answer.data
          ? { ...answer, key: requestKey, session }
          : { data: kept?.data ?? null, neededItemId: kept?.neededItemId ?? null, error: answer.error, key: requestKey, session }
      })
    }, DELAY_MS)

    return () => clearTimeout(timer)
    // fetchData is a new function on every render; the key covers every input
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey])

  const current = enabled && result?.session === session ? result : null
  return {
    preview: current?.data ?? null,
    neededItemId: current?.data ? current.neededItemId : null,
    isUpdating: enabled && result?.key !== requestKey,
    error: current?.key === requestKey ? current.error : null
  }
}
