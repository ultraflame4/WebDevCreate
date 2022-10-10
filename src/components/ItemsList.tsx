import {defineComponent, getRelativeCoords, getRelativePercentCoords, mouseInElements, ObservableValue} from "@/core";
import React, {HTMLAttributes, useContext, useEffect, useState} from "react";
import "@/assets/components/ItemsListAdapter.scss"

export interface ItemListAdapterData<T> {
    items: T[]
    itemCreator: () => T
    factory: (item: T, index: number, items: T[], setArray: React.Dispatch<React.SetStateAction<T[]>>) => React.ReactElement | string,
}

export function defData<T>(data: ItemListAdapterData<T>) {
    return data
}

interface ItemListAdapterProps extends HTMLAttributes<HTMLDivElement> {
    title: string,
    data: ItemListAdapterData<any>
}

const SelectedContext = React.createContext<{ selected: HTMLElement | null, dragging:  null|HTMLElement, dragOver: HTMLElement|null }>({
    selected: null,
    dragging: null,
    dragOver: null
})

const ItemsListAdapterItem = defineComponent((props, context) => {
    const ctx = useContext(SelectedContext)
    const itemRef = React.useRef<HTMLLIElement>(null)

    function selectItem(e: React.MouseEvent<HTMLLIElement>) {
        return;
        ctx.selected?.classList.remove("selected")
        if (ctx.selected === e.currentTarget) {
            ctx.selected = null
            return
        }
        ctx.selected = e.currentTarget
        e.currentTarget.classList.add("selected")
        console.log("dd")
    }

    function startDrag() {
        if (!itemRef.current) return;
        let element = itemRef.current;
        document.addEventListener("mousemove", mousemove)
        document.addEventListener("mouseup", ev => {
            // on drag finish
            document.removeEventListener("mousemove", mousemove)

            element.style.position="static"
            element.style.top="0"
            if(ctx.dragOver) {
                let topbottom = ctx.dragOver.getAttribute("data-drag-over")
                ctx.dragOver.insertAdjacentElement(topbottom==="top"?"beforebegin":"afterend", element)
            }
            element.classList.remove("dragging")
            ctx.dragOver?.removeAttribute("data-drag-over")
            ctx.dragOver=null

        }, {once: true})
        let box = element.parentElement!.getBoundingClientRect()
        let offset = box.top + element.getBoundingClientRect().height/2
        function mousemove(ev:MouseEvent) {

            element.style.position= "absolute"
            element.style.top = `${ev.clientY - offset}px`
            element.classList.add("dragging")
            let siblings = Array.from(element.parentElement!.children) as HTMLElement[]
            siblings = siblings.filter(el=>el!==element)
            let el = mouseInElements(ev.clientX, ev.clientY, siblings)

            if (el) {
                const {y} = getRelativePercentCoords(el, ev.clientX, ev.clientY)

                ctx.dragOver?.removeAttribute("data-drag-over")
                ctx.dragOver = el
                el.setAttribute("data-drag-over", y > 0.5 ? "bottom" : "top")
            }
            else{
                // ctx.dragOver?.classList.remove("drag-over")
                // ctx.dragOver = null
            }

        }
    }

    return <li onClick={selectItem} ref={itemRef}>
        <div>{props.children}</div>
        <span className="material-symbols-outlined" onMouseDown={startDrag}>drag_indicator</span>
    </li>
})

export const ItemsListAdapter = defineComponent<ItemListAdapterProps>((props, context) => {
    const [items, setItems] = useState(props.data.items);

    useEffect(() => {
        setItems(props.data.items)
    }, props.data.items)

    function addItem() {
        setItems([...items, props.data.itemCreator()])
    }


    return (
        <div {...props}>
            <div className={"component-itemslistadapter-titlebar"}>
                <p>{props.title}</p>
                <span className="material-symbols-outlined tools-item" title={"Add item to list"}
                      onClick={addItem}>add</span>
            </div>
            <ul className={"component-itemslistadapter"}>
                <SelectedContext.Provider value={{selected: null, dragging: null,dragOver:null}}>
                    {
                        items.map((value, index) => <ItemsListAdapterItem key={index}>{
                            props.data.factory(value, index, items, setItems)
                        }
                        </ItemsListAdapterItem>)}
                </SelectedContext.Provider>

            </ul>
        </div>
    );
})
