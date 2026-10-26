# Labour Link

Labour Link is a web application with a React and TypeScript client and an Express and TypeScript API.

## Project folders

- `client/` — Vite frontend
- `server/` — Express API

## Requirements

- Node.js (use a current LTS release)
- npm
- MongoDB, configured with `MONGO_URI`
- Third-party credentials only for features you enable, such as Razorpay, Cloudinary, Resend, and TomTom

## Run locally

1. Install frontend dependencies: `cd client` then `npm ci`.
2. Copy `client/.env.example` to `client/.env` and add the required frontend settings.
3. Start the frontend with `npm run dev`.
4. In a second terminal, install API dependencies: `cd server` then `npm ci`.
5. Copy `server/.env.example` to `server/.env`; set MongoDB and other service credentials as needed.
6. Start the API with `npm run dev`.

The frontend runs on port 5173 and the API defaults to port 5000. Keep `.env` files private; only the blank `.env.example` templates belong in GitHub.

## Build

- Client: from `client/`, run `npm run build`.
- Server: from `server/`, run `npm run build`.

## Configuration

Set `VITE_API_URL` in `client/.env` to the API base URL. If omitted, the client uses its existing hosted API URL. Server variables are documented in `server/.env.example`. Never commit real API keys, passwords, tokens, or database connection strings.

