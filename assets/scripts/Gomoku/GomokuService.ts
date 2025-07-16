import { DataSnapshot } from "firebase/database";
import { GomokuDataWithId } from "../Define";
import { connectGomokuRoom, join } from "../FirebaseManager";

export class GomokuService {
    private constructor() {}

    private static _instance: GomokuService;
    public static get instance(): GomokuService {
        this._instance ??= new GomokuService();
        return this._instance;
    }

    private _room: GomokuDataWithId;
    private charUnsubscribe: () => void;

    public get roomData(): GomokuDataWithId {
        return this._room;
    }

    public setRoomData(room: GomokuDataWithId): void {
        this._room = room;
    }

    public connectRoom(onNewMessage: (snapshot: DataSnapshot, previousChildName: string | null) => unknown): void {
        this.charUnsubscribe = connectGomokuRoom(this._room.roomId, onNewMessage);
    }

    public async joinRoom(room: GomokuDataWithId): Promise<void> {
        return join(room, room.turn);
    }

    public disconnectRoom(): void {
        this.charUnsubscribe?.();
        this.charUnsubscribe = undefined;
        this._room = undefined;
    }
}