/**
 * Grade calculation utilities for Gradebook feature
 * Implements algorithms for calculating category scores and final grades
 */

/**
 * Letter grade scale configuration
 */
export const LETTER_GRADE_SCALE = [
  { min: 90, max: 100, grade: 'A' },
  { min: 85, max: 89, grade: 'A-' },
  { min: 80, max: 84, grade: 'B+' },
  { min: 75, max: 79, grade: 'B' },
  { min: 70, max: 74, grade: 'B-' },
  { min: 65, max: 69, grade: 'C+' },
  { min: 60, max: 64, grade: 'C' },
  { min: 55, max: 59, grade: 'C-' },
  { min: 50, max: 54, grade: 'D' },
  { min: 0, max: 49, grade: 'F' }
]

/**
 * Calculate category score based on algorithm
 *
 * @param {Object} category - Grade category object
 * @param {Array} items - Array of grade items in the category
 * @param {Array} grades - Array of student grades for the items
 * @returns {number|null} Category score percentage (0-100) or null if no grades
 */
export function calculateCategoryScore(category, items, grades) {
  if (!category || !items || !grades) return null

  const categoryItems = items.filter((item) => item.categoryId === category.id)
  const categoryGrades = grades.filter((g) =>
    categoryItems.some((item) => item.id === g.gradeItemId)
  )

  if (categoryGrades.length === 0) return null

  if (category.algorithm === 'equal') {
    // Equal Weight: Average of all items (each item weighted equally)
    const sum = categoryGrades.reduce((acc, g) => {
      const item = categoryItems.find((i) => i.id === g.gradeItemId)
      if (!item || g.pointsEarned === null) return acc
      return acc + (g.pointsEarned / item.maxPoints) * 100
    }, 0)

    const validGrades = categoryGrades.filter((g) => g.pointsEarned !== null)
    return validGrades.length > 0 ? sum / validGrades.length : null
  } else if (category.algorithm === 'points') {
    // Points Based: Total points earned / total points possible
    const earnedPoints = categoryGrades.reduce((acc, g) => {
      return acc + (g.pointsEarned !== null ? g.pointsEarned : 0)
    }, 0)

    const maxPoints = categoryGrades.reduce((acc, g) => {
      const item = categoryItems.find((i) => i.id === g.gradeItemId)
      return acc + (item ? item.maxPoints : 0)
    }, 0)

    return maxPoints > 0 ? (earnedPoints / maxPoints) * 100 : null
  }

  return null
}

/**
 * Calculate final grade for a student
 *
 * @param {Array} categories - Array of grade categories
 * @param {Array} items - Array of all grade items
 * @param {Array} studentGrades - Array of student's grades with structure: [{itemId, categoryId, earnedPoints, maxPoints}]
 * @returns {Object} Object with percentage and letterGrade
 */
export function calculateFinalGrade(categories, items, studentGrades) {
  if (!categories || !items || !studentGrades) {
    return { percentage: null, letterGrade: null }
  }

  if (studentGrades.length === 0) {
    return { percentage: null, letterGrade: null }
  }

  let totalWeightedScore = 0
  let totalWeight = 0

  categories.forEach((category) => {
    // Get items for this category
    const categoryItems = items.filter(
      (item) => item.categoryId === category.id
    )

    // Get grades for this category
    const categoryGrades = studentGrades.filter((g) => {
      const item = items.find((i) => i.id === g.itemId)
      return item && item.categoryId === category.id
    })

    if (categoryGrades.length === 0) {
      return // Skip categories with no grades
    }

    let categoryScore = null

    if (category.algorithm === 'equal') {
      // Equal Weight: Average of all items
      const validGrades = categoryGrades.filter(
        (g) => g.earnedPoints !== null && g.earnedPoints !== undefined
      )

      if (validGrades.length > 0) {
        const totalPercentage = validGrades.reduce((acc, g) => {
          return acc + (g.earnedPoints / g.maxPoints) * 100
        }, 0)
        categoryScore = totalPercentage / validGrades.length
      }
    } else if (category.algorithm === 'points') {
      // Points Based: Total points earned / total points possible
      const earnedPoints = categoryGrades.reduce((acc, g) => {
        return (
          acc +
          (g.earnedPoints !== null && g.earnedPoints !== undefined
            ? g.earnedPoints
            : 0)
        )
      }, 0)

      const maxPoints = categoryGrades.reduce((acc, g) => {
        return acc + (g.maxPoints || 0)
      }, 0)

      categoryScore = maxPoints > 0 ? (earnedPoints / maxPoints) * 100 : null
    }

    if (categoryScore !== null) {
      totalWeightedScore += categoryScore * (category.weight / 100)
      totalWeight += category.weight
    }
  })

  if (totalWeight === 0) {
    return { percentage: null, letterGrade: null }
  }

  // Normalize if total weight isn't 100%
  const finalPercentage =
    totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0

  // Round to 2 decimal places
  const roundedPercentage = Math.round(finalPercentage * 100) / 100

  const letterGrade = getLetterGrade(roundedPercentage)

  return {
    percentage: roundedPercentage,
    letterGrade
  }
}

/**
 * Convert percentage to letter grade
 *
 * @param {number} percentage - Grade percentage (0-100)
 * @returns {string|null} Letter grade or null
 */
export function getLetterGrade(percentage) {
  if (percentage === null || percentage === undefined || isNaN(percentage)) {
    return null
  }

  const grade = LETTER_GRADE_SCALE.find(
    (scale) => percentage >= scale.min && percentage <= scale.max
  )

  return grade ? grade.grade : null
}

/**
 * Calculate total weight of all categories
 *
 * @param {Array} categories - Array of grade categories
 * @returns {number} Total weight percentage
 */
export function calculateTotalWeight(categories) {
  if (!categories || !Array.isArray(categories)) return 0

  return categories.reduce((sum, category) => sum + (category.weight || 0), 0)
}

/**
 * Validate grade value
 *
 * @param {number} value - Grade value to validate
 * @param {number} maxPoints - Maximum points allowed
 * @returns {Object} Validation result with isValid and error message
 */
export function validateGrade(value, maxPoints) {
  if (value === null || value === undefined || value === '') {
    return { isValid: true, error: null }
  }

  const numValue = parseFloat(value)

  if (isNaN(numValue)) {
    return { isValid: false, error: 'Please enter a numeric value' }
  }

  if (numValue < 0) {
    return { isValid: false, error: 'Grade must be a positive number' }
  }

  if (numValue > maxPoints) {
    return {
      isValid: false,
      error: `Grade cannot exceed maximum points (${maxPoints})`
    }
  }

  return { isValid: true, error: null }
}
