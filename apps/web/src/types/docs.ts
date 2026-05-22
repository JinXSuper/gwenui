// Shared types for docs — importable from both server and client components

export interface SourceFile {
  name:      string
  content:   string
  path?:     string
  language?: string
}
