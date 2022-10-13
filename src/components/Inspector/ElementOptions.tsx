import React from "react";
import {defineInspectorItem} from "@/inspector";

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
