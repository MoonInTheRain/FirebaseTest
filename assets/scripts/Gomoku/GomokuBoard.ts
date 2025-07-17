import { _decorator, Component, instantiate, Label, Node } from 'cc';
import { DataSnapshot } from 'firebase/database';
import { GomokuColor, GomokuConnect, GomokuDataWithId, GomokuPlayers } from '../Define';
import { GomokuCell } from './GomokuCell';
import { GomokuService } from './GomokuService';
const { ccclass, property } = _decorator;

@ccclass('GomokuBoard')
export class GomokuBoard extends Component {
    @property(GomokuCell)
    private baseCell: GomokuCell;

    @property(Node)
    private waitOpponent: Node;

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

    private roomData: GomokuDataWithId;
    private board: GomokuCell[][] = [];

    private myColor: GomokuColor = "none";
    private myTurn: boolean = false;

    async start() {
        this.initBoardCell();

        this.roomData = await GomokuService.instance.connectRoom(data => this.onChangeData(data));

        this.myColor = GomokuService.instance.myColor;
        this.playerColorBlack.active = this.myColor == "black";
        this.playerColorWhite.active = this.myColor == "white";


        this.updateTurnView(this.roomData.turn);
        this.updateBoard(this.roomData.board);
        this.updatePlayers(this.roomData.players);
        this.updateConnect(this.roomData.connect);
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

    private updateConnect(data: GomokuConnect): void {
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
    }

    private onClickBoard(x: number, y: number): void {
        if (!this.myTurn) { return; }
        const boardData = this.board.map(y => y.map(x => x.getData()));
        boardData[x][y] = this.myColor;
        this.roomData.board = boardData;
        this.roomData.turn = GomokuService.getOpponentColor(this.myColor);
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
        }
    }
}


