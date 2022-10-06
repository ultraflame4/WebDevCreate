import {defineComponent, ProjectBuilderContext} from "@/core";
import {useContext, useEffect, useRef, useState} from "react";
import "@/assets/ProjectPreview.scss"

export default defineComponent((props, context) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const scaleRef = useRef<HTMLSpanElement>(null);
    const builderCtx = useContext(ProjectBuilderContext)

    if (!builderCtx) {

        console.error("Error: Project Builder context is null. Goddammit react!@#$")
        return (
            <div>
                ERROR CONTEXT NOT FOUND!
            </div>
        )
    }

    useEffect(() => {
        if (iframeRef.current === null) {
            console.error("Cannot get project preview panel iframe!")
            return
        }
        if (!iframeRef.current.contentWindow){
            console.error("Cannot get project preview panel iframe content window!")
            return
        }

        let contentWindow = iframeRef.current.contentWindow
        contentWindow.document.documentElement.innerHTML = builderCtx.liveProjectDomTree.value.documentElement.outerHTML
        builderCtx.liveProjectDomTree.value = contentWindow.document


        const OnPreviewDimensionChange = () => {
            if (iframeRef.current === null) {
                console.error("Cannot get project preview panel iframe!")
                return
            }

            let dimensions = builderCtx.previewDimensions

            if (scaleRef.current)
                scaleRef.current.textContent = dimensions.scale.value.toFixed(2)

            if (dimensions.auto.value) {
                iframeRef.current.style.width = "100%"
                iframeRef.current.style.height = "100%"
                iframeRef.current.style.transform = ""
                return
            }
            console.log("test")
            iframeRef.current.style.transform = "scale(" + (dimensions.scale.value) + ")"
            iframeRef.current.style.width = dimensions.width.value + "px"
            iframeRef.current.style.height = dimensions.height.value + "px"
        }


        builderCtx.previewDimensions.auto.subscribe(OnPreviewDimensionChange)
        builderCtx.previewDimensions.scale.subscribe(OnPreviewDimensionChange)
        builderCtx.previewDimensions.height.subscribe(OnPreviewDimensionChange)
        builderCtx.previewDimensions.width.subscribe(OnPreviewDimensionChange)
        OnPreviewDimensionChange()
        return () => {
            // observer.disconnect()
            builderCtx.previewDimensions.auto.unsubscribe(OnPreviewDimensionChange)
            builderCtx.previewDimensions.scale.unsubscribe(OnPreviewDimensionChange)
            builderCtx.previewDimensions.width.unsubscribe(OnPreviewDimensionChange)
            builderCtx.previewDimensions.height.unsubscribe(OnPreviewDimensionChange)
        }
    })

    function scalePanel(diff: number) {
        if (!builderCtx)
            return
        let val = builderCtx.previewDimensions.scale.value + diff
        if (val > 0)
            builderCtx.previewDimensions.scale.value = val
    }

    function scaleDown() {
        scalePanel(-0.01)
    }

    function scaleUp() {
        scalePanel(0.01)
    }

    const autofitRef = useRef<HTMLSpanElement>(null)

    const autoFit = () => {
        if (!autofitRef.current)
            return
        autofitRef.current.classList.toggle("checked")
        builderCtx.previewDimensions.auto.value = !builderCtx.previewDimensions.auto.value
    }

    const setWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
        builderCtx.previewDimensions.width.value = e.target.valueAsNumber;
    }

    const setHeight = (e: React.ChangeEvent<HTMLInputElement>) => {
        builderCtx.previewDimensions.height.value = e.target.valueAsNumber;
    }


    return (
        <div className={"project-preview-panel"} ref={rootRef}>
            <div className={"topbar"}>
                <p className={"title"}>Preview Panel</p>

                <div className={"tools"}>

                    <span className={"dim-input"}>
                        width:
                        <input type="number" min="0" defaultValue={builderCtx.previewDimensions.width.value}
                               onChange={setWidth}/>
                    </span>
                    <br/>
                    <span className={"dim-input"}>
                        height:
                        <input type="number" min="0" defaultValue={builderCtx.previewDimensions.height.value}
                               onChange={setHeight}/>
                    </span>
                    <br/>
                    <br/>
                    <span
                        className={"material-symbols-outlined topbar-tools " + (builderCtx.previewDimensions.auto.value ? "checked" : "")}
                        onClick={autoFit} ref={autofitRef}
                        title={"Autofit - automatically fits the size and scale to use the space available"}>
                        fit_screen
                    </span>
                    <br/>
                    <span className="material-symbols-outlined topbar-tools" onClick={scaleUp}
                          title={"Zooms in / Scales up"}>
                        add
                    </span>
                    <span ref={scaleRef} style={{width: 38, textAlign: "center"}}>
                        {builderCtx.previewDimensions.scale.value.toFixed(2)}
                    </span>
                    <span className="material-symbols-outlined topbar-tools" onClick={scaleDown}
                          title={"Zooms out / Scale down"}>
                        remove
                    </span>

                </div>
            </div>
            <div className={"preview-ctn"}>
                <iframe ref={iframeRef}></iframe>
            </div>
        </div>
    )
})
