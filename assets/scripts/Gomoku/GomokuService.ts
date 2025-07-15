import { connectRoom, sendMessage } from "../FirebaseManager";

export class GomokuService {
    private constructor() {}

    private static _instance: GomokuService;
    public static get instance(): GomokuService {
        this._instance ??= new GomokuService();
        return this._instance;
    }

    private _roomId: string;
    private charUnsubscribe: () => void;

    public setRoomId(roomId: string): void {
        this._roomId = roomId;
    }

    public connectRoom(onNewMessage: (msg: any) => void): void {
        this.charUnsubscribe = connectRoom(this._roomId, onNewMessage);
    }

    public disconnectRoom(): void {
        this.charUnsubscribe?.();
        this.charUnsubscribe = undefined;
    }

    public sendMessage(message: string): void {
        sendMessage(this._roomId, message);
    }
}