import { _decorator, Component, instantiate, Node } from 'cc';
import { DataSnapshot } from 'firebase/database';
import { getUserId } from '../FirebaseManager';
import { GomokuCell } from './GomokuCell';
import { GomokuService } from './GomokuService';
import { GomokuDataWithId } from '../Define';
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

    private roomData: GomokuDataWithId;
    private board: GomokuCell[][] = [];

    private myColor: "white" | "black" | "none" = "none";
    private myTurn: boolean = false;

    start() {
        this.roomData = GomokuService.instance.roomData;
        const userId = getUserId();
        this.myColor =
            this.roomData.players.black == userId ? "black" :
            this.roomData.players.white == userId ? "white" : 
            "none";
        this.playerColorBlack.active = this.myColor == "black";
        this.playerColorWhite.active = this.myColor == "white";
        const playerFill = this.roomData.players.white != null && this.roomData.players.black != null;
        this.waitOpponent.active = !playerFill;
        this.updateTurnView(this.roomData.turn);
        this.updateBoard(this.roomData.board);

        GomokuService.instance.connectRoom(data => this.onChangeData(data));

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

    private updateTurnView(val: string): void {
        if (this.myColor == "none") {
            this.playerTurn.active = false;
            this.opponentTurn.active = false;
            return;
        }
        this.myTurn = this.myColor == val;
        this.playerTurn.active = this.myTurn;
        this.opponentTurn.active = !this.myTurn;
    }

    private updateBoard(value: ("none" | "black" | "white")[][]): void {
        if (value == null) { return; }
        for (let x = 0; x < 15; x++) {
            for (let y = 0; y < 15; y++) {
                this.board[y][x].setData(value[y][x]);
            }
        }
    }

    private onClickBoard(x: number, y: number): void {
        const boardData = this.board.map(y => y.map(x => x.getData()));
        boardData[x][y] = this.myColor;
        this.roomData.board = boardData;
        this.roomData.turn = this.myColor == "black" ? "white" : "black";
        GomokuService.instance.updateGomoku(this.roomData);
    }

    protected onDestroy(): void {
        GomokuService.instance.disconnectRoom();
    }

    private onChangeData(data: DataSnapshot): void {
        const value = data.val();
        switch (data.key) {
            case "players": {
                const playerFill = value.white != null && value.black != null;
                this.waitOpponent.active = !playerFill;
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
        }
    }
}


