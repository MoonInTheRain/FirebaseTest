import { Component, EventHandler, js } from "cc";

const handlerMap = new WeakMap<Function, string>();

export function UIHandler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    handlerMap.set(descriptor.value, propertyKey);
}

export function MakeEventHandler(_this: Component, _fn: Function, customEventData: string = "") {
    const className = js.getClassName(_this);
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