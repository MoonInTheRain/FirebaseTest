import { _decorator, Button, Component, Node } from 'cc';
import { registerPushToken } from '../FirebaseManager';
import { MakeEventHandler, UIHandler } from '../Utils';
const { ccclass, property } = _decorator;

@ccclass('RegisterPushTokenButton')
export class RegisterPushTokenButton extends Component {
    start() {
        const button = this.getComponent(Button);
        button.clickEvents.push(MakeEventHandler(this, this.onClick));
    }

    @UIHandler
    private async onClick(): Promise<void> {
        const result = await registerPushToken();
        console.log(`registerPushToken : ${result}`);
    }
}


