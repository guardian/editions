import { setConsent } from '../gdpr-consent-screen'
import ApolloClient from 'apollo-client'
import AsyncStorage from '@react-native-community/async-storage'

describe('gdpr-consent', () => {
    let client: ApolloClient<object>
    describe('setConsent', () => {
        it('should set consent values in async storage', async () => {
            // client = new ApolloClient({
            //     cache: new InMemoryCache(),
            //     link: NON_IMPLEMENTED_LINK,
            //     resolvers: {},
            // })

            const getperf = async () =>
                await AsyncStorage.getItem('@Setting_gdprAllowPerformance')

            setConsent('gdprAllowPerformance', true)
            expect(AsyncStorage.setItem).toHaveBeenCalledTimes(3)

            const newValue = await getperf()
            expect(newValue).toBe('true')
            setConsent('gdprAllowPerformance', false)
            const falseValue = await getperf()
            expect(falseValue).toBe('false')
        })
    })
})
