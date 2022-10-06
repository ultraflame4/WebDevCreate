import {defineComponent} from "@/core";
import React, {useRef} from "react";
import "@/assets/CollapsibleItem.scss"



const CollapsibleItem = defineComponent<{title:string}>((props, context) => {
    const itemRef = useRef<HTMLHeadingElement>(null)

    function toggleChildren(e:React.MouseEvent<any>) {
        if (!itemRef.current) return;
        console.log("test")
        itemRef.current.classList.toggle("collapsed")
    }

    return (
        <div >
            <h1 className={"collapsible-titlebar"} ref={itemRef}>
                {props.title}
                {
                    props.children ?
                        <a onClick={toggleChildren}>
                            <span className={"material-symbols-outlined"}>expand_more</span>
                        </a> :
                        <span style={{width: "12px"}}></span>
                }
            </h1>
            <div className={"collapsible-content"}>
                {props.children}
            </div>
        </div>
    )
})

export default CollapsibleItem
