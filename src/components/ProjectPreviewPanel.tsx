import {defineComponent, WebDevCreateAppCtx} from "@/core";
import {useContext, useEffect, useRef, useState} from "react";
import "@/assets/ProjectPreview.scss"

export default defineComponent((props, context) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const scaleRef = useRef<HTMLSpanElement>(null);
    const appCtx = useContext(WebDevCreateAppCtx)

    if (!appCtx) {

        console.error("Error: WebDecCreate App builder context is null. Goddammit react!@#$")
        return (
            <div>
                ERROR CONTEXT NOT FOUND!
            </div>
        )
    }

    useEffect(() => {


        const observer = new MutationObserver((mutations) => {
            if (iframeRef.current === null) {
                console.error("Cannot get project preview panel iframe!")
                return
            }
            iframeRef.current.srcdoc = appCtx.projectDomTree.documentElement.outerHTML
        })

        observer.observe(
            appCtx.projectDomTree.documentElement,
            {
                childList: true,
                attributes: true,
                subtree: true
            }
        )


        const OnPreviewDimensionChange = () => {
            if (iframeRef.current === null) {
                console.error("Cannot get project preview panel iframe!")
                return
            }

            let dimensions = appCtx.previewDimensions

            if (scaleRef.current)
                scaleRef.current.textContent=dimensions.scale.value.toFixed(2)

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


        appCtx.previewDimensions.auto.subscribe(OnPreviewDimensionChange)
        appCtx.previewDimensions.scale.subscribe(OnPreviewDimensionChange)
        appCtx.previewDimensions.height.subscribe(OnPreviewDimensionChange)
        appCtx.previewDimensions.width.subscribe(OnPreviewDimensionChange)
        OnPreviewDimensionChange()
        return () => {
            observer.disconnect()
            appCtx.previewDimensions.auto.unsubscribe(OnPreviewDimensionChange)
            appCtx.previewDimensions.scale.unsubscribe(OnPreviewDimensionChange)
            appCtx.previewDimensions.width.unsubscribe(OnPreviewDimensionChange)
            appCtx.previewDimensions.height.unsubscribe(OnPreviewDimensionChange)
        }
    })

    function scalePanel(diff: number) {
        if (!appCtx)
            return
        let val = appCtx.previewDimensions.scale.value + diff
        if (val > 0)
            appCtx.previewDimensions.scale.value = val
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
        appCtx.previewDimensions.auto.value = !appCtx.previewDimensions.auto.value
    }

    const setWidth = (e:React.ChangeEvent<HTMLInputElement>) => {
        appCtx.previewDimensions.width.value =e.target.valueAsNumber;
    }

    const setHeight = (e:React.ChangeEvent<HTMLInputElement>) => {
        appCtx.previewDimensions.height.value =e.target.valueAsNumber;
    }


    return (
        <div className={"project-preview-panel"} ref={rootRef}>
            <div className={"topbar"}>
                <p className={"title"}>Preview Panel</p>

                <div className={"tools"}>

                    <span className={"dim-input"}>
                        width:
                        <input type="number" min="0" defaultValue={appCtx.previewDimensions.width.value} onChange={setWidth}/>
                    </span>
                    <br/>
                    <span className={"dim-input"}>
                        height:
                        <input type="number" min="0" defaultValue={appCtx.previewDimensions.height.value} onChange={setHeight}/>
                    </span>
                    <br/>
                    <br/>
                    <span
                        className={"material-symbols-outlined topbar-tools " + (appCtx.previewDimensions.auto.value ? "checked" : "")}
                        onClick={autoFit} ref={autofitRef} title={"Autofit - automatically fits the size and scale to use the space available"}>
                        fit_screen
                    </span>
                    <br/>
                    <span className="material-symbols-outlined topbar-tools" onClick={scaleUp} title={"Zooms in / Scales up"}>
                        add
                    </span>
                    <span ref={scaleRef} style={{width:38,textAlign:"center"}}>
                        {appCtx.previewDimensions.scale.value.toFixed(2)}
                    </span>
                    <span className="material-symbols-outlined topbar-tools" onClick={scaleDown} title={"Zooms out / Scale down"}>
                        remove
                    </span>

                </div>
            </div>
            <div className={"preview-ctn"}>
                <iframe srcDoc={appCtx.projectDomTree.documentElement.outerHTML} ref={iframeRef}></iframe>
            </div>
        </div>
    )
})
