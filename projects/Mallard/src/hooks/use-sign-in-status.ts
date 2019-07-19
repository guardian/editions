import { useEffect, useState } from 'react'
import { membershipAccessTokenKeychain } from 'src/authentication/keychain'

export enum SignInStatus {
    pending,
    signedIn,
    signedOut,
}

/**
 *
 * Returns
 *  null - means pending on the async request
 *  false - no currently loged in member
 *  true - is signed in
 */
const useSignInStatus = (deps = []) => {
    const [membersData, setMembersData] = useState<SignInStatus>(
        SignInStatus.pending,
    )
    useEffect(() => {
        membershipAccessTokenKeychain
            .get()
            .then(token =>
                setMembersData(
                    token ? SignInStatus.signedIn : SignInStatus.signedOut,
                ),
            )
    }, deps)
    return membersData
}

export { useSignInStatus }
