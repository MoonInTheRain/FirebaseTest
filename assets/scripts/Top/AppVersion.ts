import { _decorator, Component, Label, Node } from 'cc';
import { getAppVersion } from '../FirebaseManager';
const { ccclass, property } = _decorator;

@ccclass('AppVersion')
export class AppVersion extends Component {
    start() {
        const label = this.getComponent(Label);
        getAppVersion().then(x => label.string = `ver ${x}`);
    }
}


