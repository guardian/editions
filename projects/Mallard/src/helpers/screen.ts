import { Dimensions } from 'react-native'

const maxScreenSize = () => {
    const { width, height } = Dimensions.get('window')
    return Math.max(width, height)
}

const minScreenSize = () => {
    const { width, height } = Dimensions.get('window')
    return Math.min(width, height)
}

export { maxScreenSize, minScreenSize }
