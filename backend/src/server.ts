import http from 'http';
import app from './app';
import { configureSocket } from './config/socket';

const server = http.createServer(app);

const io = configureSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});