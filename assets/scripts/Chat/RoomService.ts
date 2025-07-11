export class RoomService {
    private constructor() {}

    private static _instance: RoomService;
    public static get instance(): RoomService {
        this._instance ??= new RoomService();
        return this._instance;
    }

    private _roomId: string

    public setRoomId(roomId: string): void {
        this._roomId = roomId;
    }
}