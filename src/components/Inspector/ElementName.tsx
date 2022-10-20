import React, {useEffect, useRef} from "react";
import {defData, ItemsListAdapter} from "@/components/ItemsList";
import {defineComponent} from "@/core";
import {defineInspectorItem} from "@/inspector";

const ClasslistItem =
    defineComponent<{
        itemsetter: React.Dispatch<React.SetStateAction<string[]>>,
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
            props.itemsetter(prevState => {

                let classlist = [...prevState]
                classlist[props.itemindex] = e.target.value
                return classlist
            })
        }

        return <input type={"text"} ref={inputRef} onChange={update} className={"inspector-el-classlist-item"} placeholder={"empty"}/>
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
                            let classString = updatedItems.join(" ").trim()
                            if (classString.length>0){
                                props.currentElement.className=classString
                            }
                            else{
                                props.currentElement.removeAttribute("class")
                            }

                        }
                    })}
            />
        </div>
    )
})
