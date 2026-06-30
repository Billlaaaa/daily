import dayjs from 'dayjs'
import { GYM_CYCLE, CYCLE_START_DATE } from '../data/exercises'
import { lsGet } from './useLocalStorage'

export function getGymSession(date) {
  const cycleStart = lsGet('cycleStartDate', CYCLE_START_DATE)
  const dayIndex = dayjs(date).diff(dayjs(cycleStart), 'day')
  return GYM_CYCLE[((dayIndex % 7) + 7) % 7]
}

export function useGymCycle(date) {
  return getGymSession(date)
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
