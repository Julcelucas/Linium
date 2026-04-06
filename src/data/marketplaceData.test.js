import { describe, expect, it } from 'vitest'
import { filterProfiles, marketplaceProfiles } from './marketplaceData'

describe('filterProfiles', () => {
  it('returns all profiles when filters are empty', () => {
    const results = filterProfiles({
      query: '',
      location: '',
      category: 'Todas as categorias',
      zone: 'Todas as zonas',
      serviceType: 'Todos os tipos',
    })

    expect(results.length).toBe(marketplaceProfiles.length)
  })

  it('filters profiles by query text', () => {
    const results = filterProfiles({
      query: 'eletricidade',
      location: '',
      category: 'Todas as categorias',
      zone: 'Todas as zonas',
      serviceType: 'Todos os tipos',
    })

    expect(results.length).toBeGreaterThan(0)
    expect(results.some((item) => item.name.includes('Carlos'))).toBe(true)
  })

  it('filters by exact category and zone', () => {
    const results = filterProfiles({
      query: '',
      location: '',
      category: 'Tecnologia e suporte informático',
      zone: 'Todas as zonas',
      serviceType: 'Online',
    })

    expect(results.length).toBe(1)
    expect(results[0].name).toContain('Nexo Tech')
  })
})
