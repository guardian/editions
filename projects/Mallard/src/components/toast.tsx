import React, { useEffect } from 'react'
import { UiBodyCopy } from './styled-text'
import { View } from 'react-native'
import { useToast } from 'src/hooks/use-toast'
import { Button } from './button/button'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { HeadlineText } from 'src/components/styled-text'
import { getFont } from 'src/theme/typography'

export interface ToastProps {
    title: string
    subtitle?: string
}
export type ToastList = ToastProps[]

const Toast = ({ title, subtitle }: ToastProps) => {
    return (
        <View
            style={{
                backgroundColor: color.palette.highlight.main,
                padding: metrics.sides.sides,
                paddingVertical: metrics.vertical,
                paddingBottom: metrics.vertical * 2,
            }}
        >
            <HeadlineText style={getFont('headline', 1, 'bold')}>
                {title}
            </HeadlineText>
            {subtitle && <UiBodyCopy>{subtitle}</UiBodyCopy>}
        </View>
    )
}

const ToastRootHolder = ({}) => {
    const [toasts, { addToast }] = useToast()
    useEffect(() => {
        addToast('hiiii ' + Date.now(), { subtitle: 'asfasdasdsadsad' })
    }, [])
    return (
        <View
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
            }}
        >
            <Button
                onPress={() => {
                    addToast('hiiii ' + Date.now(), {
                        subtitle: 'asfasdasdsadsad',
                    })
                }}
            >
                Add toast
            </Button>

            {toasts.map((toast, i) => (
                <Toast {...toast} key={i + toast.title} />
            ))}
        </View>
    )
}

export { Toast, ToastRootHolder }
