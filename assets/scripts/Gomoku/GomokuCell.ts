import { _decorator, Button, Component, Node } from 'cc';
import { MakeEventHandler, UIHandler } from '../Utils';
const { ccclass, property } = _decorator;

/**
 * 五目並べのマスの１つ
 */
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

    /**
     * 表示とクリックイベントを初期化
     * @param onClickAction 
     */
    public init(onClickAction: () => void): void {
        this.blackNode.active = false;
        this.whiteNode.active = false;
        this.onClickAction = onClickAction;
    }

    /**
     * 表示更新
     * @param data 
     */
    public setData(data: ("none" | "white" | "black")): void {
        this.blackNode.active = data == "black";
        this.whiteNode.active = data == "white";
    }

    /**
     * 現在のマスに置かれている色を取得する
     * @returns 
     */
    public getData(): ("none" | "white" | "black") {
        if (this.blackNode.active) {
            return "black";
        }
        if (this.whiteNode.active) {
            return "white"
        }
        return "none";
    }

    /**
     * クリック時の挙動
     */
    @UIHandler
    public onClick(): void {
        this.onClickAction();
    }
}


