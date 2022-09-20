

export function defineComponent<T>(component: React.FunctionComponent<React.PropsWithChildren<T>>): React.FunctionComponent<React.PropsWithChildren<T>> {
    return component
}
