import { Hocuspocus } from "~/socket";

export default async () => {
  if (process.server) {
    let port = 1234;
    if (process.env.WSPORT) {
      port = parseInt(process.env.WSPORT);
    }
    const server = new Hocuspocus({
      port: port,
      async onStateless({ payload, document, connection }) {
        document.broadcastStateless(payload);
      },
    });
    server.listen();
  }
};
