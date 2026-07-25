import { HTMLAttributes, MouseEvent } from 'react';

type CardSize = "xs" | "sm" | "md" | "lg";
type CardSpacing = "xs" | "sm" | "md" | "lg";
type CardActionSource = "card" | "collapse-toggle";
interface CardActionContext {
    source: CardActionSource;
    collapsed: boolean;
    event: MouseEvent<Element>;
}
interface CardProps extends HTMLAttributes<HTMLDivElement> {
    size?: CardSize;
    spacing?: CardSpacing;
    collapse?: boolean;
    defaultCollapsed?: boolean;
    onCollapseChange?: (collapsed: boolean) => void;
    onAction?: (context: CardActionContext) => void;
}
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    collapseTrigger?: boolean;
}
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    collapseTrigger?: boolean;
}
interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    collapseTrigger?: boolean;
}
interface CardActionProps extends HTMLAttributes<HTMLDivElement> {
}
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
    divider?: boolean;
}
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    divider?: boolean;
}
declare function Card({ children, size, spacing, collapse, defaultCollapsed, onCollapseChange, onAction, className, style, onClick, onKeyDown, role, tabIndex, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...props }: CardProps): JSX.Element;
declare function CardHeader({ children, collapseTrigger, className, style, onClick, onKeyDown, role, tabIndex, ...props }: CardHeaderProps): JSX.Element;
declare function CardTitle({ children, collapseTrigger, className, style, onClick, onKeyDown, role, tabIndex, ...props }: CardTitleProps): JSX.Element;
declare function CardDescription({ children, collapseTrigger, className, style, onClick, onKeyDown, role, tabIndex, ...props }: CardDescriptionProps): JSX.Element;
declare function CardAction({ children, className, style, ...props }: CardActionProps): JSX.Element;
declare function CardContent({ children, divider, className, style, id, role, ...props }: CardContentProps): JSX.Element;
declare function CardFooter({ children, divider, className, style, ...props }: CardFooterProps): JSX.Element;

export { Card, CardAction, type CardActionContext, type CardActionProps, type CardActionSource, CardContent, type CardContentProps, CardDescription, type CardDescriptionProps, CardFooter, type CardFooterProps, CardHeader, type CardHeaderProps, type CardProps, type CardSize, type CardSpacing, CardTitle, type CardTitleProps };
