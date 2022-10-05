import {
    defineComponent,
    getHtmlChildrenArray,
    getQuerySelector,
    getRelativeCoords,
    ProjectBuilderContext
} from "@/core";

import React, {useContext, useEffect, useRef, useState} from "react";
import "@/assets/ElementTree.scss"
import $ from "jquery";


interface IElementTreeProps extends React.HTMLAttributes<HTMLDivElement> {
    root_element: Element,
}

interface IElementTreeItemProps extends React.HTMLAttributes<HTMLLIElement> {
    el: Element
}

export interface IElementTreeCtxObj {
    focusedElement: Element | null,
    dragFocusElement: Element | null
}

function CreateElementTreeCtxObj(): IElementTreeCtxObj {
    return {
        dragFocusElement: null,
        focusedElement: null
    }
}

const ElementTreeItem = defineComponent<IElementTreeItemProps>((props) => {
    const itemRef = useRef<HTMLParagraphElement>(null)
    const rootRef = useRef<HTMLLIElement>(null)
    const context = useContext(ElementTreeCtx)
    const appContext = useContext(ProjectBuilderContext)
    const [children, setChildren] = useState(getHtmlChildrenArray(props.el))

    useEffect(() => {

        const observer = new MutationObserver((mutations) => {
            setChildren(getHtmlChildrenArray(props.el))
        })
        observer.observe(
            props.el,
            {
                childList: true,
                attributes: false,
                subtree: false
            }
        )

        return () => {
            observer.disconnect()
        }
    })

    function toggleChildren() {
        itemRef.current?.classList.toggle("collapsed")
    }

    function focusThis() {
        if (context.focusedElement !== null) {
            context.focusedElement.classList.remove("is-focused")
        }
        if (!itemRef.current || !appContext) {
            return
        }
        itemRef.current.classList.add("is-focused");
        context.focusedElement = itemRef.current
        appContext.currentSelectedElement.value = props.el
    }

    function clearDragOverClass(el: Element | null) {
        el?.classList.remove("drag-over-before");
        el?.classList.remove("drag-over-after");
        el?.classList.remove("drag-over-center");
    }

    function OnDragStart(ev: React.DragEvent<HTMLLIElement>) {
        ev.stopPropagation()

        let queryString = getQuerySelector(props.el)
        if (queryString.length < 1) {
            ev.preventDefault()

        }
        ev.dataTransfer.setData("el", queryString);

    }

    function OnDragOver(ev: React.DragEvent<HTMLLIElement>) {

        ev.preventDefault()
        ev.stopPropagation()

        if (itemRef.current === null) {
            console.error("itemRef is null!")
            return
        }


        clearDragOverClass(context.dragFocusElement)

        context.dragFocusElement = itemRef.current;
        ev.dataTransfer.dropEffect = "move"
        if (rootRef.current === null) {
            return;
        }
        let jEl = $(rootRef.current);
        const {y} = getRelativeCoords(rootRef.current, ev.pageX, ev.pageY)

        if (y < 10) { // insert sibling before
            itemRef.current.classList.add("drag-over-before");

        }
        //@ts-ignore
        else if (y > jEl.height() - 10) { // insert after
            itemRef.current.classList.add("drag-over-after");
        } else { // add as child
            itemRef.current.classList.add("drag-over-center");
        }
    }

    function OnDragLeave(ev: React.DragEvent<HTMLLIElement>) {
        clearDragOverClass(context.dragFocusElement)
        // context.dragFocusElement = null;
    }

    function OnDrop(ev: React.DragEvent<HTMLLIElement>) {
        ev.stopPropagation()

        if (appContext === null) {
            console.error("Fatal Error, App context Is Null!")
            return (<></>)
        }


        let data = ev.dataTransfer.getData("el")
        let newEl_tagName = ev.dataTransfer.getData("tagName")
        let newEl_attrs = ev.dataTransfer.getData("attrs")

        let el;
        if (data) {
            // el represents the element in project iframe
            el = $(appContext.liveProjectDomTree.value).find(data).get()[0]
        } else if (newEl_tagName) {
            el = document.createElement(newEl_tagName);
            if (newEl_attrs) {
                let attrs: { [name: string]: string } = JSON.parse(newEl_attrs)
                for (let [attrName, attrValue] of Object.entries(attrs)) {
                    el.setAttribute(attrName, attrValue)
                }
            }

        } else {
            console.error("Error At OnDrop callback at ElementTreeItem.tsx Program is stumped :/")
            return
        }


        let currentEl = props.el

        if (itemRef.current && rootRef.current) {
            try {
                // The element that is to be inserted (and moved) is "el"
                if (itemRef.current.classList.contains("drag-over-before")) {
                    // insert as sibling before
                    currentEl.insertAdjacentElement("beforebegin", el)
                } else if (itemRef.current.classList.contains("drag-over-center")) {
                    // add as child

                    currentEl.appendChild(el);


                } else if (itemRef.current.classList.contains("drag-over-after")) {
                    // add as sibling after
                    currentEl.insertAdjacentElement("afterend", el)
                }
            } catch (e: DOMException | any) {
                console.warn("failed to move element", e.message);
            }


        } else {
            console.error("itemRef or rootRef is somehow null. Goddammit react!")
        }

        clearDragOverClass(context.dragFocusElement)
        context.dragFocusElement = null;

    }

    return (
        <li {...props} className={"element-tree-item"} draggable={true} onDragOver={OnDragOver}
            onDragStart={OnDragStart} onDrop={OnDrop} onDragLeave={OnDragLeave} ref={rootRef}>
            <p ref={itemRef} onClick={focusThis}>
                {
                    children.length > 0 ?
                        <a onClick={toggleChildren}>
                            <span className={"material-symbols-outlined"}>expand_more</span>
                        </a> :
                        <span style={{width: "12px"}}></span>
                }

                {props.el.id.length < 1 ? <i className={"unnamed"}>{props.el.tagName.toLowerCase()}</i> : props.el.id}
                <span className={"tagname"}>&lt;{props.el.tagName.toLowerCase()}&gt;</span>
            </p>
            <ul>
                {
                    children.map((value, index) => {

                        return (
                            <ElementTreeItem el={value} key={index}/>
                        )
                    })
                }
            </ul>
        </li>
    )
})


export const ElementTreeCtx = React.createContext<IElementTreeCtxObj>(CreateElementTreeCtxObj())

export default defineComponent<IElementTreeProps>((props, context) => {

    return (
        <ElementTreeCtx.Provider value={CreateElementTreeCtxObj()}>

            <ul className={"element-tree"}>
                <ElementTreeItem el={props.root_element}/>
            </ul>

        </ElementTreeCtx.Provider>
    )
})
