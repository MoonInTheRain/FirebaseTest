import { _decorator, Button, Component, EditBox, instantiate, Node } from 'cc';
import { addRoom, initFirebase, loadRoomList } from '../FirebaseManager';
import { MakeEventHandler, UIHandler } from '../Utils';
import { RoomItem } from './RoomItem';
import { RoomData } from '../Define';
const { ccclass, property } = _decorator;

@ccclass('RoomList')
export class RoomList extends Component {

    @property(EditBox)
    private input: EditBox;
    @property(Button)
    private addButton: Button;

    @property(RoomItem)
    private itemBase: RoomItem

    async start() {
        await initFirebase(); // Firebase初期化＆匿名ログイン

        const data = await loadRoomList();
        console.log(data);
        this.initList(data as RoomData[]);

        this.addButton.clickEvents.push(MakeEventHandler(this, this.addItem));
    }

    private initList(data: RoomData[]): void {
        this.itemBase.node.active = true;
        for (const element of data) {
            const newNode = instantiate(this.itemBase.node);
            newNode.setParent(this.itemBase.node.parent);
            newNode.getComponent(RoomItem).setData(element);
        }
        this.itemBase.node.active = false;
    }

    @UIHandler
    async addItem(): Promise<void> {
        if (!this.input.string) {
            return;
        }

        const name = this.input.string;
        const roomId = await addRoom(name);

        this.itemBase.node.active = true;
        const newNode = instantiate(this.itemBase.node);
        newNode.setParent(this.itemBase.node.parent);
        newNode.getComponent(RoomItem).setData({roomId, name});
        this.itemBase.node.active = false;
    }
}


