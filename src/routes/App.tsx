import {defineComponent, IProjectBuilderContext, ObservableValue, ProjectBuilderContext} from "@/core";
import "@/assets/App.scss"

import ProjectPreviewPanel from "@/components/ProjectPreviewPanel";
import templateUrl from "@/assets/template.html?url"

import $ from "jquery"
import htmlElements from "@/htmlElements.json";
import {Sidebar} from "@/components/Sidebar";
import {Inspector} from "@/components/Inspector";


export default defineComponent((props, context) => {
    let templateString = $.ajax({
        type: "GET",
        url: templateUrl,
        async: false
    }).responseText

    const ctxObj: IProjectBuilderContext = {
        // projectDomTree: new DOMParser().parseFromString(templateString, "text/html"),
        liveProjectDomTree: new ObservableValue<Document>(new DOMParser().parseFromString(templateString, "text/html")),
        elementComponentList: htmlElements,
        previewDimensions: {
            width: new ObservableValue<number>(1920),
            height: new ObservableValue<number>(1080),
            auto: new ObservableValue<boolean>(true),
            scale: new ObservableValue<number>(1)
        },
        currentSelectedElement: new ObservableValue<Element | null>(null)

    }


    return (
        <ProjectBuilderContext.Provider value={ctxObj}>
            <div id={"app"}>
                <header id={"app-header"}>
                    <h2>WebDevCreate</h2>
                </header>
                <div id={"sidebar"}>
                    <Sidebar/>
                </div>
                <div id={"project-preview"}>
                    <ProjectPreviewPanel/>
                </div>

                <div id={"inspector"}>
                    <p className={"sidebar-title"}>Inspector</p>
                    <Inspector/>
                </div>
            </div>

        </ProjectBuilderContext.Provider>
    );
})
