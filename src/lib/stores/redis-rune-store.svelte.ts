import type { Redis } from 'ioredis';

export type subscribeFn = (value: string[], message: string) => void;

export class PubSub {
	private isConnected = false;
	redis: Redis;

	constructor(redis: Redis) {
		this.redis = redis;
	}

	async connect() {
		if (this.isConnected) {
			console.log('Already connected to pubsub');
			return;
		}

		try {
			console.log('Connecting to pubsub');
			await this.redis.connect();
			this.isConnected = true;
		} catch (error) {
			console.error('Error connecting to Redis:', error);
			this.isConnected = false;
		}
	}
}

export class RedisStore {
	private pubsub: PubSub;
	private channel: string;

	private messages = $state<string[]>([]);
	private callbacks: Record<string, subscribeFn> = {};

	constructor(pubsub: PubSub, channel: string) {
		this.pubsub = pubsub;
		this.channel = channel;
	}

	async connect() {
		await this.pubsub.connect();
	}

	get redis() {
		return this.pubsub.redis;
	}

	async connectAndSubscribe() {
		try {
			await this.connect();
			await this.redis.subscribe(this.channel);
			console.log(`Subscribed to channel: ${this.channel}`);

			this.redis.on('message', (receivedChannel: string, message: string) => {
				if (receivedChannel === this.channel) {
					this.add(message);
				}
			});
		} catch (error) {
			console.error('Error subscribing to Redis:', error);
		}
	}

	public subscribe(name: string, callback: subscribeFn) {
		console.log('subscribed to', { name, channel: this.channel });
		this.callbacks[name] = callback;
	}

	public unsubscribe() {
		this.pubsub.redis.unsubscribe(this.channel);
	}

	public set(newMessages: string[]) {
		this.messages = newMessages;
	}

	public addObj(obj: unknown) {
		console.log('addObj', obj);
		const message = JSON.stringify(obj);
		console.log('stringified message', message);
		this.add(message);
	}

	public add(message: string) {
		console.log('add message to store', message);
		if (!message) {
			console.log('invalid message to add - skipped');
			return;
		}
		this.messages = [...this.messages, message];
		console.log('call callback with store data');
		const names = Object.keys(this.callbacks);
		console.log({ names });
		for (const name of names) {
			const callback = this.callbacks[name];
			console.log('calling callback', { name, message });
			callback(this.messages, message);
		}
	}

	public reset() {
		this.messages = [];
	}

	public destroy() {
		this.unsubscribe();
		this.pubsub.redis.disconnect();
	}
}
