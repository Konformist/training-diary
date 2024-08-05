export const sortByFields = <T, K extends keyof T>(items: T[], keys: K[], reverse = false) => (
  [...items].sort((a, b) => {
    const first = reverse ? b : a
    const last = reverse ? a : b

    for (let i = 0; i < keys.length; i++) {
      if (first[keys[i]] > last[keys[i]]) return 1
      if (first[keys[i]] < last[keys[i]]) return -1
    }

    return 0
  })
)

export const groupByField = <T, K extends keyof T>(items: T[], key: K): Array<[T[K], T[]]> => (
  [...items
    .reduce((acc, cur) => {
      if (!acc.has(cur[key])) acc.set(cur[key], [])
      acc.get(cur[key])?.push(cur)

      return acc
    }, new Map<T[K], T[]>())
    .entries()]
)
