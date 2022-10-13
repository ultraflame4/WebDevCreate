import {IProjectBuilderContext} from "@/core";
import React, {PropsWithChildren} from "react";

export interface InspectorItemProps {
    currentElement: Element
    builderCtx: IProjectBuilderContext
}

export type InspectorItem = {
    title: string,
    component: React.FunctionComponent<PropsWithChildren<InspectorItemProps>>
}


export function defineInspectorItem(name: string, component: React.FunctionComponent<React.PropsWithChildren<InspectorItemProps>>) {
    return {
        title: name,
        component: component
    }
}
