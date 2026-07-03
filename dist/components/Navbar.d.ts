import { HTMLAttributes, ReactNode, MouseEvent } from 'react';

type NavbarLegacyVariant = "default" | "outline";
type NavbarModernVariant = "dark" | "light" | "brand-dark" | "brand-light";
type NavbarVariant = NavbarLegacyVariant | NavbarModernVariant;
type NavbarSize = "xs" | "sm" | "md" | "lg";
type NavbarActionSource = "item-select" | "submenu-select" | "hamburger-action";
type NavbarItemActionEvent = MouseEvent<HTMLElement> | undefined;
type NavbarHamburgerActionEvent = MouseEvent<HTMLButtonElement>;
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
    showHamburger?: boolean;
    hamburgerAriaLabel?: string;
    hamburgerIcon?: ReactNode;
    hamburgerDisabled?: boolean;
    onHamburgerAction?: (event: NavbarHamburgerActionEvent) => void;
    items?: NavbarItem[];
    actions?: ReactNode;
    size?: NavbarSize;
    variant?: NavbarVariant;
    sticky?: boolean;
    desktopNavigationLabel?: string;
    activeItemId?: string;
    defaultActiveItemId?: string;
    onActiveItemChange?: (itemId: string) => void;
    onItemSelect?: (item: NavbarItem, parentItem?: NavbarItem) => void;
    onAction?: (context: NavbarActionContext) => void;
    emptyText?: ReactNode;
}
declare function Navbar({ brand, defaultBrandName, showBrand, brandLogo, brandName, brandTagline, showHamburger, hamburgerAriaLabel, hamburgerIcon, hamburgerDisabled, onHamburgerAction, items, actions, size, variant, sticky, desktopNavigationLabel, activeItemId, defaultActiveItemId, onActiveItemChange, onItemSelect, onAction, emptyText, className, style, onKeyDown, ...props }: NavbarProps): JSX.Element;

export { Navbar, type NavbarActionContext, type NavbarActionSource, type NavbarHamburgerActionEvent, type NavbarItem, type NavbarItemActionEvent, type NavbarProps, type NavbarSize, type NavbarVariant };
