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
                <p>Elements List</p>
                <div id={"elements-list"}>

                </div>
                <p>Element Tree</p>
                <ElementTree id={"sidebar-tree"} root_element={document.body}/>
            </div>
        </div>
    )
})
