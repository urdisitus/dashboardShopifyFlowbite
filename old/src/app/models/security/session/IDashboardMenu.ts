interface IDashboardMenu {
    id: string;
    code: string;
    name: string;
    icon?: string;
    idParent?: string;
    childrens?: IDashboardMenu[],
    route?: string;    
    active? : boolean;
    dropdown? : boolean;
    liClass? : string;
    aClass? : string;
}