import { _decorator, Button, Component, EditBox, instantiate, Node } from 'cc';
import { GomokuRoomItem } from './GomokuRoomItem';
import { GomokuDataWithId, RoomData } from '../Define';
import { initFirebase, loadRoomList, addRoom, getGomokuRooms, createRoomByBlack } from '../FirebaseManager';
import { MakeEventHandler, UIHandler } from '../Utils';
const { ccclass, property } = _decorator;

@ccclass('GomokuRoomList')
export class GomokuRoomList extends Component {

    @property(EditBox)
    private input: EditBox;
    @property(Button)
    private addButton: Button;

    @property(GomokuRoomItem)
    private itemBase: GomokuRoomItem

    async start() {
        await initFirebase(); // Firebase初期化＆匿名ログイン

        const data = await getGomokuRooms();
        console.log(data);
        this.initList(data as GomokuDataWithId[]);

        this.addButton.clickEvents.push(MakeEventHandler(this, this.addItem));
    }

    private initList(data: GomokuDataWithId[]): void {
        this.itemBase.node.active = true;
        for (const element of data) {
            const newNode = instantiate(this.itemBase.node);
            newNode.setParent(this.itemBase.node.parent);
            newNode.getComponent(GomokuRoomItem).setData(element);
        }
        this.itemBase.node.active = false;
    }

    @UIHandler
    async addItem(): Promise<void> {
        if (!this.input.string) {
            return;
        }

        const name = this.input.string;
        const room = await createRoomByBlack(name);

        this.itemBase.node.active = true;
        const newNode = instantiate(this.itemBase.node);
        newNode.setParent(this.itemBase.node.parent);
        newNode.getComponent(GomokuRoomItem).setData(room);
        this.itemBase.node.active = false;
    }
}


