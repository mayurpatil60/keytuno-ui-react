import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Scrollbar } from '@keytuno/ui-react';

const meta: Meta<typeof Scrollbar> = {
  title: 'Component/Scrollbar',
  component: Scrollbar,
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

const frameBaseStyle: CSSProperties = {
  width: 'min(560px, 92vw)',
  border: '1px solid var(--ktn-border-muted)',
  borderRadius: 'var(--ktn-radius-md, 0.5rem)',
  backgroundColor: 'var(--ktn-bg-surface, #ffffff)',
};

const paragraphStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.84rem',
  color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
  lineHeight: 1.45,
};

const longParagraphs = [
  'Position sizing, entry quality, and stop discipline should be reviewed before any overnight trade execution.',
  'Use this area to monitor volatility shifts and watchlist updates without breaking layout consistency.',
  'Themed scrollbars help maintain visual continuity in both light and dark modes.',
  'Keep horizontal and vertical overflow manageable when rendering dense analytics blocks.',
  'This content is intentionally long so the vertical scrollbar appears clearly in Storybook.',
  'Reusable scrollbar behavior is useful for dialogs, dropdowns, side panels, and table wrappers.',
  'The thumb and track inherit design tokens to avoid default browser scrollbar mismatches.',
  'You can combine axis modes for matrix-like data where both directions can overflow.',
  'A compact and modern scrollbar keeps the UI clean while still discoverable.',
  'Always validate contrast and thumb visibility in low-contrast themes.',
];

function renderPlaygroundContent(axis: 'x' | 'y' | 'both'): JSX.Element {
  if (axis === 'x') {
    return (
      <div
        style={{
          display: 'inline-flex',
          gap: '0.5rem',
          minWidth: '980px',
          padding: '0.75rem',
        }}
      >
        {Array.from({ length: 14 }).map((_, index) => (
          <span
            key={`playground-pill-${index}`}
            style={{
              border: '1px solid var(--ktn-border-muted)',
              borderRadius: '999px',
              backgroundColor: 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.1))',
              color: 'var(--ktn-text-primary)',
              fontSize: '0.8rem',
              paddingInline: '0.7rem',
              paddingBlock: '0.3rem',
              whiteSpace: 'nowrap',
            }}
          >
            Segment {index + 1}
          </span>
        ))}
      </div>
    );
  }

  if (axis === 'both') {
    return (
      <div
        style={{
          minWidth: '920px',
          minHeight: '300px',
          padding: '0.75rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(10rem, 1fr))',
          gap: '0.6rem',
        }}
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={`playground-grid-${index}`}
            style={{
              border: '1px solid var(--ktn-border-muted)',
              borderRadius: 'var(--ktn-radius-sm, 0.375rem)',
              backgroundColor: 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.1))',
              padding: '0.5rem',
              color: 'var(--ktn-text-primary)',
              fontSize: '0.8rem',
              minHeight: '3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Cell {index + 1}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: '0.75rem' }}>
      {longParagraphs.map((paragraph, index) => (
        <p key={`playground-para-${index}`} style={paragraphStyle}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export const Vertical: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Vertical</h3>

      <Scrollbar axis="y" style={{ ...frameBaseStyle, height: '14rem' }}>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: '0.75rem' }}
        >
          {longParagraphs.map((paragraph, index) => (
            <p key={`vertical-para-${index}`} style={paragraphStyle}>
              {paragraph}
            </p>
          ))}
        </div>
      </Scrollbar>
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Horizontal</h3>

      <Scrollbar axis="x" style={frameBaseStyle}>
        <div
          style={{
            display: 'inline-flex',
            gap: '0.5rem',
            minWidth: '980px',
            padding: '0.75rem',
          }}
        >
          {Array.from({ length: 14 }).map((_, index) => (
            <span
              key={`horizontal-pill-${index}`}
              style={{
                border: '1px solid var(--ktn-border-muted)',
                borderRadius: '999px',
                backgroundColor: 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.1))',
                color: 'var(--ktn-text-primary)',
                fontSize: '0.8rem',
                paddingInline: '0.7rem',
                paddingBlock: '0.3rem',
                whiteSpace: 'nowrap',
              }}
            >
              Instrument {index + 1}
            </span>
          ))}
        </div>
      </Scrollbar>
    </div>
  ),
};

export const BothAxes: Story = {
  name: 'Both Axes',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Both Axes</h3>

      <Scrollbar axis="both" style={{ ...frameBaseStyle, height: '14rem' }}>
        <div
          style={{
            minWidth: '920px',
            minHeight: '300px',
            padding: '0.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(10rem, 1fr))',
            gap: '0.6rem',
          }}
        >
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={`both-grid-${index}`}
              style={{
                border: '1px solid var(--ktn-border-muted)',
                borderRadius: 'var(--ktn-radius-sm, 0.375rem)',
                backgroundColor: 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.1))',
                padding: '0.5rem',
                color: 'var(--ktn-text-primary)',
                fontSize: '0.8rem',
                minHeight: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Grid Cell {index + 1}
            </div>
          ))}
        </div>
      </Scrollbar>
    </div>
  ),
};

export const ScrollbarPlayground: Story = {
  name: 'Scrollbar Playground',
  args: {
    axis: 'y',
    withAction: false,
  },
  argTypes: {
    axis: {
      control: 'inline-radio',
      options: ['x', 'y', 'both'],
    },
    withAction: { control: 'boolean' },
    onAction: { action: 'action' },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    onCopy: { table: { disable: true } },
    onCut: { table: { disable: true } },
    onPaste: { table: { disable: true } },
  },
  render: (args) => {
    const axis = args.axis ?? 'y';
    const withAction = args.withAction ?? false;

    return (
      <Scrollbar
        axis={axis}
        onAction={withAction ? args.onAction : undefined}
        style={{
          ...frameBaseStyle,
          ...(axis === 'x' ? {} : { height: '14rem' }),
        }}
      >
        {renderPlaygroundContent(axis)}
      </Scrollbar>
    );
  },
};
