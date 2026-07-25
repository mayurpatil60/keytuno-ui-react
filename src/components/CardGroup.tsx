import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export interface CardGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  children?: ReactNode;
  joined?: boolean;
  gap?: CSSProperties["gap"];
}

interface StyleableElementProps {
  style?: CSSProperties;
}

export function CardGroup({
  children,
  joined = true,
  gap = "0.75rem",
  className = "",
  style,
  ...props
}: CardGroupProps): JSX.Element {
  const items = Children.toArray(children).filter((child) => child != null);

  const composedClassName = className.trim() === "" ? undefined : className;

  const rootStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: joined ? 0 : gap,
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    ...style,
  };

  return (
    <div className={composedClassName} style={rootStyle} {...props}>
      {items.map((child, index) => {
        if (!joined || !isValidElement<StyleableElementProps>(child)) {
          return child;
        }

        const itemCount = items.length;
        const isFirst = index === 0;
        const isLast = index === itemCount - 1;
        const existingStyle = child.props.style ?? {};
        const radius = "var(--ktn-radius-lg, 0.75rem)";

        const joinedStyle: CSSProperties = {
          ...existingStyle,
          borderRadius:
            itemCount === 1
              ? (existingStyle.borderRadius ?? radius)
              : isFirst
                ? `${radius} ${radius} 0 0`
                : isLast
                  ? `0 0 ${radius} ${radius}`
                  : "0",
          marginTop: isFirst ? existingStyle.marginTop : "-1px",
        };

        return cloneElement(child, {
          style: joinedStyle,
        });
      })}
    </div>
  );
}
