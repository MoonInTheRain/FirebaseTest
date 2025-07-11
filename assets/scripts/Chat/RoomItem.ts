import { _decorator, Button, Component, Label, Node } from 'cc';
import { MakeEventHandler, UIHandler } from '../Utils';
import { RoomData } from '../Define';
const { ccclass, property } = _decorator;

@ccclass('RoomItem')
export class RoomItem extends Component {
    @property(Label)
    private label: Label;
    @property(Button)
    private joinButton: Button;
    
    start() {
        this.joinButton.clickEvents.push(MakeEventHandler(this, this.join));
    }

    public setData(data: RoomData): void {
        this.label.string = data.name;
    }

    @UIHandler
    private join(): void {

    }
}


