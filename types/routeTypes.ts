export interface Route {
    name: string,
    path: string,
    icon: VNode,
    class?: string,
    callback?: () => any,
}

export interface SideBarLogo {
    link: string,
    name: string,
}