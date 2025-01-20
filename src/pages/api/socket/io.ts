import { Server as HttpServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as SocketIOServer } from 'socket.io'; // pnpm i socket.io pnpm i socket.io-client

import { NextApiResponseServerIO} from '@/lib/types/index';

export const config = {
  api: {
    bodyParser: false,
  },
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log('First use, starting socket.io');
    const path = '/api/socket/io';
    const httpServer: HttpServer = res.socket.server as any
    const io = new SocketIOServer(httpServer, {
      // cors: {
      //   origin: '*',
      //   methods: ['GET', 'POST'],
      // },
      path,
      // @ts-ignore 某个版本的bug
      addTrailingSlash: false
    });
    res.socket.server.io = io;
  } else {
    console.log('socket.io already running');
  }
  res.end();
}

export default ioHandler;