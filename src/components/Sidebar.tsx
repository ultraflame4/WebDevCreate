import {defineComponent, ObservableValue, ProjectBuilderContext} from "@/core";
import {SearchContext, TitleSearchBar} from "@/components/ContentSearch";
import ElementComponentsList from "@/components/ElementComponents";
import ElementTree from "@/components/ElementTree";
import {useContext} from "react";

import "@/assets/App.scss"


export const Sidebar = defineComponent((props, context) => {
    const ctxObj = useContext(ProjectBuilderContext)
    if (ctxObj == null) {
        console.error("WebDevCreateAppCtx context is null")
        return (<>Fatal error, could not get app context</>)
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
                <ElementTree root_element={ctxObj.projectDomTree.body}/>
            </div>

        </>
    )
})
