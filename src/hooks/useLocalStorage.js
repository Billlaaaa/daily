import { useState, useCallback } from 'react'

let USER_PREFIX = ''

export function setUserPrefix(prefix) {
  USER_PREFIX = prefix ? `u_${prefix}` : ''
}

function pk(key) {
  return USER_PREFIX ? `${USER_PREFIX}__${key}` : key
}

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(pk(key))
      return item !== null ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      localStorage.setItem(pk(key), JSON.stringify(valueToStore))
    } catch (e) {
      console.error(e)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

export function lsGet(key, fallback = null) {
  try {
    const item = localStorage.getItem(pk(key))
    return item !== null ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

export function lsSet(key, value) {
  try {
    localStorage.setItem(pk(key), JSON.stringify(value))
  } catch (e) {
    console.error(e)
  }
}

export function lsDel(key) {
  localStorage.removeItem(pk(key))
}
