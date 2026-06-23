import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FiChevronRight } from 'react-icons/fi';

import { Breadcrumb, type BreadcrumbActionContext, type BreadcrumbItem } from '@keytuno/ui-react';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Component/Breadcrumb',
  component: Breadcrumb,
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

const defaultItems = [
  { label: 'Dashboard', href: '#' },
  { label: 'Portfolio', href: '#' },
  { label: 'Overview', href: '#' },
  { label: 'Current Page' },
];

const mixedItems = [
  { label: 'Home', href: '#' },
  { label: 'Settings' },
  { label: 'Billing' },
  { label: 'Invoices' },
  { label: 'Current Page' },
];

export const BreadcrumbLinks: Story = {
  name: 'Breadcrumb Links',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Links and plain text items</h3>
      <Breadcrumb items={defaultItems} />
      <Breadcrumb items={mixedItems} />
    </div>
  ),
};

export const BreadcrumbSizes: Story = {
  name: 'Breadcrumb Sizes',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Sizes</h3>
      <Breadcrumb size="xs" items={defaultItems} />
      <Breadcrumb size="sm" items={defaultItems} />
      <Breadcrumb size="md" items={defaultItems} />
      <Breadcrumb size="lg" items={defaultItems} />
    </div>
  ),
};

export const BreadcrumbEllipsisAndSeparator: Story = {
  name: 'Breadcrumb Ellipsis and Separator',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Collapsed with custom separator</h3>
      <Breadcrumb
        items={[
          { label: 'Workspace', href: '#' },
          { label: 'Applications', href: '#' },
          { label: 'Investment', href: '#' },
          { label: 'Mutual Funds', href: '#' },
          { label: 'SIP', href: '#' },
          { label: 'Create Plan' },
        ]}
        maxVisibleItems={4}
        separator={<FiChevronRight size={12} aria-hidden />}
      />
    </div>
  ),
};

export const BreadcrumbActions: Story = {
  name: 'Breadcrumb Actions',
  args: {
    onAction: undefined,
  },
  argTypes: {
    onAction: {
      action: 'action',
      description: 'Fires when a breadcrumb item with href or action behavior is activated.',
    },
  },
  render: (args) => {
    const onAction = args.onAction;

    const items = [
      { label: 'Workspace', href: '#' },
      { label: 'Reports', ariaLabel: 'Open reports' },
      { label: 'Create Report' },
    ];

    const handleAction =
      onAction == null
        ? undefined
        : (context: BreadcrumbActionContext) => {
            context.event.preventDefault();
            onAction(context);
          };

    return (
      <div style={stackStyle}>
        <h3 style={{ margin: 0 }}>Clickable and action items</h3>
        <Breadcrumb items={items} onAction={handleAction} />
      </div>
    );
  },
};

export const BreadcrumbPlayground: Story = {
  name: 'Breadcrumb Playground',
  args: {
    size: 'md',
    maxVisibleItems: 4,
    separatorType: 'slash',
    includeLinks: true,
    includeActions: true,
    onAction: undefined,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    maxVisibleItems: {
      control: 'number',
    },
    separatorType: {
      control: 'inline-radio',
      options: ['slash', 'chevron'],
    },
    includeLinks: {
      control: 'boolean',
    },
    includeActions: {
      control: 'boolean',
    },
    onAction: {
      action: 'action',
    },
    items: { table: { disable: true } },
    separator: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const separator =
      args.separatorType === 'chevron' ? <FiChevronRight size={12} aria-hidden /> : '/';
    const onAction = args.onAction;
    const includeActions = args.includeActions ?? false;

    const handleAction =
      onAction == null
        ? undefined
        : (context: BreadcrumbActionContext) => {
            context.event.preventDefault();
            onAction(context);
          };

    const baseItems: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '#' },
      { label: 'Portfolio', href: '#' },
      { label: 'Watchlist', href: '#' },
      { label: 'Market Alerts', href: '#' },
      { label: 'Create Alert' },
    ];

    const items = baseItems
      .map<BreadcrumbItem>((item, index) => {
        if (!args.includeLinks) {
          return {
            ...item,
            href: undefined,
            ariaLabel: includeActions && index !== 4 ? `Open ${item.label}` : undefined,
          };
        }

        if (index === 4) {
          return {
            ...item,
            href: undefined,
          };
        }

        return item;
      })
      .map<BreadcrumbItem>((item, index) => {
        if (!includeActions || index === 4) {
          return item;
        }

        return {
          ...item,
          ariaLabel: item.ariaLabel ?? `Open ${item.label}`,
        };
      });

    return (
      <Breadcrumb
        size={args.size}
        items={items}
        maxVisibleItems={args.maxVisibleItems}
        separator={separator}
        onAction={includeActions ? handleAction : undefined}
      />
    );
  },
};
