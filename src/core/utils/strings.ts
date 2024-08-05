export const isIncludeString = (value: string, search: string) => (
  value.toLowerCase().trim().includes(search.toLowerCase().trim())
)

export const firstLetterUp = (value: string) => (
  value[0].toUpperCase() + value.slice(1)
)
