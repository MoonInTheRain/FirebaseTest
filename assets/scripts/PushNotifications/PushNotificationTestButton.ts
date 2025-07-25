import { _decorator, Button, Component, Node } from 'cc';
import { pushTopicNotificationTest, registerPushToken } from '../FirebaseManager';
import { MakeEventHandler, UIHandler } from '../Utils';
const { ccclass, property } = _decorator;

@ccclass('PushNotificationTestButton')
export class PushNotificationTestButton extends Component {
    start() {
        const button = this.getComponent(Button);
        button.clickEvents.push(MakeEventHandler(this, this.onClick));
    }

    @UIHandler
    private async onClick(): Promise<void> {
        await pushTopicNotificationTest();
    }
}


