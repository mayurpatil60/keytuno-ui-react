import { HTMLAttributes, CSSProperties } from 'react';

type SkeletonRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
type SkeletonActionSource = 'click' | 'focus' | 'blur';
interface SkeletonActionContext {
    source: SkeletonActionSource;
    animated: boolean;
    radius: SkeletonRadius;
    width: CSSProperties['width'];
    height: CSSProperties['height'];
    decorative: boolean;
    event?: unknown;
}
interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    animated?: boolean;
    radius?: SkeletonRadius;
    width?: CSSProperties['width'];
    height?: CSSProperties['height'];
    decorative?: boolean;
    onAction?: (context: SkeletonActionContext) => void;
}
declare function Skeleton({ animated, radius, width, height, decorative, onAction, className, style, onClick, onFocus, onBlur, role, ['aria-label']: ariaLabel, ['aria-live']: ariaLive, ...props }: SkeletonProps): JSX.Element;

export { Skeleton, type SkeletonActionContext, type SkeletonActionSource, type SkeletonProps, type SkeletonRadius };
