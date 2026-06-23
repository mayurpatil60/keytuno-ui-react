import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FiActivity, FiBarChart2, FiPieChart, FiSettings } from 'react-icons/fi';

import {
  Badge,
  Button,
  Card,
  CardContent,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Tabs,
  type TabsItem,
} from '@keytuno/ui-react';

const portfolioContentStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const tabItems: TabsItem[] = [
  {
    value: 'overview',
    label: 'Overview',
    icon: <FiPieChart size={14} aria-hidden />,
    content: (
      <div style={portfolioContentStyle}>
        <h4 style={{ margin: 0 }}>Portfolio Snapshot</h4>
        <p style={{ margin: 0 }}>Track total exposure, P/L movement, and allocation health.</p>
        <div style={{ display: 'inline-flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Badge variant="secondary">Allocation: Balanced</Badge>
          <Badge variant="primary">Risk: Moderate</Badge>
        </div>
      </div>
    ),
  },
  {
    value: 'performance',
    label: 'Performance',
    icon: <FiBarChart2 size={14} aria-hidden />,
    content: (
      <div style={portfolioContentStyle}>
        <h4 style={{ margin: 0 }}>Performance Metrics</h4>
        <p style={{ margin: 0 }}>Review weekly returns, drawdowns, and benchmark comparison.</p>
        <Button size="sm" variant="outline">
          View Full Report
        </Button>
      </div>
    ),
  },
  {
    value: 'activity',
    label: 'Activity',
    icon: <FiActivity size={14} aria-hidden />,
    content: (
      <div style={portfolioContentStyle}>
        <h4 style={{ margin: 0 }}>Recent Activity</h4>
        <p style={{ margin: 0 }}>Last order synced 2 minutes ago with no execution errors.</p>
      </div>
    ),
  },
  {
    value: 'settings',
    label: 'Settings',
    icon: <FiSettings size={14} aria-hidden />,
    content: (
      <div style={portfolioContentStyle}>
        <h4 style={{ margin: 0 }}>Workspace Settings</h4>
        <p style={{ margin: 0 }}>
          Adjust notifications, data refresh cadence, and account defaults.
        </p>
      </div>
    ),
  },
];

const tabItemsWithCardContent: TabsItem[] = tabItems.map((item) => ({
  ...item,
  content: (
    <Card size="sm" spacing="sm">
      <CardContent>{item.content}</CardContent>
    </Card>
  ),
}));

const tabItemsWithoutIcons: TabsItem[] = tabItemsWithCardContent.map((item) => ({
  value: item.value,
  label: item.label,
  content: item.content,
}));

const meta: Meta<typeof Tabs> = {
  title: 'Component/Tabs',
  component: Tabs,
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
  width: 'min(920px, 94vw)',
};

const frameStyle: CSSProperties = {
  width: 'min(760px, 94vw)',
};

export const Basic: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic</h3>

      <Field style={frameStyle}>
        <FieldLabel htmlFor="tabs-basic">Portfolio Workspace</FieldLabel>

        <FieldContent>
          <Tabs items={tabItemsWithCardContent} defaultValue="overview" />
          <FieldDescription>
            Default line variant with top side and horizontal orientation.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Variants</h3>

      <FieldGroup style={frameStyle}>
        <Field>
          <FieldLabel htmlFor="tabs-variant-line">Line (Default)</FieldLabel>

          <FieldContent>
            <Tabs
              items={tabItemsWithCardContent}
              varient="line"
              defaultValue="overview"
              size="sm"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="tabs-variant-button">Button</FieldLabel>

          <FieldContent>
            <Tabs
              items={tabItemsWithCardContent}
              varient="button"
              defaultValue="performance"
              size="sm"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="tabs-variant-icon">Only Icon</FieldLabel>

          <FieldContent>
            <Tabs
              items={tabItemsWithCardContent}
              varient="only icon"
              defaultValue="activity"
              size="sm"
            />
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  ),
};

export const OrientationAndSide: Story = {
  name: 'Orientation & Side',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Orientation & Side</h3>

      <FieldGroup style={frameStyle}>
        <Field>
          <FieldLabel htmlFor="tabs-left-vertical">Vertical on Left</FieldLabel>

          <FieldContent>
            <Tabs
              items={tabItemsWithCardContent}
              varient="button"
              orientation="vertical"
              side="left"
              size="sm"
              defaultValue="overview"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="tabs-bottom-horizontal">Horizontal on Bottom</FieldLabel>

          <FieldContent>
            <Tabs
              items={tabItemsWithCardContent}
              varient="line"
              orientation="horizontal"
              side="bottom"
              size="sm"
              defaultValue="performance"
            />
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  ),
};

export const WithoutIcons: Story = {
  name: 'Without Icons',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Without Icons</h3>

      <Field style={frameStyle}>
        <FieldLabel htmlFor="tabs-without-icons">Text-Only Tabs</FieldLabel>

        <FieldContent>
          <Tabs items={tabItemsWithoutIcons} varient="button" defaultValue="overview" />
          <FieldDescription>
            Icons are optional. Tabs work with labels and content only.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const TabsPlayground: Story = {
  name: 'Tabs Playground',
  args: {
    varient: 'line',
    orientation: 'horizontal',
    size: 'md',
    side: 'top',
    disabled: false,
    defaultValue: 'overview',
    withAction: false,
  },
  argTypes: {
    varient: {
      control: 'select',
      options: ['line', 'button', 'only icon'],
    },
    variant: { table: { disable: true } },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    side: {
      control: 'select',
      options: ['left', 'top', 'bottom', 'right'],
    },
    disabled: { control: 'boolean' },
    defaultValue: {
      control: 'select',
      options: ['overview', 'performance', 'activity', 'settings'],
    },
    withAction: { control: 'boolean' },
    onAction: { action: 'action' },
    onValueChange: { action: 'value-change' },
    items: { table: { disable: true } },
    value: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;

    return (
      <Field style={frameStyle}>
        <FieldLabel htmlFor="tabs-playground">Interactive Playground</FieldLabel>

        <FieldContent>
          <Tabs
            key={`${args.varient}-${args.orientation}-${args.size}-${args.side}-${args.disabled}-${args.defaultValue}-${withAction}`}
            items={tabItemsWithCardContent}
            varient={args.varient}
            orientation={args.orientation}
            size={args.size}
            side={args.side}
            disabled={args.disabled}
            defaultValue={args.defaultValue}
            onAction={withAction ? args.onAction : undefined}
            onValueChange={withAction ? args.onValueChange : undefined}
          />

          <FieldDescription>
            Use controls to test variant, orientation, side positioning, and size.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};
