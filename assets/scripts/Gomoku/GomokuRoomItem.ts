import { _decorator, Button, Component, director, Label } from 'cc';
import { GomokuDataWithId } from '../Define';
import { MakeEventHandler, UIHandler } from '../Utils';
import { GomokuService } from './GomokuService';
import { getUserId } from '../FirebaseManager';
const { ccclass, property } = _decorator;

/**
 * 五目並べのルームの表示
 */
@ccclass('GomokuRoomItem')
export class GomokuRoomItem extends Component {
    @property(Label)
    private label: Label;
    @property(Button)
    private joinButton: Button;
    @property(Label)
    private buttonLabel: Label;
    
    private data: GomokuDataWithId;

    private status: "enter" | "join" | "see" = "enter";

    start() {
        this.joinButton.clickEvents.push(MakeEventHandler(this, this.join));
    }

    /**
     * 表示更新
     * @param data 
     */
    public setData(data: GomokuDataWithId): void {
        this.label.string = data.name;
        this.data = data;

        // 参加状況によってボタンの表示を変える
        const userId = getUserId();
        if (data.players.black == userId || data.players.white == userId) {
            this.buttonLabel.string = "入室";
            this.status = "enter";
        } else if (data.players.black == null || data.players.white == null) {
            this.buttonLabel.string = "参加";
            this.status = "join";
        } else {
            this.buttonLabel.string = "観戦";
            this.status = "see";
        }
    }

    /**
     * ボタン押下時の挙動
     */
    @UIHandler
    private async join(): Promise<void> {
        // 参加する場合、参加者にデータを追加してから遷移する
        if (this.status == "join") {
            await GomokuService.instance.joinRoom(this.data);
        }
        GomokuService.instance.setRoomData(this.data);
        director.loadScene("gomoku");
    }
}


