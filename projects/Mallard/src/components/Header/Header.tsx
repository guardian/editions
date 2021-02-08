import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Button } from '../Button/Button'
import { CloseButton } from '../Button/CloseButton'
import { IssueTitle } from '../issue/issue-title'
import { Header } from '../layout/header/header'

const HeaderScreenContainer = ({
    actionLeft,
    actionRight,
    children,
    title,
}) => {
    const navigation = useNavigation()
    return (
        <>
            <Header
                leftAction={
                    actionLeft ? (
                        <Button
                            icon={'\uE00A'}
                            alt="Back"
                            onPress={() => navigation.goBack()}
                        ></Button>
                    ) : null
                }
                action={
                    actionRight ? (
                        <CloseButton
                            accessibilityLabel={`Close the ${title} screen`}
                            accessibilityHint="Closes the current screen"
                            onPress={() => navigation.goBack()}
                        />
                    ) : null
                }
                layout={'center'}
            >
                <IssueTitle title={title} />
            </Header>
            {children}
        </>
    )
}

export { HeaderScreenContainer }
