import { Injectable } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";

@WebSocketGateway({
    cors: {
        origin: "*",    
    },      
})

@Injectable()
export class TaskGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
        client.emit('connected', {
            message: 'Connected to task websocket',
            clientId: client.id,
        });
    }
}
