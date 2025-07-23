# quickpoll-9770c8a4

## QuickPoll Backend (In-Memory Poll Service)

This backend provides a simple, live-updating, in-memory poll REST API:
- Create polls (`POST /polls`)
- Vote on polls (`POST /polls/{id}/vote`)
- List all active polls (`GET /polls`)
- Get full poll with results (`GET /polls/{id}`)
- Share poll by link (see `GET /polls/{id}`)
- Real-time results subscription via WebSocket (`ws://localhost:3000/polls/live`)
- Explore API with Swagger docs: [http://localhost:3000/docs](http://localhost:3000/docs)

### Local Development

Install dependencies:
```
npm install
```

Start for live-reload dev:
```
npm run dev
```
Or for production:
```
npm start
```

#### WebSocket Live Results

Connect to: `ws://localhost:3000/polls/live`
- On new poll: `{ "type": "NEW_POLL", poll: { id, question, options, ... } }`
- On vote: `{ "type": "VOTE", pollId, results: [number, ...] }`
- On poll closed: `{ "type": "CLOSED", pollId }`

#### CORS

CORS is enabled for all origins; this backend can be safely consumed from any mobile frontend or local web client.

### State

All state is stored **in-memory**. All polls and votes reset if the server restarts.
