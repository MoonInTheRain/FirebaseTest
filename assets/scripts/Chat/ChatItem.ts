import { _decorator, Component, Label, Node } from 'cc';
import { ChatData } from '../Define';
const { ccclass, property } = _decorator;

@ccclass('ChatItem')
export class ChatItem extends Component {
    @property(Label)
    private label: Label;
    @property(Node)
    private isMine: Node;
    @property(Node)
    private isTheirs: Node;

    start() {
    }

    public setData(data: ChatData): void {
        this.label.string = data.message;
        this.isMine.active = data.isMine;
        this.isTheirs.active = !data.isMine;
    }
}


