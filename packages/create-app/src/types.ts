export interface ScaffoldOptions {
  projectName: string;
  includePatterns: boolean;
}

export interface ResolvedPaths {
  repoRoot: string;
  targetDir: string;
  templateDir: string;
}
