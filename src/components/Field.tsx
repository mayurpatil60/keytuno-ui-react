import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useId,
  useRef,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type HTMLAttributes,
  type LabelHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

export type FieldOrientation = 'vertical' | 'horizontal' | 'responsive';
export type FieldActionSource = 'focus-within' | 'blur-within' | 'label-click' | 'field-click';

export interface FieldActionContext {
  source: FieldActionSource;
  orientation: FieldOrientation;
  disabled: boolean;
  invalid: boolean;
  required: boolean;
  event?: unknown;
}

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: FieldOrientation;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  onAction?: (context: FieldActionContext) => void;
}

export interface FieldGroupProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: FieldOrientation;
}

export interface FieldContentProps extends HTMLAttributes<HTMLDivElement> {}

export interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export interface FieldTitleProps extends HTMLAttributes<HTMLDivElement> {}

export interface FieldDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export interface FieldSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

export interface FieldErrorProps extends HTMLAttributes<HTMLParagraphElement> {}

interface FieldGroupContextValue {
  orientation: FieldOrientation;
}

interface FieldContextValue {
  orientation: FieldOrientation;
  disabled: boolean;
  invalid: boolean;
  required: boolean;
  fieldId: string;
  contentId: string;
  labelId: string;
  titleId: string;
  descriptionId: string;
  errorId: string;
  emitAction: (source: FieldActionSource, event?: unknown) => void;
}

const FieldGroupContext = createContext<FieldGroupContextValue | null>(null);
const FieldContext = createContext<FieldContextValue | null>(null);

const baseFieldClasses = 'relative';
const visuallyHiddenStyle: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

function containsComponentType(node: ReactNode, targetComponent: unknown): boolean {
  if (!isValidElement(node)) {
    return false;
  }

  const element = node as ReactElement<{ children?: ReactNode }>;

  if (element.type === targetComponent) {
    return true;
  }

  return Children.toArray(element.props.children).some((child) =>
    containsComponentType(child, targetComponent),
  );
}

function joinAriaIds(ids: Array<string | undefined>): string | undefined {
  const resolvedIds = ids.filter((id): id is string => id != null && id.trim() !== '');

  return resolvedIds.length > 0 ? resolvedIds.join(' ') : undefined;
}

function getFieldLayoutStyle(orientation: FieldOrientation): CSSProperties {
  if (orientation === 'horizontal') {
    return {
      display: 'grid',
      gridTemplateColumns: 'minmax(10rem, 13rem) minmax(0, 1fr)',
      alignItems: 'start',
      columnGap: '0.85rem',
      rowGap: '0.4rem',
    };
  }

  if (orientation === 'responsive') {
    return {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(15rem, 1fr))',
      alignItems: 'start',
      columnGap: '0.85rem',
      rowGap: '0.45rem',
    };
  }

  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '0.45rem',
  };
}

function useFieldGroupContextValue(): FieldGroupContextValue {
  const contextValue = useContext(FieldGroupContext);

  if (contextValue != null) {
    return contextValue;
  }

  return {
    orientation: 'vertical',
  };
}

function useFieldContextValue(): FieldContextValue {
  const contextValue = useContext(FieldContext);

  if (contextValue != null) {
    return contextValue;
  }

  return {
    orientation: 'vertical',
    disabled: false,
    invalid: false,
    required: false,
    fieldId: '',
    contentId: '',
    labelId: '',
    titleId: '',
    descriptionId: '',
    errorId: '',
    emitAction: () => {},
  };
}

export function FieldGroup({
  children,
  orientation = 'vertical',
  className = '',
  style,
  ...props
}: FieldGroupProps): JSX.Element {
  const contextValue: FieldGroupContextValue = {
    orientation,
  };

  const groupStyle: CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.9rem',
    ...style,
  };

  const composedClassName = `${baseFieldClasses} ${className}`.trim();

  return (
    <FieldGroupContext.Provider value={contextValue}>
      <div className={composedClassName} style={groupStyle} {...props}>
        {children}
      </div>
    </FieldGroupContext.Provider>
  );
}

export function Field({
  children,
  orientation,
  disabled = false,
  invalid = false,
  required = false,
  onAction,
  className = '',
  style,
  ...props
}: FieldProps): JSX.Element {
  const {
    id,
    role,
    onFocus,
    onBlur,
    onClick,
    ['aria-labelledby']: ariaLabelledByProp,
    ['aria-describedby']: ariaDescribedByProp,
    ...restProps
  } = props;
  const groupContextValue = useFieldGroupContextValue();
  const resolvedOrientation = orientation ?? groupContextValue.orientation;
  const generatedId = useId();
  const hasFocusWithinRef = useRef(false);
  const fieldId = id ?? `${generatedId}-field`;
  const contentId = `${fieldId}-content`;
  const labelId = `${fieldId}-label`;
  const titleId = `${fieldId}-title`;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;
  const hasLabel = Children.toArray(children).some((child) =>
    containsComponentType(child, FieldLabel),
  );
  const hasTitle = Children.toArray(children).some((child) =>
    containsComponentType(child, FieldTitle),
  );
  const hasDescription = Children.toArray(children).some((child) =>
    containsComponentType(child, FieldDescription),
  );
  const hasError = Children.toArray(children).some((child) =>
    containsComponentType(child, FieldError),
  );
  const resolvedAriaLabelledBy =
    ariaLabelledByProp ?? (hasLabel ? labelId : hasTitle ? titleId : undefined);
  const resolvedAriaDescribedBy =
    ariaDescribedByProp ??
    joinAriaIds([hasDescription ? descriptionId : undefined, hasError ? errorId : undefined]);

  function emitAction(source: FieldActionSource, event?: unknown): void {
    onAction?.({
      source,
      orientation: resolvedOrientation,
      disabled,
      invalid,
      required,
      event,
    });
  }

  function handleFocus(event: ReactFocusEvent<HTMLDivElement>): void {
    onFocus?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    if (!hasFocusWithinRef.current) {
      hasFocusWithinRef.current = true;
      emitAction('focus-within', event);
    }
  }

  function handleBlur(event: ReactFocusEvent<HTMLDivElement>): void {
    onBlur?.(event);

    if (disabled) {
      return;
    }

    const nextFocusedElement = event.relatedTarget;

    if (nextFocusedElement instanceof Node && event.currentTarget.contains(nextFocusedElement)) {
      return;
    }

    if (hasFocusWithinRef.current) {
      hasFocusWithinRef.current = false;
      emitAction('blur-within', event);
    }
  }

  function handleClick(event: ReactMouseEvent<HTMLDivElement>): void {
    onClick?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    const clickTarget = event.target;

    if (
      clickTarget instanceof HTMLElement &&
      clickTarget.closest('[data-ktn-field-label="true"]') != null
    ) {
      return;
    }

    emitAction('field-click', event);
  }

  const contextValue: FieldContextValue = {
    orientation: resolvedOrientation,
    disabled,
    invalid,
    required,
    fieldId,
    contentId,
    labelId,
    titleId,
    descriptionId,
    errorId,
    emitAction,
  };

  const fieldStyle: CSSProperties = {
    width: '100%',
    ...getFieldLayoutStyle(resolvedOrientation),
    ...(disabled
      ? {
          opacity: 0.72,
        }
      : {}),
    ...style,
  };

  const composedClassName = `${baseFieldClasses} ${className}`.trim();

  return (
    <FieldContext.Provider value={contextValue}>
      <div
        id={fieldId}
        role={role ?? 'group'}
        aria-disabled={disabled || undefined}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        aria-labelledby={resolvedAriaLabelledBy}
        aria-describedby={resolvedAriaDescribedBy}
        className={composedClassName}
        style={fieldStyle}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        {...restProps}
      >
        {children}
      </div>
    </FieldContext.Provider>
  );
}

export function FieldContent({
  children,
  className = '',
  style,
  ...props
}: FieldContentProps): JSX.Element {
  const { orientation, contentId } = useFieldContextValue();
  const { id, ...restProps } = props;
  const composedClassName = className.trim() === '' ? undefined : className;

  const contentStyle: CSSProperties = {
    width: '100%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    ...(orientation !== 'vertical'
      ? {
          justifySelf: 'stretch',
        }
      : {}),
    ...style,
  };

  return (
    <div id={id ?? contentId} className={composedClassName} style={contentStyle} {...restProps}>
      {children}
    </div>
  );
}

export function FieldLabel({
  children,
  required,
  className = '',
  style,
  ...props
}: FieldLabelProps): JSX.Element {
  const {
    orientation,
    disabled,
    invalid,
    required: fieldRequired,
    labelId,
    emitAction,
  } = useFieldContextValue();
  const { id, onClick, ...restProps } = props;
  const resolvedRequired = required ?? fieldRequired;
  const composedClassName = className.trim() === '' ? undefined : className;

  const labelStyle: CSSProperties = {
    margin: 0,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontWeight: 500,
    fontSize: '0.84rem',
    lineHeight: 1.35,
    color: invalid ? 'var(--ktn-action-danger-bg, #dc2626)' : 'var(--ktn-text-primary)',
    ...(orientation !== 'vertical'
      ? {
          paddingBlockStart: '0.34rem',
        }
      : {}),
    ...(disabled
      ? {
          cursor: 'not-allowed',
        }
      : {}),
    ...style,
  };

  return (
    <label
      id={id ?? labelId}
      data-ktn-field-label="true"
      className={composedClassName}
      style={labelStyle}
      onClick={(event) => {
        onClick?.(event);

        if (!(event.defaultPrevented || disabled)) {
          emitAction('label-click', event);
        }
      }}
      {...restProps}
    >
      {children}
      {resolvedRequired ? (
        <>
          <span
            aria-hidden
            style={{
              color: 'var(--ktn-action-danger-bg, #dc2626)',
              fontSize: '0.95em',
              lineHeight: 1,
            }}
          >
            *
          </span>

          <span style={visuallyHiddenStyle}>required</span>
        </>
      ) : null}
    </label>
  );
}

export function FieldTitle({
  children,
  className = '',
  style,
  ...props
}: FieldTitleProps): JSX.Element {
  const { invalid, titleId } = useFieldContextValue();
  const { id, ...restProps } = props;
  const composedClassName = className.trim() === '' ? undefined : className;

  const titleStyle: CSSProperties = {
    margin: 0,
    fontWeight: 600,
    fontSize: '0.9rem',
    lineHeight: 1.3,
    color: invalid ? 'var(--ktn-action-danger-bg, #dc2626)' : 'var(--ktn-text-primary)',
    ...style,
  };

  return (
    <div id={id ?? titleId} className={composedClassName} style={titleStyle} {...restProps}>
      {children}
    </div>
  );
}

export function FieldDescription({
  children,
  className = '',
  style,
  ...props
}: FieldDescriptionProps): JSX.Element {
  const { disabled, descriptionId } = useFieldContextValue();
  const { id, ...restProps } = props;
  const composedClassName = className.trim() === '' ? undefined : className;

  const descriptionStyle: CSSProperties = {
    margin: 0,
    fontWeight: 400,
    fontSize: '0.79rem',
    lineHeight: 1.45,
    color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
    ...(disabled
      ? {
          opacity: 0.84,
        }
      : {}),
    ...style,
  };

  return (
    <p
      id={id ?? descriptionId}
      className={composedClassName}
      style={descriptionStyle}
      {...restProps}
    >
      {children}
    </p>
  );
}

export function FieldSeparator({
  className = '',
  style,
  ...props
}: FieldSeparatorProps): JSX.Element {
  const composedClassName = className.trim() === '' ? undefined : className;

  const separatorStyle: CSSProperties = {
    width: '100%',
    height: '1px',
    backgroundColor: 'var(--ktn-border-muted)',
    borderRadius: '999px',
    margin: '0.15rem 0',
    ...style,
  };

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={composedClassName}
      style={separatorStyle}
      {...props}
    />
  );
}

export function FieldError({
  children,
  className = '',
  style,
  ...props
}: FieldErrorProps): JSX.Element {
  const { errorId } = useFieldContextValue();
  const { id, role, ['aria-live']: ariaLive, ...restProps } = props;
  const composedClassName = className.trim() === '' ? undefined : className;

  const errorStyle: CSSProperties = {
    margin: 0,
    fontWeight: 500,
    fontSize: '0.78rem',
    lineHeight: 1.35,
    color: 'var(--ktn-action-danger-bg, #dc2626)',
    ...style,
  };

  return (
    <p
      id={id ?? errorId}
      role={role ?? 'alert'}
      aria-live={ariaLive ?? 'polite'}
      className={composedClassName}
      style={errorStyle}
      {...restProps}
    >
      {children}
    </p>
  );
}
