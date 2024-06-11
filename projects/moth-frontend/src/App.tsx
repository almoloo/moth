import { DeflyWalletConnect } from '@blockshake/defly-connect';
import { DaffiWalletConnect } from '@daffiwallet/connect';
import { PeraWalletConnect } from '@perawallet/connect';
import { PROVIDER_ID, ProvidersArray, WalletProvider, useInitializeProviders } from '@txnlab/use-wallet';
import algosdk from 'algosdk';
import { SnackbarProvider } from 'notistack';
import Home from './routes/Home';
import { getAlgodConfigFromViteEnvironment, getKmdConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './routes/About';
import Explore from './routes/Explore';
import Profile from './routes/Profile';
import Gateway from './routes/Gateway';
import Layout from './components/Layout';
import NoMatch from './components/NoMatch';
import Dashboard from './routes/Dashboard';
import Sample from './routes/Sample';

let providersArray: ProvidersArray;
if (import.meta.env.VITE_ALGOD_NETWORK === '') {
	const kmdConfig = getKmdConfigFromViteEnvironment();
	providersArray = [
		{
			id: PROVIDER_ID.KMD,
			clientOptions: {
				wallet: kmdConfig.wallet,
				password: kmdConfig.password,
				host: kmdConfig.server,
				token: String(kmdConfig.token),
				port: String(kmdConfig.port),
			},
		},
	];
} else {
	providersArray = [
		{ id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
		{ id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
		{ id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect },
		{ id: PROVIDER_ID.EXODUS },
		// If you are interested in WalletConnect v2 provider
		// refer to https://github.com/TxnLab/use-wallet for detailed integration instructions
	];
}

export default function App() {
	const algodConfig = getAlgodConfigFromViteEnvironment();

	const walletProviders = useInitializeProviders({
		providers: providersArray,
		nodeConfig: {
			network: algodConfig.network,
			nodeServer: algodConfig.server,
			nodePort: String(algodConfig.port),
			nodeToken: String(algodConfig.token),
		},
		algosdkStatic: algosdk,
	});

	const addLayout = (element: JSX.Element) => {
		return <Layout>{element}</Layout>;
	};

	return (
		<SnackbarProvider maxSnack={3}>
			<WalletProvider value={walletProviders}>
				<Router>
					<Routes>
						<Route
							path="/"
							element={addLayout(<Home />)}
						/>
						<Route
							path="/about"
							element={addLayout(<About />)}
						/>
						<Route
							path="/explore"
							element={addLayout(<Explore />)}
						/>
						<Route
							path="/profile"
							element={addLayout(<Profile />)}
						/>
						<Route
							path="/gateway/:address/:amount/:returnUrl"
							element={<Gateway />}
						/>
						<Route
							path="*"
							element={addLayout(<NoMatch />)}
						/>
						<Route
							path="/dashboard"
							element={addLayout(<Dashboard />)}
						/>
						<Route
							path="/sample"
							element={addLayout(<Sample />)}
						/>
					</Routes>
				</Router>
			</WalletProvider>
		</SnackbarProvider>
	);
}
