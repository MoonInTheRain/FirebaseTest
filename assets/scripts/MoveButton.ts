import { _decorator, Button, Component, director, Node } from 'cc';
import { MakeEventHandler, UIHandler } from './Utils';
const { ccclass, property } = _decorator;

@ccclass('MoveButton')
export class MoveButton extends Component {
    @property
    private target: string = ""

    start() {
        this.getComponent(Button).clickEvents.push(MakeEventHandler(this, this.onClick));
    }

    @UIHandler
    private onClick(): void {
        director.loadScene(this.target);
    }
}


