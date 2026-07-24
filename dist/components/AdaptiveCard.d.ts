import { HTMLAttributes, ReactNode } from 'react';
import { ButtonProps } from './Button.js';
import './Tooltip.js';

type AdaptiveCardVariant = "default" | "compact" | "ghost";
type AdaptiveCardSize = "xs" | "sm" | "md" | "lg";
type AdaptiveCardFieldType = "auto" | "text" | "link" | "number" | "currency" | "percent" | "date" | "phone" | "status" | "badge" | "progress" | "media";
type AdaptiveCardActionMode = "auto" | "inline" | "menu";
type AdaptiveCardActionAlignment = "left" | "right";
type AdaptiveCardActionPlacement = "top" | "bottom";
type AdaptiveCardActionLayout = "own-row" | "same-row";
type AdaptiveCardInnerColumns = 1 | 2 | 3;
interface AdaptiveCardColumns {
    mobile?: number;
    tablet?: number;
    web?: number;
}
interface AdaptiveCardColumnBreakpoints {
    tablet?: number;
    web?: number;
}
interface AdaptiveCardFieldSchema<TData extends object = object> {
    key: Extract<keyof TData, string> | string;
    label?: ReactNode;
    showLabel?: boolean;
    type?: AdaptiveCardFieldType;
    align?: "left" | "right";
    span?: 1 | 2 | 3 | "full";
    priority?: number;
    hideIfEmpty?: boolean;
    formatter?: (value: unknown, row: TData, rowIndex: number) => ReactNode;
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    dateOptions?: Intl.DateTimeFormatOptions;
    mediaAlt?: string;
    mediaType?: "auto" | "image" | "video" | "audio" | "file";
}
interface AdaptiveCardAction<TData extends object = object> {
    id: string;
    label: ReactNode;
    icon?: ReactNode;
    variant?: ButtonProps["variant"];
    disabled?: boolean | ((row: TData, rowIndex: number) => boolean);
    onAction?: (row: TData, rowIndex: number) => void;
}
type AdaptiveCardActionSource = "item-action";
interface AdaptiveCardActionContext<TData extends object = object> {
    source: AdaptiveCardActionSource;
    actionId?: string;
    row?: TData;
    rowIndex?: number;
    event?: unknown;
}
interface AdaptiveCardProps<TData extends object = object> extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    data?: TData[];
    schema?: AdaptiveCardFieldSchema<TData>[];
    rowKey?: keyof TData | ((row: TData, index: number) => string | number);
    variant?: AdaptiveCardVariant;
    size?: AdaptiveCardSize;
    locale?: string;
    currency?: string;
    showFieldLabels?: boolean;
    insideColumns?: AdaptiveCardInnerColumns;
    columns?: number | AdaptiveCardColumns;
    columnBreakpoints?: AdaptiveCardColumnBreakpoints;
    actions?: AdaptiveCardAction<TData>[] | ((row: TData, rowIndex: number) => AdaptiveCardAction<TData>[]);
    actionMode?: AdaptiveCardActionMode;
    actionInlineMaxVisible?: number;
    actionAlignment?: AdaptiveCardActionAlignment;
    actionPlacement?: AdaptiveCardActionPlacement;
    actionLayout?: AdaptiveCardActionLayout;
    actionMenuLabel?: ReactNode;
    virtualized?: boolean;
    virtualizedMaxHeight?: number | string;
    virtualizedEstimateSize?: number;
    virtualizedOverscan?: number;
    viewportMaxHeight?: number | string;
    emptyText?: ReactNode;
    onAction?: (context: AdaptiveCardActionContext<TData>) => void;
}
declare function AdaptiveCard<TData extends object = object>({ data, schema, rowKey, variant, size, locale, currency, showFieldLabels, insideColumns, columns, columnBreakpoints, actions, actionMode, actionInlineMaxVisible, actionAlignment, actionPlacement, actionLayout, actionMenuLabel, virtualized, virtualizedMaxHeight, virtualizedEstimateSize, virtualizedOverscan, viewportMaxHeight, emptyText, onAction, className, style, ...props }: AdaptiveCardProps<TData>): JSX.Element;

export { AdaptiveCard, type AdaptiveCardAction, type AdaptiveCardActionAlignment, type AdaptiveCardActionContext, type AdaptiveCardActionLayout, type AdaptiveCardActionMode, type AdaptiveCardActionPlacement, type AdaptiveCardActionSource, type AdaptiveCardColumnBreakpoints, type AdaptiveCardColumns, type AdaptiveCardFieldSchema, type AdaptiveCardFieldType, type AdaptiveCardInnerColumns, type AdaptiveCardProps, type AdaptiveCardSize, type AdaptiveCardVariant };
