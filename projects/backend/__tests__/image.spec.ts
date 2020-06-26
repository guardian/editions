import { adjustWidth, detectImageAspectRatio } from '../image'

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

describe('detectImageAspectRatio', () => {
    it('correctly identifies landscape-wide image aspect ratio type', async () => {
        const path =
            'd9dfd06b5042a9808b4bc3be3ccea4122cda6cb1/0_0_4000_1000/master/7087.jpg'
        const aspectRatio = detectImageAspectRatio(path)
        expect(aspectRatio).toBe('landscape-wide')
    })

    it('correctly identifies portrait image aspect ratio type', async () => {
        const path =
            'd9dfd06b5042a9808b4bc3be3ccea4122cda6cb1/0_0_1000_4000/master/7087.jpg'
        const aspectRatio = detectImageAspectRatio(path)
        expect(aspectRatio).toBe('portrait')
    })

    it('returns landscape for invalid input', async () => {
        const path =
            'd9dfd06b5042a9808b4bc3be3ccea4122cda6cb10_0_abc_4000/master/7087.jpg'
        const aspectRatio = detectImageAspectRatio(path)
        expect(aspectRatio).toBe('landscape')
        const path2 = ''
        const aspectRatio2 = detectImageAspectRatio(path2)
        expect(aspectRatio2).toBe('landscape')
        const path3 =
            'd9dfd06b5042a9808b4bc3be3ccea4122cda6cb1/0_0_10004000/master/7087.jpg'
        const aspectRatio3 = detectImageAspectRatio(path3)
        expect(aspectRatio3).toBe('landscape')
        const path4 =
            '/d9dfd06b5042a9808b4bc3be3/ccea4122cda6cb1/0_0_500/_4000/master/7087.jpg'
        const aspectRatio4 = detectImageAspectRatio(path4)
        expect(aspectRatio4).toBe('landscape')
    })
})
