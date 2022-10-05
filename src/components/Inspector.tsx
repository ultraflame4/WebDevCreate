import {defineComponent, ProjectBuilderContext} from "@/core";
import React, {HTMLAttributes, useContext, useEffect, useRef} from "react";

import "@/assets/Inspector.scss"

interface InspectorItemProps {
    currentElement: Element | null
}

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


    if (!props.currentElement) {
        return (<></>)
    }

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
    const [currentElement, setElement] = React.useState<Element | null>(null)

    useEffect(() => {
        if (!projectCtx)
            return

        function update(current: Element | null) {
            setElement(current)
        }

        projectCtx.currentSelectedElement.subscribe(update)

        return () => {
            projectCtx.currentSelectedElement.unsubscribe(update)
        }
    })


    return (
        <ul className={"inspector-items"}>
            <li className={"inspector-el-text"}>
                <ElementText currentElement={currentElement}/>
            </li>
        </ul>
    )
})
