import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ObjectsGateway {
  @WebSocketServer() server: Server;

  emitNewObject(payload: any) {
    this.server.emit('objectCreated', payload);
  }

  emitDeleteObject(id: string) {
    this.server.emit('objectDeleted', id);
  }
}
