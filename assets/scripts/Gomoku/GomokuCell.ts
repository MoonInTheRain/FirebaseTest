import { _decorator, Button, Component, Node } from 'cc';
import { MakeEventHandler, UIHandler } from '../Utils';
const { ccclass, property } = _decorator;

@ccclass('GomokuCell')
export class GomokuCell extends Component {
    @property(Node)
    private blackNode: Node;
    @property(Node)
    private whiteNode: Node;

    private onClickAction: () => void;

    protected start(): void {
        const button = this.getComponent(Button);
        button.clickEvents.push(MakeEventHandler(this, this.onClick));
    }

    public init(onClickAction: () => void): void {
        this.blackNode.active = false;
        this.whiteNode.active = false;
        this.onClickAction = onClickAction;
    }

    public setData(data: ("none" | "white" | "black")): void {
        this.blackNode.active = data == "black";
        this.whiteNode.active = data == "white";
    }

    public getData(): ("none" | "white" | "black") {
        if (this.blackNode.active) {
            return "black";
        }
        if (this.whiteNode.active) {
            return "white"
        }
        return "none";
    }

    @UIHandler
    public onClick(): void {
        this.onClickAction();
    }
}


