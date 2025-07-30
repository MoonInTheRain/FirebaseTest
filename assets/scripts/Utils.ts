import { Component, EventHandler, js } from "cc";

/**
 * UIHandlerを付与した関数のマップ
 */
const handlerMap = new WeakMap<Function, string>();

/**
 * MakeEventHandlerに渡す関数に付与する属性
 * @param target 
 * @param propertyKey 
 * @param descriptor 
 */
export function UIHandler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    handlerMap.set(descriptor.value, propertyKey);
}

/**
 * イベントを生成するための関数
 * @param _this ファンクションが存在しているコンポーネント。基本的にthisを渡すことになる。
 * @param _fn 実行する関数。UIHandlerの属性を付与している必要あり。
 * @param customEventData 関数に渡される引数。省略可。
 * @returns 
 */
export function MakeEventHandler(_this: Component, _fn: Function, customEventData: string = "") {
    const className = js.getClassName(_this);
    // 関数の名前をマップから取得する。_fn.nameだとリリースビルド時に名前が変わって実行されなくなる。
    const functionName = handlerMap.get(_fn);
    if (functionName == undefined) {
        console.error(`missing UIHandler at ${_fn.name} in ${className}`);
    }

    const newEventHandler = new EventHandler();
    newEventHandler.target = _this.node;
    newEventHandler.component = className
    newEventHandler.handler = functionName;
    newEventHandler.customEventData = customEventData;
    return newEventHandler;
}