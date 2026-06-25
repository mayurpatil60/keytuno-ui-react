import type { Meta, StoryObj } from '@storybook/react';
import { FiEdit3, FiEye, FiSettings } from 'react-icons/fi';

import { Button, ButtonGroup, type ButtonGroupActionContext } from '@keytuno/ui-react';

const meta: Meta<typeof ButtonGroup> = {
  title: 'Actions/Button Group',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;
type CompactPlaygroundArgs = {
  orientation: 'horizontal' | 'vertical';
  size: 'xs' | 'sm' | 'md' | 'lg';
  variant: 'primary' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link';
  disabled: boolean;
  withLabels: boolean;
  withTooltips: boolean;
  onAction?: (context: ButtonGroupActionContext) => void;
};

export const ButtonGroupStory: Story = {
  name: 'Button Group',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ButtonGroup orientation="horizontal" size="md" variant="outline">
        <Button>Overview</Button>
        <Button>Orders</Button>
        <Button>Reports</Button>
      </ButtonGroup>

      <ButtonGroup orientation="vertical" size="sm" variant="secondary">
        <Button>Create</Button>
        <Button>Edit</Button>
        <Button>Delete</Button>
      </ButtonGroup>

      <ButtonGroup orientation="horizontal" size="sm" variant="ghost" disabled>
        <Button>Disabled 1</Button>
        <Button>Disabled 2</Button>
        <Button>Disabled 3</Button>
      </ButtonGroup>

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        <ButtonGroup
          orientation="horizontal"
          size="sm"
          variant="secondary"
          compact
          aria-label="Quick actions"
        >
          <Button aria-label="View" tooltip="View">
            <FiEye size={13} />
          </Button>
          <Button aria-label="Edit" tooltip="Edit">
            <FiEdit3 size={13} />
          </Button>
          <Button aria-label="Settings" tooltip="Settings">
            <FiSettings size={13} />
          </Button>
        </ButtonGroup>

        <ButtonGroup orientation="horizontal" size="sm" variant="outline" compact>
          <Button>
            <FiEye size={13} />
            <span>View</span>
          </Button>
          <Button>
            <FiEdit3 size={13} />
            <span>Edit</span>
          </Button>
          <Button>
            <FiSettings size={13} />
            <span>Config</span>
          </Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};

export const ButtonGroupPlayground: Story = {
  name: 'Button Group Playground',
  args: {
    orientation: 'horizontal',
    size: 'md',
    variant: 'outline',
    compact: false,
    disabled: false,
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    compact: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onAction: { action: 'group-action' },
    children: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: (args) => {
    const orientation = args.orientation ?? 'horizontal';
    const size = args.size ?? 'md';
    const variant = args.variant;
    const compact = args.compact ?? false;
    const disabled = args.disabled ?? false;
    const onAction = args.onAction;

    return (
      <ButtonGroup
        orientation={orientation}
        size={size}
        variant={variant}
        compact={compact}
        disabled={disabled}
        onAction={onAction}
      >
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    );
  },
};

export const CompactTriplePlayground: StoryObj<CompactPlaygroundArgs> = {
  name: 'Compact Triple Playground',
  args: {
    orientation: 'horizontal',
    size: 'sm',
    variant: 'secondary',
    disabled: false,
    withLabels: false,
    withTooltips: true,
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    disabled: { control: 'boolean' },
    withLabels: { control: 'boolean' },
    withTooltips: { control: 'boolean' },
    onAction: { action: 'group-action' },
  },
  render: (args) => {
    const orientation = args.orientation ?? 'horizontal';
    const size = args.size ?? 'sm';
    const variant = args.variant ?? 'secondary';
    const disabled = args.disabled ?? false;
    const withLabels = args.withLabels ?? false;
    const withTooltips = args.withTooltips ?? true;
    const onAction = args.onAction;

    const iconSize = size === 'xs' ? 11 : size === 'sm' ? 12 : size === 'md' ? 13 : 14;

    return (
      <ButtonGroup
        orientation={orientation}
        size={size}
        variant={variant}
        compact
        disabled={disabled}
        onAction={onAction}
        aria-label="Compact actions"
      >
        <Button aria-label="View" tooltip={withTooltips ? 'View' : undefined}>
          <FiEye size={iconSize} />
          {withLabels ? <span>View</span> : null}
        </Button>

        <Button aria-label="Edit" tooltip={withTooltips ? 'Edit' : undefined}>
          <FiEdit3 size={iconSize} />
          {withLabels ? <span>Edit</span> : null}
        </Button>

        <Button aria-label="Settings" tooltip={withTooltips ? 'Settings' : undefined}>
          <FiSettings size={iconSize} />
          {withLabels ? <span>Settings</span> : null}
        </Button>
      </ButtonGroup>
    );
  },
};
