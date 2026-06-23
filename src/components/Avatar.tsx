import {
  useEffect,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

export interface AvatarImageProps {
  src?: string;
  alt?: string;
}

export interface AvatarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  size?: AvatarSize;
  text?: string;
  avatarImage?: AvatarImageProps;
  badgeIcon?: ReactNode;
  badgeColor?: string;
  onAction?: (event: ReactMouseEvent<HTMLDivElement>) => void;
}

type AvatarSizeTokens = {
  dimension: string;
  fontSize: string;
  badgeDotSize: string;
  badgeIconSize: string;
};

const sizeTokens: Record<AvatarSize, AvatarSizeTokens> = {
  xs: {
    dimension: '1.75rem',
    fontSize: '0.625rem',
    badgeDotSize: '0.45rem',
    badgeIconSize: '0.8rem',
  },
  sm: {
    dimension: '2rem',
    fontSize: '0.6875rem',
    badgeDotSize: '0.5rem',
    badgeIconSize: '0.9rem',
  },
  md: {
    dimension: '2.5rem',
    fontSize: '0.8125rem',
    badgeDotSize: '0.58rem',
    badgeIconSize: '1rem',
  },
  lg: {
    dimension: '3rem',
    fontSize: '0.9375rem',
    badgeDotSize: '0.68rem',
    badgeIconSize: '1.1rem',
  },
};

const baseClasses =
  'relative inline-flex items-center justify-center rounded-full border select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

const baseStyle: CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'visible',
  borderRadius: '999px',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--ktn-border-muted)',
  backgroundColor: 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.14))',
  color: 'var(--ktn-text-primary)',
  fontWeight: 600,
  lineHeight: 1,
  textAlign: 'center',
  textTransform: 'uppercase',
  userSelect: 'none',
  verticalAlign: 'middle',
};

const imageStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
  objectFit: 'cover',
  borderRadius: '999px',
};

const fallbackTextStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
};

function toInitials(value: string | undefined): string {
  const normalized = (value ?? '').trim();

  if (normalized === '') {
    return 'U';
  }

  const words = normalized.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase();
}

export function Avatar({
  size = 'md',
  text,
  avatarImage,
  badgeIcon,
  badgeColor,
  onAction,
  className = '',
  style,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: AvatarProps): JSX.Element {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = avatarImage?.src?.trim() ?? '';

  useEffect(() => {
    setImageFailed(false);
  }, [imageSrc]);

  const tokens = sizeTokens[size];
  const hasImage = imageSrc !== '' && !imageFailed;
  const hasBadge = badgeIcon != null || badgeColor != null;
  const resolvedBadgeColor = badgeColor ?? 'var(--ktn-action-primary-bg)';
  const isActionable = onAction != null || onClick != null;
  const computedLabel = (avatarImage?.alt?.trim() ?? text?.trim() ?? '').trim();
  const fallbackAriaLabel = computedLabel === '' ? 'Avatar' : computedLabel;
  const resolvedAriaLabel = ariaLabel ?? (ariaLabelledBy == null ? fallbackAriaLabel : undefined);
  const resolvedRole = role ?? (isActionable ? 'button' : 'img');
  const resolvedTabIndex = tabIndex ?? (isActionable ? 0 : undefined);

  const composedClassName = `${baseClasses} ${className}`.trim();
  const composedStyle: CSSProperties = {
    ...baseStyle,
    width: tokens.dimension,
    height: tokens.dimension,
    fontSize: tokens.fontSize,
    ...(isActionable ? { cursor: 'pointer' } : {}),
    ...style,
  };

  const badgeStyle: CSSProperties = {
    position: 'absolute',
    insetInlineEnd: 0,
    insetBlockEnd: 0,
    transform: 'translate(18%, 18%)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '999px',
    backgroundColor: resolvedBadgeColor,
    boxShadow: '0 0 0 2px var(--ktn-bg-surface, #ffffff)',
    color: '#ffffff',
    width: badgeIcon == null ? tokens.badgeDotSize : tokens.badgeIconSize,
    height: badgeIcon == null ? tokens.badgeDotSize : tokens.badgeIconSize,
    lineHeight: 0,
    overflow: 'hidden',
    zIndex: 1,
  };

  function handleClick(event: ReactMouseEvent<HTMLDivElement>): void {
    onAction?.(event);
    onClick?.(event);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>): void {
    onKeyDown?.(event);

    if (event.defaultPrevented || !isActionable) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  const resolvedOnClick = isActionable ? handleClick : onClick;

  return (
    <div
      className={composedClassName}
      style={composedStyle}
      role={resolvedRole}
      tabIndex={resolvedTabIndex}
      aria-label={resolvedAriaLabel}
      aria-labelledby={ariaLabelledBy}
      onClick={resolvedOnClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {hasImage ? (
        <img
          src={imageSrc}
          alt={avatarImage?.alt ?? text ?? 'Avatar'}
          style={imageStyle}
          onError={() => {
            setImageFailed(true);
          }}
        />
      ) : (
        <span aria-hidden style={fallbackTextStyle}>
          {toInitials(text)}
        </span>
      )}

      {hasBadge ? <span style={badgeStyle}>{badgeIcon}</span> : null}
    </div>
  );
}
