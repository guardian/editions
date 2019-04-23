import React from 'react';
import { Router, Link, RouteComponentProps } from '@reach/router';
import Article from './component/Article';

const Home = ({  }: RouteComponentProps) => (
	<div>
		<h2>Welcome</h2>
	</div>
);

const Dashboard = ({  }: RouteComponentProps) => (
	<div>
		<h2>Dashboard</h2>
	</div>
);

const App: React.FC = () => {
	return (
		<div className="App">
			<nav>
				<Link to="/">Home</Link>
				<Link to="dashboard">Dashboard</Link>
				<Link to="edition/id/front/otters">Article</Link>
			</nav>
			<Router>
				<Home path="/" />
				<Dashboard path="dashboard" />
				<Article path=":edition/:editionId/:front/:article" />
			</Router>
		</div>
	);
};

export default App;
