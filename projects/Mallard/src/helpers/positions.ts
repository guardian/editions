import { LayoutRectangle, Dimensions } from 'react-native'
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

const positions: {
    [key: string]: LayoutRectangle
} = {}

const setScreenPositionOfItem = (
    item: Article['key'],
    position: LayoutRectangle,
) => {
    positions[item] = position
}

const getScreenPositionOfItem = (item: Article['key']): LayoutRectangle => {
    if (positions[item]) return positions[item]
    const { height, width } = Dimensions.get('window')
    return {
        x: 0,
        y: height * 0.9,
        width,
        height,
    }
}

export { getScreenPositionOfItem, setScreenPositionOfItem }
