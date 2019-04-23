import React from 'react';
import { Router, Link, RouteComponentProps, Redirect } from '@reach/router';
import Article, { ArticleProps } from './route/Article';
import Edition, { EditionProps } from './route/Edition';
import Product, { ProductProps } from './route/Product';
import Front, { FrontProps } from './route/Front';

const Error = () => <div>Error!</div>;

const ProductRoute = (props: RouteComponentProps<ProductProps>) => {
	if (props.product) {
		return <Product product={props.product} />;
	} else return <Error />;
};

const EditionRoute = (props: RouteComponentProps<EditionProps>) => {
	if (props.product && props.edition) {
		return <Edition edition={props.edition} product={props.product} />;
	} else return <Error />;
};

const FrontRoute = (props: RouteComponentProps<FrontProps>) => {
	if (props.front && props.product && props.edition) {
		return (
			<Front
				front={props.front}
				edition={props.edition}
				product={props.product}
			/>
		);
	} else return <Error />;
};

const ArticleRoute = (props: RouteComponentProps<ArticleProps>) => {
	if (props.front && props.article && props.product && props.edition) {
		return (
			<Article
				article={props.article}
				front={props.front}
				edition={props.edition}
				product={props.product}
			/>
		);
	} else return <Error />;
};

const App: React.FC = () => {
	return (
		<div className="App">
			<nav>
				<Link to="/">Home</Link>
				<Link to="daily/sunday">Sunday</Link>
				<Link to="daily/sunday/sport">Sports front</Link>
				<Link to="daily/sunday/sport/otters">Sports Article</Link>
			</nav>
			<Router>
				<Redirect from="/" to="daily" noThrow />
				<ProductRoute path=":product" />
				<EditionRoute path=":product/:edition" />
				<FrontRoute path=":product/:edition/:front" />
				<ArticleRoute path=":product/:edition/:front/:article" />
			</Router>
		</div>
	);
};

export default App;
