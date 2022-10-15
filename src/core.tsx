import React, {createContext} from "react";
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

export function getHtmlChildrenArray(el: Element) {
    return Array.prototype.slice.call(el.children)
}


/**
 * Returns adjusted mouse coordinates relative to the top of element
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

/**
 * Returns adjusted mouse coordinates relative to the top of element in percentage 0.1, 0.2 ,0.3 ...
 * @param el Element
 * @param pageX mouse coordinate x relative to the page
 * @param pageY mouse coordinate y relative to the page
 */
export function getRelativePercentCoords(el: Element, pageX: number, pageY: number): { x: number, y: number } {
    const data = getRelativeCoords(el, pageX, pageY)
    return {
        x: data.x / el.clientWidth,
        y: data.y / el.clientHeight
    }
}

export interface ElementComponent {
    name: string,
    description?: string,
}


export interface IProjectBuilderContext {
    liveProjectDomTree: ObservableValue<Document>,
    elementComponentList: ElementComponent[]
    previewDimensions: {
        width: ObservableValue<number>,
        height: ObservableValue<number>,
        scale: ObservableValue<number>
        auto: ObservableValue<boolean>
    },
    currentSelectedElement: ObservableValue<Element | null>
}

export const ProjectBuilderContext = React.createContext<IProjectBuilderContext | null>(null)


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


export function useObservableValue<T>(observableValue: ObservableValue<T> | null | undefined): T | null {
    if (!observableValue) {
        return null;
    }
    let [value, setValue] = React.useState(observableValue.value);
    React.useEffect(() => {

        let listener = (value: T) => {
            setValue(value)
        }

        observableValue.subscribe(listener)
        return () => observableValue.unsubscribe(listener)
    })
    return value
}

/**
 * returns the first element that the mouse is over, else null
 * @param mouseX
 * @param mouseY
 * @param elements
 */
export function mouseInElements(mouseX: number, mouseY: number, elements: HTMLElement[]) {
    for (let element of elements) {
        let rect = element.getBoundingClientRect()
        if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
            return element
        }
    }
    return null
}


export interface IContextMenu_MenuObj {
    /**
     * The text to display in the menu, optional
     */
    name?: string,
    /**
     * The element to display in the menu, optional. If used, name should not be used, else both will show up
     */
    element?: React.ReactElement,
    /**
     * The function to call when the menu item is clicked. Optional
     */
    callback?: () => void,
    /**
     * Sub menus, optional
     */
    children?: IContextMenu_MenuObj[]
}

export interface IContextMenu {
    /**
     * Creates and opens a context menu. Call this function when you want to open a context menu. e.g. on right click
     * @param menu
     */
    createMenu: (event: React.MouseEvent, menu: IContextMenu_MenuObj[]) => void

    /**
     * This is a callback function that is called when the context menu is opened. Has to be set before the context menu is opened.
     * @param menu_data
     */
    onOpenMenu?: (event: React.MouseEvent, menu_data: IContextMenu_MenuObj[]) => void
}


export const ContextMenu = React.createContext<IContextMenu>(
    {
        createMenu: (e, _: IContextMenu_MenuObj[]) => {
            e.preventDefault()
            console.log("No context menu defined")
        },
        onOpenMenu: (e, _: IContextMenu_MenuObj[]) => {
        }
    }
)

export const ContextMenuProvider = defineComponent((props, context) => {
    const menuCtxObj: IContextMenu = {
        createMenu(event: React.MouseEvent, menu: IContextMenu_MenuObj[]): void {
            event.preventDefault()

            this.onOpenMenu?.(event, menu)

        }
    }
    return (
        <ContextMenu.Provider value={menuCtxObj}>
            {props.children}
        </ContextMenu.Provider>
    )
})
