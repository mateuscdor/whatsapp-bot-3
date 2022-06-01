import makeWASocket, { makeInMemoryStore, useSingleFileAuthState, WASocket, BaileysEventEmitter, DisconnectReason, AuthenticationState } from '@adiwajshing/baileys';
const { Boom } = require('@hapi/boom');
const P = require('pino');

export class WhatsAppBot {
	public store: ReturnType<typeof makeInMemoryStore>;
	private state: AuthenticationState;
	private saveState;
    
	public client: WASocket | undefined | null;
    public eventListener: BaileysEventEmitter | undefined;

	constructor(store_path = './session') {
		this.store = makeInMemoryStore({
			logger: P().child({ level: 'fatal', stream: 'store' })
		});
		this.store.readFromFile(store_path + '/baileys_store_multi.json');
		// save every 10s
		setInterval(() => {
			this.store.writeToFile(store_path + '/baileys_store_multi.json');
		}, 10000);

		const { state, saveState } = useSingleFileAuthState(store_path + '/auth_info_multi.json');

		this.state = state;
		this.saveState = saveState;
		this.client = undefined;
        this.eventListener = undefined;
	}

	public start() {
		this.client = makeWASocket({
			logger: P({ level: 'fatal' }),
			printQRInTerminal: true,
			auth: this.state
		});

		this.store.bind(this.client.ev);
		console.log('Client Ready!');
		this.eventListener = this.client.ev;

        this.eventListener.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update
            if(connection === 'close') {
                // reconnect if not logged out
                if((new Boom(lastDisconnect?.error))?.output?.statusCode !== DisconnectReason.loggedOut) {
                    this.start()
                } else {
                    // console.log('connection closed')
                }
            }
            // console.log('connection update', update)
        })
        // listen for when the auth credentials is updated
        this.eventListener.on('creds.update', this.saveState)
	}
}
