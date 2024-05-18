import React from 'react';
import Logo from './Logo';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<>
			<header className="container flex items-center">
				<Logo className="h-6" />
				header
			</header>
			<main>{children}</main>
			<footer>footer</footer>
		</>
	);
};

export default Layout;
