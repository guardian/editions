import React, { useState } from 'react'

import { articlePillars, ArticleType } from 'src/common'
import { StyleSheet, View } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { Button, ButtonAppearance } from 'src/components/button/button'

export const getEnumPosition = <T extends {}>(
    value: T,
    position: number,
): T[keyof T] => {
    const enumAsArray = Object.values(value)
    return enumAsArray[position] as T[keyof T]
}

const styles = StyleSheet.create({
    devTools: {
        position: 'absolute',
        zIndex: 9999,
        elevation: 999,
        top: metrics.vertical,
        right: metrics.horizontal,
        alignItems: 'flex-end',
    },
})

export const DevTools = ({
    pillar,
    type,
    setPillar,
    setType,
}: {
    pillar: number
    type: number
    setPillar: (p: (p: number) => number) => void
    setType: (t: (t: number) => number) => void
}) => {
    const [open, setOpen] = useState(false)
    return (
        <View style={styles.devTools}>
            <Button
                appearance={ButtonAppearance.skeletonActive}
                alt={'open devtools'}
                onPress={() => {
                    setOpen(current => !current)
                }}
            >
                {`🌈`}
            </Button>
            {open && (
                <>
                    <Button
                        style={{ marginTop: metrics.vertical }}
                        onPress={() => {
                            setPillar(app => {
                                if (app + 1 >= articlePillars.length) {
                                    return 0
                                }
                                return app + 1
                            })
                        }}
                    >
                        {`PILLAR: ${articlePillars[pillar]}`}
                    </Button>
                    <Button
                        style={{ marginTop: metrics.vertical }}
                        onPress={() => {
                            setType(app => {
                                if (
                                    app + 1 >=
                                    Object.keys(ArticleType).length
                                ) {
                                    return 0
                                }
                                return app + 1
                            })
                        }}
                    >
                        {`TYPE: ${getEnumPosition(ArticleType, type)}`}
                    </Button>
                </>
            )}
        </View>
    )
}
