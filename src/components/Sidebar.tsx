import {defineComponent, ObservableValue, ProjectBuilderContext, useObservableValue} from "@/core";
import {SearchContext, TitleSearchBar} from "@/components/ContentSearch";
import ElementComponentsList from "@/components/ElementComponents";
import ElementTree from "@/components/ElementTree";
import React, {useContext, useEffect} from "react";

import "@/assets/App.scss"


export const Sidebar = defineComponent((props, context) => {
    const ctxObj = useContext(ProjectBuilderContext)

    const domTree = useObservableValue(ctxObj!.liveProjectDomTree)

    if (ctxObj == null) {
        console.error("WebDevCreateAppCtx context is null")
        return (<>Fatal error, could not get app context</>)
    }

    if (!domTree){
        console.error("Could not get dom tree")
        return (<>Fatal error, could not get dom tree</>)
    }

    return (
        <>
            <SearchContext.Provider value={{query: new ObservableValue("")}}>
                <TitleSearchBar className={"sidebar-title"} title={"Elements & Components"}/>

                <div id={"components-list"} className={"sidebar-section"}>
                    <ElementComponentsList elementComponents={ctxObj.elementComponentList}/>
                </div>

            </SearchContext.Provider>

            <p className={"sidebar-title"}>Html Tree</p>
            <div id={"sidebar-tree"} className={"sidebar-section"}>
                <ElementTree root_element={domTree.body}/>
            </div>

        </>
    )
})
