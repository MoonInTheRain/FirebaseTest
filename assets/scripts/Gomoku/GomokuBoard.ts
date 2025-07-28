import { _decorator, Button, Component, instantiate, Label, Node } from 'cc';
import { DataSnapshot } from 'firebase/database';
import { GomokuColor, GomokuConnect, GomokuDataWithId, GomokuPlayers } from '../Define';
import { getUserId, pushUserNotification } from '../FirebaseManager';
import { GomokuCell } from './GomokuCell';
import { GomokuService } from './GomokuService';
import { MakeEventHandler, UIHandler } from '../Utils';
const { ccclass, property } = _decorator;

@ccclass('GomokuBoard')
export class GomokuBoard extends Component {
    @property(GomokuCell)
    private baseCell: GomokuCell;

    @property(Node)
    private waitOpponent: Node;
    @property(Node)
    private blackWin: Node;
    @property(Node)
    private whiteWin: Node;

    @property(Node)
    private playerColorBlack: Node;
    @property(Node)
    private playerColorWhite: Node;

    @property(Node)
    private playerTurn: Node;
    @property(Node)
    private opponentTurn: Node;

    @property(Label)
    private connectBlack: Label;
    @property(Label)
    private connectWhite: Label;

    @property(Button)
    private callBlackButton: Button;
    @property(Button)
    private callWhiteButton: Button;

    private roomData: GomokuDataWithId;
    private board: GomokuCell[][] = [];

    private myColor: GomokuColor = "none";
    private myTurn: boolean = false;
    private isFinish: boolean = false;

    async start() {
        this.blackWin.active = false;
        this.whiteWin.active = false;
        this.initBoardCell();

        GomokuService.instance.startSubscribe(data => this.onChangeData(data));
        this.roomData = await GomokuService.instance.connectRoom();

        this.myColor = GomokuService.instance.myColor;
        this.playerColorBlack.active = this.myColor == "black";
        this.playerColorWhite.active = this.myColor == "white";

        this.updateTurnView(this.roomData.turn);
        this.updateBoard(this.roomData.board);
        this.updatePlayers(this.roomData.players);
        this.updateConnect(this.roomData.connect);
        this.updateWinner(this.roomData.winner);

        this.callBlackButton.clickEvents.push(MakeEventHandler(this, this.onClickCallBlack));
        this.callWhiteButton.clickEvents.push(MakeEventHandler(this, this.onClickCallWhite));
    }

    private initBoardCell(): void {
        this.baseCell.node.active = true;
        for (let x = 0; x < 15; x++) {
            const newLine: GomokuCell[] = [];
            for (let y = 0; y < 15; y++) {
                const newNode = instantiate(this.baseCell.node);
                newNode.setParent(this.baseCell.node.parent);
                const cell = newNode.getComponent(GomokuCell);
                cell.init(() => this.onClickBoard(x, y));
                newLine.push(cell);
            }
            this.board.push(newLine);
        }
        this.baseCell.node.active = false;
    }

    private updateTurnView(val: GomokuColor): void {
        this.roomData.turn = val;
        if (this.myColor == "none") {
            this.playerTurn.active = false;
            this.opponentTurn.active = false;
            return;
        }
        this.myTurn = this.myColor == val;
        this.playerTurn.active = this.myTurn;
        this.opponentTurn.active = !this.myTurn;
    }

    private updateBoard(value: GomokuColor[][]): void {
        if (value == null) { return; }
        this.roomData.board = value;
        for (let x = 0; x < 15; x++) {
            for (let y = 0; y < 15; y++) {
                this.board[y][x].setData(value[y][x]);
            }
        }
    }

    private updatePlayers(data: GomokuPlayers): void {
        this.roomData.players = data;
        this.waitOpponent.active = data.black == null || data.white == null;
    }

    private updateWinner(data: GomokuColor | undefined): void {
        if (data == "white") {
            this.whiteWin.active = true;
            this.isFinish = true;
        } else if (data == "black") {
            this.blackWin.active = true;
            this.isFinish = true;
        }
    }

    private async updateConnect(data: GomokuConnect): Promise<void> {
        if (data == undefined) {
            this.connectBlack.string = "黒：オフライン";
            this.connectWhite.string = "白：オフライン";
            return;
        }
        this.roomData.connect = data;
        const blackUser = this.roomData.players.black;
        const whiteUser = this.roomData.players.white;
        const isBlack = (blackUser != undefined) && (data[blackUser] == true);
        const isWhite = (whiteUser != undefined) && (data[whiteUser] == true);
        this.connectBlack.string = isBlack ? "黒：オンライン" : "黒：オフライン";
        this.connectWhite.string = isWhite ? "白：オンライン" : "白：オフライン";

        // スマホのスタンバイなどで、自分がオフラインになってしまった時につなぎ直す。
        if (this.myColor != "none" && data[getUserId()] == undefined) {
            this.roomData = await GomokuService.instance.connectRoom();
        }

        this.callBlackButton.node.active = false;
        this.callWhiteButton.node.active = false;
        if (this.myColor == "white" && blackUser != undefined && !isBlack) {
            this.callBlackButton.node.active = true;
        }
        if (this.myColor == "black" && whiteUser != undefined && !isWhite) {
            this.callWhiteButton.node.active = true;
        }
    }

    private onClickBoard(x: number, y: number): void {
        if (!this.myTurn || this.isFinish) { return; }
        const boardData = this.board.map(y => y.map(x => x.getData()));
        if (boardData[x][y] != "none") { return; }
        boardData[x][y] = this.myColor;
        this.roomData.board = boardData;
        this.roomData.turn = GomokuService.getOpponentColor(this.myColor);
        this.roomData.winner = this.checkWinner(boardData);
        GomokuService.instance.updateGomoku(this.roomData);
    }

    protected onDestroy(): void {
        GomokuService.instance.disconnectRoom();
    }

    private onChangeData(data: DataSnapshot): void {
        const value = data.val();
        switch (data.key) {
            case "players": {
                this.updatePlayers(value);
                break;
            }
            case "turn": {
                this.updateTurnView(value);
                break;
            }
            case "board": {
                this.updateBoard(value);
                break;
            }
            case "connect": {
                this.updateConnect(value);
                break;
            }
            case "winner": {
                this.updateWinner(value);
                break;
            }
        }
    }

    private checkWinner(board: GomokuColor[][]): GomokuColor {
        const directions = [
            { dx: 1, dy: 0 },  // 横
            { dx: 0, dy: 1 },  // 縦
            { dx: 1, dy: 1 },  // 斜め（右下）
            { dx: 1, dy: -1 }, // 斜め（右上）
        ];

        for (let y = 0; y < 15; y++) {
            for (let x = 0; x < 15; x++) {
                const current = board[y][x];
                if (current == "none") { continue; }

                for (const { dx, dy } of directions) {
                    let count = 1;
                    for (let i = 1; i < 5; i++) {
                        const nx = x + dx * i;
                        const ny = y + dy * i;

                        if (
                            nx < 0 || nx >= 15 ||
                            ny < 0 || ny >= 15 ||
                            board[ny][nx] !== current
                        ) {
                            break;
                        }
                        count++;
                    }

                    if (count === 5) { return current; }
                }
            }
        }

        return "none";
    }

    @UIHandler
    private onClickCallBlack(): void {
        this.callPlayer(this.roomData.players.black);
    }

    @UIHandler
    private onClickCallWhite(): void {
        this.callPlayer(this.roomData.players.white);
    }

    private callPlayer(userId: string | undefined) {
        if (userId == undefined) { return; }
        pushUserNotification(userId, this.roomData.roomId);
    }
}


