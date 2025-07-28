import { DataSnapshot } from "firebase/database";
import { GomokuColor, GomokuDataWithId } from "../Define";
import { connectGomokuRoom, getGomokuRoom, getUserId, setGomokuRoomOnline, updateGomoku } from "../FirebaseManager";

export class GomokuService {
    private constructor() {}

    private static _instance: GomokuService;
    public static get instance(): GomokuService {
        this._instance ??= new GomokuService();
        return this._instance;
    }

    private _roomId: string;
    private _room: GomokuDataWithId;
    private _myColor: GomokuColor;
    private unsubscribe: () => void;
    private disconnect: () => void;

    public get roomData(): GomokuDataWithId {
        return this._room;
    }

    public get roomId(): string {
        return this._room?.roomId ?? this._roomId;
    }

    public get myColor(): GomokuColor {
        return this._myColor;
    }

    public setRoomId(roomId: string): void {
        this._roomId = roomId;
    }

    public setRoomData(room: GomokuDataWithId): void {
        this._room = room;
        this.setRoomId(room.roomId);
        const userId = getUserId();
        this._myColor =
            room.players.black == userId ? "black" :
            room.players.white == userId ? "white" : 
            "none";
    }

    public startSubscribe(onNewMessage: (snapshot: DataSnapshot, previousChildName: string | null) => unknown): void {
        this.unsubscribe = connectGomokuRoom(this.roomId, onNewMessage);
    }

    public async connectRoom(): Promise<GomokuDataWithId> {
        this.disconnect = await setGomokuRoomOnline(this.roomId);
        // 接続した情報を取り直すためにルームを再取得する。
        const room = await getGomokuRoom(this.roomId);
        this.setRoomData(room);
        return this._room;
    }

    public async joinRoom(room: GomokuDataWithId): Promise<void> {
        room.players[room.turn] = getUserId();
        room.turn = "black"
        return updateGomoku(room);
    }

    public static getOpponentColor(myColor: GomokuColor): GomokuColor {
        switch (myColor) {
            case "black":
                return "white";
            case "white":
                return "black";
            default:
                return "none";
        }
    }

    public async updateGomoku(room: GomokuDataWithId): Promise<void> {
        return updateGomoku(room);
    }

    public disconnectRoom(): void {
        this.unsubscribe?.();
        this.unsubscribe = undefined;
        this.disconnect?.();
        this.disconnect = undefined;
        this._room = undefined;
        this._roomId = undefined;
    }
}