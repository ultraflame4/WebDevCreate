import {defineComponent, IProjectBuilderContext, ProjectBuilderContext, useObservableValue} from "@/core";
import React, {PropsWithChildren, useContext} from "react";

import "@/assets/components/Inspector.scss"
import CollapsibleItem from "@/components/CollapsibleItem";
import {ElementName} from "@/components/Inspector/ElementName";
import {ElementDimensions} from "@/components/Inspector/ElementDimensions";
import {ElementText} from "@/components/Inspector/ElementText";
import {ElementOptions} from "@/components/Inspector/ElementOptions";
import {InspectorItem} from "@/inspector";

const InspectorItems: InspectorItem[] = [
    ElementName,
    ElementDimensions,
    ElementText,
    ElementOptions
]

export const Inspector = defineComponent((props, context) => {
    const projectCtx = useContext(ProjectBuilderContext)
    const currentElement = useObservableValue(projectCtx?.currentSelectedElement)

    if (projectCtx === null) {
        return (
            <ul className={"inspector-items"}>Project Context is null!</ul>
        )
    }


    if (!currentElement) {
        return (
            <ul className={"inspector-items"}>No element selected</ul>
        )
    }

    return (
        <ul className={"inspector-items"}>
            {
                InspectorItems.map((value, index) => {

                    return (
                        <li key={index}>
                            <CollapsibleItem title={value.title}>
                                {React.createElement(value.component, {
                                    builderCtx: projectCtx,
                                    currentElement: currentElement
                                })}

                            </CollapsibleItem>
                        </li>
                    )
                })
            }

        </ul>
    )
})


