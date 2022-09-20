import {defineComponent} from "@/tools";
import React, {CSSProperties, useEffect, useState} from "react";
import "@/assets/ElementTree.scss"
import ElementTreeItem from "@/components/ElementTreeItem";


interface props extends React.HTMLAttributes<HTMLUListElement> {
    elements: Element,
    maxrecursion?: number
}
// todo remove max recursion and make the tree read the actual website being built
const ElementTreeList = defineComponent<props>((props, context) => {

    const max_recursion = props.maxrecursion ?? 5
    if (max_recursion < 1) {
        return (<></>)
    }

    const [children,setChildren] = useState(new Array<Element>())

    useEffect(() => {
        setChildren(Array.prototype.slice.call(props.elements.children))
    },[props.elements])

    return (
        <ul {...props}>
            {children.map((value, index) => {

                return (
                    <ElementTreeItem el={value} key={index}>
                        <ElementTreeList elements={value} maxrecursion={max_recursion - 1}/>
                    </ElementTreeItem>
                )
            })}
        </ul>
    )
})
export default ElementTreeList
