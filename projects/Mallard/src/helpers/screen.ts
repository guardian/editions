import { Dimensions } from 'react-native'

const maxScreenSize = () => {
    const { width, height } = Dimensions.get('window')
    if (width > height) {
        return width
    }
    return height
}

export { maxScreenSize }
