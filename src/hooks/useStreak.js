import dayjs from 'dayjs'
import { lsGet } from './useLocalStorage'
import { getStudyBlocks, getDailyItems, getNutritionItems } from './usePlanData'

export function isDayComplete(dateStr) {
  const study = lsGet(`study_${dateStr}`, {})
  const daily = lsGet(`daily_${dateStr}`, {})
  const nutrition = lsGet(`nutrition_${dateStr}`, {})

  const allStudy = getStudyBlocks().every(b => study[b.id])
  const allDaily = getDailyItems().every(i => daily[i.id])
  const allNutrition = getNutritionItems().every(i => nutrition[i.id])

  return allStudy && allDaily && allNutrition
}

export function getDayCompletionFraction(dateStr) {
  const study = lsGet(`study_${dateStr}`, {})
  const daily = lsGet(`daily_${dateStr}`, {})
  const nutrition = lsGet(`nutrition_${dateStr}`, {})

  const items = [...getStudyBlocks().map(b => !!study[b.id]), ...getDailyItems().map(i => !!daily[i.id]), ...getNutritionItems().map(i => !!nutrition[i.id])]
  if (items.length === 0) return 0
  return items.filter(Boolean).length / items.length
}

export function useStreak(planStartDate, totalDays, today) {
  const todayStr = dayjs(today).format('YYYY-MM-DD')
  const startDay = dayjs(planStartDate)

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  // Build list of plan days up to and including today
  const days = []
  for (let i = 0; i < totalDays; i++) {
    const d = startDay.add(i, 'day').format('YYYY-MM-DD')
    if (d > todayStr) break
    days.push(d)
  }

  for (const d of days) {
    if (isDayComplete(d)) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 0
    }
  }

  // Current streak: walk backwards from today
  for (let i = days.length - 1; i >= 0; i--) {
    if (isDayComplete(days[i])) {
      currentStreak++
    } else {
      break
    }
  }

  return { currentStreak, longestStreak }
}
