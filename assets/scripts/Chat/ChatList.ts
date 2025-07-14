import { _decorator, Button, Component, EditBox, instantiate } from 'cc';
import { MakeEventHandler, UIHandler } from '../Utils';
import { ChatItem } from './ChatItem';
import { RoomService } from './RoomService';
import { ChatData } from '../Define';
const { ccclass, property } = _decorator;

@ccclass('ChatList')
export class ChatList extends Component {

    @property(EditBox)
    private input: EditBox;
    @property(Button)
    private addButton: Button;

    @property(ChatItem)
    private itemBase: ChatItem

    async start() {
        RoomService.instance.connectRoom(data => this.addMessage(data))

        this.addButton.clickEvents.push(MakeEventHandler(this, this.addItem));
    }

    protected onDestroy(): void {
        RoomService.instance.disconnectRoom();
        super.onDestroy?.();
    }

    private addMessage(data: ChatData): void {
        this.itemBase.node.active = true;
        const newNode = instantiate(this.itemBase.node);
        newNode.setParent(this.itemBase.node.parent);
        newNode.getComponent(ChatItem).setData(data);
        this.itemBase.node.active = false;
    }

    @UIHandler
    async addItem(): Promise<void> {
        if (!this.input.string) {
            return;
        }

        const message = this.input.string;
        RoomService.instance.sendMessage(message);
    }
}


