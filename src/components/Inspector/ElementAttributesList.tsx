import {defineInspectorItem} from "@/inspector";
import {ItemsListAdapter} from "@/components/ItemsList";
import {defineComponent} from "@/core";
import htmlAttributes from "@/htmlAttributes.json";
import React, {useEffect, useRef} from "react";

interface attributeItem {
    name: string,
    value: string | undefined
}


interface itemProps {
    index: number;
    itemsSetter: React.Dispatch<React.SetStateAction<attributeItem[]>>;
    itemsArray: attributeItem[]
}


const ElementAttributeItemValue = defineComponent<{ attrName:string,onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void }>((props, context) => {

    return (
        <>
            <input type={"text"} placeholder={"Value"} onChange={props.onChange}/>
        </>
    )
})


const ElementAttributeItem = defineComponent<itemProps>((props, context) => {
    const currentAttrName =  useRef("")

    function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.itemsSetter(prevState => {
            let a = [...prevState]
            a[props.index].name = e.target.value;
            return a
        })
    }
    function onValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.itemsSetter(prevState => {
            let a = [...prevState]
            a[props.index].value = e.target.value;
            return a
        })
    }

    return (
        <div className={"inspector-el-attributes-item"}>
            <input type={"text"} placeholder={"Name"} list={"html-attributes-datalist"} onChange={onNameChange}/>
            <ElementAttributeItemValue attrName={currentAttrName.current} onChange={onValueChange}/>
        </div>
    )
})

export const ElementAttributesList = defineInspectorItem("Attributes", (props, context) => {
    return (
        <>
            <ItemsListAdapter
                itemsMovable={true}
                title={"Current Attributes"}
                data={{
                    factory(item, index, items, setItems): React.ReactElement | string {
                        return <ElementAttributeItem itemsArray={items} itemsSetter={setItems} index={index}
                                                     key={index}/>
                    },
                    itemCreator():attributeItem {
                        return {name: "", value: ""}
                    },
                    items: [],
                    itemsUpdate(updatedItems): void {
                        updatedItems.forEach(item => {
                            //todo get element attributs on load
                            try{
                                props.currentElement.setAttribute(item.name,item.value)
                            }
                            catch (e){

                            }
                        })
                    }
                }}/>
            <datalist id={"html-attributes-datalist"}>
                {
                    Object.entries(htmlAttributes).map((value, index) => {
                            const [key, val] = value;
                            if (!val.elements.includes(props.currentElement.tagName.toLowerCase()) && !val.elements.includes("*")) {
                                console.log("hey", val.elements, value)
                                return <></>
                            }
                            return <option value={key} key={index}/>

                        }
                    )
                }
            </datalist>
        </>
    )
})
