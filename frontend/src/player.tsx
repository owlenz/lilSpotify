import { useEffect, useState } from "react"
import logo from './assets/images/logo-universal.png';
import { ChangeState, CurrentSong, NextSong, OpenApp, PrevSong, Seek } from "../wailsjs/go/App/App.js"
import { BsFillPauseFill, BsFillSkipBackwardFill, BsFillSkipForwardFill, BsFillPlayFill } from "react-icons/bs";
type appStatus = "opened" | "closed"
type playbackStatus = "Paused" | "Playing"

export type Metadata = {
	"appStatus": appStatus
	"status": playbackStatus
	"artist": string
	"albumCover": string
	"title": string
	"album": string
	"length": string
	"lengthF": string
	"position": string
	"positionF": string
	"lengthR": string
	"trackId": string
}

function Player() {
	const [appStatus, setAppStatus] = useState<boolean | undefined>();
	const [status, setStatus] = useState<boolean | undefined>();
	const [metadata, setMetadata] = useState<Metadata|null>();
	const [posBar, setPosBar] = useState<number>()

	const openSpotify = async () => {
		await OpenApp();
	}

	const changeState = async () => {
		await ChangeState();
		setStatus(!status)
	}

	const nextSong = async () => {
		await NextSong();
	}
	const prevSong = async () => {
		await PrevSong();
	}

	const seek = async (event: React.MouseEvent<HTMLDivElement>) => {
		const bar = document.getElementsByClassName("bar")[0].getBoundingClientRect();
		console.log(bar.width, event)

		const x = (event.clientX - bar.left) / bar.width
		if (metadata) {
			console.log("millisecond: ", x * parseInt(metadata.lengthR))
			setPosBar(x * 100)
			await Seek(Math.floor(x * parseInt(metadata.lengthR)), metadata.trackId)
		}
	}


	const fetchCurrentSong = async () => {
		try {
			const result = await CurrentSong();
			//@ts-ignore
			setMetadata((prevMetadata) => {
				if (prevMetadata?.trackId !== result.trackId) {
					setPosBar(0);
				}
				return result;
			});
			console.log(result, metadata);
			setStatus(result.status === "Playing")
			if (result.appStatus === "closed") {
				setAppStatus(false)
			} else {
				setAppStatus(true)
				setPosBar((parseFloat(result["position"]) / parseFloat(result["length"])) * 100)
			}
		} catch (error) {
			console.error("Error fetching current song:", error);
		}
	};

	useEffect(() => {
		const intervalId = setInterval(fetchCurrentSong, 1000);
		//const pos_fetch = setInterval(() => {
		//if (metadata && metadata["position"])
		//}, 3000);

		return () => { clearInterval(intervalId); };
	}, []);

	useEffect(() => {
		const handlePauseListner = (event: KeyboardEvent) => {
			if (event.code === "Space") changeState()
		}
		window.addEventListener('keydown', handlePauseListner)
		return () => window.removeEventListener('keydown', handlePauseListner)
	})


	return appStatus === true && metadata ? (
		<div id="App" className='App'>
			<div className='artContainer'>
				<img src={metadata ? metadata["albumCover"] : logo} id="art" alt="album cover" />
			</div>
			<div className='controls'>
				<button className='playback' onClick={prevSong}><BsFillSkipBackwardFill /></button>
				<button className='playback' onClick={changeState}>{status ? <BsFillPauseFill /> : <BsFillPlayFill />}</button>
				<button className='playback' onClick={nextSong}><BsFillSkipForwardFill /></button>
			</div>
			<div className='bot'>
				<div id="title" className="title">{metadata["title"]}</div>
				<div className='status'>
					<div onClick={seek} className='bar'>
						<div className='innerBar' style={{ width: `${posBar}%` }}></div>
						<div className="seek_ball" style={{left: `${posBar}%`; right: `${}`;}}></div>
					</div>
					<div className='position'>
						<span>{metadata["positionF"]}</span>
						<span>{metadata["lengthF"]}</span>
					</div>
				</div>
			</div>
		</div>
	) : appStatus === false ? (<div className='App'><button className='openButton' onClick={() => openSpotify()}>Open Spotify</button></div>) : null
}

export default Player
