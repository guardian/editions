import React from 'react';
import { Router, RouteComponentProps, Redirect } from '@reach/router';
import Article, { ArticleProps } from './route/Article';
import Issue, { IssueProps } from './route/Issue';
import Product, { ProductProps } from './route/Product';
import Front, { FrontProps } from './route/Front';
import Footer from './component/Footer';
import emotionReset from 'emotion-reset';
import { injectGlobal } from 'emotion';
import { palette } from '@guardian/pasteup/palette';

const Error = () => <div>Error!</div>;

const ProductRoute = (props: RouteComponentProps<ProductProps>) => {
    if (props.product) {
        return <Product product={props.product} />;
    } else return <Error />;
};

const IssueRoute = (props: RouteComponentProps<IssueProps>) => {
    if (props.product && props.issue) {
        return <Issue issue={props.issue} product={props.product} />;
    } else return <Error />;
};

const FrontRoute = (props: RouteComponentProps<FrontProps>) => {
    if (props.front && props.product && props.issue) {
        return (
            <Front
                front={props.front}
                issue={props.issue}
                product={props.product}
            />
        );
    } else return <Error />;
};

const ArticleRoute = (props: RouteComponentProps<ArticleProps>) => {
    if (props.front && props.article && props.product && props.issue) {
        return (
            <Article
                article={props.article}
                front={props.front}
                issue={props.issue}
                product={props.product}
            />
        );
    } else return <Error />;
};

const App: React.FC = () => {
    injectGlobal`
        ${emotionReset}
        :root {
            font-family: 'system-ui';
        }
        a {
            color: ${palette.brand.main};
        }
    `;
    return (
        <>
            <Router>
                <Redirect from="/" to="daily" noThrow />
                <ProductRoute path=":product" />
                <IssueRoute path=":product/:issue" />
                <FrontRoute path=":product/:issue/:front" />
                <ArticleRoute path=":product/:issue/:front/:article" />
            </Router>
            <Footer />
        </>
    );
};

export default App;
