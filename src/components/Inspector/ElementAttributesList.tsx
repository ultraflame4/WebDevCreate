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
    itemsArray: attributeItem[],
    item: attributeItem
}

interface compAttrItemProps {
    attrName: string,
    attrInitialValue: string | undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const ElementAttributeItemValue = defineComponent<compAttrItemProps>((props, context) => {
    const inputRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.value = props.attrInitialValue ?? ""
        }
    }, [props.attrInitialValue])

    return (
        <>
            <input type={"text"} placeholder={"Value"} onChange={props.onChange} ref={inputRef}/>
        </>
    )
})


const ElementAttributeItem = defineComponent<itemProps>((props, context) => {
    const currentAttrName = useRef(props.item.name)
    const inputRef = useRef<HTMLInputElement>(null)

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

    useEffect(() => {
        if (inputRef.current) {

            currentAttrName.current = props.item.name
            inputRef.current.value = currentAttrName.current;
        }
    }, [props.item])

    return (
        <div className={"inspector-el-attributes-item"}>
            <input type={"text"} placeholder={"Name"} list={"html-attributes-datalist"} onChange={onNameChange}
                   ref={inputRef}/>
            <ElementAttributeItemValue attrName={currentAttrName.current} attrInitialValue={props.item.value} onChange={onValueChange}/>
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
                                                     key={index} item={item}/>
                    },
                    itemCreator(): attributeItem {
                        return {name: "", value: ""}
                    },
                    items: Array.from(props.currentElement.attributes).map((item, index) => {
                        return {name: item.name, value: item.value}
                    }),
                    itemsUpdate(updatedItems:attributeItem[]): void {
                        console.log("---")

                        for (let i=0; i < props.currentElement.attributes.length; i++) {
                            let name = props.currentElement.attributes[0].name.toLowerCase().trim()
                            if (updatedItems.find(item => item.name.toLowerCase().trim() === name) === undefined) {
                                props.currentElement.removeAttribute(name);
                            }
                        }

                        updatedItems.forEach(item => {
                            try{
                                props.currentElement.setAttribute(item.name,item.value??"")
                            }
                            catch (e) {}
                        })
                    }
                }}/>
            <datalist id={"html-attributes-datalist"}>
                {
                    Object.entries(htmlAttributes).map((value, index) => {
                            const [key, val] = value;
                            if (!val.elements.includes(props.currentElement.tagName.toLowerCase()) && !val.elements.includes("*")) {
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
