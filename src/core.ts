import React from "react";
import $ from "jquery"

export function defineComponent<T>(component: React.FunctionComponent<React.PropsWithChildren<T>>): React.FunctionComponent<React.PropsWithChildren<T>> {
    return component
}




/**
 * modified from https://gist.github.com/karlgroves/7544592
 * @param el
 */
export function getDomPath(el: Element) {
    let stack = [];
    while (el.parentNode != null) {
        // console.log(el.nodeName);
        let sibCount = 0;
        let sibIndex = 0;
        for (let i = 0; i < el.parentNode.childNodes.length; i++) {
            let sib = el.parentNode.childNodes[i];
            if (sib.nodeName == el.nodeName) {
                if (sib === el) {
                    sibIndex = sibCount;
                }
                sibCount++;
            }
        }
        if (el.hasAttribute('id') && el.id != '') {
            stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
        } else if (sibCount > 1) {
            stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
        } else {
            stack.unshift(el.nodeName.toLowerCase());
        }
        // @ts-ignore
        el = el.parentNode;
    }
    return stack.slice(1); // removes the html element
}

export function getQuerySelector(el: Element) {
    return getDomPath(el).join(">")
}

/**
 * Returns adjusted mouse coordinates relative to the center of element
 * @param el Element
 * @param pageX mouse coordinate x relative to the page
 * @param pageY mouse coordinate y relative to the page
 */
export function getRelativeCoords(el: Element, pageX: number, pageY: number): { x: number, y: number } {
    let jqueryEl = $(el)

    let offset = jqueryEl.offset()
    if (offset === undefined) {
        console.error("Cannot get offset of ", el, "it is not in DOM")
        return {x: 0, y: 0}
    }
    // @ts-ignore
    let _x = pageX - offset.left;
    // @ts-ignore
    let _y = pageY - offset.top;
    return {x: _x, y: _y}
}

export interface ElementComponent {
    name:string,
    description?:string,
}

export interface IWebDevCreateAppBuilderCtxObj{
    projectDomTree: Document
    elementComponentList : ElementComponent[]
    appVersion: string
}

export const WebDevCreateAppBuilderContext = React.createContext<IWebDevCreateAppBuilderCtxObj|null>(null)

export class ObservableValue<T> {
    private _value: T
    private _listeners: ((value: T) => void)[] = []

    constructor(value: T) {
        this._value = value
    }

    get value(): T {
        return this._value
    }

    set value(value: T) {
        this._value = value
        this._listeners.forEach(listener => listener(value))
    }

    subscribe(listener: (value: T) => void) {
        this._listeners.push(listener)
    }

    unsubscribe(listener: (value: T) => void) {
        this._listeners = this._listeners.filter(l => l !== listener)
    }
}
