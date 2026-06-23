import { useState, type ButtonHTMLAttributes, type CSSProperties, type MouseEvent } from 'react';

import { Tooltip, type TooltipProps, type TooltipSide, type TooltipSize } from './Tooltip';

type ButtonVariantValue = 'primary' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
type ButtonSizeValue = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariantValue;
  size?: ButtonSizeValue;
  compact?: boolean;
  iconOnly?: boolean;
  iconOnlyTone?: boolean;
  iconColor?: CSSProperties['color'];
  onAction?: (event: MouseEvent<HTMLButtonElement>) => void;
  tooltip?: TooltipProps['label'];
  tooltipSide?: TooltipSide;
  tooltipSize?: TooltipSize;
  tooltipDisabled?: boolean;
  tooltipOpenDelay?: number;
  tooltipCloseDelay?: number;
}

export type ButtonSharedProps = Pick<ButtonProps, 'variant' | 'size' | 'compact' | 'disabled'>;

const iconToneColors: Record<ButtonVariantValue, string> = {
  primary: 'var(--ktn-action-primary-bg)',
  outline: 'var(--ktn-text-primary)',
  secondary: 'var(--ktn-action-primary-bg)',
  ghost: 'var(--ktn-text-primary)',
  destructive: 'var(--ktn-action-danger-bg, #dc2626)',
  link: 'var(--ktn-action-primary-bg)',
};

const baseClasses =
  'inline-flex items-center justify-center gap-2 border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const baseButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  borderWidth: '1px',
  borderStyle: 'solid',
  fontWeight: 500,
  lineHeight: 1,
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  transition: 'background-color 120ms ease, color 120ms ease, border-color 120ms ease',
};

const variantStyles: Record<ButtonVariantValue, CSSProperties> = {
  primary: {
    backgroundColor: 'var(--ktn-action-primary-bg)',
    color: 'var(--ktn-action-primary-fg)',
    borderColor: 'var(--ktn-action-primary-bg)',
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--ktn-text-primary)',
    borderColor: 'var(--ktn-border-muted)',
  },
  secondary: {
    backgroundColor: 'var(--ktn-bg-surface)',
    color: 'var(--ktn-text-primary)',
    borderColor: 'var(--ktn-border-muted)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--ktn-text-primary)',
    borderColor: 'transparent',
  },
  destructive: {
    backgroundColor: 'var(--ktn-action-danger-bg, #dc2626)',
    color: 'var(--ktn-action-danger-fg, #ffffff)',
    borderColor: 'var(--ktn-action-danger-bg, #dc2626)',
  },
  link: {
    backgroundColor: 'transparent',
    color: 'var(--ktn-action-primary-bg)',
    borderColor: 'transparent',
    borderWidth: 0,
    textDecoration: 'underline',
    textUnderlineOffset: '0.14em',
  },
};

const hoverStyles: Record<ButtonVariantValue, CSSProperties> = {
  primary: {
    backgroundColor: 'color-mix(in srgb, var(--ktn-action-primary-bg) 90%, black)',
    borderColor: 'color-mix(in srgb, var(--ktn-action-primary-bg) 90%, black)',
  },
  outline: {
    backgroundColor: 'var(--ktn-bg-muted, rgba(127, 127, 127, 0.1))',
    borderColor: 'var(--ktn-border-strong, var(--ktn-border-muted))',
  },
  secondary: {
    backgroundColor: 'color-mix(in srgb, var(--ktn-bg-surface) 88%, var(--ktn-text-primary))',
    borderColor: 'var(--ktn-border-strong, var(--ktn-border-muted))',
  },
  ghost: {
    backgroundColor: 'var(--ktn-bg-muted, rgba(127, 127, 127, 0.1))',
    borderColor: 'transparent',
  },
  destructive: {
    backgroundColor: 'color-mix(in srgb, var(--ktn-action-danger-bg, #dc2626) 90%, black)',
    borderColor: 'color-mix(in srgb, var(--ktn-action-danger-bg, #dc2626) 90%, black)',
  },
  link: {
    color: 'color-mix(in srgb, var(--ktn-action-primary-bg) 85%, black)',
  },
};

const sizeStyles: Record<ButtonSizeValue, CSSProperties> = {
  md: {
    height: '2.5rem',
    paddingInline: '0.95rem',
    fontSize: '0.875rem',
    borderRadius: 'var(--ktn-radius-md)',
  },
  xs: {
    height: '1.75rem',
    paddingInline: '0.5rem',
    fontSize: '0.75rem',
    borderRadius: 'var(--ktn-radius-sm)',
  },
  sm: {
    height: '2.125rem',
    paddingInline: '0.75rem',
    fontSize: '0.8125rem',
    borderRadius: 'var(--ktn-radius-md)',
  },
  lg: {
    height: '2.75rem',
    paddingInline: '1.125rem',
    fontSize: '0.95rem',
    borderRadius: 'var(--ktn-radius-md)',
  },
};

const compactSizeStyles: Record<ButtonSizeValue, CSSProperties> = {
  xs: {
    height: '1.36rem',
    paddingInline: '0.24rem',
    fontSize: '0.7rem',
    borderRadius: 'var(--ktn-radius-sm)',
    gap: '0.2rem',
  },
  sm: {
    height: '1.56rem',
    paddingInline: '0.28rem',
    fontSize: '0.75rem',
    borderRadius: 'var(--ktn-radius-sm)',
    gap: '0.22rem',
  },
  md: {
    height: '1.78rem',
    paddingInline: '0.32rem',
    fontSize: '0.8rem',
    borderRadius: 'var(--ktn-radius-sm)',
    gap: '0.24rem',
  },
  lg: {
    height: '1.96rem',
    paddingInline: '0.36rem',
    fontSize: '0.86rem',
    borderRadius: 'var(--ktn-radius-sm)',
    gap: '0.26rem',
  },
};

const iconOnlySizeStyles: Record<ButtonSizeValue, CSSProperties> = {
  xs: {
    width: '1.75rem',
    paddingInline: 0,
    gap: 0,
  },
  sm: {
    width: '2.125rem',
    paddingInline: 0,
    gap: 0,
  },
  md: {
    width: '2.5rem',
    paddingInline: 0,
    gap: 0,
  },
  lg: {
    width: '2.75rem',
    paddingInline: 0,
    gap: 0,
  },
};

const compactIconOnlySizeStyles: Record<ButtonSizeValue, CSSProperties> = {
  xs: {
    width: '1.36rem',
  },
  sm: {
    width: '1.56rem',
  },
  md: {
    width: '1.78rem',
  },
  lg: {
    width: '1.96rem',
  },
};

function resolveVariant(variant?: ButtonVariantValue): ButtonVariantValue {
  if (variant != null) {
    return variant;
  }

  return 'primary';
}

export function Button({
  children,
  variant,
  size = 'md',
  compact = false,
  iconOnly = false,
  iconOnlyTone = false,
  iconColor,
  onAction,
  tooltip,
  tooltipSide = 'auto',
  tooltipSize = 'sm',
  tooltipDisabled = false,
  tooltipOpenDelay,
  tooltipCloseDelay,
  className = '',
  style,
  type = 'button',
  disabled,
  onClick,
  onMouseEnter,
  onMouseLeave,
  'aria-label': ariaLabel,
  ...props
}: ButtonProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const resolvedVariant = resolveVariant(variant);
  const isDisabled = disabled === true;
  const resolvedIconColor =
    iconColor ?? (iconOnlyTone ? iconToneColors[resolvedVariant] : undefined);
  const isIconColorMode = iconOnly && resolvedIconColor != null;

  function handleMouseEnter(event: MouseEvent<HTMLButtonElement>): void {
    if (!isDisabled) {
      setIsHovered(true);
    }

    onMouseEnter?.(event);
  }

  function handleMouseLeave(event: MouseEvent<HTMLButtonElement>): void {
    setIsHovered(false);
    onMouseLeave?.(event);
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    onAction?.(event);
    onClick?.(event);
  }

  const composedClassName = `${baseClasses} ${className}`.trim();
  const composedStyle: CSSProperties = {
    ...baseButtonStyle,
    ...variantStyles[resolvedVariant],
    ...(!isDisabled && isHovered ? hoverStyles[resolvedVariant] : {}),
    ...sizeStyles[size],
    ...(compact ? compactSizeStyles[size] : {}),
    ...(iconOnly ? iconOnlySizeStyles[size] : {}),
    ...(iconOnly && compact ? compactIconOnlySizeStyles[size] : {}),
    ...(isIconColorMode
      ? {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
          color: resolvedIconColor,
          textDecoration: 'none',
        }
      : {}),
    ...(isHovered
      ? {
          position: 'relative',
          zIndex: 1,
        }
      : {}),
    ...(isDisabled
      ? {
          cursor: 'not-allowed',
          opacity: 0.6,
        }
      : {
          cursor: 'pointer',
        }),
    ...style,
  };

  const hasTooltip = tooltip != null && !(typeof tooltip === 'string' && tooltip.trim() === '');
  const tooltipLabel = typeof tooltip === 'string' ? tooltip.trim() : '';
  const resolvedAriaLabel =
    ariaLabel ?? (iconOnly && tooltipLabel !== '' ? tooltipLabel : undefined);

  const buttonElement = (
    <button
      className={composedClassName}
      style={composedStyle}
      type={type}
      disabled={isDisabled}
      aria-label={resolvedAriaLabel}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );

  if (!hasTooltip) {
    return buttonElement;
  }

  return (
    <Tooltip
      label={tooltip}
      size={tooltipSize}
      side={tooltipSide}
      disabled={tooltipDisabled}
      openDelay={tooltipOpenDelay}
      closeDelay={tooltipCloseDelay}
    >
      {buttonElement}
    </Tooltip>
  );
}
