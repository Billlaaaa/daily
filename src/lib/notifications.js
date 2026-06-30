import dayjs from 'dayjs'
import { studyBlocks } from '../data/studyBlocks'
import { nutritionItems, supplementItems } from '../data/nutritionItems'

function buildTodayEvents() {
  const today = dayjs().format('YYYY-MM-DD')
  const events = []

  studyBlocks.forEach((b) => {
    events.push({
      time: dayjs(`${today} ${b.time}`, 'YYYY-MM-DD h:mm A'),
      title: `${b.label} starting`,
      body: 'Time to start your study block.',
    })
  })

  nutritionItems.forEach((item) => {
    events.push({
      time: dayjs(`${today} ${item.time}`, 'YYYY-MM-DD h:mm A'),
      title: 'Meal time',
      body: item.label,
    })
  })

  supplementItems.forEach((item) => {
    events.push({
      time: dayjs(`${today} ${item.time}`, 'YYYY-MM-DD h:mm A'),
      title: 'Supplement reminder',
      body: item.label,
    })
  })

  return events
}

async function fireNotification(title, body) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready
      reg.showNotification(title, { body, icon: '/icon-192.png', badge: '/icon-192.png', tag: title })
      return
    }
  } catch {
    // fall through to direct Notification below
  }
  try {
    new Notification(title, { body, icon: '/icon-192.png' })
  } catch {
    // some platforms (older Android Chrome) disallow the direct constructor — nothing more we can do
  }
}

let scheduledTimeouts = []
let scheduledForDate = null

export function clearScheduledNotifications() {
  scheduledTimeouts.forEach(clearTimeout)
  scheduledTimeouts = []
  scheduledForDate = null
}

export function scheduleTodayNotifications() {
  const today = dayjs().format('YYYY-MM-DD')
  if (scheduledForDate === today) return
  scheduledTimeouts.forEach(clearTimeout)
  scheduledTimeouts = []
  scheduledForDate = today

  const now = dayjs()
  buildTodayEvents().forEach((ev) => {
    const delay = ev.time.diff(now)
    if (delay <= 0 || delay > 24 * 60 * 60 * 1000) return
    scheduledTimeouts.push(setTimeout(() => fireNotification(ev.title, ev.body), delay))
  })
}

export function getNotificationStatus() {
  if (typeof Notification === 'undefined') return 'unsupported'
  return Notification.permission
}

export async function requestNotificationPermission() {
  if (typeof Notification === 'undefined') return 'unsupported'
  const result = await Notification.requestPermission()
  if (result === 'granted') scheduleTodayNotifications()
  return result
}
