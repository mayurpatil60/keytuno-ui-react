import { HTMLAttributes, ReactNode, MouseEvent, CSSProperties } from 'react';

type SidebarVariant = "default" | "outline" | "soft";
type SidebarSize = "xs" | "sm" | "md" | "lg";
type SidebarActionSource = "item-select" | "submenu-toggle" | "collapse-toggle" | "mobile-toggle" | "escape-close";
type SidebarItemActionEvent = MouseEvent<HTMLElement>;
interface SidebarItem {
    id: string;
    label: ReactNode;
    icon?: ReactNode;
    badge?: ReactNode;
    href?: string;
    disabled?: boolean;
    active?: boolean;
    defaultExpanded?: boolean;
    expanded?: boolean;
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
    mobileOpen: boolean;
    nextMobileOpen?: boolean;
    isMobileViewport: boolean;
    size: SidebarSize;
    variant: SidebarVariant;
    event?: unknown;
}
interface SidebarSectionSeparatorContext {
    index: number;
    sectionId?: string;
    collapsed: boolean;
    mobileViewport: boolean;
}
interface SidebarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
    sections?: SidebarSection[];
    header?: ReactNode;
    footer?: ReactNode;
    size?: SidebarSize;
    variant?: SidebarVariant;
    varient?: SidebarVariant;
    collapsed?: boolean;
    defaultCollapsed?: boolean;
    onCollapsedChange?: (collapsed: boolean) => void;
    mobileOpen?: boolean;
    defaultMobileOpen?: boolean;
    onMobileOpenChange?: (open: boolean) => void;
    responsive?: boolean;
    collapseBreakpoint?: number;
    iconOnly?: boolean;
    showCollapseToggle?: boolean;
    showMobileToggle?: boolean;
    mobileOpenLabel?: string;
    mobileCloseLabel?: string;
    panelAriaLabel?: string;
    navigationAriaLabel?: string;
    collapseExpandLabel?: string;
    collapseCollapseLabel?: string;
    collapseLockedLabel?: string;
    closeMobileOnSelect?: boolean;
    activeItemId?: string;
    defaultActiveItemId?: string;
    onActiveItemChange?: (itemId: string) => void;
    onItemSelect?: (item: SidebarItem) => void;
    sectionSpacing?: CSSProperties["rowGap"];
    sectionPaddingTop?: CSSProperties["paddingTop"];
    sectionPaddingBottom?: CSSProperties["paddingBottom"];
    showSectionSeparators?: boolean;
    sectionSeparatorInset?: CSSProperties["paddingInline"];
    sectionSeparatorSize?: "xs" | "sm" | "md" | "lg";
    sectionSeparatorStyle?: CSSProperties;
    renderSectionSeparator?: (context: SidebarSectionSeparatorContext) => ReactNode;
    onAction?: (context: SidebarActionContext) => void;
    emptyText?: ReactNode;
}
declare function Sidebar({ sections, header, footer, size, variant, varient, collapsed, defaultCollapsed, onCollapsedChange, mobileOpen, defaultMobileOpen, onMobileOpenChange, responsive, collapseBreakpoint, iconOnly, showCollapseToggle, showMobileToggle, mobileOpenLabel, mobileCloseLabel, panelAriaLabel, navigationAriaLabel, collapseExpandLabel, collapseCollapseLabel, collapseLockedLabel, closeMobileOnSelect, activeItemId, defaultActiveItemId, onActiveItemChange, onItemSelect, sectionSpacing, sectionPaddingTop, sectionPaddingBottom, showSectionSeparators, sectionSeparatorInset, sectionSeparatorSize, sectionSeparatorStyle, renderSectionSeparator, onAction, emptyText, className, style, onKeyDown, ...props }: SidebarProps): JSX.Element;

export { Sidebar, type SidebarActionContext, type SidebarActionSource, type SidebarItem, type SidebarItemActionEvent, type SidebarProps, type SidebarSection, type SidebarSectionSeparatorContext, type SidebarSize, type SidebarVariant };
