import {defineComponent, ElementComponent} from "@/core";
import "@/assets/ElementComponents.scss"

interface itemProps{
    name: string,
    desc: string,
    tagName: string
}

const ElementComponentItem = defineComponent<itemProps>((props, context) => {
    return (
        <li className={"el-comp-item"} draggable={true}>
            <p>
                {props.name}
            </p>
        </li>
    )
})

interface listProps{
    elementComponents:ElementComponent[]
}

export default defineComponent<listProps>((props, context) => {
    return (
        <ul className={"el-comp-list"}>
            {
                props.elementComponents.map((value, index) => {
                    return (
                        <ElementComponentItem
                            key={index}
                            name={value.name}
                            desc={value.description??""}
                            tagName={value.htmlTagName}
                        />
                    )
                })
            }
        </ul>
    )
})
