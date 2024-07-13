# Doc Editor

Doc Editor is a collaborative text editor similar to Google Docs or Framapad. It allows multiple users to work on a document simultaneously with real-time updates.

## Features

- Real-time collaborative editing
- User authentication
- Document sharing and permissions
- Text formatting
- Document versioning

## Technology Stack

- **Frontend:** VueJS
- **Backend:** NodeJS, Nuxt 3
- **WebSockets:** WS with the help of Hocuspocus server
- **Database:** MongoDB
- **Deployment:** Jelastic Cloud via CI/CD

# Installation

## Setup


Make sure to install the dependencies:

```bash
# npm
npm install
```

## Development Server

Start the development server on `http://localhost:3000`.
You need to start a mongodb database, a `docker-compose.yml` file is given:

```bash
# start the database
docker compose up

# run the dev server
npm run dev
```

## Production

A `Dockerfile` is provide

Some env variable are needed:

- `MONGODB_URL`: The connection string for MongoDB.
- `JWT_SECRET`: Secret key for JSON Web Token (JWT) authentication.
- `PORT`: On which port the http server while run
- `WSPORT`: On which port the websocket server while run
