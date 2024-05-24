import { LifeBuoyIcon } from 'lucide-react';
import React from 'react';

const NoMatch = () => {
	return (
		<section className="padding flex grow items-center justify-center bg-slate-50">
			<div className="flex items-start gap-5">
				<LifeBuoyIcon className="h-12 w-12 text-rose-400" />
				<div className="flex flex-col gap-2">
					<h1 className="text-xl font-bold">404. Not Found!</h1>
					<p className="text-neutral-500 leading-relaxed">
						The page you are looking for does not exist.
						<br /> Please check the URL or click the button below to go back to the homepage.
					</p>
				</div>
			</div>
		</section>
	);
};

export default NoMatch;
