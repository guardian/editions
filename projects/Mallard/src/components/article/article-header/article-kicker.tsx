import React from 'react'
import { View } from "react-native";
import { useArticleAppearance } from 'src/theme/appearance'
import { HeadlineKickerText } from 'src/components/styled-text';
import { longReadHeaderStyles, newsHeaderStyles } from './article-header-styles';

export interface ArticleKickerProps {
    kicker: string,
    type?: 'news' | 'longRead'
};

export const ArticleKicker = ({
    kicker,
    type
}: ArticleKickerProps) => {
    const { appearance } = useArticleAppearance();
    return (
        <View style={[type && type === 'longRead' ? longReadHeaderStyles.kicker : newsHeaderStyles.kicker, appearance.backgrounds]}>
            <HeadlineKickerText style={[appearance.text]    }>
                {kicker}
            </HeadlineKickerText>
        </View>
    );
}
