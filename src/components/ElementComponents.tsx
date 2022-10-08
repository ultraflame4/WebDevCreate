import {defineComponent, ElementComponent} from "@/core";
import "@/assets/components/ElementComponents.scss"
import DragStartEvent = JQuery.DragStartEvent;
import React, {useContext, useEffect, useState} from "react";
import {it} from "node:test";
import {ISearchContextObj, SearchContext} from "@/components/ContentSearch";

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

    function OnClick(ev: React.MouseEvent<HTMLLIElement>) {

    }

    return (
        <li className={"el-comp-item"} draggable={true} onDragStart={dragStart} onClick={OnClick}>
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
    const ctx = useContext(SearchContext);
    const [items, setItems] = useState(props.elementComponents)



    useEffect(() => {
        function queryChange(searchQuery:string) {
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
        ctx.query.subscribe(queryChange)
        return () => {
            ctx.query.unsubscribe(queryChange)
        }
    })


    return (
        <div className={"el-comp-ctn"}>
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
