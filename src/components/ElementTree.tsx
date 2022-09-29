import {defineComponent} from "@/core";

import React, {useEffect} from "react";
import ElementTreeList from "@/components/ElementTreeList";
import ElementTreeItem from "@/components/ElementTreeItem";


interface props extends React.HTMLAttributes<HTMLDivElement> {
    root_element: Element,
}


export interface IElementTreeCtxObj {
    focusedElement: Element | null,
    dragFocusElement: Element | null
}

function CreateElementTreeCtxObj(): IElementTreeCtxObj {
    return {
        dragFocusElement: null,
        focusedElement: null
    }
}

export const ElementTreeCtx = React.createContext<IElementTreeCtxObj>(CreateElementTreeCtxObj())

export default defineComponent<props>((props, context) => {

    return (
        <div {...props}>
            <ElementTreeCtx.Provider value={CreateElementTreeCtxObj()}>

                <ul className={"element-tree"}>
                    <ElementTreeItem el={props.root_element}>
                        <ElementTreeList elements={props.root_element}/>
                    </ElementTreeItem>
                </ul>

            </ElementTreeCtx.Provider>
        </div>
    )
})
