import { HTMLAttributes, ReactNode, MouseEvent } from 'react';

type SidebarVariant = "default" | "dark" | "light" | "brand-dark" | "brand-light";
type SidebarSize = "xs" | "sm" | "md" | "lg";
type SidebarActionSource = "item-select" | "submenu-toggle" | "collapse-toggle" | "escape-close";
type SidebarItemActionEvent = MouseEvent<HTMLElement>;
interface SidebarItem {
    id: string;
    label: ReactNode;
    icon?: ReactNode;
    badge?: ReactNode;
    href?: string;
    disabled?: boolean;
    active?: boolean;
    expanded?: boolean;
    defaultExpanded?: boolean;
    items?: SidebarItem[];
    ariaLabel?: string;
    onAction?: (event: SidebarItemActionEvent) => void;
}
interface SidebarSection {
    id?: string;
    title?: ReactNode;
    items: SidebarItem[];
}
interface SidebarActionContext {
    source: SidebarActionSource;
    itemId?: string;
    itemLabel?: string;
    collapsed: boolean;
    nextCollapsed?: boolean;
    open: boolean;
    nextOpen?: boolean;
    size: SidebarSize;
    variant: SidebarVariant;
    event?: unknown;
}
interface SidebarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
    sections?: SidebarSection[];
    size?: SidebarSize;
    variant?: SidebarVariant;
    brandLogo?: ReactNode;
    brandName?: ReactNode;
    brandTagline?: ReactNode;
    footer?: ReactNode;
    collapsed?: boolean;
    defaultCollapsed?: boolean;
    onCollapsedChange?: (collapsed: boolean) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    closeOnEscape?: boolean;
    showItemIcons?: boolean;
    activeItemId?: string;
    defaultActiveItemId?: string;
    onActiveItemChange?: (itemId: string) => void;
    onItemSelect?: (item: SidebarItem) => void;
    onAction?: (context: SidebarActionContext) => void;
    panelAriaLabel?: string;
    navigationAriaLabel?: string;
    emptyText?: ReactNode;
}
declare function Sidebar({ sections, size, variant, brandLogo, brandName, brandTagline, footer, collapsed, defaultCollapsed, onCollapsedChange, open, defaultOpen, onOpenChange, closeOnEscape, showItemIcons, activeItemId, defaultActiveItemId, onActiveItemChange, onItemSelect, onAction, panelAriaLabel, navigationAriaLabel, emptyText, className, style, onKeyDown, ...props }: SidebarProps): JSX.Element | null;

export { Sidebar, type SidebarActionContext, type SidebarActionSource, type SidebarItem, type SidebarItemActionEvent, type SidebarProps, type SidebarSection, type SidebarSize, type SidebarVariant };
