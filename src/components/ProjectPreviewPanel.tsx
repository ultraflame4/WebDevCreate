import {defineComponent, WebDevCreateAppBuilderContext} from "@/core";
import {useContext, useEffect, useRef} from "react";
import "@/assets/ProjectPreview.scss"
import {ElementTreeCtx} from "@/components/ElementTree";

export default defineComponent((props, context) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const appCtx = useContext(WebDevCreateAppBuilderContext)

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
            if (iframeRef.current===null){
                console.error("Cannot get project preview panel iframe!")
                return
            }
            iframeRef.current.srcdoc=appCtx.projectDomTree.documentElement.outerHTML
        })

        observer.observe(
            appCtx.projectDomTree.documentElement,
            {
                childList: true,
                attributes: true,
                subtree:true
            }
        )

        return () => {
            observer.disconnect()
        }
    })
    return (
        <div className={"project-preview-panel"} ref={rootRef}>
            <iframe srcDoc={appCtx.projectDomTree.documentElement.outerHTML} ref={iframeRef}></iframe>
        </div>
    )
})
