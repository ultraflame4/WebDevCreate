import {defineComponent} from "@/tools";
import "@/assets/App.scss"
import ElementTree from "@/components/ElementTree";

export default defineComponent((props, context) => {



    return (
        <div id={"app"}>
            <header id={"app-header"}>
                <h2>WebDevCreate</h2>
            </header>
            <div id={"sidebar"}>
                <ElementTree id={"sidebar-tree"} elements={document.body}/>
            </div>
        </div>
    )
})
