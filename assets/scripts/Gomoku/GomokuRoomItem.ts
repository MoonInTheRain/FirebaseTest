import { _decorator, Button, Component, director, Label } from 'cc';
import { GomokuDataWithId } from '../Define';
import { MakeEventHandler, UIHandler } from '../Utils';
import { GomokuService } from './GomokuService';
const { ccclass, property } = _decorator;

@ccclass('GomokuRoomItem')
export class GomokuRoomItem extends Component {
    @property(Label)
    private label: Label;
    @property(Button)
    private joinButton: Button;
    
    private data: GomokuDataWithId;

    start() {
        this.joinButton.clickEvents.push(MakeEventHandler(this, this.join));
    }

    public setData(data: GomokuDataWithId): void {
        this.label.string = data.name;
        this.data = data;
    }

    @UIHandler
    private join(): void {
        GomokuService.instance.setRoomId(this.data.roomId);
        director.loadScene("chat");
    }
}


