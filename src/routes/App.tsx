import {defineComponent, IWebDevCreateAppCtx, ObservableValue, WebDevCreateAppCtx} from "@/core";
import "@/assets/App.scss"
import ElementTree from "@/components/ElementTree";
import ProjectPreviewPanel from "@/components/ProjectPreviewPanel";
import templateUrl from "@/assets/template.html?url"

import $ from "jquery"
import ElementComponentsList from "@/components/ElementComponents";
import htmlElements from "@/htmlElements.json";
import {SearchContext, TitleSearchBar} from "@/components/ContentSearch";


export default defineComponent((props, context) => {
    let templateString = $.ajax({
        type: "GET",
        url: templateUrl,
        async: false
    }).responseText

    const ctxObj: IWebDevCreateAppCtx = {
        projectDomTree: new DOMParser().parseFromString(templateString, "text/html"),
        elementComponentList: htmlElements,
        appVersion: APP_VERSION,
        // @ts-ignore
        previewDimensions:
            {
                width: new ObservableValue<number>(1920),
                height: new ObservableValue<number>(1080),
                auto: new ObservableValue<boolean>(true),
                scale: new ObservableValue<number>(1)
            }

    }


    return (
        <WebDevCreateAppCtx.Provider value={ctxObj}>
            <div id={"app"}>
                <header id={"app-header"}>
                    <h2>WebDevCreate</h2>
                </header>
                <div id={"sidebar"}>

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

                </div>
                <div id={"project-preview"}>
                    <ProjectPreviewPanel/>
                </div>

                <div id={"inspector"}>
                    <p className={"sidebar-title"}>Inspector</p>
                </div>
            </div>
        </WebDevCreateAppCtx.Provider>
    );
})
