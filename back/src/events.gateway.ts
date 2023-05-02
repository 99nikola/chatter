import { Logger } from "@nestjs/common";
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { Observable, from, map } from "rxjs";
import { Server } from "ws";

@WebSocketGateway({
  path: "/chat",
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  afterInit() {
    Logger.log("Event gateway initialized", "EventsGateway");
  }
  @WebSocketServer()
  server: Server;

  handleConnection() {
    Logger.log("Client connected", "EventsGateway");
  }

  handleDisconnect() {
    Logger.log("Client disconnected", "EventsGateway");
  }

  @SubscribeMessage("ok/testing/something")
  handleTest(@MessageBody() data: string): string {
    console.log("TEST SUCCESS", data);
    return data;
  }

  @SubscribeMessage("events")
  handleEventWithId(@MessageBody("id") id: number): number {
    console.log("ID", typeof id, id);
    // id === messageBody.id
    return id;
  }

  @SubscribeMessage("events")
  handleEvent(@MessageBody() data: string): string {
    console.log("HELLOO", data);
    return data;
  }

  @SubscribeMessage("events")
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: "events", data: item })),
    );
  }

  @SubscribeMessage("identity")
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @SubscribeMessage("events")
  onEvent(client: any, data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: "events", data: item })),
    );
  }
}
