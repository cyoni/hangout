export function isNullOrEmpty(value: string): boolean {
  return !value || value === null || value.trim() === ""
}
