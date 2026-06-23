import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FiCheck } from 'react-icons/fi';

import { Avatar } from '@keytuno/ui-react';

const sampleImage =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop&crop=faces';

const meta: Meta<typeof Avatar> = {
  title: 'Component/Avatar',
  component: Avatar,
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
  alignItems: 'center',
  flexWrap: 'wrap',
};

const stackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: 'min(860px, 92vw)',
};

export const AvatarExamples: Story = {
  name: 'Avatar',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Text, Image, Badge</h3>
      <div style={rowStyle}>
        <Avatar text="Mayur Joshi" size="md" />
        <Avatar
          avatarImage={{ src: sampleImage, alt: 'Mayur portrait' }}
          text="Mayur Joshi"
          size="md"
        />
        <Avatar text="MJ" size="md" badgeColor="#22c55e" />
        <Avatar
          avatarImage={{ src: sampleImage, alt: 'Mayur portrait' }}
          text="Mayur Joshi"
          size="md"
          badgeIcon={<FiCheck size={10} />}
        />
      </div>
    </div>
  ),
};

export const AvatarSizes: Story = {
  name: 'Avatar Sizes',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Sizes</h3>
      <div style={rowStyle}>
        <Avatar text="MJ" size="xs" />
        <Avatar text="MJ" size="sm" />
        <Avatar text="MJ" size="md" />
        <Avatar text="MJ" size="lg" />
      </div>
    </div>
  ),
};

export const AvatarActions: Story = {
  name: 'Avatar Actions',
  parameters: {
    docs: {
      description: {
        story:
          'Interactive avatars support keyboard activation with Enter or Space and emit action callbacks.',
      },
    },
  },
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Actionable Avatars</h3>
      <div style={rowStyle}>
        <Avatar text="Mayur Joshi" badgeColor="#22c55e" onAction={() => undefined} />
        <Avatar
          avatarImage={{ src: sampleImage, alt: 'Mayur portrait' }}
          text="Mayur Joshi"
          badgeIcon={<FiCheck size={10} />}
          onAction={() => undefined}
          aria-label="Open profile"
        />
      </div>
    </div>
  ),
};

export const AvatarPlayground: Story = {
  name: 'Avatar Playground',
  args: {
    size: 'md',
    text: 'Mayur Joshi',
    imageSrc: '',
    imageAlt: 'Avatar image',
    badgeType: 'none',
    badgeColor: '#22c55e',
    withAction: true,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    text: { control: 'text' },
    imageSrc: { control: 'text' },
    imageAlt: { control: 'text' },
    badgeType: {
      control: 'inline-radio',
      options: ['none', 'color', 'icon'],
    },
    badgeColor: { control: 'color' },
    withAction: { control: 'boolean' },
    onAction: { action: 'action' },
    onClick: { action: 'click' },
    avatarImage: { table: { disable: true } },
    badgeIcon: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: (args) => {
    const imageSrc = typeof args.imageSrc === 'string' ? args.imageSrc.trim() : '';
    const badgeType = args.badgeType;
    const withAction = args.withAction ?? false;

    return (
      <Avatar
        size={args.size}
        text={args.text}
        avatarImage={imageSrc === '' ? undefined : { src: imageSrc, alt: args.imageAlt }}
        badgeColor={badgeType === 'color' ? args.badgeColor : undefined}
        badgeIcon={badgeType === 'icon' ? <FiCheck size={10} /> : undefined}
        onAction={withAction ? args.onAction : undefined}
        onClick={withAction ? args.onClick : undefined}
      />
    );
  },
};
