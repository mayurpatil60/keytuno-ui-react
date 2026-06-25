import { useMemo, useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox, type CheckboxActionContext } from '@keytuno/ui-react';

const meta: Meta<typeof Checkbox> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
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
  gap: '0.875rem',
  width: 'min(860px, 92vw)',
};

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  flexWrap: 'wrap',
};

type GroupState = Record<string, boolean>;

function CheckboxGroupDemo(): JSX.Element {
  const [values, setValues] = useState<GroupState>({
    profile: true,
    notifications: false,
    reports: true,
  });

  const options: Array<{ key: keyof GroupState; label: string }> = [
    { key: 'profile', label: 'Profile access' },
    { key: 'notifications', label: 'Email notifications' },
    { key: 'reports', label: 'Weekly reports' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      {options.map((option) => (
        <Checkbox
          key={option.key}
          checked={values[option.key]}
          onCheckedChange={(next) => {
            setValues((current) => ({
              ...current,
              [option.key]: next,
            }));
          }}
        >
          {option.label}
        </Checkbox>
      ))}
    </div>
  );
}

type TableRow = {
  id: string;
  instrument: string;
  exchange: string;
};

const tableRows: TableRow[] = [
  { id: 'row-nifty', instrument: 'NIFTY 50', exchange: 'NSE' },
  { id: 'row-banknifty', instrument: 'BANKNIFTY', exchange: 'NSE' },
  { id: 'row-fin', instrument: 'FINNIFTY', exchange: 'NSE' },
];

function CheckboxTableDemo(): JSX.Element {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({
    'row-nifty': true,
    'row-banknifty': false,
    'row-fin': false,
  });

  const allSelected = useMemo(
    () => tableRows.every((row) => selectedRows[row.id] === true),
    [selectedRows],
  );

  const tableStyle: CSSProperties = {
    width: 'min(640px, 92vw)',
    borderCollapse: 'collapse',
    border: '1px solid var(--ktn-border-muted)',
    borderRadius: '0.5rem',
    overflow: 'hidden',
  };

  const thStyle: CSSProperties = {
    textAlign: 'left',
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--ktn-text-primary)',
    borderBottom: '1px solid var(--ktn-border-muted)',
    padding: '0.625rem 0.75rem',
    backgroundColor: 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.08))',
  };

  const tdStyle: CSSProperties = {
    fontSize: '0.8125rem',
    color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
    borderBottom: '1px solid var(--ktn-border-muted)',
    padding: '0.625rem 0.75rem',
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={{ ...thStyle, width: '2.75rem' }}>
            <Checkbox
              checked={allSelected}
              onCheckedChange={(next) => {
                const nextState = tableRows.reduce<Record<string, boolean>>((acc, row) => {
                  acc[row.id] = next;
                  return acc;
                }, {});

                setSelectedRows(nextState);
              }}
              aria-label="Select all rows"
            />
          </th>
          <th style={thStyle}>Instrument</th>
          <th style={thStyle}>Exchange</th>
        </tr>
      </thead>

      <tbody>
        {tableRows.map((row, index) => (
          <tr key={row.id}>
            <td style={tdStyle}>
              <Checkbox
                checked={selectedRows[row.id] === true}
                onCheckedChange={(next) => {
                  setSelectedRows((current) => ({
                    ...current,
                    [row.id]: next,
                  }));
                }}
                aria-label={`Select ${row.instrument}`}
              />
            </td>
            <td style={tdStyle}>{row.instrument}</td>
            <td
              style={{
                ...tdStyle,
                borderBottom: index === tableRows.length - 1 ? 0 : tdStyle.borderBottom,
              }}
            >
              {row.exchange}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const Basic: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic</h3>
      <div style={rowStyle}>
        <Checkbox>Unchecked</Checkbox>
        <Checkbox defaultChecked>Checked</Checkbox>
        <Checkbox invalid>Invalid</Checkbox>
      </div>
    </div>
  ),
};

export const Description: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Description</h3>
      <Checkbox description="You will receive product and release updates.">Email alerts</Checkbox>
      <Checkbox invalid description="Please accept terms before continuing." defaultChecked={false}>
        Accept terms and conditions
      </Checkbox>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Disabled</h3>
      <div style={rowStyle}>
        <Checkbox disabled>Disabled</Checkbox>
        <Checkbox disabled defaultChecked>
          Disabled Checked
        </Checkbox>
        <Checkbox disabled invalid>
          Disabled Invalid
        </Checkbox>
      </div>
    </div>
  ),
};

export const Group: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Group</h3>
      <CheckboxGroupDemo />
    </div>
  ),
};

export const Table: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Table</h3>
      <CheckboxTableDemo />
    </div>
  ),
};

export const Actions: Story = {
  name: 'Checkbox Actions',
  args: {
    onAction: undefined,
    onCheckedChange: undefined,
  },
  argTypes: {
    onAction: {
      action: 'action',
      description: 'Fires with checked state and native change event when checkbox toggles.',
    },
    onCheckedChange: {
      action: 'checked-change',
      description: 'Fires with next checked value.',
    },
  },
  render: (args) => {
    const onAction = args.onAction;
    const onCheckedChange = args.onCheckedChange;

    const handleAction =
      onAction == null
        ? undefined
        : (context: CheckboxActionContext) => {
            onAction(context);
          };

    return (
      <div style={stackStyle}>
        <h3 style={{ margin: 0 }}>Action Events</h3>
        <Checkbox
          defaultChecked={false}
          description="Toggle to emit action callbacks."
          onAction={handleAction}
          onCheckedChange={onCheckedChange}
        >
          Enable strategy alerts
        </Checkbox>
      </div>
    );
  },
};

export const CheckboxPlayground: Story = {
  name: 'Checkbox Playground',
  args: {
    size: 'md',
    children: 'Enable notifications',
    description: 'Receive release and product updates.',
    defaultChecked: false,
    disabled: false,
    invalid: false,
    required: false,
    withAction: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    children: { control: 'text' },
    description: { control: 'text' },
    defaultChecked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    withAction: { control: 'boolean' },
    onAction: { action: 'action' },
    onCheckedChange: { action: 'checked-change' },
    checked: { table: { disable: true } },
    onChange: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const label = typeof args.children === 'string' ? args.children : 'Enable notifications';
    const description =
      typeof args.description === 'string' && args.description.trim() !== ''
        ? args.description
        : undefined;
    const withAction = args.withAction ?? false;

    return (
      <Checkbox
        key={`${args.size}-${args.defaultChecked}-${args.disabled}-${args.invalid}-${args.required}-${label}`}
        size={args.size}
        defaultChecked={args.defaultChecked}
        disabled={args.disabled}
        invalid={args.invalid}
        required={args.required}
        description={description}
        onAction={withAction ? args.onAction : undefined}
        onCheckedChange={withAction ? args.onCheckedChange : undefined}
      >
        {label}
      </Checkbox>
    );
  },
};
