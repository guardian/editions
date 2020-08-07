import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { withKnobs, text } from '@storybook/addon-knobs'
import { IssueMenuButton } from './IssueMenuButton'
import { BugButton } from './BugButton'
import { ReloadButton } from './ReloadButton'
import { ModalButton } from './ModalButton'
import { ButtonAppearance } from './Button'
import { CloseButton } from './CloseButton'
import { SettingsButton } from './SettingsButton'

storiesOf('Buttons', module)
    .addDecorator(withKnobs)
    .add('IssueMenuButton - default', () => (
        <IssueMenuButton onPress={() => {}} />
    ))
    .add('CloseButton - default', () => {
        return (
            <CloseButton
                onPress={() => {}}
                appearance={ButtonAppearance.default}
                accessibilityHint="Accesibility Hint"
                accessibilityLabel="Accesibility Label"
            />
        )
    })
    .add('CloseButton - with appearance', () => {
        return (
            <CloseButton
                onPress={() => {}}
                appearance={ButtonAppearance.modal}
                accessibilityHint="Accesibility Hint"
                accessibilityLabel="Accesibility Label"
            />
        )
    })
    .add('BugButton - default', () => <BugButton onPress={() => {}} />)
    .add('ReloadButton - default', () => <ReloadButton onPress={() => {}} />)
    .add('ModalButton - default', () => (
        <ModalButton onPress={() => {}}>
            {text('Button Text', 'Sign In')}
        </ModalButton>
    ))
    .add('SettingsButton - default', () => (
        <SettingsButton onPress={() => {}} />
    ))
