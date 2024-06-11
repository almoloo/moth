// src/components/Home.tsx
import { Button } from '@/components/ui/button';
import { CoffeeIcon, RepeatIcon, TrophyIcon, WalletIcon } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import ConnectButton from '@/components/ConnectButton';
import { useWallet } from '@txnlab/use-wallet';

interface HomeProps {}

const faqList = [
	{
		question: 'How does it work?',
		answer: 'Our payment gateway allows you to accept algorand on your website. Users earn loyalty points when they pay through our gateway, which they can use as cash-back for their next purchases.',
	},
	{
		question: 'How can I earn loyalty points?',
		answer: 'You can earn loyalty points by making payments through our payment gateway. The more you use our gateway, the more points you can accumulate.',
	},
	{
		question: 'How can I use my loyalty points?',
		answer: 'You can use your loyalty points as cash-back to pay less on your next purchases. Simply apply your points at checkout to enjoy the discount.',
	},
	{
		question: 'How do I sign up?',
		answer: 'Signing up is easy! Just visit our website and follow the simple registration process to start accepting algorand and earning loyalty points.',
	},
	{
		question: 'Is my information secure?',
		answer: 'Yes, we take the security of your information seriously. We use industry-standard encryption and security measures to protect your data.',
	},
];

const Home: React.FC<HomeProps> = () => {
	const { activeAddress } = useWallet();

	return (
		<>
			{/* ----- HERO ----- */}
			<section className="lg:bg-hero-pattern bg-no-repeat bg-contain bg-left flex flex-col items-center lg:grid lg:grid-cols-6">
				<div className="padding pr-0 flex flex-col space-y-5 order-2 lg:order-1 lg:col-span-3 text-center lg:text-left">
					<h1 className="font-black text-3xl">The Future of Secure and Seamless Transactions</h1>
					<p className="text-neutral-600 text-lg">
						Revolutionize the way you accept payments on your website with our cutting-edge dApp built on Algorand blockchain
						technology.
					</p>
					<div className="flex space-x-4 justify-center lg:justify-start">
						{/* <Button variant="default">
							<WalletIcon className="h-4 w-4 mr-2" />
							Get Started
						</Button> */}
						{activeAddress ? (
							<Button>
								<Link to="/dashboard">Dashboard</Link>
							</Button>
						) : (
							<ConnectButton standAlone />
						)}
						<Button variant="outline">
							<Link to="https://github.com/almoloo/moth">Learn More</Link>
						</Button>
					</div>
				</div>
				<div className="py-5 lg:p-0 order-1 lg:order-2 lg:col-span-2 lg:col-start-5 max-h-[50vh]">
					<DotLottieReact
						src="/src/assets/hero.lottie"
						loop
						autoplay
					/>
				</div>
			</section>
			{/* ----- Pros ----- */}
			<section className="padding lg:grid lg:grid-cols-6 lg:grid-rows-2 space-y-10 lg:space-y-0 gap-y-[50px] lg:gap-x-14">
				<div className="flex flex-col items-center lg:items-stretch text-center lg:text-left space-y-3 lg:col-span-3">
					<strong className="text-xs font-extrabold text-rose-700">Unlock the Power</strong>
					<h2 className="font-bold text-2xl">Simplify Integration and Boost Customer Loyalty</h2>
					<p className="text-neutral-600 text-sm leading-relaxed">
						Discover how easy it is to integrate Moth into your website and start rewarding your customers with loyalty points.
						Increase customer satisfaction and encourage repeat purchases.
					</p>
				</div>
				<div className="lg:col-span-2 lg:row-start-2 flex flex-col items-center lg:items-stretch text-center lg:text-left space-y-3">
					<CoffeeIcon className="w-8 h-8 text-rose-400" />
					<h3 className="font-bold text-lg">Streamline Payment Process for Customers</h3>
					<p className="text-neutral-600 text-sm leading-relaxed">
						Integrating Moth into your website is a breeze, allowing you to streamline the payment process for your customers.
					</p>
				</div>
				<div className="lg:col-span-2 lg:row-start-2 flex flex-col items-center lg:items-stretch text-center lg:text-left space-y-3">
					<TrophyIcon className="w-8 h-8 text-rose-400" />
					<h3 className="font-bold text-lg">Reward Your Returning Customers for Their Loyalty</h3>
					<p className="text-neutral-600 text-sm leading-relaxed">
						Start rewarding your customers for their loyalty with our innovative loyalty points system.{' '}
					</p>
				</div>
				<div className="lg:col-span-2 lg:row-start-2 flex flex-col items-center lg:items-stretch text-center lg:text-left space-y-3">
					<RepeatIcon className="w-8 h-8 text-rose-400" />
					<h3 className="font-bold text-lg">Drive Repeat Purchases with a Unique Incentive</h3>
					<p className="text-neutral-600 text-sm leading-relaxed">
						Drive repeat purchases and boost customer engagement with a unique incentive program.{' '}
					</p>
				</div>
			</section>
			{/* ----- FAQ ----- */}
			<section className="padding flex flex-col lg:grid lg:grid-cols-3 gap-[50px]">
				<div className="flex flex-col items-start gap-3 lg:col-span-1">
					<h2 className="font-bold text-2xl">FAQs</h2>
					<p className="text-neutral-600 text-sm leading-relaxed">
						Find answers to frequently asked questions about our payment gateway and loyalty point system.
					</p>
					<Button variant="outline">
						<Link to="/">Contact Us</Link>
					</Button>
				</div>
				<div className="col-span-2 flex flex-col gap-8">
					{faqList.map((item, index) => (
						<div key={index}>
							<strong className="block mb-3">{item.question}</strong>
							<p className="text-neutral-600">{item.answer}</p>
						</div>
					))}
				</div>
			</section>
		</>
	);
};

export default Home;
