import React from 'react';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<>
			<header>header</header>
			<main>{children}</main>
			<footer>footer</footer>
		</>
	);
};

export default Layout;
