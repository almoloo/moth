import Logo from '@/components/Logo';
import { Skeleton } from '@/components/ui/skeleton';
import { BracesIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GatewayProps {}

const Gateway: React.FC<GatewayProps> = () => {
	const [loading, setLoading] = useState<boolean>(true);

	return (
		<div className="gateway-container px-[50px] lg:px-[100px] flex flex-col justify-center">
			<header className="py-[25px] lg:py-[50px] self-center">
				<Link to="/">
					<Logo className="h-6 text-rose-500" />
				</Link>
			</header>
			<main className="grow bg-white border rounded-lg shadow flex flex-col lg:grid lg:grid-cols-2">
				<section className="flex flex-col items-center justify-center gap-3">
					{loading ? (
						<>
							<Skeleton className="w-24 h-24 rounded-full" />
							<Skeleton className="w-36 h-6 rounded" />
							<Skeleton className="w-24 h-4 rounded" />
						</>
					) : (
						<>
							<img
								src=""
								alt=""
								className="w-24 h-24 rounded-full"
							/>
						</>
					)}
				</section>
				<section>right side</section>
			</main>
			<footer className="py-[25px] lg:py-[50px] flex items-center self-center gap-1">
				<BracesIcon className="h-4 w-4 text-rose-300" />
				<p className="leading-none text-sm text-rose-50">
					Designed and Developed by <Link to="https://github.com/almoloo">@almoloo</Link>
					{' & '}
					<Link to="https://github.com/Hossein-79">@Hossein-79</Link>
					{'.'}
				</p>
			</footer>
		</div>
	);
};

export default Gateway;
