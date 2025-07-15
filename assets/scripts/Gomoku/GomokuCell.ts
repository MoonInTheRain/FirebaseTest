import { _decorator, Button, Component, Node } from 'cc';
import { MakeEventHandler, UIHandler } from '../Utils';
const { ccclass, property } = _decorator;

@ccclass('GomokuCell')
export class GomokuCell extends Component {
    @property(Node)
    private blackNode: Node;
    @property(Node)
    private whiteNode: Node;

    private pos: {x: number, y: number};

    protected start(): void {
        const button = this.getComponent(Button);
        button.clickEvents.push(MakeEventHandler(this, this.onClick));
    }

    public init(x: number, y: number): void {
        this.pos = {x, y};
        this.blackNode.active = false;
        this.whiteNode.active = false;
    }

    @UIHandler
    public onClick(): void {
        console.log(this.pos);
    }
}


