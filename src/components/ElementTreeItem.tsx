import {defineComponent, ElementTreeContext, getDomPath, getQuerySelector, IElementTreeCtxObj} from "@/tools";
import React, {useContext, useRef} from "react";

interface props extends React.HTMLAttributes<HTMLLIElement> {
    el: Element
}

export default defineComponent<props>((props) => {
    const itemRef = useRef<HTMLParagraphElement>(null)
    const context = useContext(ElementTreeContext)
    function toggleChildren() {
        itemRef.current?.classList.toggle("collapsed")
    }

    function focusThis() {
        console.log(context)
        if (context.currentlySelectedElement!==null) {
            context.currentlySelectedElement.classList.remove("is-focused")
        }
        if (itemRef.current === null) {
            return
        }
        itemRef.current.classList.add("is-focused");
        context.currentlySelectedElement=itemRef.current
    }

    function OnDragStart(ev: React.DragEvent<HTMLLIElement>) {
        ev.stopPropagation()

        ev.dataTransfer.setData("el",getQuerySelector(props.el))

    }

    function OnDragOver(ev:React.DragEvent<HTMLLIElement>){
        ev.preventDefault()
    }

    function OnDrop(ev:React.DragEvent<HTMLLIElement>){
        ev.stopPropagation()
        let data = ev.dataTransfer.getData("el")
        //@ts-ignore
        console.log(`Moving`,document.querySelector(data),`to be a child of`,itemRef.current)
    }

    return (
        <li {...props} className={"element-tree-item"} draggable={true} onDragOver={OnDragOver} onDragStart={OnDragStart} onDrop={OnDrop}>
            <p ref={itemRef} onClick={focusThis}>
                {
                    props.el.childElementCount > 0 ?
                        <a onClick={toggleChildren}><span
                            className={"material-symbols-outlined"}>arrow_drop_down</span></a> :
                        <span style={{width: "12px"}}></span> // spacer
                }

                {props.el.id.length < 1 ? <i className={"unnamed"}>{props.el.tagName.toLowerCase()}</i> : props.el.id}
                <span className={"tagname"}>&lt;{props.el.tagName.toLowerCase()}&gt;</span>
            </p>
            {props.children}
        </li>
    )
})
