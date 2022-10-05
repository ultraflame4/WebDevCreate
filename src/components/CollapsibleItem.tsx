import {defineComponent} from "@/core";
import React, {useRef} from "react";
import "@/assets/CollapsibleItem.scss"



export default defineComponent<{title:string}>((props, context) => {
    const itemRef = useRef<HTMLHeadingElement>(null)

    function toggleChildren(e:React.MouseEvent<HTMLDivElement>) {
        if (!itemRef.current) return;
        console.log("test")
        itemRef.current.classList.toggle("collapsed")
    }

    return (
        <div >
            <h1 className={"collapsible-titlebar"} ref={itemRef} onClick={toggleChildren}>
                {props.title}
                {
                    props.children ?
                        <a >
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
