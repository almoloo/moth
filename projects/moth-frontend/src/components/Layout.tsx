import React from 'react';
import Logo from './Logo';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { BracesIcon, GithubIcon } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import ConnectButton from './ConnectButton';
import { useWallet } from '@txnlab/use-wallet';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const { activeAddress } = useWallet();
	return (
		<>
			<header className="px-[25px] py-[15px] lg:px-[100px] flex items-center border-b sticky top-0 z-10 bg-white">
				<Link to="/">
					<Logo className="h-6 text-neutral-700" />
				</Link>
				<nav className="flex space-x-5 ml-auto">
					{!activeAddress && (
						<Button
							size="sm"
							variant="link"
							asChild
						>
							<Link to="/about">About Us</Link>
						</Button>
					)}
					<ConnectButton />
				</nav>
			</header>
			<main className="layout-container">{children}</main>
			<footer className="px-[25px] py-[15px] lg:p-[100px]">
				<div className="flex items-center justify-between border-b pb-[30px]">
					<Link to="/">
						<Logo className="text-neutral-400 h-6" />
					</Link>
					<Button
						variant="outline"
						size="icon"
						className="rounded-full"
						asChild
					>
						<Link to="https://github.com/almoloo/moth">
							<GithubIcon className="h-4 w-4 text-rose-500" />
						</Link>
					</Button>
				</div>
				<div className="mt-[30px] flex items-center justify-center space-x-1">
					<BracesIcon className="h-4 w-4 text-rose-300" />
					<p className="leading-none text-sm text-neutral-600">
						Designed and Developed by <Link to="https://github.com/almoloo">@almoloo</Link>
						{' & '}
						<Link to="https://github.com/Hossein-79">@Hossein-79</Link>
						{'.'}
					</p>
				</div>
			</footer>
			<Toaster />
		</>
	);
};

export default Layout;
