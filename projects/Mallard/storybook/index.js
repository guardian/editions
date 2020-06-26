import {
    getStorybookUI,
    configure,
    addDecorator,
} from '@storybook/react-native'
import { withKnobs } from '@storybook/addon-knobs'
import { loadStories } from './storyLoader'

addDecorator(withKnobs)

configure(() => {
    loadStories()
}, module)

const StorybookUI = getStorybookUI({ port: 7007, host: 'localhost' })
export default StorybookUI
