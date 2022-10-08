import {defineComponent, IProjectBuilderContext, ObservableValue, useObservableValue} from "@/core";
import React, {HTMLAttributes, useContext, useEffect} from "react";
import "@/assets/components/TabMenu.scss"

/**
 * @property {ObservableValue<number>} opened_tab Represents the current tab index that is open \ active.
 * @property {ObservableValue<string[]>} tab_names The array of tab names
 */
export interface ITabMenuContext {
    opened_tab: ObservableValue<number>
    tab_names: ObservableValue<string[]>
}

export const TabMenuCtx = React.createContext<ITabMenuContext | null>(null)


const TabMenuBarItem = defineComponent<{ index: number, ctx: ITabMenuContext }>((props, context) => {
    const currentlySelectedItem = useObservableValue(props.ctx.opened_tab)

    function click() {
        props.ctx.opened_tab.value=props.index;
    }

    return (
        <li className={(currentlySelectedItem == props.index) ? "checked" : ""} onClick={click}>
            {props.children}
        </li>
    )
})

export const TabMenuBar = defineComponent<HTMLAttributes<HTMLDivElement>>((props, context) => {
    const tabMenuCtx = useContext(TabMenuCtx)
    const tabNames = useObservableValue(tabMenuCtx?.tab_names)

    if (!tabMenuCtx || !tabNames) {
        console.error("Error, there isn't a TabMenuCtx!")
        return (
            <div>No context provided</div>
        )
    }

    return (
        <div {...props}>
            <ul className={"tabmenu-bar"}>
                {tabNames.map((value, index) => {
                    return (
                        <TabMenuBarItem key={index} index={index} ctx={tabMenuCtx}>
                            {value}
                        </TabMenuBarItem>
                    )
                })}
            </ul>
        </div>
    )
})
