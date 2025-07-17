export type TodoData = {check: boolean, text: string};

export type RoomData = { roomId: string, name: string };

export type ChatData = { message: string, isMine: boolean};

export type GomokuData = {
    name: string,
    players: GomokuPlayers,
    board: GomokuColor[][],
    turn: GomokuColor,
    winner: GomokuColor,
    createdAt: object,
    connect: GomokuConnect;
}

export type GomokuPlayers = {
    white?: string;
    black?: string;
}

export type GomokuConnect = {
    [userId: string]: boolean;
}

export type GomokuColor = "white" | "black" | "none";

export type GomokuDataWithId = GomokuData & { roomId: string }