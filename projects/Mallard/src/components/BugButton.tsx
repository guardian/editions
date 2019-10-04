import React from 'react'
import { useContext } from 'react'
import { createMailtoHandler } from 'src/helpers/diagnostics'
import { Button } from './button/button'
import { isInBeta } from 'src/helpers/release-stream'
import { StyleSheet } from 'react-native'
import { AccessContext } from 'src/authentication/AccessContext'

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 9999,
    },
})

const BugButton = () => {
    const { attempt } = useContext(AccessContext)
    return isInBeta() ? (
        <Button
            style={styles.button}
            onPress={createMailtoHandler('Report a bug', '', attempt)}
            alt="Report a bug"
            icon=""
        />
    ) : null
}

export { BugButton }
