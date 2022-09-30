import {defineComponent, ElementComponent} from "@/core";
import "@/assets/ElementComponents.scss"
import DragStartEvent = JQuery.DragStartEvent;
import React, {useState} from "react";
import {it} from "node:test";

interface itemProps {
    name: string,
    desc: string,
    attrs?: { [attrName: string]: string }
}

const ElementComponentItem = defineComponent<itemProps>((props, context) => {

    function dragStart(ev: React.DragEvent<HTMLLIElement>) {
        if (ev.dataTransfer == null) {
            console.error("ElementComponents: Drag start data transfer is null")
            return
        }

        ev.dataTransfer.setData("tagName", props.name);
        if (props.attrs) {
            ev.dataTransfer.setData("attrs", JSON.stringify(props.attrs))
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

interface listProps {
    elementComponents: ElementComponent[]
}

export default defineComponent<listProps>((props, context) => {
    const [items, setItems] = useState(props.elementComponents)

    function OnSearchUpdate(e: React.ChangeEvent<HTMLInputElement>) {
        let searchQuery = e.target.value
        let filteredItems: ElementComponent[] = []

        for (let i = 0; i < props.elementComponents.length; i++) {
            let item = props.elementComponents[i];
            if (item.name.includes(searchQuery)) {
                filteredItems.push(item)
            } else if (item.description) {
                if (item.description.includes(searchQuery)) {
                    filteredItems.push(item)
                }
            }
        }

        setItems(filteredItems)
    }

    return (
        <div className={"el-comp-ctn"}>
            <input className={"el-comp-search"} placeholder={"Search name or description"} type={"search"} onChange={OnSearchUpdate}/>
            <ul className={"el-comp-list"}>
                {
                    items.map((value, index) => {
                        return (
                            <ElementComponentItem
                                key={index}
                                name={value.name}
                                desc={value.description ?? ""}
                            />
                        )
                    })
                }
            </ul>
        </div>
    )
})
