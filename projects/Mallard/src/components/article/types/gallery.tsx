import React from 'react'
import {
    Image,
    ImageStyle,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
} from 'react-native'
import { GalleryArticle, Image as ImageType, ImageElement } from 'src/common'
import { BigArrow } from 'src/components/icons/BigArrow'
import { UiBodyCopy } from 'src/components/styled-text'
import { useArticle } from 'src/hooks/use-article'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'
import {
    GalleryHeader,
    GalleryHeaderProps,
} from '../article-header/gallery-header'
import { Wrap } from '../wrap/wrap'
import { Direction } from '../../../common'
import { useImagePath } from 'src/hooks/use-image-paths'
import { useIssueCompositeKey } from 'src/hooks/use-issue-id'
import { ImageResource } from 'src/components/front/image-resource'
import { useIssueSummary } from 'src/hooks/use-issue-summary'

const galleryImageStyles = StyleSheet.create({
    root: { backgroundColor: color.skeleton },
})
const GalleryImage = ({
    src,
    accessibilityLabel,
    style,
}: {
    src: ImageType
    accessibilityLabel?: string
    style: StyleProp<ImageStyle>
}) => {
    return (
        <ImageResource
            image={src}
            style={[style, galleryImageStyles.root]}
            setAspectRatio={true}
            accessibilityLabel={accessibilityLabel}
        />
    )
}

const captionStyles = StyleSheet.create({
    root: {
        color: color.textOverPhotoBackground,
        ...getFont('sans', 0.9),
    },
})
const Caption = ({
    element,
    style,
}: {
    element: ImageElement
    style?: StyleProp<TextStyle>
}) =>
    element.caption || element.copyright ? (
        <UiBodyCopy style={[style, captionStyles.root]}>
            {[element.caption, element.copyright].filter(Boolean).join(' - ')}
        </UiBodyCopy>
    ) : null

const styles = StyleSheet.create({
    background: {
        backgroundColor: color.photoBackground,
    },
    image: {
        width: '100%',
    },
    spacer: {
        paddingVertical: metrics.vertical * 0.6,
    },
    whiteText: { color: color.palette.neutral[100] },
    arrowContainer: {
        paddingLeft: 10,
    },
    arrowContainerMobile: {
        paddingBottom: metrics.vertical,
    },
    arrow: { position: 'absolute', top: 3, left: -2 },
})

const GalleryItem = ({ element }: { element: ImageElement }) => {
    const [color] = useArticle()
    return (
        <Wrap
            borderColor={styles.whiteText.color}
            style={styles.spacer}
            rightRail={size => (
                <View
                    style={[
                        styles.arrowContainer,
                        size < Breakpoints.tabletVertical &&
                            styles.arrowContainerMobile,
                    ]}
                >
                    <View style={styles.arrow}>
                        <BigArrow
                            direction={
                                size < Breakpoints.tabletVertical
                                    ? Direction.top
                                    : Direction.left
                            }
                            scale={1.2}
                            fill={color.main}
                        ></BigArrow>
                    </View>
                    <Caption element={element} />
                </View>
            )}
        >
            <GalleryImage
                accessibilityLabel={element.alt}
                src={element.src}
                style={styles.image}
            />
        </Wrap>
    )
}

const GalleryCoverItem = ({
    element,
    ...props
}: GalleryHeaderProps & {
    element?: ImageType
}) => {
    const uri = useImagePath(element)
    return (
        <>
            {element && (
                <Image
                    style={{ width: '100%', flexGrow: 1, minHeight: 400 }}
                    source={{
                        uri,
                    }}
                />
            )}

            <GalleryHeader {...props} />
        </>
    )
}

const Gallery = ({ gallery }: { gallery: GalleryArticle }) => {
    const { issueId } = useIssueSummary()
    const publishedId = (issueId && issueId.publishedIssueId) || null
    return (
        <>
            <View style={[styles.background]}>
                <GalleryCoverItem
                    element={gallery.image}
                    headline={gallery.headline}
                    byline={gallery.byline}
                    standfirst={gallery.standfirst}
                ></GalleryCoverItem>
            </View>
            <View
                style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: color.palette.neutral[46],
                    marginTop: -1,
                }}
            ></View>
            <View style={[styles.background]}>
                {gallery.elements.map((element, index) => {
                    if (element.id === 'image' && publishedId) {
                        return <GalleryItem key={index} element={element} />
                    }
                    return <Text key={index}>{element.id}</Text>
                })}
            </View>
        </>
    )
}

export { Gallery, GalleryHeader }
