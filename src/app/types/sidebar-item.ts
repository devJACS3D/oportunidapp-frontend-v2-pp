
export interface SidebarItem
{
    id?: string;
    title: string;
    type: 'item' | 'group';
    icon?: string;
    url?: string;
    exactMatch?: boolean;
    profiles?: number[];
    showItems?: boolean,
    children?: SidebarItem[];
}