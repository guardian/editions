import React from 'react';
import { Router, Link, RouteComponentProps, Redirect } from '@reach/router';
import Article, { ArticleProps } from './route/Article';
import Issue, { IssueProps } from './route/Issue';
import Product, { ProductProps } from './route/Product';
import Front, { FrontProps } from './route/Front';

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
    return (
        <div>
            <Router>
                <Redirect from="/" to="daily" noThrow />
                <ProductRoute path=":product" />
                <IssueRoute path=":product/:issue" />
                <FrontRoute path=":product/:issue/:front" />
                <ArticleRoute path=":product/:issue/:front/:article" />
            </Router>
            <nav style={{ opacity: 0.5, fontSize: '.5em' }}>
                <ul>
                    <li>secret debug nav</li>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="daily/sunday">Sunday</Link>
                    </li>
                    <li>
                        <Link to="daily/sunday/sport">Sports front</Link>
                    </li>
                    <li>
                        <Link to="daily/sunday/sport/otters">
                            Sports Article
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default App;
