import {ContextMenu, defineComponent, IContextMenu_MenuObj, mouseInElements} from "@/core";
import {useContext, useEffect, useRef, useState} from "react";
import "@/assets/components/AppContextMenu.scss"

const AppContextMenuItem = defineComponent<{ itemData: IContextMenu_MenuObj }>((props, context) => {
    return (
        <li className={"app-context-menu-item"}>
            {props.itemData.name}

            {/*Children here*/}
            {
                props.itemData.children ?
                    <ul className={"app-context-submenu"}>
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


    return (
        <div
            className={"app-context-menu"}
            style={{
                top: location.y + "px",
                left: location.x + "px",
            }}
            ref={ctxMenuRef}>
            <ul>
                {
                    menuData.map((value, index) => {
                        return (
                            <AppContextMenuItem key={index} itemData={value}/>
                        )
                    })
                }
            </ul>
        </div>
    )
})
