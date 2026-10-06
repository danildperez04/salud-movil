// features/more/domain/user-initials.ts

/** "Joshua Martínez" -> "JM"; con una sola palabra devuelve solo la primera letra */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}
