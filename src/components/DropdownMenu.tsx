import {defineComponent} from "@/core";
import "@/assets/components/DropdownMenu.scss"
import React, {useEffect, useRef, useState} from "react";

interface DropdownMenuProps {
    options: string[];
    defaultOption: number
    onSelect: (data: string) => void
}

type DropdownMenuItemProps =
    {
        current: number,

        thisIndex: number,
        callback: (index: number) => void
    }

const DropdownMenuItem = defineComponent<DropdownMenuItemProps>((props, context) => {
    return (
        <li className={(props.current == props.thisIndex) ? "selected" : ""}
            onClick={event => props.callback(props.thisIndex)}>
            {props.children}
        </li>
    )
})

/**
 * Props:
 * - options : A string array, represents the various options in the dropdown menu.
 * - onSelect: The callback to call when user selects an option in the dropdown menu
 * - defaultOption: The default initial option before the user has selected anything. In the form of an index of the options array.
 */
export const DropdownMenu = defineComponent<DropdownMenuProps>((props, context) => {

    const [current,setCurrent] = useState<number>(props.defaultOption)

    useEffect(() => {
        if (current != props.defaultOption) {
            setCurrent(props.defaultOption)
        }
    })

    function openMenu(ev: React.MouseEvent<HTMLDivElement>) {
        ev.currentTarget.classList.toggle("checked")
    }

    function selectItem(index: number) {
        props.onSelect(props.options[index])
        setCurrent(index)
    }

    return (
        <div>
            <div className={"dropdown-input"} onClick={openMenu}>
                {props.options[current]}
                <span className="material-symbols-outlined">expand_more</span>
            </div>
            <ul className={"dropdown-menu"}>
                {props.options.map((value, index) => {
                    return (
                        <DropdownMenuItem key={index} current={current} thisIndex={index} callback={selectItem}>
                            {value}
                        </DropdownMenuItem>
                    )
                })}
            </ul>
        </div>
    )
})
