/**
 * Utility to resolve static and public asset URLs safely across both
 * local development and GitHub Pages subpath deployment (/Blooming-wellness/).
 */
export function getAssetUrl(path: string | undefined | null): string {
  if (!path) return '';
  
  // External URLs or data URIs
  if (
    path.startsWith('http://') || 
    path.startsWith('https://') || 
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  // Normalize /src/assets/... to /assets/... for production public folder
  let normalized = path;
  if (normalized.startsWith('/src/assets/')) {
    normalized = normalized.replace('/src/assets/', '/assets/');
  } else if (normalized.startsWith('src/assets/')) {
    normalized = normalized.replace('src/assets/', 'assets/');
  }

  // Obtain Vite base URL (e.g. '/Blooming-wellness/' or '/')
  const base = import.meta.env.BASE_URL || '/';
  
  // If path already starts with the base URL, don't duplicate it
  if (base !== '/' && normalized.startsWith(base)) {
    return normalized;
  }

  const cleanPath = normalized.startsWith('/') ? normalized.slice(1) : normalized;
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
}
