import { _decorator, Button, Component, Label, Node, Toggle } from 'cc';
import { MakeEventHandler, UIHandler } from './Utils';
const { ccclass, property } = _decorator;

@ccclass('TodoListItem')
export class TodoListItem extends Component {
    @property(Toggle)
    private toggle: Toggle;
    @property(Label)
    private label: Label;
    @property(Button)
    private deleteButton: Button;

    public isDeleteScheduled: boolean = false;

    public data: {check: boolean, text: string};
    private callback: () => Promise<void>;

    public setData(data: {check: boolean, text: string}, callback: () => Promise<void>) {
        this.data = data;
        this.callback = callback;
        this.updateData();
    }

    private updateData(): void {
        this.toggle.isChecked = this.data.check;
        this.label.string = this.data.text;
    }

    protected start(): void {
        this.toggle.checkEvents.push(MakeEventHandler(this, this.onToggleChange));
        this.deleteButton.clickEvents.push(MakeEventHandler(this, this.onDelete));
    }

    @UIHandler
    private async onToggleChange(): Promise<void> {
        this.data.check = this.toggle.isChecked;
        await this.callback?.();
        this.updateData();
    }

    @UIHandler
    private async onDelete(): Promise<void> {
        this.isDeleteScheduled = true;
        this.node.destroy();
        await this.callback?.();
    }
}


