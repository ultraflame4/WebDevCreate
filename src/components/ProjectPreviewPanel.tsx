import {defineComponent, WebDevCreateAppCtx} from "@/core";
import {useContext, useEffect, useRef} from "react";
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

            let dimensions = appCtx.previewDimensions.value

            if (scaleRef.current)
                scaleRef.current.textContent=dimensions.scale.value.toFixed(2)

            if (dimensions.auto) {
                iframeRef.current.style.width = "100%"
                iframeRef.current.style.height = "100%"
                iframeRef.current.style.transform = ""
                return
            }

            iframeRef.current.style.transform = "scale(" + (dimensions.scale.value) + ")"
            iframeRef.current.style.width = dimensions.width + "px"
            iframeRef.current.style.height = dimensions.height + "px"
        }
        appCtx.previewDimensions.subscribe(OnPreviewDimensionChange)
        appCtx.previewDimensions.value.scale.subscribe(OnPreviewDimensionChange)
        OnPreviewDimensionChange()
        return () => {
            observer.disconnect()
            appCtx.previewDimensions.unsubscribe(OnPreviewDimensionChange)
            appCtx.previewDimensions.value.scale.unsubscribe(OnPreviewDimensionChange)
        }
    })

    function scalePanel(diff: number) {
        if (!appCtx)
            return
        let val = appCtx.previewDimensions.value.scale.value + diff
        if (val > 0)
            appCtx.previewDimensions.value.scale.value = val
    }

    function scaleDown() {
        scalePanel(-0.01)
    }

    function scaleUp() {
        scalePanel(0.01)
    }

    const autofitRef = useRef<HTMLSpanElement>(null)

    function autoFit() {
        if (!appCtx || !autofitRef.current)
            return
        let dimCopy = appCtx.previewDimensions.value
        dimCopy.auto = !dimCopy.auto
        autofitRef.current.classList.toggle("checked")
        appCtx.previewDimensions.value = dimCopy
    }

    function setWidth(e:React.ChangeEvent<HTMLInputElement>) {
        if (!appCtx)
            return
        let dimCopy = appCtx.previewDimensions.value
        dimCopy.width = e.target.valueAsNumber;
        appCtx.previewDimensions.value = dimCopy
    }
    function setHeight(e:React.ChangeEvent<HTMLInputElement>) {
        if (!appCtx)
            return
        let dimCopy = appCtx.previewDimensions.value
        dimCopy.height = e.target.valueAsNumber;
        appCtx.previewDimensions.value = dimCopy
    }

    return (
        <div className={"project-preview-panel"} ref={rootRef}>
            <div className={"topbar"}>
                <p className={"title"}>Preview Panel</p>

                <div className={"tools"}>

                    <span className={"dim-input"}>
                        width:
                        <input type="number" min="0" defaultValue={appCtx.previewDimensions.value.width} onChange={setWidth}/>
                    </span>
                    <br/>
                    <span className={"dim-input"}>
                        height:
                        <input type="number" min="0" defaultValue={appCtx.previewDimensions.value.height} onChange={setHeight}/>
                    </span>
                    <br/>
                    <br/>
                    <span
                        className={"material-symbols-outlined topbar-tools " + (appCtx.previewDimensions.value.auto ? "checked" : "")}
                        onClick={autoFit} ref={autofitRef}>
                        fit_screen
                    </span>
                    <br/>
                    <span className="material-symbols-outlined topbar-tools" onClick={scaleUp}>
                        add
                    </span>
                    <span ref={scaleRef} style={{width:38,textAlign:"center"}}>
                        {appCtx.previewDimensions.value.scale.value.toFixed(2)}
                    </span>
                    <span className="material-symbols-outlined topbar-tools" onClick={scaleDown}>
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
