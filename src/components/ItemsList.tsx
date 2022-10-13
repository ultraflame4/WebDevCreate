import {defineComponent, getRelativeCoords, getRelativePercentCoords, mouseInElements, ObservableValue} from "@/core";
import React, {HTMLAttributes, useContext, useEffect, useRef, useState} from "react";
import "@/assets/components/ItemsListAdapter.scss"
import ScrollEvent = JQuery.ScrollEvent;
import {now} from "jquery";

export interface ItemListAdapterData<T> {
    items: T[]
    itemCreator: () => T
    factory: (item: T, index: number, items: T[], setItems: React.Dispatch<React.SetStateAction<string[]>>) => React.ReactElement | string,
    itemsUpdate: (updatedItems:T[])=>void

}

export function defData<T>(data: ItemListAdapterData<T>) {
    return data
}

interface ItemListAdapterProps extends HTMLAttributes<HTMLDivElement> {
    title: string,
    data: ItemListAdapterData<any>
    itemsMovable?: boolean,
}

const SelectedContext = React.createContext<{ dragging: null | HTMLElement, dragOver: HTMLElement | null }>({
    dragging: null,
    dragOver: null
})

const ItemsListAdapterItem = defineComponent<{
    item_move: (item: HTMLElement, fromIndex: number, toIndex: number) => void,
    items_movable: boolean
}>((props, context) => {
    const ctx = useContext(SelectedContext)
    const itemRef = React.useRef<HTMLLIElement>(null)

    function startDrag() {
        if (!itemRef.current) return;
        let element = itemRef.current;
        let elementIndex = Array.from(element.parentElement!.children).indexOf(element)
        document.addEventListener("mousemove", mousemove)
        document.addEventListener("mouseup", ev => {
            // on drag finish
            document.removeEventListener("mousemove", mousemove)
            element.removeAttribute("style")

            if (ctx.dragOver) {
                let topbottom = ctx.dragOver.getAttribute("data-drag-over")
                let dragOverIndex = Array.from(ctx.dragOver.parentElement!.children).indexOf(ctx.dragOver)

                let EndIndex = topbottom === "top" ? dragOverIndex : dragOverIndex + 1;

                // update items array in parent element
                props.item_move(element, elementIndex, EndIndex)

            }
            element.classList.remove("dragging")
            ctx.dragOver?.removeAttribute("data-drag-over")
            ctx.dragOver = null


        }, {once: true})


        function mousemove(ev: MouseEvent) {
            let box = element.parentElement!.getBoundingClientRect()
            let offset = box.top + element.getBoundingClientRect().height / 2


            element.style.position = "absolute"
            element.style.top = `${ev.clientY - offset}px`
            element.classList.add("dragging")
            let siblings = Array.from(element.parentElement!.children) as HTMLElement[]
            siblings = siblings.filter(el => el !== element)
            let el = mouseInElements(ev.clientX, ev.clientY, siblings)

            if (el) {
                const {y} = getRelativePercentCoords(el, ev.clientX, ev.clientY)

                ctx.dragOver?.removeAttribute("data-drag-over")
                ctx.dragOver = el

                el.setAttribute("data-drag-over", y > 0.5 ? "bottom" : "top")
            } else {
                // ctx.dragOver?.classList.remove("drag-over")
                // ctx.dragOver = null
            }

        }
    }

    return <li ref={itemRef}>
        <div>{props.children}</div>
        {props.items_movable ? <span className="material-symbols-outlined" onMouseDown={startDrag}>drag_indicator</span>:""}
    </li>
})

export const ItemsListAdapter = defineComponent<ItemListAdapterProps>((props, context) => {
    const [items, setItems] = useState(props.data.items);
    let itemsMovable = props.itemsMovable ?? false

    useEffect(() => {
        setItems(props.data.items)
    }, [props.data.items])

    useEffect(() => {
        props.data.itemsUpdate(items)
    }, [items])

    function addItem() {
        setItems(prevState => {
            return [...prevState, props.data.itemCreator()]
        })
    }
    function removeItem() {
        setItems(prevState => {
            let newArray = [...prevState]
            newArray.pop()
            return newArray
        })
    }

    function moveItem(item_: HTMLElement, fromIndex: number, toIndex: number) {
        setItems(prevState => {
            let newItems = [...prevState]
            let item = newItems[fromIndex]

            if (newItems.length <= toIndex) {
                newItems.push(item)
            } else {
                newItems.splice(toIndex, 0, item)
            }

            if (toIndex < fromIndex) {
                newItems.splice(fromIndex + 1, 1)
            } else {
                newItems.splice(fromIndex, 1)
            }

            return newItems;
        })
    }

    return (
        <div {...props}>
            <div className={"component-itemslistadapter-titlebar"}>
                <p>{props.title}</p>
                <span className="material-symbols-outlined tools-item" title={"Add item to list"}
                      onClick={removeItem}>remove</span>

                <span className="material-symbols-outlined tools-item" title={"Add item to list"}
                      onClick={addItem}>add</span>

            </div>
            <div>
                <ul className={"component-itemslistadapter"}>
                    <SelectedContext.Provider value={{dragging: null, dragOver: null}}>
                        {
                            items.map((value, index, array) => {

                                return (
                                    <ItemsListAdapterItem key={index} item_move={moveItem} items_movable={itemsMovable}>
                                        {
                                            props.data.factory(value, index, array, setItems)
                                        }
                                    </ItemsListAdapterItem>
                                )
                            })
                        }
                    </SelectedContext.Provider>

                </ul>
            </div>
        </div>
    );
})
