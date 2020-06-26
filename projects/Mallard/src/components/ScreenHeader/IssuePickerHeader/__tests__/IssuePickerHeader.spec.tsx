import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { IssuePickerHeader } from '../IssuePickerHeader'

jest.mock('src/helpers/locale', () => ({
    locale: 'en_GB',
}))

jest.mock('react-navigation', () => ({
    withNavigation: (child: any) => child,
}))

describe('IssuePickerHeader', () => {
    it('should match the default style', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <IssuePickerHeader />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    it('should match the altered style by the prop headerStyles', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <IssuePickerHeader
                headerStyles={{
                    backgroundColor: '#7D0068',
                    textColorPrimary: '#007ABC',
                    textColorSecondary: '#F3C100',
                }}
            />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
})
