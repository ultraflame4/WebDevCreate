import {defineComponent, ElementTreeContext} from "@/tools";

import React from "react";
import ElementTreeList from "@/components/ElementTreeList";

interface props extends React.HTMLAttributes<HTMLDivElement> {
    elements: Element,
}

export default defineComponent<props>((props, context) => {

    return (
        <div {...props}>
            <ElementTreeContext.Provider value={{currentlySelectedElement:null}}>
                <ElementTreeList elements={props.elements} className={"element-tree"}/>
            </ElementTreeContext.Provider>
        </div>
    )
})
