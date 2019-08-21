import { Dimensions } from 'react-native'
import DeviceInfo from "react-native-device-info";
import { sizes, ImageSize } from "../constants/image-sizes";

const maxScreenSize = (): number => {
    const { width, height } = Dimensions.get('window')
    return Math.max(width, height)
}

const minScreenSize = (): number => {
    const { width, height } = Dimensions.get('window')
    return Math.min(width, height)
}

const screenSizeToImageSize = (screenSize: number): number => {
    const allSizes = Object.values(sizes);
    const minPossibleSize = Math.min(...allSizes);
    if(screenSize <= minPossibleSize){
        return minPossibleSize
    }
    
    const maxPossibleSize = Math.max(...allSizes);
    if(screenSize >= maxPossibleSize){
        return maxPossibleSize
    }

    const availableSizes: number[] = Object.values(sizes).filter(size => screenSize <= size);
    return Math.min(...availableSizes)
}

const convertImageSizeToImageDescription = (screenSize: number): ImageSize => {
    if(!screenSize){
        return 'phone'
    }
    const imageSize = Object.keys(sizes).find(size => sizes[size as ImageSize] === screenSize)
    return imageSize as ImageSize || 'phone'
}

const imageForScreenSize = () => {    
    const screenSize = DeviceInfo.isTablet() ? maxScreenSize() : minScreenSize()
    return convertImageSizeToImageDescription(screenSizeToImageSize(screenSize))

}

export { maxScreenSize, minScreenSize, screenSizeToImageSize, convertImageSizeToImageDescription, imageForScreenSize }
