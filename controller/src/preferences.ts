/** Shared validation for Host configuration and browser preference drafts. */
import type { TranslationProvider } from '@deepseek-ai/dsh-experimental-translator/types'

export type { CotTranslationPreferences, CotTranslationSnapshot } from './types.ts'

/** Language preference accepted by both Host configuration and browser drafts. */
export const LANGUAGE_PREFERENCE_PATTERN = /^(?:auto|[a-zA-Z]{2,8}(?:-[a-zA-Z0-9]{1,8})*)$/

/** Explicit provider choices accepted by Host configuration and browser drafts. */
export const PROVIDER_PREFERENCES = [
  'bing', 'google', 'deepseek-account', 'deepseek-official', 'configured-model',
] as const satisfies readonly TranslationProvider[]

/** Normalize a route to the encoding used by the Host catalog, preserving exact IDs. */
export function canonicalModelRoute(value: string): string | undefined {
  try {
    const route: unknown = JSON.parse(value)
    if (Array.isArray(route) && route.length === 2 && route.every(id => typeof id === 'string' && id.trim() !== '')) {
      return JSON.stringify(route)
    }
  } catch {
    return undefined
  }
  return undefined
}
