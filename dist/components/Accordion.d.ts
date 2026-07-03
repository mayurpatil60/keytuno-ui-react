import { HTMLAttributes, ReactNode } from 'react';

type AccordionOrientation = 'horizontal' | 'vertical';
type AccordionSize = 'xs' | 'sm' | 'md' | 'lg';
interface AccordionItem {
    id: string;
    title: ReactNode;
    content: ReactNode;
    actions?: ReactNode;
    disabled?: boolean;
}
interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    items: AccordionItem[];
    orientation?: AccordionOrientation;
    size?: AccordionSize;
    disabled?: boolean;
    multiple?: boolean;
    defaultOpenItems?: string[];
    onOpenItemsChange?: (openItemIds: string[]) => void;
}
declare function Accordion({ items, orientation, size, disabled, multiple, defaultOpenItems, onOpenItemsChange, className, style, ...props }: AccordionProps): JSX.Element;

export { Accordion, type AccordionItem, type AccordionOrientation, type AccordionProps, type AccordionSize };
