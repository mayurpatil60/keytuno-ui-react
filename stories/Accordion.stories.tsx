import type { Meta, StoryObj } from '@storybook/react';

import { Accordion, Button } from '@keytuno/ui-react';

const demoItems = [
  {
    id: 'item-1',
    title: 'What is Finvesto?',
    content: 'Finvesto is a modular finance UI system with reusable web and mobile components.',
  },
  {
    id: 'item-2',
    title: 'Can I open multiple items?',
    content:
      'Yes. Enable the multiple prop to allow opening several accordion panels at the same time.',
  },
  {
    id: 'item-3',
    title: 'Does it support disabled state?',
    content: 'Yes. You can disable the whole accordion or specific items.',
  },
];

const demoItemsWithActions = [
  {
    id: 'item-1',
    title: 'Overview settings',
    content: 'Configure layout and defaults for this section.',
    actions: (
      <Button size="xs" variant="ghost" compact>
        Edit
      </Button>
    ),
  },
  {
    id: 'item-2',
    title: 'Notification preferences',
    content: 'Fine-tune who gets notified and when.',
    actions: (
      <Button size="xs" variant="outline" compact>
        Configure
      </Button>
    ),
  },
  {
    id: 'item-3',
    title: 'Advanced controls',
    content: 'Review advanced controls before enabling them.',
    actions: (
      <Button size="xs" variant="secondary" compact>
        Review
      </Button>
    ),
  },
];

const meta: Meta<typeof Accordion> = {
  title: 'Component/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const AccordionStory: Story = {
  name: 'Accordion',
  render: () => (
    <div
      style={{ width: 'min(920px, 92vw)', display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <Accordion items={demoItems} orientation="horizontal" size="md" />
      <Accordion items={demoItems} orientation="vertical" size="sm" multiple />
    </div>
  ),
};

export const AccordionPlayground: Story = {
  name: 'Accordion Playground',
  args: {
    orientation: 'vertical',
    size: 'md',
    disabled: false,
    multiple: true,
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
    disabled: { control: 'boolean' },
    multiple: {
      control: 'boolean',
      description: 'Whether multiple items can be open at the same time.',
    },
    items: { table: { disable: true } },
    defaultOpenItems: { table: { disable: true } },
    onOpenItemsChange: {
      action: 'open-items-change',
      description: 'Fires with the currently open item IDs whenever expansion changes.',
    },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: (args) => {
    const orientation = args.orientation ?? 'vertical';
    const size = args.size ?? 'md';
    const disabled = args.disabled ?? false;
    const multiple = args.multiple ?? false;
    const onOpenItemsChange = args.onOpenItemsChange;

    return (
      <div style={{ width: 'min(920px, 92vw)' }}>
        <Accordion
          items={demoItems}
          orientation={orientation}
          size={size}
          disabled={disabled}
          multiple={multiple}
          onOpenItemsChange={onOpenItemsChange}
        />
      </div>
    );
  },
};

export const AccordionWithActions: Story = {
  name: 'Accordion With Actions',
  parameters: {
    docs: {
      description: {
        story:
          'Header actions are rendered next to each accordion trigger. Opening and closing panels uses a smooth transition to avoid visual blinking.',
      },
    },
  },
  render: () => (
    <div style={{ width: 'min(920px, 92vw)' }}>
      <Accordion items={demoItemsWithActions} multiple defaultOpenItems={['item-1']} />
    </div>
  ),
};

export const AccordionMultiplePlayground: Story = {
  name: 'Accordion Multiple Playground',
  args: {
    orientation: 'vertical',
    size: 'sm',
    disabled: false,
    multiple: true,
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
    disabled: { control: 'boolean' },
    multiple: {
      control: 'boolean',
      description: 'Whether multiple items can be open at the same time.',
    },
    items: { table: { disable: true } },
    defaultOpenItems: { table: { disable: true } },
    onOpenItemsChange: {
      action: 'open-items-change',
      description: 'Fires with the currently open item IDs whenever expansion changes.',
    },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: (args) => {
    const orientation = args.orientation ?? 'vertical';
    const size = args.size ?? 'md';
    const disabled = args.disabled ?? false;
    const multiple = args.multiple ?? true;
    const onOpenItemsChange = args.onOpenItemsChange;

    return (
      <div style={{ width: 'min(920px, 92vw)' }}>
        <Accordion
          items={demoItems}
          orientation={orientation}
          size={size}
          disabled={disabled}
          multiple={multiple}
          defaultOpenItems={['item-1', 'item-2']}
          onOpenItemsChange={onOpenItemsChange}
        />
      </div>
    );
  },
};
