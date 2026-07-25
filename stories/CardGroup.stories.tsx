import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardGroup,
  CardHeader,
  CardTitle,
  type CardGroupProps,
  type CardProps,
} from "../src/index";

const meta: Meta<typeof CardGroup> = {
  title: "Data/CardGroup",
  component: CardGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

type CardGroupPlaygroundArgs = CardGroupProps & {
  cardSize: NonNullable<CardProps["size"]>;
  cardCount: 2 | 3 | 4;
  showCardDividers: boolean;
};

const frameStyle: CSSProperties = {
  width: "min(920px, 96vw)",
  maxWidth: "100%",
};

const bodyTextStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.84rem",
  lineHeight: 1.45,
  color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
};

function renderCardItems(
  count: 2 | 3 | 4,
  size: NonNullable<CardProps["size"]>,
  withDividers: boolean,
): JSX.Element[] {
  return Array.from({ length: count }, (_, index) => {
    const stepNumber = index + 1;

    return (
      <Card key={`card-${stepNumber}`} size={size}>
        <CardHeader>
          <CardTitle>{`Step ${stepNumber}`}</CardTitle>
          <CardDescription>{`Section ${stepNumber} summary`}</CardDescription>
        </CardHeader>

        <CardContent divider={withDividers}>
          <p style={bodyTextStyle}>{`Card ${stepNumber} content block`}</p>
        </CardContent>

        <CardFooter divider={withDividers}>
          <Button size="sm" variant="outline">
            Back
          </Button>
          <Button size="sm" variant="primary">
            Continue
          </Button>
        </CardFooter>
      </Card>
    );
  });
}

export const CardGroupStory: Story = {
  name: "CardGroup",
  render: () => (
    <div style={frameStyle}>
      <CardGroup joined>{renderCardItems(3, "md", false)}</CardGroup>
    </div>
  ),
};

export const CardGroupPlayground: StoryObj<CardGroupPlaygroundArgs> = {
  name: "CardGroup Playground",
  args: {
    joined: true,
    gap: "0.75rem",
    cardSize: "md",
    cardCount: 3,
    showCardDividers: false,
    id: "card-group-playground",
    role: "group",
    "aria-label": "Card group playground",
    title: "Card group root",
    className: "",
    style: undefined,
  },
  argTypes: {
    joined: {
      control: "boolean",
      description: "Join stacked cards without spacing and merge borders.",
    },
    gap: {
      control: "text",
      description: "Vertical gap used when joined is false.",
    },
    cardSize: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    cardCount: {
      control: "inline-radio",
      options: [2, 3, 4],
    },
    showCardDividers: {
      control: "boolean",
      description: "Toggle card content/footer section separators.",
    },
    id: {
      control: "text",
    },
    role: {
      control: "text",
    },
    "aria-label": {
      control: "text",
    },
    title: {
      control: "text",
    },
    className: {
      control: "text",
    },
    style: {
      control: "object",
      description: "Native div style forwarded to CardGroup root.",
    },
    onClick: {
      action: "click",
      description: "Native div click event forwarded by CardGroup.",
    },
    children: { table: { disable: true } },
  },
  render: (args) => {
    const {
      cardSize,
      cardCount,
      showCardDividers,
      joined,
      gap,
      id,
      role,
      title,
      className,
      style,
      onClick,
      "aria-label": ariaLabel,
    } = args;

    const items = renderCardItems(cardCount, cardSize, showCardDividers);

    return (
      <div style={frameStyle}>
        <CardGroup
          joined={joined}
          gap={gap}
          id={id}
          role={role}
          title={title}
          className={className}
          style={style}
          aria-label={ariaLabel}
          onClick={onClick}
        >
          {items}
        </CardGroup>
      </div>
    );
  },
};
