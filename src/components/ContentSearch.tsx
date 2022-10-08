import {defineComponent, ObservableValue} from "@/core";
import "@/assets/components/ContentSearch.scss"
import React, {useContext, useRef} from "react";

export interface ISearchContextObj {
    query: ObservableValue<string>
}

export const SearchContext = React.createContext<ISearchContextObj>({query: new ObservableValue("")})


interface props extends React.HTMLAttributes<HTMLParagraphElement> {
    title: string
}

/**
 * Adds a search bar,that expands, next to a title passed in as a slot
 */
export const TitleSearchBar = defineComponent<props>((props, context) => {
    const searchboxRef = useRef<HTMLInputElement>(null);
    const ctx = useContext(SearchContext)


    function toggleSearchbox() {
        searchboxRef?.current?.classList.toggle("opened")
    }

    function OnTextChange(e: React.ChangeEvent<HTMLInputElement>) {
        ctx.query.value = e.target.value
    }

    return (
        <div {...props} className={"title-searchbar " + props.className}>
            <p>{props.title}</p>
            <div className={"searchbar"}>
                <input className={"searchbar-input"} placeholder={"Search ..."} type={"search"}
                       ref={searchboxRef} onChange={OnTextChange}/>

                <span id={"icon-close"} className="material-symbols-outlined searchbar-icon"
                      onClick={toggleSearchbox}>close</span>
                <span id={"icon-search"} className="material-symbols-outlined searchbar-icon"
                      onClick={toggleSearchbox}>search</span>

            </div>
        </div>
    )
})
