import { useEffect, useState } from 'react'
import { currentMembershipDataCache } from 'src/services/membership-service'
import { canViewEdition } from 'src/authentication/helpers'

export enum EditionMembershipStatus {
    pending,
    canView,
    cannotView,
    notLoggedIn,
}

const assertUnreachable = (x: never): never => {
    throw new Error("Didn't expect to get here")
}

const useCanViewEditionStatus = () => {
    const [canViewEditionStatus, setCanViewEditionStatus] = useState<
        EditionMembershipStatus
    >(EditionMembershipStatus.pending)

    useEffect(() => {
        currentMembershipDataCache
            .get()
            .then(data =>
                setCanViewEditionStatus(
                    data
                        ? canViewEdition(data)
                            ? EditionMembershipStatus.canView
                            : EditionMembershipStatus.cannotView
                        : EditionMembershipStatus.notLoggedIn,
                ),
            )
    })

    return <T>({
        canView,
        cannotView,
        notLoggedIn,
        pending,
    }: {
        canView: () => T
        cannotView: () => T
        notLoggedIn: () => T
        pending: () => T
    }) => {
        switch (canViewEditionStatus) {
            case EditionMembershipStatus.canView: {
                return canView()
            }
            case EditionMembershipStatus.cannotView: {
                return cannotView()
            }
            case EditionMembershipStatus.notLoggedIn: {
                return notLoggedIn()
            }
            case EditionMembershipStatus.pending: {
                return pending()
            }
            default: {
                return assertUnreachable(canViewEditionStatus)
            }
        }
    }
}

const useIsSignedIn = () => {
    const handler = useCanViewEditionStatus()

    return <T>({
        signedIn,
        signedOut,
        pending,
    }: {
        signedIn: () => T
        signedOut: () => T
        pending: () => T
    }) =>
        handler({
            canView: signedIn,
            cannotView: signedIn,
            notLoggedIn: signedOut,
            pending: pending,
        })
}

export { useCanViewEditionStatus, useIsSignedIn }
