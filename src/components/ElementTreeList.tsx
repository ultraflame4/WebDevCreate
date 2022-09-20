import {defineComponent} from "@/tools";
import React, {CSSProperties, useEffect, useState} from "react";
import "@/assets/ElementTree.scss"
import ElementTreeItem from "@/components/ElementTreeItem";


interface props extends React.HTMLAttributes<HTMLUListElement> {
    elements: Element,
    maxrecursion?: number
}

function getHtmlChildrenArray(el: Element) {
    let array = Array.prototype.slice.call(el.children)
    return array
}

// todo remove max recursion and make the tree read the actual website being built
const ElementTreeList = defineComponent<props>((props, context) => {

    const max_recursion = props.maxrecursion ?? 10
    if (max_recursion < 1) {
        return (<></>)
    }

    const [children, setChildren] = useState(new Array<Element>())

    useEffect(() => {
        setChildren(getHtmlChildrenArray(props.elements))
        const observer = new MutationObserver((mutations) => {
            setChildren(getHtmlChildrenArray(props.elements))
        })
        observer.observe(
            props.elements,
            {
                childList: true,
                attributes: false
            }
        )

        return () => {
            observer.disconnect()
        }
    }, [props.elements])

    return (
        <ul {...props}>
            {
                children.map((value, index) => {

                    return (
                        <ElementTreeItem el={value} key={index}>
                            <ElementTreeList elements={value} maxrecursion={max_recursion - 1}/>
                        </ElementTreeItem>
                    )
                })
            }
        </ul>
    )
})
export default ElementTreeList
