import React from "react";


export function defineComponent<T>(component: React.FunctionComponent<React.PropsWithChildren<T>>): React.FunctionComponent<React.PropsWithChildren<T>> {
    return component
}


export interface IElementTreeCtxObj {
    currentlySelectedElement: Element|null
}

export const ElementTreeContext = React.createContext<IElementTreeCtxObj>({currentlySelectedElement:null})

/**
 * modified from https://gist.github.com/karlgroves/7544592
 * @param el
 */
export function getDomPath(el:Element) {
    let stack = [];
    while ( el.parentNode != null ) {
        // console.log(el.nodeName);
        let  sibCount = 0;
        let sibIndex = 0;
        for (let i = 0; i < el.parentNode.childNodes.length; i++ ) {
            let sib = el.parentNode.childNodes[i];
            if ( sib.nodeName == el.nodeName ) {
                if ( sib === el ) {
                    sibIndex = sibCount;
                }
                sibCount++;
            }
        }
        if ( el.hasAttribute('id') && el.id != '' ) {
            stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
        } else if ( sibCount > 1 ) {
            stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
        } else {
            stack.unshift(el.nodeName.toLowerCase());
        }
        // @ts-ignore
        el = el.parentNode;
    }
    return stack.slice(1); // removes the html element
}

export function getQuerySelector(el: Element) {
    return getDomPath(el).join(">")
}
