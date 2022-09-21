import {defineComponent, getQuerySelector, getRelativeCoords} from "@/tools";
import React, {useContext, useRef} from "react";
import $ from "jquery";
import {ElementTreeCtx} from "@/components/ElementTree";


interface props extends React.HTMLAttributes<HTMLLIElement> {
    el: Element
}

export default defineComponent<props>((props) => {
    const itemRef = useRef<HTMLParagraphElement>(null)
    const rootRef = useRef<HTMLLIElement>(null)
    const context = useContext(ElementTreeCtx)


    function toggleChildren() {
        itemRef.current?.classList.toggle("collapsed")
    }

    function focusThis() {
        if (context.focusedElement !== null) {
            context.focusedElement.classList.remove("is-focused")
        }
        if (itemRef.current === null) {
            return
        }
        itemRef.current.classList.add("is-focused");
        context.focusedElement = itemRef.current
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
    // todo stop drag drop when it item being dropped is its own child. !important

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


        let data = ev.dataTransfer.getData("el")
        let el = $(data).get()[0]
        console.log(itemRef.current, rootRef.current)
        if (itemRef.current && rootRef.current) {
            // The element that is to be inserted (and moved) is "el"
            if (itemRef.current.classList.contains("drag-over-before")){
                // insert as sibling before
                //todo
            }
            else if (itemRef.current.classList.contains("drag-over-center")){
                // add as child
                //todo

            }else if (itemRef.current.classList.contains("drag-over-after")){
                // add as sibling after
                //todo
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
                    props.el.childElementCount > 0 ?
                        <a onClick={toggleChildren}><span
                            className={"material-symbols-outlined"}>expand_more</span></a> :
                        <span style={{width: "12px"}}></span> // spacer
                }

                {props.el.id.length < 1 ? <i className={"unnamed"}>{props.el.tagName.toLowerCase()}</i> : props.el.id}
                <span className={"tagname"}>&lt;{props.el.tagName.toLowerCase()}&gt;</span>
            </p>
            {props.children}
        </li>
    )
})
