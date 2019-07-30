import { useState } from 'react'

const useForceUpdate = () => {
    const [, setState] = useState(true)
    return () => setState(prev => !prev)
}

export { useForceUpdate }
