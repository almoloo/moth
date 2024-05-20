import PageHeader from '@/components/PageHeader';
import { InfoIcon } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface AboutProps {}

const featuresList = [
	{
		title: 'Effortless Algo Transactions',
		description:
			'Our DApp serves as a gateway for accepting Algo payments on your website. With us, transactions are just a few clicks away.',
	},
	{
		title: 'Loyalty Points System',
		description:
			'One of our key features is the loyalty points system. Users earn loyalty points when they pay via our gateway. These points can be used as cashback on future purchases, making transactions more rewarding.',
	},
	{
		title: 'Security and Trust',
		description:
			'Security is our topmost priority. Our DApp is built with the highest security standards to ensure safe and secure transactions.',
	},
	{
		title: 'Algorand Wallet Integration',
		description:
			'Our DApp seamlessly integrates with Algorand wallets, enabling users to connect their wallets easily for transactions.',
	},
	{
		title: 'User-friendly Interface',
		description:
			'We believe in simplicity and ease of use. Our interface is designed to be intuitive and user-friendly, ensuring a smooth experience for all our users.',
	},
];

const About: React.FC<AboutProps> = () => {
	return (
		<>
			<PageHeader
				icon={<InfoIcon />}
				title="About Moth"
				description="Welcome to the future of digital payments with our decentralized application on the Algorand blockchain."
			/>
			<section className="padding flex flex-col gap-8">
				<div className="leading-relaxed">
					<p className="mb-3">
						We are committed to creating a seamless and secure digital payment experience. Our DApp is designed to facilitate
						easy transactions using Algorand (Algo), one of the leading cryptocurrencies in the blockchain world.
					</p>
					<p>
						Our vision is to bring the power of blockchain to everyday transactions - making them fast, secure, and
						straightforward. We believe in the transformative power of blockchain and want to make it accessible to everyone.
					</p>
				</div>
				<div>
					<h3 className="font-bold text-lg mb-3">Our Features</h3>
					<ul className="list-disc list-outside flex flex-col gap-3 ml-5 leading-relaxed">
						{featuresList.map((feature, index) => (
							<li key={index}>
								<strong>{feature.title}: </strong>
								<p className="inline">{feature.description}</p>
							</li>
						))}
					</ul>
				</div>
				<div>
					<h3 className="font-bold text-lg mb-3">Meet Our Team</h3>
					<div className="flex flex-col lg:grid lg:grid-cols-2 gap-5">
						<div className="flex gap-5 bg-neutral-50 border rounded p-5">
							<img
								src="/src/assets/ali.png"
								alt="Ali Mousavi"
								className="w-1/5 lg:w-1/6 aspect-square rounded shrink-0"
							/>
							<div className="flex flex-col gap-1 py-2">
								<strong>Ali Mousavi</strong>
								<small className="text-neutral-600 text-xs">UI Designer & Front-End Dev.</small>
								<div className="flex gap-2 text-rose-500 text-xs mt-auto">
									<Link to="https://github.com/almoloo">GitHub</Link>
									<span>•</span>
									<Link to="mailto:amousavig@icloud.com">amousavig@icloud.com</Link>
								</div>
							</div>
						</div>
						<div className="flex gap-5 bg-neutral-50 border rounded p-5">
							<img
								src="/src/assets/hossein.jpeg"
								alt="Hossein Arabi"
								className="w-1/5 lg:w-1/6 aspect-square rounded shrink-0"
							/>
							<div className="flex flex-col gap-1 py-2">
								<strong>Hossein Arabi</strong>
								<small className="text-neutral-600 text-xs">Back-End & Smart Contract Dev.</small>
								<div className="flex gap-2 text-rose-500 text-xs mt-auto">
									<Link to="https://github.com/Hossein-79">GitHub</Link>
									<span>•</span>
									<Link to="mailto:ho.arabi79@gmail.com">ho.arabi79@gmail.com</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div>
					<h3 className="font-bold text-lg mb-3">Our Mission</h3>
					<p className="mb-3">
						Our mission is to simplify digital payments and bring the benefits of blockchain technology to businesses and their
						customers. We aim to create a platform where transactions are not just secure and quick, but also rewarding with our
						loyalty points system.
					</p>
					<p>Join us on this journey towards a more efficient and rewarding digital payment experience.</p>
				</div>
			</section>
		</>
	);
};

export default About;
