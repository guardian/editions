import { LayoutRectangle, Dimensions, Animated } from 'react-native'
import { Article } from 'src/common'

/*
This stores the screen positions of all items so
that when you try to go and open them the transitioner
knows where to place the screen.

Ideally we'd use state for something like this but
a) it's unclear how to retrieve react state
   from navigation/index :(
b) animations in react in general are always a
   bunch of imperative escape hatches put together
   for performance reasons. I'm not sure we wanna
   bother with proper state every time a tile goes
   on screen?
*/

export type ScreenPosition = LayoutRectangle
interface NavigationPosition {
    position: Animated.Value
    index: number
}

type SaveableNavigationPositions = 'article'

const positions: {
    [key: string]: ScreenPosition
} = {}

const interpolators: {
    [key in SaveableNavigationPositions]?: NavigationPosition
} = {}

const setScreenPositionOfItem = (
    item: Article['key'],
    position: ScreenPosition,
) => {
    positions[item] = position
}

const getScreenPositionOfItem = (item: Article['key']): ScreenPosition => {
    if (positions[item]) return positions[item]
    const { height, width } = Dimensions.get('window')
    return {
        x: 0,
        y: height * 0.9,
        width,
        height,
    }
}

const setNavigationPosition = (
    key: SaveableNavigationPositions,
    [position, index]: [Animated.Value, number],
) => {
    interpolators[key] = { position, index }
}
const getNavigationPosition = (
    key: SaveableNavigationPositions,
): NavigationPosition | undefined => interpolators[key]

export {
    getScreenPositionOfItem,
    setScreenPositionOfItem,
    setNavigationPosition,
    getNavigationPosition,
}
