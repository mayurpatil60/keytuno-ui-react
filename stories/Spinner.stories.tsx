import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Spinner } from '@keytuno/ui-react';

const meta: Meta<typeof Spinner> = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const stackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: 'min(860px, 92vw)',
};

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(100px, 1fr))',
  gap: '0.75rem',
};

const itemStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.75rem',
  border: '1px solid var(--ktn-border-muted)',
  borderRadius: 'var(--ktn-radius-md)',
};

const labelStyle: CSSProperties = {
  fontSize: '0.8125rem',
  color: 'var(--ktn-text-secondary)',
};

export const SpinnerSizes: Story = {
  name: 'Spinner Sizes',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Sizes</h3>
      <div style={rowStyle}>
        <div style={itemStyle}>
          <Spinner size="xs" />
          <span style={labelStyle}>xs</span>
        </div>
        <div style={itemStyle}>
          <Spinner size="sm" />
          <span style={labelStyle}>sm</span>
        </div>
        <div style={itemStyle}>
          <Spinner size="md" />
          <span style={labelStyle}>md</span>
        </div>
        <div style={itemStyle}>
          <Spinner size="lg" />
          <span style={labelStyle}>lg</span>
        </div>
      </div>
    </div>
  ),
};

export const SpinnerPlayground: Story = {
  name: 'Spinner Playground',
  args: {
    size: 'md',
    decorative: false,
    withAction: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    decorative: { control: 'boolean' },
    withAction: { control: 'boolean' },
    onAction: { action: 'action' },
    onClick: { action: 'click' },
    onFocus: { action: 'focus' },
    onBlur: { action: 'blur' },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;

    return (
      <Spinner
        key={`${args.size}-${args.decorative}-${withAction}`}
        size={args.size}
        decorative={args.decorative}
        onAction={withAction ? args.onAction : undefined}
        onClick={withAction ? args.onClick : undefined}
        onFocus={withAction ? args.onFocus : undefined}
        onBlur={withAction ? args.onBlur : undefined}
        tabIndex={withAction ? 0 : undefined}
      />
    );
  },
};
