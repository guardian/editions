import { CrosswordType, CrosswordEntry } from '../../../common/src'
import { patchCrossword } from '../crossword'

const createCrossword = (type: CrosswordType = CrosswordType.QUICK) => ({
    name: '',
    type,
    number: 1,
    date: {
        dateTime: 1,
        iso8601: '',
    },
    dimensions: {
        cols: 1,
        rows: 1,
    },
    entries: [
        {
            id: '1',
            number: 1,
            solution: 'help',
        },
    ],
    solutionAvailable: true,
    hasNumbers: false,
    randomCluesOrdering: false,
})

const hasNoSolution = (entry: CrosswordEntry) => !entry.solution
const hasSolution = (entry: CrosswordEntry) => !!entry.solution
const id = <A>(a: A) => a

describe('getCrosswordArticleOverrides', () => {
    it('removes the solutions from everyman and prize', () => {
        const types = Object.values(CrosswordType)

        for (const type of types) {
            const cw = createCrossword(type)
            const out = patchCrossword(cw, cw.type)
            if ([CrosswordType.EVERYMAN, CrosswordType.PRIZE].includes(type)) {
                expect(out.entries.map(hasNoSolution).every(id)).toBe(true)
                expect(out.solutionAvailable).toBe(false)
            } else {
                expect(out.entries.map(hasSolution).every(id)).toBe(true)
                expect(out.solutionAvailable).toBe(true)
            }
        }
    })
})
