import { HTMLAttributes, ReactNode, MouseEvent } from 'react';

type NavbarVariant = "default" | "outline" | "soft";
type NavbarSize = "xs" | "sm" | "md" | "lg";
type NavbarMobileMenuSide = "left" | "right";
type NavbarActionSource = "item-select" | "submenu-select" | "mobile-toggle" | "escape-close";
type NavbarItemActionEvent = MouseEvent<HTMLElement> | undefined;
interface NavbarItem {
    id: string;
    label: ReactNode;
    icon?: ReactNode;
    badge?: ReactNode;
    href?: string;
    disabled?: boolean;
    active?: boolean;
    ariaLabel?: string;
    items?: NavbarItem[];
    onAction?: (event: NavbarItemActionEvent) => void;
}
interface NavbarActionContext {
    source: NavbarActionSource;
    itemId?: string;
    itemLabel?: string;
    parentItemId?: string;
    mobileOpen: boolean;
    nextMobileOpen?: boolean;
    isMobileViewport: boolean;
    size: NavbarSize;
    variant: NavbarVariant;
    event?: unknown;
}
interface NavbarProps extends Omit<HTMLAttributes<HTMLElement>, "children" | "onChange"> {
    brand?: ReactNode;
    defaultBrandName?: ReactNode;
    showBrand?: boolean;
    brandLogo?: ReactNode;
    brandName?: ReactNode;
    brandTagline?: ReactNode;
    items?: NavbarItem[];
    actions?: ReactNode;
    size?: NavbarSize;
    variant?: NavbarVariant;
    varient?: NavbarVariant;
    sticky?: boolean;
    responsive?: boolean;
    mobileBreakpoint?: number;
    mobileMenuSide?: NavbarMobileMenuSide;
    mobileTitle?: ReactNode;
    showMobileToggle?: boolean;
    mobileToggleLabel?: string;
    mobileCloseLabel?: string;
    desktopNavigationLabel?: string;
    mobileNavigationLabel?: string;
    mobileOpen?: boolean;
    defaultMobileOpen?: boolean;
    onMobileOpenChange?: (open: boolean) => void;
    closeMobileOnSelect?: boolean;
    activeItemId?: string;
    defaultActiveItemId?: string;
    onActiveItemChange?: (itemId: string) => void;
    onItemSelect?: (item: NavbarItem, parentItem?: NavbarItem) => void;
    onAction?: (context: NavbarActionContext) => void;
    emptyText?: ReactNode;
}
declare function Navbar({ brand, defaultBrandName, showBrand, brandLogo, brandName, brandTagline, items, actions, size, variant, varient, sticky, responsive, mobileBreakpoint, mobileMenuSide, mobileTitle, showMobileToggle, mobileToggleLabel, mobileCloseLabel, desktopNavigationLabel, mobileNavigationLabel, mobileOpen, defaultMobileOpen, onMobileOpenChange, closeMobileOnSelect, activeItemId, defaultActiveItemId, onActiveItemChange, onItemSelect, onAction, emptyText, className, style, onKeyDown, ...props }: NavbarProps): JSX.Element;

export { Navbar, type NavbarActionContext, type NavbarActionSource, type NavbarItem, type NavbarItemActionEvent, type NavbarMobileMenuSide, type NavbarProps, type NavbarSize, type NavbarVariant };
