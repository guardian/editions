import React from 'react'
import { StyleSheet, View } from 'react-native'
import { HeadlineText } from 'src/components/styled-text'
import { useMediaQuery } from 'src/hooks/use-screen'
import { useToast } from 'src/hooks/use-toast'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'
import { UiBodyCopy } from './styled-text'

export interface ToastProps {
    title: string
    subtitle?: string
}
export type ToastList = ToastProps[]

const styles = StyleSheet.create({
    toast: {
        backgroundColor: color.palette.highlight.main,
        padding: metrics.sides.sides,
        paddingTop: metrics.vertical / 2,
        paddingBottom: metrics.vertical * 2,
        borderColor: color.palette.highlight.dark,
        borderTopWidth: 1,
    },
    title: getFont('headline', 1, 'bold'),
})

const Toast = ({ title, subtitle }: ToastProps) => {
    const isTablet = useMediaQuery(width => width >= Breakpoints.tabletVertical)
    return (
        <View
            style={[
                styles.toast,
                isTablet && { paddingHorizontal: metrics.sides.sidesTablet },
            ]}
        >
            <HeadlineText style={styles.title}>{title}</HeadlineText>
            {subtitle && <UiBodyCopy>{subtitle}</UiBodyCopy>}
        </View>
    )
}

const holderStyles = StyleSheet.create({
    root: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
})

const ToastRootHolder = ({}) => {
    const [toasts] = useToast()
    return (
        <View style={holderStyles.root}>
            {toasts.map((toast, i) => (
                <Toast {...toast} key={i + toast.title} />
            ))}
        </View>
    )
}

export { Toast, ToastRootHolder }
