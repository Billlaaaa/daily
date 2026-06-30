import dayjs from 'dayjs'
import { GYM_CYCLE, gymExercises } from '../data/exercises'
import { lsGet } from './useLocalStorage'

export function getGymSession(date) {
  // Weekly split anchored to the day of week: Mon=Push … Sun=Rest
  const dow = (dayjs(date).day() + 6) % 7 // 0 = Monday
  return GYM_CYCLE[dow]
}

export function useGymCycle(date) {
  return getGymSession(date)
}

export function getGymCompletion(date) {
  const split = getGymSession(date)
  if (split === 'Rest') return { split, pct: 100 }
  if (split === 'Cardio') {
    const done = !!lsGet(`gym_${date}_cardio`, false)
    return { split, pct: done ? 100 : 0 }
  }
  const exercises = gymExercises[split] || []
  let totalSets = 0
  let doneSets = 0
  exercises.forEach((name) => {
    const sets = lsGet(`gym_${date}_${name}`, [{ done: false }, { done: false }, { done: false }])
    totalSets += sets.length
    doneSets += sets.filter((s) => s.done).length
  })
  return { split, pct: totalSets > 0 ? (doneSets / totalSets) * 100 : 0 }
}

export function getLastSessionDate(split, beforeDate) {
  // Walk backwards from beforeDate to find the most recent date with this split
  let d = dayjs(beforeDate).subtract(1, 'day')
  for (let i = 0; i < 30; i++) {
    if (getGymSession(d.format('YYYY-MM-DD')) === split) {
      return d.format('YYYY-MM-DD')
    }
    d = d.subtract(1, 'day')
  }
  return null
}
