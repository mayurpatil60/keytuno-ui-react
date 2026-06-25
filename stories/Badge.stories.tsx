import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from '@keytuno/ui-react';

const meta: Meta<typeof Badge> = {
  title: 'Feedback/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const rowStyle: CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
};

const stackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: 'min(860px, 92vw)',
};

export const BadgeVariants: Story = {
  name: 'Badge Variants',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Variants</h3>
      <div style={rowStyle}>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="ghost">Ghost</Badge>
        <Badge variant="link">Link</Badge>
      </div>
    </div>
  ),
};

export const BadgeSizes: Story = {
  name: 'Badge Sizes',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Sizes</h3>
      <div style={rowStyle}>
        <Badge size="xs">XS</Badge>
        <Badge size="sm">SM</Badge>
        <Badge size="md">MD</Badge>
        <Badge size="lg">LG</Badge>
      </div>
    </div>
  ),
};

export const BadgeActions: Story = {
  name: 'Badge Actions',
  parameters: {
    docs: {
      description: {
        story:
          'Actionable badges are keyboard-accessible and can trigger action callbacks on click, Enter, or Space.',
      },
    },
  },
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Actionable Badges</h3>
      <div style={rowStyle}>
        <Badge variant="primary" onAction={() => undefined}>
          Active
        </Badge>
        <Badge variant="outline" onAction={() => undefined}>
          Review
        </Badge>
        <Badge variant="link" onAction={() => undefined} aria-label="Open details">
          Details
        </Badge>
      </div>
    </div>
  ),
};

export const BadgePlayground: Story = {
  name: 'Badge Playground',
  args: {
    children: 'Badge',
    variant: 'primary',
    size: 'md',
    withAction: false,
  },
  argTypes: {
    children: { control: 'text' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    withAction: { control: 'boolean' },
    onAction: { action: 'action' },
    onClick: { action: 'click' },
    varient: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: (args) => {
    const label = typeof args.children === 'string' ? args.children : 'Badge';
    const withAction = args.withAction ?? false;

    return (
      <Badge
        variant={args.variant}
        size={args.size}
        onAction={withAction ? args.onAction : undefined}
        onClick={withAction ? args.onClick : undefined}
      >
        {label}
      </Badge>
    );
  },
};
