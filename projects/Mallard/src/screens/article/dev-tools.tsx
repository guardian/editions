import React from 'react'

import { articlePillars, ArticleType } from 'src/common'
import { Dimensions } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { Button } from 'src/components/button/button'

export const getEnumPosition = <T extends {}>(value: any, position: number) => {
    return (value[Object.keys(value)[position]] as unknown) as T
}

export const DevTools = ({
    pillar,
    setPillar,
    type,
    setType,
}: {
    pillar: number
    type: number
    setPillar: (p: (p: number) => number) => void
    setType: (t: (t: number) => number) => void
}) => {
    return (
        <>
            <Button
                onPress={() => {
                    setPillar(app => {
                        if (app + 1 >= articlePillars.length) {
                            return 0
                        }
                        return app + 1
                    })
                }}
                style={{
                    position: 'absolute',
                    zIndex: 9999,
                    elevation: 999,
                    top: Dimensions.get('window').height - 600,
                    right: metrics.horizontal,
                    alignSelf: 'flex-end',
                }}
            >
                {`${articlePillars[pillar]} 🌈`}
            </Button>
            <Button
                onPress={() => {
                    setType(app => {
                        if (app + 1 >= Object.keys(ArticleType).length) {
                            return 0
                        }
                        return app + 1
                    })
                }}
                style={{
                    position: 'absolute',
                    zIndex: 9999,
                    elevation: 999,
                    top: Dimensions.get('window').height - 550,
                    right: metrics.horizontal,
                    alignSelf: 'flex-end',
                }}
            >
                {`${getEnumPosition(ArticleType, type)} 🌈`}
            </Button>
        </>
    )
}
