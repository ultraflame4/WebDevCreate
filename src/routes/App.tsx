import {defineComponent, IWebDevCreateAppBuilderCtxObj, WebDevCreateAppBuilderContext} from "@/tools";
import "@/assets/App.scss"
import ElementTree from "@/components/ElementTree";
import ProjectPreviewPanel from "@/components/ProjectPreviewPanel";
import templateUrl from "@/assets/template.html"

import $ from "jquery"

export default defineComponent((props, context) => {
    let templateString = $.ajax({
        type: "GET",
        url:templateUrl,
        async:false
    }).responseText

    const ctxObj:IWebDevCreateAppBuilderCtxObj = {
        projectDomTree: new DOMParser().parseFromString(templateString,"text/html")
    }

    return (
        <WebDevCreateAppBuilderContext.Provider value={ctxObj}>
            <div id={"app"}>
                <header id={"app-header"}>
                    <h2>WebDevCreate</h2>
                </header>
                <div id={"sidebar"}>
                    <p>Elements List</p>
                    <div id={"elements-list"}>

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
