import {defineComponent, ElementComponent} from "@/core";
import "@/assets/ElementComponents.scss"
import DragStartEvent = JQuery.DragStartEvent;
import React from "react";

interface itemProps{
    name: string,
    desc: string,
    tagName: string
    attrs?: {[attrName:string] : string}
}

const ElementComponentItem = defineComponent<itemProps>((props, context) => {

    function dragStart(ev: React.DragEvent<HTMLLIElement>) {
        if (ev.dataTransfer == null) {
            console.error("ElementComponents: Drag start data transfer is null")
            return
        }

        ev.dataTransfer.setData("tagName",props.name);
        if (props) {
            ev.dataTransfer.setData("attrs",JSON.stringify(props.attrs))
        }


    }

    return (
        <li className={"el-comp-item"} draggable={true} onDragStart={dragStart}>
            <p>
                {props.name}
            </p>
        </li>
    )
})

interface listProps{
    elementComponents:ElementComponent[]
}

export default defineComponent<listProps>((props, context) => {
    return (
        <ul className={"el-comp-list"}>
            {
                props.elementComponents.map((value, index) => {
                    return (
                        <ElementComponentItem
                            key={index}
                            name={value.name}
                            desc={value.description??""}
                            tagName={value.htmlTagName}
                        />
                    )
                })
            }
        </ul>
    )
})
