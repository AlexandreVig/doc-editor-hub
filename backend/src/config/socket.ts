import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export const configureSocket = (server: HttpServer): Server => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });

    socket.on('subscribe-to-document', (documentId: string) => {
      // Join room for the specified document
      socket.join(documentId);
      console.log(`Client ${socket.id} joined room ${documentId}`);
    });

    socket.on('unsubscribe-from-document', (documentId: string) => {
      // Leave room for the specified document
      socket.leave(documentId);
      console.log(`Client ${socket.id} left room ${documentId}`);
    });

    socket.on('document-update', (data: any) => {
      const { documentId } = data;

      // Broadcast changes to all clients in the same document room except sender
      socket.to(documentId).emit('document-update', data);
    });
  });

  return io;
};