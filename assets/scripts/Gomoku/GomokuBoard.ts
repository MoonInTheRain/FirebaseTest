import { _decorator, Component, instantiate, Node } from 'cc';
import { DataSnapshot } from 'firebase/database';
import { getUserId } from '../FirebaseManager';
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

    private board: GomokuCell[][] = [];

    private isBlack: boolean;
    private isWhite: boolean;

    start() {
        const data = GomokuService.instance.roomData;
        const userId = getUserId();
        this.isBlack = data.players.black == userId;
        this.isWhite = data.players.white == userId;
        this.playerColorBlack.active = this.isBlack;
        this.playerColorWhite.active = this.isWhite;
        const playerFill = data.players.white != null && data.players.black != null;
        this.waitOpponent.active = !playerFill;
        this.updateTurnView(data.turn);

        GomokuService.instance.connectRoom(data => this.onChangeData(data));

        this.baseCell.node.active = true;
        for (let x = 0; x < 15; x++) {
            const newLine: GomokuCell[] = [];
            for (let y = 0; y < 15; y++) {
                const newNode = instantiate(this.baseCell.node);
                newNode.setParent(this.baseCell.node.parent);
                const cell = newNode.getComponent(GomokuCell);
                cell.init(x, y);
                newLine.push(cell);
            }
            this.board.push(newLine);
        }
        this.baseCell.node.active = false;
    }

    private updateTurnView(val: string): void {
        switch (val) {
            case "white" : {
                this.playerTurn.active = this.isWhite;
                this.opponentTurn.active = !this.isWhite;
                break;
            }
            case "black" : {
                this.playerTurn.active = this.isBlack;
                this.opponentTurn.active = !this.isBlack;
                break;
            }
        }
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
                // ターン表示更新
                break;
            }
            case "board": {
                // ボードの表示更新
                break;
            }
        }
    }
}


