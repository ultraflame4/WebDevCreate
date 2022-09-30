import {defineComponent, IWebDevCreateAppBuilderCtxObj, WebDevCreateAppBuilderContext} from "@/core";
import "@/assets/App.scss"
import ElementTree from "@/components/ElementTree";
import ProjectPreviewPanel from "@/components/ProjectPreviewPanel";
import templateUrl from "@/assets/template.html"

import $ from "jquery"
import ElementComponentsList from "@/components/ElementComponents";
import htmlElements from "@/htmlElements.json";


export default defineComponent((props, context) => {
    let templateString = $.ajax({
        type: "GET",
        url:templateUrl,
        async:false
    }).responseText

    const ctxObj:IWebDevCreateAppBuilderCtxObj = {
        projectDomTree: new DOMParser().parseFromString(templateString,"text/html"),
        elementComponentList:htmlElements
    }


    return (
        <WebDevCreateAppBuilderContext.Provider value={ctxObj}>
            <div id={"app"}>
                <header id={"app-header"}>
                    <h2>WebDevCreate</h2>
                </header>
                <div id={"sidebar"}>
                    <p>Elements & Components</p>
                    <div id={"components-list"}>
                        <ElementComponentsList elementComponents={ctxObj.elementComponentList}/>
                    </div>
                    <p>Html Tree</p>
                    <ElementTree id={"sidebar-tree"} root_element={ctxObj.projectDomTree.body}/>
                </div>
                <div id={"project-preview"}>
                    <ProjectPreviewPanel/>
                </div>
            </div>
        </WebDevCreateAppBuilderContext.Provider>
    );
})
