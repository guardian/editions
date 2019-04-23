import React from 'react';
import { Router, Link, RouteComponentProps, Redirect } from '@reach/router';
import Article from './component/Article';

const Home = ({  }: RouteComponentProps) => (
	<div>
		<h2>Welcome</h2>
	</div>
);

const Edition = ({  }: RouteComponentProps) => (
	<div>
		<h2>Edition</h2>
	</div>
);

const Front = ({  }: RouteComponentProps) => (
	<div>
		<h2>Front</h2>
	</div>
);

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
				<Home path=":edition" />
				<Edition path=":edition/:editionId" />
				<Front path=":edition/:editionId/:front" />
				<Article path=":edition/:editionId/:front/:article" />
			</Router>
		</div>
	);
};

export default App;
