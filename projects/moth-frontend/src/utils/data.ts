import algoKit from '@algorandfoundation/algokit-utils';
import { MothClient } from '@/contracts/Moth';

export const fetchProfile = async (address: string) => {
	return async () => {
		const data = await fetch('https://jsonplaceholder.typicode.com/todos/1');
		if (data === null) return null;
		return {
			address: 'DN456YFXDIKGZGHNIN73J7ST24IKGPYKE3T5MUR3HTHGCV6DE3RY23X72A',
			logo: 'QmZMQQU7m1jsNDaG4CEdjfiv57uRxQyHK7v2Xawj9wZbRK',
			title: 'My Awesome Shop',
			description:
				'Welcome to our online haven, where every click leads to discovery! Dive into a treasure trove of fashion, gadgets, and more. With seamless navigation and irresistible deals, your shopping journey begins here!',
			url: 'https://awesome.shop',
			loyaltyEnabled: true,
			loyaltyMultiplierEnabled: false,
			loyaltyPercentage: 5,
		};
	};
};
