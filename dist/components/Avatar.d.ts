import { HTMLAttributes, ReactNode, MouseEvent } from 'react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';
interface AvatarImageProps {
    src?: string;
    alt?: string;
}
interface AvatarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    size?: AvatarSize;
    text?: string;
    avatarImage?: AvatarImageProps;
    badgeIcon?: ReactNode;
    badgeColor?: string;
    onAction?: (event: MouseEvent<HTMLDivElement>) => void;
}
declare function Avatar({ size, text, avatarImage, badgeIcon, badgeColor, onAction, className, style, onClick, onKeyDown, role, tabIndex, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...props }: AvatarProps): JSX.Element;

export { Avatar, type AvatarImageProps, type AvatarProps, type AvatarSize };
