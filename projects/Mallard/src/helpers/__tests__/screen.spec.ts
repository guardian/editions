import { maxScreenSize } from '../screen'

jest.mock('Dimensions', () => ({
    get: jest
        .fn()
        .mockReturnValueOnce({ width: 200, height: 100 })
        .mockReturnValueOnce({ width: 400, height: 500 })
        .mockReturnValueOnce({ width: 800, height: 800 }),
}))

describe('maxScreenSize', () => {
    it('should return the greater width value of 200', () => {
        expect(maxScreenSize()).toBe(200)
    })

    it('should return the greater height value of 500', () => {
        expect(maxScreenSize()).toBe(500)
    })

    it('should return 800 as the screen width and height are equal', () => {
        expect(maxScreenSize()).toBe(800)
    })
})
