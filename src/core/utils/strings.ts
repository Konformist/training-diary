export const isIncludeString = (value: string, search: string) => (
  value.toLowerCase().trim().includes(search.toLowerCase().trim())
);
