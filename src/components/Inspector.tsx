import {defineComponent, ProjectBuilderContext, useObservableValue} from "@/core";
import React, {HTMLAttributes, useContext, useEffect, useRef} from "react";

import "@/assets/Inspector.scss"

interface InspectorItemProps {
    currentElement: Element
}

export const ElementOptions = defineComponent<InspectorItemProps>((props, context) => {

    return (
        <ul className={"inspector-el-options"}>
            <li onClick={event => alert("Not implemented!")}>Make Component</li>
            <li className={"delete-btn"} onClick={event => {
                if (!props.currentElement.parentElement) {
                    alert("Cannot delete root element")
                    return
                }
                if (props.currentElement.parentElement.tagName.toLowerCase() === "html") {
                    alert("Cannot delete child elements of html! ( head, body )")
                    return
                }
                props.currentElement.remove()
            }}>Delete Element
            </li>
        </ul>
    )
})

export const ElementText = defineComponent<InspectorItemProps>((props, context) => {
    const txtAreaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (!txtAreaRef.current)
            return

        txtAreaRef.current.value = props.currentElement?.textContent?.trim() ?? "";
        if (props.currentElement) {
            if (props.currentElement.childElementCount > 0) {
                txtAreaRef.current.value = "Elements with children cannot have text!\nEdit or add a child element's text instead."
                txtAreaRef.current.disabled = true
            } else {
                txtAreaRef.current.disabled = false
            }
        }

    })

    const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!props.currentElement)
            return

        props.currentElement.textContent = e.target.value

    }
    return (
        <>
            <h1>Text</h1>
            <textarea onChange={onTextChange} ref={txtAreaRef}></textarea>
        </>
    )
})

export const Inspector = defineComponent((props, context) => {
    const projectCtx = useContext(ProjectBuilderContext)
    const currentElement = useObservableValue(projectCtx?.currentSelectedElement)

    if (!currentElement) {
        return (
            <ul className={"inspector-items"}>No element selected</ul>
        )
    }

    return (
        <ul className={"inspector-items"}>
            <li className={"inspector-el-text"}>
                <ElementText currentElement={currentElement}/>
            </li>
            <li>
                <h1>Other Options</h1>
                <ElementOptions currentElement={currentElement}/>
            </li>
        </ul>
    )
})
