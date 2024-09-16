import CrosswordView from './components/CrosswordView.jsx'
import { createRoot } from 'react-dom/client'

declare global {
    interface Window {
        loadCrosswordData: (id: string, crosswordData: any) => false | void
    }
}

const wrapper = document.getElementById('root')!
const root = createRoot(wrapper)

window.loadCrosswordData = (id, crosswordData) => {
    return wrapper
        ? // @ts-ignore
          root.render(<CrosswordView id={id} crosswordData={crosswordData} />)
        : false
}
