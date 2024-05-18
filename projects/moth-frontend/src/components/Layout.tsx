import React from 'react';
import Logo from './Logo';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<>
			<header className="padding py-[15px] flex items-center border-b mb-4">
				<Logo className="h-6" />
			</header>
			<main>{children}</main>
			<footer>footer</footer>
		</>
	);
};

export default Layout;
