import React from 'react';

interface PageHeaderProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon, title, description }) => {
	return (
		<section className="padding bg-slate-50 flex flex-col gap-5">
			<div className="flex items-center gap-2">
				<div className="w-6 h-6 text-slate-500">{icon}</div>
				<h1 className="text-xl font-bold">{title}</h1>
			</div>
			<p className="text-neutral-600 text-sm">{description}</p>
		</section>
	);
};

export default PageHeader;
