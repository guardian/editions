import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { withKnobs, color, text } from '@storybook/addon-knobs'
import { IssueMenuButton } from './IssueMenuButton'
import { CloseModalButton } from './CloseModalButton'
import { BugButton } from './BugButton'
import { ReloadButton } from './ReloadButton'
import { ModalButton } from './ModalButton'

storiesOf('Buttons', module)
    .addDecorator(withKnobs)
    .add('IssueMenuButton - default', () => (
        <IssueMenuButton onPress={() => {}} />
    ))
    .add('CloseModalButton - default', () => (
        <CloseModalButton onPress={() => {}} />
    ))
    .add('CloseModalButton - with colour', () => {
        const colorPicker = color('colour', '#41A9E0')
        return (
            <CloseModalButton
                onPress={() => {}}
                bgColor={colorPicker}
                borderColor={colorPicker}
            />
        )
    })
    .add('BugButton - default', () => <BugButton onPress={() => {}} />)
    .add('ReloadButton - default', () => <ReloadButton onPress={() => {}} />)
    .add('ModalButton - default', () => (
        <ModalButton onPress={() => {}}>
            {text('Button Text', 'Sign In')}
        </ModalButton>
    )) // WASSIS?!
