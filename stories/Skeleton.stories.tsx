import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Skeleton,
} from '@keytuno/ui-react';

const meta: Meta<typeof Skeleton> = {
  title: 'Component/Skeleton',
  component: Skeleton,
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

const frameStyle: CSSProperties = {
  width: 'min(560px, 92vw)',
};

const listRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto',
  gap: '0.75rem',
  alignItems: 'center',
};

export const Avatar: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Avatar</h3>

      <Field style={frameStyle}>
        <FieldLabel>Avatar Skeleton</FieldLabel>

        <FieldContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Skeleton width="2.75rem" height="2.75rem" radius="full" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                <Skeleton width="42%" height="0.875rem" />
                <Skeleton width="68%" height="0.75rem" radius="sm" />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Skeleton width="2.75rem" height="2.75rem" radius="full" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
                <Skeleton width="38%" height="0.875rem" />
                <Skeleton width="62%" height="0.75rem" radius="sm" />
              </div>
            </div>
          </div>

          <FieldDescription>Avatar placeholders with title and subtitle shimmer.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const CardSkeleton: Story = {
  name: 'Card',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Card</h3>

      <Field style={frameStyle}>
        <FieldLabel>Card Skeleton</FieldLabel>

        <FieldContent>
          <Card style={{ width: '100%' }}>
            <CardHeader>
              <CardTitle>
                <Skeleton width="38%" height="1rem" />
              </CardTitle>
              <Skeleton width="62%" height="0.85rem" radius="sm" />
            </CardHeader>

            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Skeleton width="100%" height="0.8rem" radius="sm" />
                <Skeleton width="96%" height="0.8rem" radius="sm" />
                <Skeleton width="82%" height="0.8rem" radius="sm" />
                <Skeleton
                  width="6.5rem"
                  height="1.9rem"
                  radius="md"
                  style={{ marginTop: '0.35rem' }}
                />
              </div>
            </CardContent>
          </Card>

          <FieldDescription>
            Card loading state built with existing Card primitives.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Text: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Text</h3>

      <Field style={frameStyle}>
        <FieldLabel>Text Skeleton</FieldLabel>

        <FieldContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <Skeleton width="72%" height="0.95rem" />
            <Skeleton width="100%" height="0.8rem" radius="sm" />
            <Skeleton width="96%" height="0.8rem" radius="sm" />
            <Skeleton width="88%" height="0.8rem" radius="sm" />
            <Skeleton width="64%" height="0.8rem" radius="sm" />
          </div>

          <FieldDescription>Use varying widths to mimic natural reading rhythm.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Form: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Form</h3>

      <FieldGroup style={frameStyle}>
        <Field>
          <FieldLabel>Profile Form Skeleton</FieldLabel>

          <FieldContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <Skeleton width="5.5rem" height="0.72rem" radius="sm" />
                <Skeleton width="100%" height="2.2rem" radius="md" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <Skeleton width="7rem" height="0.72rem" radius="sm" />
                <Skeleton width="100%" height="2.2rem" radius="md" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <Skeleton width="4.25rem" height="0.72rem" radius="sm" />
                <Skeleton width="100%" height="5rem" radius="md" />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <Skeleton width="5.5rem" height="2rem" radius="md" />
                <Skeleton width="6.25rem" height="2rem" radius="md" />
              </div>
            </div>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  ),
};

export const Table: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Table</h3>

      <Field style={frameStyle}>
        <FieldLabel>Table Skeleton</FieldLabel>

        <FieldContent>
          <div
            style={{
              border: '1px solid var(--ktn-border-muted)',
              borderRadius: 'var(--ktn-radius-md, 0.5rem)',
              overflow: 'hidden',
              backgroundColor: 'var(--ktn-bg-surface, #ffffff)',
            }}
          >
            <div style={{ ...listRowStyle, padding: '0.65rem 0.85rem' }}>
              <Skeleton width="7rem" height="0.72rem" radius="sm" />
              <Skeleton width="4rem" height="0.72rem" radius="sm" />
            </div>

            <div style={{ ...listRowStyle, padding: '0.65rem 0.85rem' }}>
              <Skeleton width="58%" height="0.82rem" radius="sm" />
              <Badge size="sm" variant="secondary">
                <Skeleton width="2.9rem" height="0.65rem" radius="full" />
              </Badge>
            </div>

            <div style={{ ...listRowStyle, padding: '0.65rem 0.85rem' }}>
              <Skeleton width="63%" height="0.82rem" radius="sm" />
              <Badge size="sm" variant="outline">
                <Skeleton width="2.5rem" height="0.65rem" radius="full" />
              </Badge>
            </div>

            <div style={{ ...listRowStyle, padding: '0.65rem 0.85rem' }}>
              <Skeleton width="52%" height="0.82rem" radius="sm" />
              <Badge size="sm" variant="secondary">
                <Skeleton width="2.8rem" height="0.65rem" radius="full" />
              </Badge>
            </div>
          </div>

          <FieldDescription>Table placeholders for list and status cells.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const SkeletonPlayground: Story = {
  name: 'Skeleton Playground',
  args: {
    width: '100%',
    height: '1rem',
    radius: 'md',
    animated: true,
    decorative: true,
    withAction: false,
  },
  argTypes: {
    width: { control: 'text' },
    height: { control: 'text' },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    animated: { control: 'boolean' },
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
      <Field style={frameStyle}>
        <FieldLabel>Playground</FieldLabel>

        <FieldContent>
          <div
            style={{
              border: '1px dashed var(--ktn-border-muted)',
              borderRadius: 'var(--ktn-radius-md, 0.5rem)',
              padding: '0.7rem',
            }}
          >
            <Skeleton
              key={`${args.width}-${args.height}-${args.radius}-${args.animated}-${args.decorative}-${withAction}`}
              width={args.width}
              height={args.height}
              radius={args.radius}
              animated={args.animated}
              decorative={args.decorative}
              onAction={withAction ? args.onAction : undefined}
              onClick={withAction ? args.onClick : undefined}
              onFocus={withAction ? args.onFocus : undefined}
              onBlur={withAction ? args.onBlur : undefined}
              tabIndex={withAction ? 0 : undefined}
            />
          </div>

          <FieldDescription>
            Adjust dimensions, radius, and animation from controls.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};
