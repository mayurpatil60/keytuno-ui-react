import { HTMLAttributes, ReactNode } from 'react';

type TabsVariant = "line" | "button" | "only icon";
type TabsOrientation = "horizontal" | "vertical";
type TabsSize = "xs" | "sm" | "md" | "lg";
type TabsSide = "left" | "top" | "bottom" | "right";
type TabsActionSource = "value-change" | "tab-focus" | "tab-blur";
interface TabsActionContext {
    source: TabsActionSource;
    value: string | null;
    previousValue?: string | null;
    triggerValue?: string;
    orientation: TabsOrientation;
    side: TabsSide;
    variant: TabsVariant;
    size: TabsSize;
    disabled: boolean;
    event?: unknown;
}
interface TabsItem {
    value: string;
    label: ReactNode;
    content: ReactNode;
    icon?: ReactNode;
    disabled?: boolean;
}
interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
    items: TabsItem[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    onAction?: (context: TabsActionContext) => void;
    variant?: TabsVariant;
    orientation?: TabsOrientation;
    size?: TabsSize;
    side?: TabsSide;
    disabled?: boolean;
    emptyText?: ReactNode;
}
declare function Tabs({ items, value, defaultValue, onValueChange, onAction, variant, orientation, size, side, disabled, emptyText, className, style, ...props }: TabsProps): JSX.Element;

export { Tabs, type TabsActionContext, type TabsActionSource, type TabsItem, type TabsOrientation, type TabsProps, type TabsSide, type TabsSize, type TabsVariant };
