import { Button } from '@/components/ui/button';
import { FlaskConicalIcon } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sample = () => {
	function useQuery() {
		const { search } = useLocation();

		return React.useMemo(() => new URLSearchParams(search), [search]);
	}

	const query = useQuery();

	return (
		<section className="padding">
			<h2 className="font-bold text-lg mb-3">
				<FlaskConicalIcon className="inline-block text-neutral-600 w-6 h-6 mr-2" />
				{query.get('txid') ? 'Sample Callback' : 'Sample Gateway'}
			</h2>
			{query.get('txid') ? (
				<p>
					Your transaction was successful! You can view the transaction details on the Algorand Explorer by copying and pasting
					the transaction ID below.
				</p>
			) : (
				<p>Click on the button below to view and interact with the sample gateway.</p>
			)}
			<div className="flex justify-center border rounded bg-slate-50 p-10 mt-5">
				{query.get('txid') ? (
					<div className="flex flex-col items-center">
						<p className="text-lg font-bold">Transaction ID</p>
						<code className="text-lg text-neutral-600 mt-2">{query.get('txid')}</code>
					</div>
				) : (
					<Button
						size="lg"
						type="button"
						variant="default"
						asChild
					>
						<Link to="/gateway/BPALZW45EWOXWUTPOQMSQOCLLKCEIWV2RVHJ6ILDCHKMBTYEUG4RSBFLE4/0.01/http%3A%2F%2Flocalhost%3A5173%2Fsample%3Ftxid%3DTRANSACTION_ID">
							Pay 0.01 ALGO
						</Link>
					</Button>
				)}
			</div>
		</section>
	);
};

export default Sample;
