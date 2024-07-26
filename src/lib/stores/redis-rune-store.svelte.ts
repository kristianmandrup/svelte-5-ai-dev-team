import type { Redis } from 'ioredis';

export type subscribeFn = (value: string[], message: string) => void;

export class RedisStore {
	private pubsub: Redis;
	private channel: string;
	private isConnected = false;
	private messages = $state<string[]>([]);
	private callback?: subscribeFn;

	constructor(pubsub: Redis, channel: string) {
		this.pubsub = pubsub;
		this.channel = channel;
	}

	async connectAndSubscribe() {
		if (this.isConnected) {
			console.log('Already connected to pubsub');
			return;
		}

		try {
			console.log('Connecting to pubsub');
			await this.pubsub.connect();
			this.isConnected = true;

			await this.pubsub.subscribe(this.channel);
			console.log(`Subscribed to channel: ${this.channel}`);

			this.pubsub.on('message', (receivedChannel: string, message: string) => {
				if (receivedChannel === this.channel) {
					this.add(message);
				}
			});
		} catch (error) {
			console.error('Error connecting to Redis:', error);
			this.isConnected = false;
		}
	}

	public subscribe(callback: subscribeFn) {
		console.log('subscribed to', this.channel);
		this.callback = callback;
	}

	public unsubscribe() {
		this.pubsub.unsubscribe(this.channel);
	}

	public set(newMessages: string[]) {
		this.messages = newMessages;
	}

	public add(message: string) {
		console.log('add message to store', message);
		this.messages = [...this.messages, message];
		console.log('call callback with store data');
		if (this.callback) {
			this.callback(this.messages, message);
		}
	}

	public reset() {
		this.messages = [];
	}

	public destroy() {
		this.unsubscribe();
		this.pubsub.disconnect();
	}
}
