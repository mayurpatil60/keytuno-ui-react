import { HTMLAttributes, ReactNode, CSSProperties } from 'react';

interface CardGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    children?: ReactNode;
    joined?: boolean;
    gap?: CSSProperties["gap"];
}
declare function CardGroup({ children, joined, gap, className, style, ...props }: CardGroupProps): JSX.Element;

export { CardGroup, type CardGroupProps };
