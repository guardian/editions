import React from "react";
import TestRenderer from "react-test-renderer";
import { ArticleKicker } from "../article-kicker";

describe("ArticleKicker", () => {
    it('should display a default Kicker', () => {
        const component: any = TestRenderer.create(<ArticleKicker kicker="Opinion" />).toJSON();
        expect(component).toMatchSnapshot();
    })
    it('should display a long read style kicker', () => {
        const component: any = TestRenderer.create(<ArticleKicker kicker="Opinion" type="longRead" />).toJSON();
        expect(component).toMatchSnapshot();
    })
});
