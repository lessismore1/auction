export function buildCoordinate(x, y) {
  return `${x},${y}`
}

export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0
}

export function preventDefault(fn) {
  return function(event) {
    if (event) {
      event.preventDefault()
    }
    fn.call(this, event)
  }
}

export function shortenAddress(address) {
  if (address) {
    return address.slice(0, 6) + '...' + address.slice(42 - 5)
  }
}

export function capitalize(str) {
  if (typeof str !== 'string') return null
  if (!str.trim()) return str

  let firstLetter = str.charAt(0).toUpperCase()
  let rest = str.slice(1)

  return firstLetter + rest
}
