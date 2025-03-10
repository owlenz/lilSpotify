import { useEffect, useState } from 'react';
import { Init } from '../wailsjs/go/App/App.js';
import './App.css';
import Player from './player';


function App() {
	const [App, setApp] = useState<"dbus" | "api" | undefined>();


	function start_dbus() {
		console.log("xd")
		setApp("dbus")
	}


	useEffect(() => {
		if (App == "api") {
			(async () => { await Init("api") })()
		}else if(App == "dbus") {
			(async () => { await Init("dbus") })()
		}
	}, [App])

	return App ? <Player/>  : (
		<div className='home'>
			<button onClick={() => start_dbus()}>Dbus (Linux Only)</button>
			<button onClick={() => setApp("api")}>Spotify Api</button>
		</div>
	)

}

export default App
