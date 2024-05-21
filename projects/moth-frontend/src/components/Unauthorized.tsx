import { ShieldOffIcon } from 'lucide-react';
import React from 'react';

const Unauthorized = () => {
	return (
		<section className="padding flex grow items-center justify-center bg-slate-50">
			<div className="bg-rose-100/25 flex items-center border border-dashed rounded p-8 gap-5">
				<ShieldOffIcon className="h-12 w-12 text-rose-400" />
				<div className="flex flex-col gap-2">
					<h1 className="text-xl font-bold">Unauthorized Access</h1>
					<p className="text-neutral-500">You need to connect your wallet to access this page.</p>
				</div>
			</div>
		</section>
	);
};

export default Unauthorized;
