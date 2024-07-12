import { Hocuspocus } from "~/socket";

export default async () => {
  if (process.server) {
    const server = new Hocuspocus({
      port: 1234,
      async onStateless({ payload, document, connection }) {
        document.broadcastStateless(payload);
      },
    });
    server.listen();
  }
};
