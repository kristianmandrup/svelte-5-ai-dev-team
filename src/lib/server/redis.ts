// import Redis from 'ioredis';
import RedisMock from 'ioredis-mock';
import { PubSub, RedisStore } from '$lib/stores/redis-store.svelte';

export const redis = new RedisMock(6380); // new Redis(process.env.REDIS_URL);
export const pubsub = new PubSub(redis);

export const createStore = (name: string = '', type: string) =>
	new RedisStore(pubsub, `${name}@${type}`);

export const createProjectStore = (name: string = '') => createStore(name, 'projects');
export const createTeamStore = (name: string = '') => createStore(name, 'teams');
export const createMemberStore = (name: string = '') => createStore(name, 'members');
