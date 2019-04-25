import React from 'react';
import { Router, RouteComponentProps, Redirect } from '@reach/router';
import Article, { ArticleProps } from './route/Article';
import Issue, { IssueProps } from './route/Issue';
import Product, { ProductProps } from './route/Product';
import Front, { FrontProps } from './route/Front';
import Footer from './component/layout/Footer';
import injectGlobalStyles from './helper/globalStyles';
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
    injectGlobalStyles();
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
