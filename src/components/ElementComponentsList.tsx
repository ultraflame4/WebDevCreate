import {defineComponent, ElementComponent} from "@/core";
import "@/assets/ElementComponentsList.scss"

interface props{
    elementComponents:ElementComponent[]
}

export default defineComponent<props>((props, context) => {
    return (
        <ul className={"element-components-list"}>
            {
                props.elementComponents.map((value, index) => {
                    return (
                        <li key={index}>{value.name}</li>
                    )
                })
            }
        </ul>
    )
})
