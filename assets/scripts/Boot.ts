import { _decorator, Component, director, Node } from 'cc';
import { getGomokuRoom, initFirebase } from './FirebaseManager';
import { GomokuService } from './Gomoku/GomokuService';
const { ccclass, property } = _decorator;

@ccclass('Boot')
export class Boot extends Component {
    async start() {
        const params = new URLSearchParams(window.location.search);
        const boardRoomId = params.get('boardRoomId');
        if (boardRoomId) {
            await initFirebase();
            GomokuService.instance.setRoomId(boardRoomId);
            director.loadScene("gomoku");

            // クエリを削除してURLだけを書き換える（ページリロードなし）
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState(null, '', cleanUrl);
        }
    }

    update(deltaTime: number) {
        
    }
}


