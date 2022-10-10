import React, {useEffect, useRef} from "react";
import {defineInspectorItem} from "@/components/Inspector";
import {defData, ItemsListAdapter} from "@/components/ItemsList";
import {defineComponent} from "@/core";

const ClasslistItem =
    defineComponent<{
        itemsetter: (newArray:string[])=>void,
        itemval: string,
        itemindex: number,
        itemarray:string[]
    }>

    ((props) => {
        const inputRef = useRef<HTMLInputElement>(null)
        useEffect(() => {
            if (inputRef.current) {
                inputRef.current.value = props.itemval
            }
        }, [props.itemval])

        function update(e:React.ChangeEvent<HTMLInputElement>) {
            let a = props.itemarray
            a[props.itemindex] = e.target.value
            props.itemsetter(a)
        }

        return <input type={"text"} ref={inputRef} onChange={update}/>
    })

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
                itemsMovable={true}
                data={defData<string>(
                    {
                        items: Array.from(props.currentElement.classList),
                        itemCreator: () => "",
                        factory: (item, index, array, setItems) => {


                            return <ClasslistItem itemsetter={setItems} itemval={item} itemindex={index} itemarray={array}/>
                        },
                        itemsUpdate(updatedItems: string[]): void {
                            props.currentElement.className = updatedItems.join(" ");

                        }
                    })}
            />
        </div>
    )
})
