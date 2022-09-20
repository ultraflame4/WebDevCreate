import React from "react";


export function defineComponent<T>(component: React.FunctionComponent<React.PropsWithChildren<T>>): React.FunctionComponent<React.PropsWithChildren<T>> {
    return component
}


export interface IElementTreeCtxObj {
    currentlySelectedElement: Element|null
}

export const ElementTreeContext = React.createContext<IElementTreeCtxObj>({currentlySelectedElement:null})

