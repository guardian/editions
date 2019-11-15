const pillars = ['news', 'opinion', 'sport', 'culture', 'lifestyle'] as const

export type Pillar = typeof pillars[number]

export { pillars }
