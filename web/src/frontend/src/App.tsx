import * as React from "react";
import "./App.css";
import AlertStripe from "nav-frontend-alertstriper";
import "./styles/app.css";

const logo = require("./logo.svg");

class App extends React.Component<{}, {}> {
	render() {
		return (
			<div className="App">
				<div className="App-header">
					<img src={ logo } className="App-logo" alt="logo" />
					<h2>Welcome to React</h2>
				</div>
				<p className="App-intro">
					To get not started, edit <code>src/App.tsx</code> and save to reload.
					</p>
				<AlertStripe type="suksess" solid={ true }>
					Whoo
				</AlertStripe>
			</div>
		);
	}
}

export default App;
