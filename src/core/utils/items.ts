export const withZero = <T>(items: T[], all = false) => [
  { id: 0, name: all ? 'Все' : 'Не выбрано' },
  ...items,
]
