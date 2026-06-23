import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  FiActivity,
  FiBarChart2,
  FiBell,
  FiBookmark,
  FiBriefcase,
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiPieChart,
  FiSettings,
  FiShield,
  FiTrendingUp,
} from 'react-icons/fi';

import { Card, CardContent, CardHeader, CardTitle } from '@keytuno/ui-react';

const iconMap = {
  activity: FiActivity,
  chart: FiBarChart2,
  bell: FiBell,
  bookmark: FiBookmark,
  briefcase: FiBriefcase,
  calendar: FiCalendar,
  card: FiCreditCard,
  dollar: FiDollarSign,
  pie: FiPieChart,
  settings: FiSettings,
  shield: FiShield,
  trend: FiTrendingUp,
} as const;

type IconName = keyof typeof iconMap;

interface IconPlaygroundArgs {
  name: IconName;
  size: number;
  color: string;
}

const meta: Meta<IconPlaygroundArgs> = {
  title: 'Icons/Gallery',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: '0.75rem',
  width: 'min(920px, 94vw)',
};

const iconTileStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.85rem 0.7rem',
  border: '1px solid var(--ktn-border-muted)',
  borderRadius: 'var(--ktn-radius-md, 0.5rem)',
  backgroundColor: 'var(--ktn-bg-surface, #ffffff)',
  color: 'var(--ktn-text-primary)',
  minHeight: '5.75rem',
};

export const IconGrid: Story = {
  name: 'Icon Grid',
  render: () => (
    <div style={gridStyle}>
      {(
        Object.entries(iconMap) as Array<[IconName, (props: { size?: number }) => JSX.Element]>
      ).map(([name, IconComponent]) => (
        <div key={name} style={iconTileStyle}>
          <IconComponent size={20} />
          <span
            style={{
              fontSize: '0.78rem',
              lineHeight: 1.3,
              color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const IconPlayground: Story = {
  name: 'Icon Playground',
  args: {
    name: 'activity',
    size: 28,
    color: 'var(--ktn-action-primary-bg)',
  },
  argTypes: {
    name: {
      control: 'select',
      options: Object.keys(iconMap),
    },
    size: {
      control: { type: 'number', min: 12, max: 64, step: 2 },
    },
    color: {
      control: 'color',
    },
  },
  render: (args) => {
    const narrowedArgs = args as Partial<IconPlaygroundArgs>;
    const selectedName = (narrowedArgs.name ?? 'activity') as IconName;
    const SelectedIcon = iconMap[selectedName];

    return (
      <Card style={{ width: 'min(360px, 92vw)' }}>
        <CardHeader>
          <CardTitle>Icon Playground</CardTitle>
        </CardHeader>

        <CardContent>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '6.5rem',
              border: '1px dashed var(--ktn-border-muted)',
              borderRadius: 'var(--ktn-radius-md, 0.5rem)',
              color: narrowedArgs.color,
            }}
          >
            <SelectedIcon size={narrowedArgs.size} />
          </div>
        </CardContent>
      </Card>
    );
  },
};
