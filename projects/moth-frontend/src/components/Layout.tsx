import React from 'react';
import Logo from './Logo';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { BracesIcon, GithubIcon } from 'lucide-react';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<>
			<header className="padding py-[15px] lg:py-[15px] flex items-center border-b">
				<Link to="/">
					<Logo className="h-6 text-neutral-700" />
				</Link>
				<nav className="flex space-x-5 ml-auto">
					<Button
						size="sm"
						variant="link"
					>
						About Us
					</Button>
					<Button
						size="sm"
						variant="default"
					>
						Connect Button
					</Button>
				</nav>
			</header>
			<main>{children}</main>
			<footer className="padding border-t">
				<div className="flex items-center justify-between border-b pb-[30px]">
					<Link to="/">
						<Logo className="text-neutral-400 h-6" />
					</Link>
					<Link to="https://github.com/almoloo/moth">
						<Button
							variant="outline"
							size="icon"
							className="rounded-full"
						>
							<GithubIcon className="h-4 w-4 text-rose-500" />
						</Button>
					</Link>
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
		</>
	);
};

export default Layout;
