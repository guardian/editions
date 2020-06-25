import React from 'react'
import TestRenderer, { ReactTestRendererJSON } from 'react-test-renderer'
import { ScreenHeader } from '../ScreenHeader'
import { IssueOrigin } from '../../../../../Apps/common/src'

jest.mock('src/helpers/locale', () => ({
    locale: 'en_GB',
}))

jest.mock('react-navigation', () => ({
    withNavigation: (child: any) => child,
}))

const issue = {
    name: 'Daily Edition',
    date: '2020-06-25',
    key: 'daily-edition/2020-06-25',
    publishedId: 'daily-edition/2020-06-25/2020-06-25T00:58:19.4Z',
    localId: 'daily-edition/2020-06-25',
    fronts: [],
    origin: 'api' as IssueOrigin,
}

describe('ScreenHeader', () => {
    it('should match the default style', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <ScreenHeader issue={issue} />,
        ).toJSON()
        expect(component).toMatchSnapshot()
    })
    it('should match the altered style by the prop headerStyles', () => {
        const component: ReactTestRendererJSON | null = TestRenderer.create(
            <ScreenHeader
                issue={issue}
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
