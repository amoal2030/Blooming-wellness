import { ActiveTab } from '../types';

export const CANONICAL_BASE_URL = 'https://amoal2030.github.io/Blooming-wellness/';

export const PUBLIC_SECTIONS = [
  'broadcasts',
  'lectures',
  'interviews',
  'quizzes',
  'events',
  'registrations',
  'contact',
] as const;

export type PublicSection = (typeof PUBLIC_SECTIONS)[number];

export function isPublicSection(value: string | null | undefined): value is PublicSection {
  if (!value) return false;
  return (PUBLIC_SECTIONS as readonly string[]).includes(value);
}

/**
 * Resolves the active tab from the current URL query string (`?section=...`).
 * Any missing, invalid, or private value (such as `admin`) safely defaults to `home`.
 */
export function getTabFromSearch(search: string): ActiveTab {
  try {
    const params = new URLSearchParams(search);
    const section = params.get('section');
    if (isPublicSection(section)) {
      return section;
    }
  } catch {
    // Fallback to home on malformed search string
  }
  return 'home';
}

/**
 * Returns the app's base pathname (normalized with leading and trailing slash).
 */
export function getBasePath(): string {
  const env = (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env;
  const base = env?.BASE_URL || '/Blooming-wellness/';
  const normalized = base.startsWith('/') ? base : `/${base}`;
  return normalized.endsWith('/') ? normalized : `${normalized}/`;
}

/**
 * Returns a clean relative href suitable for crawlable `<a href="...">` links.
 * Never outputs an admin URL.
 */
export function getTabHref(tab: ActiveTab): string {
  const basePath = getBasePath();
  if (tab === 'home' || tab === 'admin') {
    return basePath;
  }
  return `${basePath}?section=${encodeURIComponent(tab)}`;
}

/**
 * Builds the next relative browser URL when navigating via History API,
 * ensuring no duplicate `section` parameters or conflicts with other parameters.
 */
export function buildRelativeUrlForTab(tab: ActiveTab, currentPathname?: string, currentSearch?: string): string {
  const pathname = currentPathname || getBasePath();
  const params = new URLSearchParams(currentSearch || '');

  // Always clear existing section entries first to prevent duplicate `?section=` params
  params.delete('section');

  if (tab !== 'home' && tab !== 'admin' && isPublicSection(tab)) {
    params.set('section', tab);
  }

  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

/**
 * Returns the strict canonical URL for the given active tab,
 * excluding tracking parameters or unknown query arguments.
 */
export function getCanonicalUrlForTab(tab: ActiveTab): string {
  if (tab === 'home' || tab === 'admin') {
    return CANONICAL_BASE_URL;
  }
  if (isPublicSection(tab)) {
    return `${CANONICAL_BASE_URL}?section=${encodeURIComponent(tab)}`;
  }
  return CANONICAL_BASE_URL;
}
