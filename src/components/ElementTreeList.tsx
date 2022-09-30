import {defineComponent} from "@/core";
import React, {CSSProperties, useEffect, useState} from "react";
import "@/assets/ElementTree.scss"
import ElementTreeItem from "@/components/ElementTreeItem";


interface props extends React.HTMLAttributes<HTMLUListElement> {
    elements: Element,
}

function getHtmlChildrenArray(el: Element) {
    let array = Array.prototype.slice.call(el.children)
    return array
}

const ElementTreeList = defineComponent<props>((props, context) => {


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
                            <ElementTreeList elements={value}/>
                        </ElementTreeItem>
                    )
                })
            }
        </ul>
    )
})
export default ElementTreeList
