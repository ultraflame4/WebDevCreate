import {defineComponent, IProjectBuilderContext, ProjectBuilderContext, useObservableValue} from "@/core";
import React, {PropsWithChildren, useContext, useEffect, useRef} from "react";

import "@/assets/Inspector.scss"
import CollapsibleItem from "@/components/CollapsibleItem";

interface InspectorItemProps {
    currentElement: Element
    builderCtx: IProjectBuilderContext
}

type InspectorItem = {
    title: string,
    component: React.FunctionComponent<PropsWithChildren<InspectorItemProps>>
}
const InspectorItems: InspectorItem[] = []

export function defineInspectorItem(name: string, component: React.FunctionComponent<React.PropsWithChildren<InspectorItemProps>>) {
    InspectorItems.push({
        title: name,
        component: component
    })
    return component
}



export const Inspector = defineComponent((props, context) => {
    const projectCtx = useContext(ProjectBuilderContext)
    const currentElement = useObservableValue(projectCtx?.currentSelectedElement)

    if (projectCtx === null) {
        return (
            <ul className={"inspector-items"}>Project Context is null!</ul>
        )
    }


    if (!currentElement) {
        return (
            <ul className={"inspector-items"}>No element selected</ul>
        )
    }

    return (
        <ul className={"inspector-items"}>
            {
                InspectorItems.map((value, index) => {
                    return (
                        <li>
                            <CollapsibleItem title={value.title}>
                                {React.createElement(value.component,{
                                    builderCtx: projectCtx,
                                    currentElement: currentElement
                                })}

                            </CollapsibleItem>
                        </li>
                    )
                })
            }

        </ul>
    )
})


export const ElementText = defineInspectorItem("Text", (props, context) => {
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
        <textarea className={"inspector-el-text"} onChange={onTextChange} ref={txtAreaRef}></textarea>
    )
})


export const ElementOptions = defineInspectorItem("Other options", (props, context) => {

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
                props.builderCtx.currentSelectedElement.value = null
            }}>
                Delete Element
            </li>
        </ul>
    )
})
