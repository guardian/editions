import { adjustWidth } from '../image'

describe('adjustWidth', () => {
    it('returns double the width for wide/immersive images', async () => {
        const width = 200
        const newWidth = adjustWidth(width, 'landscape', 'immersive')
        expect(newWidth).toBe(400)

        const newWidth2 = adjustWidth(width, 'landscape', 'inline')
        expect(newWidth2).toBe(200)

        const newWidth3 = adjustWidth(width, 'landscape-wide', 'inline')
        expect(newWidth3).toBe(400)
    })
})
