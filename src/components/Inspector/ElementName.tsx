import React, {useEffect, useRef} from "react";
import {defineInspectorItem} from "@/components/Inspector";
import {defData, ItemsListAdapter} from "@/components/ItemsList";

export const ElementName = defineInspectorItem("Name & Classes", (props, context) => {
    const inRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!inRef.current) return;
        inRef.current.value = props.currentElement.id;
    })

    function changeName(e: React.ChangeEvent<HTMLInputElement>) {
        let text = e.target.value
        if (text.includes(" "))
            return

        props.currentElement.id = text;
    }


    return (
        <div className={"inspector-el-names"}>
            <h2>Name</h2>
            <input placeholder={"unnamed"} type={"text"} pattern={"[^\\s]*"} onChange={changeName} ref={inRef}/>
            <ItemsListAdapter
                className={"class-list"}
                title={"Classes"}
                data={defData<string>(
                    {
                        items: ["test","a","a","a","a"],
                        itemCreator: () => "d",
                        factory: (item, index) => item
                    })}
            />
        </div>
    )
})
