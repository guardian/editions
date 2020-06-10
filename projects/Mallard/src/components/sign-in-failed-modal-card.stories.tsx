import React from 'react'
import { storiesOf } from '@storybook/react-native'
import { withKnobs } from '@storybook/addon-knobs'
import { SignInFailedModalCard } from './sign-in-failed-modal-card'

storiesOf('SignInFailedModalCard', module)
    .addDecorator(withKnobs)
    .add('SignInFailedModalCard - default', () => (
        <SignInFailedModalCard
            email={'harry@potter.com'}
            onDismiss={() => undefined}
            onOpenCASLogin={() => undefined}
            onLoginPress={() => undefined}
            onFaqPress={() => undefined}
            close={() => undefined}
        />
    ))
    .add('SignInFailedModalCard - apple sign in hidden email', () => (
        <SignInFailedModalCard
            email={'harry@privaterelay.appleid.com'}
            onDismiss={() => undefined}
            onOpenCASLogin={() => undefined}
            onLoginPress={() => undefined}
            onFaqPress={() => undefined}
            close={() => undefined}
        />
    ))
