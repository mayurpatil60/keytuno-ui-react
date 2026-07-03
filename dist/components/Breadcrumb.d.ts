import { HTMLAttributes, ReactNode, MouseEvent } from 'react';

type BreadcrumbSize = "xs" | "sm" | "md" | "lg";
interface BreadcrumbItem {
    label: ReactNode;
    href?: string;
    target?: string;
    rel?: string;
    ariaLabel?: string;
    onAction?: (event: MouseEvent<Element>) => void;
}
interface BreadcrumbActionContext {
    item: BreadcrumbItem;
    index: number;
    isCurrentPage: boolean;
    event: MouseEvent<Element>;
}
interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
    items: BreadcrumbItem[];
    size?: BreadcrumbSize;
    separator?: ReactNode;
    separatorFallback?: ReactNode;
    ellipsisContent?: ReactNode;
    ellipsisAriaLabelFormatter?: (hiddenItemsCount: number) => string;
    itemAriaLabelFormatter?: (context: {
        item: BreadcrumbItem;
        index: number;
        isCurrentPage: boolean;
    }) => string | undefined;
    navigationAriaLabel?: string;
    maxVisibleItems?: number;
    onAction?: (context: BreadcrumbActionContext) => void;
}
interface BreadcrumbSeparatorProps extends HTMLAttributes<HTMLLIElement> {
    size?: BreadcrumbSize;
}
interface BreadcrumbEllipsisProps extends HTMLAttributes<HTMLLIElement> {
    size?: BreadcrumbSize;
}
declare function BreadcrumbSeparator({ size, children, className, style, ...props }: BreadcrumbSeparatorProps): JSX.Element;
declare function BreadcrumbEllipsis({ size, children, className, style, ...props }: BreadcrumbEllipsisProps): JSX.Element;
declare function Breadcrumb({ items, size, separator, separatorFallback, ellipsisContent, ellipsisAriaLabelFormatter, itemAriaLabelFormatter, navigationAriaLabel, maxVisibleItems, onAction, className, style, ["aria-label"]: ariaLabel, ...props }: BreadcrumbProps): JSX.Element;

export { Breadcrumb, type BreadcrumbActionContext, BreadcrumbEllipsis, type BreadcrumbEllipsisProps, type BreadcrumbItem, type BreadcrumbProps, BreadcrumbSeparator, type BreadcrumbSeparatorProps, type BreadcrumbSize };
