import { maxScreenSize, minScreenSize } from '../screen'

const mock = jest.fn()

jest.mock('Dimensions', () => ({
    get: mock,
}))

describe('helpers/screen', () => {
    beforeEach(mock.mockReset)
    describe('maxScreenSize', () => {
        it('should return the greater width value of 200', () => {
            mock.mockReturnValueOnce({ width: 200, height: 100 })
            expect(maxScreenSize()).toBe(200)
        })

        it('should return the greater height value of 500', () => {
            mock.mockReturnValueOnce({ width: 400, height: 500 })
            expect(maxScreenSize()).toBe(500)
        })

        it('should return 800 as the screen width and height are equal', () => {
            mock.mockReturnValueOnce({ width: 800, height: 800 })
            expect(maxScreenSize()).toBe(800)
        })
    })

    describe('minScreenSize', () => {
        it('should return the lesser width value of 100', () => {
            mock.mockReturnValueOnce({ width: 200, height: 100 })
            expect(minScreenSize()).toBe(100)
        })

        it('should return the lesser height value of 400', () => {
            mock.mockReturnValueOnce({ width: 400, height: 500 })
            expect(minScreenSize()).toBe(400)
        })

        it('should return 800 as the screen width and height are equal', () => {
            mock.mockReturnValueOnce({ width: 800, height: 800 })
            expect(minScreenSize()).toBe(800)
        })
    })
})
