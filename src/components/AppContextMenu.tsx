import {ContextMenu, defineComponent, IContextMenu_MenuObj, mouseInElements} from "@/core";
import React, {useContext, useEffect, useRef, useState} from "react";
import "@/assets/components/AppContextMenu.scss"
const CtxMenuInstanceData = React.createContext<{expandLeft:boolean}>({expandLeft:true})

const AppContextMenuItem = defineComponent<{ itemData: IContextMenu_MenuObj }>((props, context) => {
    const ctx = useContext(CtxMenuInstanceData)

    let hasChild = false;
    if (props.itemData.children) {
        hasChild = props.itemData.children.length>0
    }

    return (
        <li className={"app-context-menu-item"} data-haschild={hasChild} onClick={event => props.itemData.callback?.()}>
            {props.itemData.name}
            {props.itemData.element}

            {/*Children here*/}
            {
                props.itemData.children ?
                    <ul className={"app-context-submenu"} data-expandleft={ctx.expandLeft} >
                        {
                            props.itemData.children.map(
                                (value, index) => <AppContextMenuItem itemData={value}/>)
                        }
                    </ul>
                    :
                    ""
            }
        </li>
    )
})



export const AppContextMenu = defineComponent((props, context) => {
    const mouseX = useRef(0)
    const mouseY = useRef(0)
    const [location, setLocation] = useState({x: 0, y: 0})

    const ctxMenuRef = useRef<HTMLDivElement>(null)
    const ctxMenu = useContext(ContextMenu)
    const [menuData, setMenuData] = useState<IContextMenu_MenuObj[]>([])

    useEffect(() => {
        ctxMenu.onOpenMenu = (e, menu_data) => {
            if (!ctxMenuRef.current) {
                return
            }
            ctxMenuRef.current.classList.remove("hidden")

            setLocation({x: e.clientX, y: e.clientY})
            setMenuData(menu_data)
        }
    }, [ctxMenu])


    useEffect(() => {

        function mouseMove(e: MouseEvent) {
            mouseX.current = e.clientX
            mouseY.current = e.clientY
        }

        function mouseClick(e: MouseEvent) {
            if (!ctxMenuRef.current) {
                return
            }
            let results = mouseInElements(mouseX.current, mouseY.current, [ctxMenuRef.current])
            if (!results) {
                setMenuData([])
                ctxMenuRef.current.classList.add("hidden")
            }
        }

        document.addEventListener("mousemove", mouseMove)
        document.addEventListener("click", mouseClick)
        document.addEventListener("contextmenu", mouseClick)
        return () => {
            document.removeEventListener("mousemove", mouseMove)
            document.removeEventListener("click", mouseClick)
            document.removeEventListener("contextmenu", mouseClick)
        }
    })

    const ctxMenuWidth = 160
    const ctxMenuPosition = {
        left: (location.x+ctxMenuWidth) > window.innerWidth ? window.innerWidth-ctxMenuWidth : location.x,
    }


    return (
        <div
            className={"app-context-menu"}
            style={{
                top: location.y + "px",
                left: ctxMenuPosition.left + "px",
            }}
            ref={ctxMenuRef}>
            <CtxMenuInstanceData.Provider value={{expandLeft: !((location.x+ctxMenuWidth * 2) > window.innerWidth)}}>
                <ul>
                    {
                        menuData.map((value, index) => {
                            return (
                                <AppContextMenuItem key={index} itemData={value}/>
                            )
                        })
                    }
                </ul>
            </CtxMenuInstanceData.Provider>

        </div>
    )
})
