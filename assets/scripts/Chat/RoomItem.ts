import { _decorator, Button, Component, director, Label, Node } from 'cc';
import { MakeEventHandler, UIHandler } from '../Utils';
import { RoomData } from '../Define';
import { RoomService } from './RoomService';
const { ccclass, property } = _decorator;

@ccclass('RoomItem')
export class RoomItem extends Component {
    @property(Label)
    private label: Label;
    @property(Button)
    private joinButton: Button;
    
    private data: RoomData;

    start() {
        this.joinButton.clickEvents.push(MakeEventHandler(this, this.join));
    }

    public setData(data: RoomData): void {
        this.label.string = data.name;
        this.data = data;
    }

    @UIHandler
    private join(): void {
        RoomService.instance.setRoomId(this.data.roomId);
        director.loadScene("chat");
    }
}


