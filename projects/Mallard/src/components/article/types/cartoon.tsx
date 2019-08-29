import React from 'react'
import { View } from 'react-native'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { GalleryHeader } from '../article-header/gallery-header'
import { MaxWidthWrap } from '../wrap/max-width'
import { AutoSizedImageResource } from 'src/components/front/image-resource'
import { PictureArticle } from '../../../../../common/src'

const Cartoon = ({ article }: { article: PictureArticle }) => (
    <View style={{ backgroundColor: color.photoBackground }}>
        <GalleryHeader
            standfirst={article.trail}
            headline={article.headline}
            byline={article.byline}
            cutout={article.bylineImages && article.bylineImages.cutout}
        />
        <View
            style={{
                alignItems: 'center',
                borderColor: color.palette.neutral[46],
                borderTopWidth: 1,
                paddingVertical: metrics.vertical / 2,
                paddingBottom: metrics.vertical * 10,
            }}
        >
            {article.image && (
                <MaxWidthWrap>
                    <AutoSizedImageResource
                        style={{ width: '100%' }}
                        image={article.image}
                    />
                </MaxWidthWrap>
            )}
        </View>
    </View>
)

export { Cartoon }
