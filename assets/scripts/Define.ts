export type TodoData = {check: boolean, text: string};

export type RoomData = { roomId: string, name: string };

export type ChatData = { message: string, isMine: boolean};

export type GomokuData = {
    name: string,
    players: {
        white?: string;
        black?: string;
    },
    board: (null | 'black' | 'white')[][],
    turn: "black" | "white",
    createdAt: object
}

export type GomokuDataWithId = GomokuData & { roomId: string }