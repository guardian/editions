import React, { Component } from 'react'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { GENERIC_FATAL_ERROR } from 'src/helpers/words'

class ErrorBoundary extends Component<
    {},
    { hasError: boolean; message: string | undefined }
> {
    constructor(props: {}) {
        super(props)
        this.state = { hasError: false, message: undefined }
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true, message: JSON.stringify(error) }
    }

    componentDidCatch() {
        //@TODO: Log this to sentry or w/e
    }

    render() {
        if (this.state.hasError) {
            return (
                <FlexErrorMessage
                    title={GENERIC_FATAL_ERROR}
                    message={`Here's some details; ` + this.state.message}
                ></FlexErrorMessage>
            )
        }

        return this.props.children
    }
}

export { ErrorBoundary }
