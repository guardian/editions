import React, { useContext } from 'react'
import {
    Modal,
    SafeAreaView,
    View,
    Image,
    Dimensions,
    Animated,
    Text,
    StyleSheet,
} from 'react-native'
import { LightboxContext, LightboxContextType } from './use-lightbox-modal'
import {
    ImageElement,
    Direction,
    ArticlePillar,
} from '../../../Apps/common/src'
import { useAspectRatio } from 'src/hooks/use-aspect-ratio'
import { CloseModalButton } from 'src/components/button/close-modal-button'
import { useImagePath } from 'src/hooks/use-image-paths'
import { NativeArrow } from 'src/components/article/html/components/native-arrow'
import { getPillarColors } from 'src/helpers/transform'
import { useDimensions } from 'src/hooks/use-screen'

const styles = StyleSheet.create({
    lightboxPage: {
        width: '100%',
        height: '100%',
    },
    caption: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 5,
    },
    closeButton: {
        position: 'absolute',
        zIndex: 1,
        right: 0,
        paddingTop: 10,
        paddingRight: 10,
    },
    lightboxImage: {
        // display: 'flex',
        // alignItems: 'center',
        // flexDirection: 'column',
    },
})

const LightboxImage = ({
    image,
    arrowColor,
}: {
    image: ImageElement
    arrowColor: string
}) => {
    const imagePath = useImagePath(image.src, 'full-size')
    const aspectRatio = useAspectRatio(imagePath)
    // console.log(aspectRatio)
    return (
        <>
            <Image
                source={{
                    uri: imagePath,
                }}
                style={{ aspectRatio }}
            />
            <View style={styles.caption}>
                <NativeArrow fill={arrowColor} direction={Direction.top} />
                {image.caption && <Text>{image.caption}</Text>}
            </View>
        </>
    )
}

export const LightboxScreen = ({
    images,
    visible,
    closeLightbox,
    pillar,
    index,
}: {
    images: ImageElement[]
    visible: boolean
    closeLightbox: () => void
    pillar: ArticlePillar
    index: number
}) => {
    // const [, { pillar }] = useArticle()
    // console.log('PILLAR: ', pillar)
    const pillarColors = getPillarColors(pillar)
    const { width } = useDimensions()
    return (
        <Modal visible={visible}>
            <SafeAreaView>
                <View>
                    <View style={styles.closeButton}>
                        <CloseModalButton
                            onPress={closeLightbox}
                            color={pillarColors.main}
                        />
                    </View>

                    <Animated.FlatList
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={1}
                        maxToRenderPerBatch={1}
                        windowSize={2}
                        initialNumToRender={1}
                        horizontal={true}
                        initialScrollIndex={index}
                        pagingEnabled
                        keyExtractor={(item: ImageElement) => item.src.path}
                        data={images}
                        getItemLayout={(_: never, index: number) => ({
                            length: width,
                            offset: width * index,
                            index,
                        })}
                        renderItem={({
                            item,
                        }: // index,
                        {
                            item: ImageElement
                            index: number
                        }) => (
                            <View style={[{ width }, styles.lightboxImage]}>
                                <LightboxImage
                                    image={item}
                                    arrowColor={pillarColors.main}
                                />
                            </View>
                        )}
                    />
                    {/* {images && images[0] && (
                        <LightboxImage
                            image={images[0]}
                            arrowColor={pillarColors.main}
                        />
                    )} */}
                </View>
            </SafeAreaView>
        </Modal>
    )
}

export const LightboxWrapper = () => {
    const lightboxContext: LightboxContextType = useContext(LightboxContext)
    return (
        <LightboxScreen
            images={lightboxContext.images}
            visible={lightboxContext.visible}
            closeLightbox={() => lightboxContext.setLightboxVisible(false)}
            pillar={'sport'}
            index={lightboxContext.index}
        />
    )
}
