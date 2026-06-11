import { OnGatewayConnection } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
export declare class TaskGateway implements OnGatewayConnection {
    server: Server;
    handleConnection(client: Socket): void;
}
