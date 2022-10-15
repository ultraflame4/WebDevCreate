import React from "react";
import {defineInspectorItem} from "@/inspector";
import "@/assets/components/Inspector.scss"
import {IProjectBuilderContext} from "@/core";

export function GetElementOptions(targetElement: Element, projectBuilderCtx: IProjectBuilderContext | null): React.ReactElement[] {
    if (!projectBuilderCtx) {
        console.error("ProjectBuilderContext is null")
        return []
    }
    return [
        (
            <button className={"button el-options-btn"} onClick={event => alert("Not implemented!")} type={"button"}>Make
                Component</button>
        ),
        (
            <button className={"danger-btn el-options-btn"} onClick={event => {
                if (!targetElement.parentElement) {
                    alert("Cannot delete root element")
                    return
                }
                if (targetElement.parentElement.tagName.toLowerCase() === "html") {
                    alert("Cannot delete child elements of html! ( head, body )")
                    return
                }

                targetElement.remove()
                projectBuilderCtx.currentSelectedElement.value = null
            }} type={"button"}>
                Delete Element
            </button>
        )
    ]
}

export const ElementOptions = defineInspectorItem("Other options", (props, context) => {

    return (
        <ul className={"inspector-el-options"}>
            {GetElementOptions(props.currentElement, props.builderCtx).map(value => <li>{value}</li>)}
        </ul>
    )
})
