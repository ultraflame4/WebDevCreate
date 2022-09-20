import {defineComponent} from "@/tools";
import React, {useRef} from "react";

interface props extends React.HTMLAttributes<HTMLLIElement> {
    el: Element
}

export default defineComponent<props>((props, context) => {
    const itemRef = useRef<HTMLParagraphElement>(null)

    function toggleChildren() {
        itemRef.current?.classList.toggle("collapsed")
    }

    return (
        <li {...props} className={"element-tree-item"}>
            <p ref={itemRef}>
                <a onClick={toggleChildren}><span className={"material-symbols-outlined"}>arrow_drop_down</span></a>
                {props.el.id.length < 1 ? <i className={"unnamed"}>{props.el.tagName.toLowerCase()}</i>: props.el.id}
                <span className={"tagname"}>&lt;{props.el.tagName.toLowerCase()}&gt;</span>
            </p>
            {props.children}
        </li>
    )
})
