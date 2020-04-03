import { getStorybookUI, configure } from '@storybook/react-native'
import { loadStories } from './storyLoader'

configure(() => {
    loadStories()
}, module)

const StorybookUI = getStorybookUI({ port: 7007, host: 'localhost' })
export default StorybookUI
