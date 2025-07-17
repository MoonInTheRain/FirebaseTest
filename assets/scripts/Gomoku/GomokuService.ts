import { DataSnapshot } from "firebase/database";
import { GomokuColor, GomokuDataWithId } from "../Define";
import { connectGomokuRoom, getRoom, getUserId, updateGomoku } from "../FirebaseManager";

export class GomokuService {
    private constructor() {}

    private static _instance: GomokuService;
    public static get instance(): GomokuService {
        this._instance ??= new GomokuService();
        return this._instance;
    }

    private _room: GomokuDataWithId;
    private _myColor: GomokuColor;
    private charUnsubscribe: () => void;

    public get roomData(): GomokuDataWithId {
        return this._room;
    }

    public get myColor(): GomokuColor {
        return this._myColor;
    }

    public setRoomData(room: GomokuDataWithId): void {
        this._room = room;
        const userId = getUserId();
        this._myColor =
            room.players.black == userId ? "black" :
            room.players.white == userId ? "white" : 
            "none";
    }

    public async connectRoom(onNewMessage: (snapshot: DataSnapshot, previousChildName: string | null) => unknown): Promise<GomokuDataWithId> {
        this.charUnsubscribe = await connectGomokuRoom(this._room, onNewMessage);
        const room = await getRoom(this._room.roomId);
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
        this.charUnsubscribe?.();
        this.charUnsubscribe = undefined;
        this._room = undefined;
    }
}