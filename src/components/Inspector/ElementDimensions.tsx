import {DropdownMenu} from "@/components/DropdownMenu";
import React from "react";
import {defineInspectorItem} from "@/inspector";

export const ElementDimensions = defineInspectorItem("Dimensions", (props, context) => {

    const positionTypes = [
        "static", "relative", "absolute", "sticky", "fixed"
    ]
    let currentElement = props.currentElement as HTMLElement

    let posStyle = currentElement.style.position.trim()
    let elementPosition = (posStyle.length < 1 ? "static" : posStyle)

    // @ts-ignore
    if (props.currentElement.style === undefined) {
        return <></>
    }

    function handlePositionTypeSelect(data: string) {
        currentElement.style.position = data

    }

    return (
        <div className={"inspector-el-dimensions"}>
            <h2>Position type</h2>
            <DropdownMenu onSelect={handlePositionTypeSelect} options={positionTypes}
                          defaultOption={positionTypes.indexOf(elementPosition)}/>

        </div>
    )
})
