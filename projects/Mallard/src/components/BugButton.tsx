import React from 'react'
import { useContext } from 'react'
import { AuthContext } from 'src/authentication/auth-context'
import { createMailtoHandler } from 'src/helpers/diagnostics'
import { Button } from './button/button'
import { isInBeta } from 'src/helpers/release-stream'

const BugButton = () => {
    const { status } = useContext(AuthContext)
    return isInBeta() ? (
        <Button
            style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
            }}
            onPress={createMailtoHandler('Report a bug', '', status)}
            alt="Report a bug"
            icon=""
        />
    ) : null
}

export { BugButton }
