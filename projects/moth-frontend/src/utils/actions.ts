import { Profile } from './definitions';

export const saveProfile = async (profile: Profile) => {
	try {
		const data = await fetch('https://jsonplaceholder.typicode.com/todos/1');
		return profile;
	} catch (error) {
		throw new Error('Error saving profile');
	}
};
