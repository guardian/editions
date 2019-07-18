import { useEffect, useState } from 'react'
import { membershipAccessTokenKeychain } from 'src/authentication/keychain'

/**
 *
 * Returns
 *  null - means pending on the async request
 *  false - no currently loged in member
 *  true - is signed in
 */
const useIsSignedIn = (deps = []) => {
    const [membersData, setMembersData] = useState<boolean | null>(null)
    useEffect(() => {
        membershipAccessTokenKeychain
            .get()
            .then(token => setMembersData(!!token))
    }, deps)
    return membersData
}

export { useIsSignedIn }
