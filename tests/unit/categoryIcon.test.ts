import { describe, expect, it } from 'vitest'
import { DEFAULT_CATEGORY_ICON, categoryIcon } from '~/utils/categoryIcon'

describe('categoryIcon', () => {
  it('returns a specific icon for known categories', () => {
    expect(categoryIcon('smartphones')).toBe('lucide:smartphone')
    expect(categoryIcon('home-decoration')).toBe('lucide:lamp')
  })

  it('falls back to a neutral icon for categories the API may add later', () => {
    expect(categoryIcon('something-new')).toBe(DEFAULT_CATEGORY_ICON)
    expect(categoryIcon('')).toBe(DEFAULT_CATEGORY_ICON)
  })
})
