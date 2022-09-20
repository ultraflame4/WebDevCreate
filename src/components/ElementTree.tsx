import {defineComponent} from "@/tools";
import ElementTreeItem from "@/components/ElementTreeItem";
import ElementTree from "@/components/ElementTreeList";
import React from "react";
import ElementTreeList from "@/components/ElementTreeList";
interface props extends React.HTMLAttributes<HTMLDivElement> {
    elements: Element,
}

export default defineComponent<props>((props, context) => {

    return (
        <div {...props}>
            <ElementTreeList elements={props.elements} className={"element-tree"}/>
        </div>
    )
})
