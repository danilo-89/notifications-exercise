import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
	const [count, setCount] = useState(0);

	const fetchTest = async () => {
		const response = await fetch(
			'http://localhost:3001/notifications?_page=1&_limit=20'
		);
		console.log(response);
		const movies = await response.json();
		console.log(movies);
		const linkHeader = response.headers.get('Link');
		const totalCountHeader = response.headers.get('X-Total-Count');
		const contentRangeHeader = response.headers.get('Content-Range');
		const unseenCount = response.headers.get('X-Unseen-Count');
		console.log(
			response.headers,
			{ linkHeader },
			{ totalCountHeader },
			{ contentRangeHeader },
			{ unseenCount }
		);
		for (let [key, value] of response.headers.entries()) {
			console.log(`${key}: ${value}`);
		}
		console.log(response.headers.get('X-Unseen-Count'));
	};

	fetchTest();

	return (
		<>
			<div>
				<a href='https://vitejs.dev' target='_blank'>
					<img src={viteLogo} className='logo' alt='Vite logo' />
				</a>
				<a href='https://react.dev' target='_blank'>
					<img src={reactLogo} className='logo react' alt='React logo' />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className='card'>
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className='read-the-docs'>
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
