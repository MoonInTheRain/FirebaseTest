import { _decorator, Button, Component, EditBox, instantiate, Node } from 'cc';
import { initFirebase, loadTodoList, saveTodoList } from '../FirebaseManager';
import { MakeEventHandler, UIHandler } from '../Utils';
import { TodoListItem } from './TodoListItem';
import { TodoData } from '../Define';
const { ccclass, property } = _decorator;

@ccclass('TodoListManager')
export class TodoListManager extends Component {

    @property(EditBox)
    private input: EditBox;
    @property(Button)
    private addButton: Button;

    @property(TodoListItem)
    private itemBase: TodoListItem

    private items: TodoListItem[] = [];

    async start() {
        await initFirebase(); // Firebase初期化＆匿名ログイン
    
        const data = await loadTodoList();
        this.initList(data);

        this.addButton.clickEvents.push(MakeEventHandler(this, this.addItem))
    }

    private initList(data: object): void {
        this.itemBase.node.active = true;
        const todoList = Object.keys(data)
            .filter((key) => /^\d+$/.test(key)) // 数値っぽいキーだけ
            .sort((a, b) => Number(a) - Number(b)) // 昇順に並べる
            .map((key) => data[key]);
        for (const element of todoList) {
            const newNode = instantiate(this.itemBase.node);
            newNode.setParent(this.itemBase.node.parent);
            newNode.getComponent(TodoListItem).setData(element, () => this.saveData());
        }
        this.itemBase.node.active = false;
    }

    async saveData(): Promise<void> {
        const list = this.itemBase.node.parent
            .getComponentsInChildren(TodoListItem)
            .filter(x => x.isDeleteScheduled == false && x != this.itemBase)
            .map(x => x.data);
        saveTodoList(list)
    }

    @UIHandler
    async addItem(): Promise<void> {
        if (!this.input.string) {
            return;
        }

        this.itemBase.node.active = true;
        const newNode = instantiate(this.itemBase.node);
        newNode.setParent(this.itemBase.node.parent);
        newNode.getComponent(TodoListItem).setData({check: false, text: this.input.string}, () => this.saveData());
        this.itemBase.node.active = false;
        await this.saveData();
    }
}


