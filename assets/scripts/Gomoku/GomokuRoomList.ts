import { _decorator, Button, Component, EditBox, instantiate } from 'cc';
import { GomokuDataWithId } from '../Define';
import { createRoom, getGomokuRooms, initFirebase } from '../FirebaseManager';
import { MakeEventHandler, UIHandler } from '../Utils';
import { GomokuRoomItem } from './GomokuRoomItem';
const { ccclass, property } = _decorator;

/**
 * 五目並べのルーム一覧表示
 */
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

    /**
     * 新しいルームを追加する
     * @returns 
     */
    @UIHandler
    async addItem(): Promise<void> {
        if (!this.input.string) {
            return;
        }

        const name = this.input.string;
        const room = await createRoom(name, "black");

        this.itemBase.node.active = true;
        const newNode = instantiate(this.itemBase.node);
        newNode.setParent(this.itemBase.node.parent);
        newNode.getComponent(GomokuRoomItem).setData(room);
        this.itemBase.node.active = false;
    }
}


