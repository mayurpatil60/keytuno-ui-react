import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FiAtSign, FiSearch } from 'react-icons/fi';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
} from '@keytuno/ui-react';

const meta: Meta<typeof Input> = {
  title: 'Component/Input',
  component: Input,
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

const iconWrapStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
};

const leadingIconStyle: CSSProperties = {
  position: 'absolute',
  insetInlineStart: '0.625rem',
  insetBlockStart: '50%',
  transform: 'translateY(-50%)',
  color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
  lineHeight: 0,
  pointerEvents: 'none',
  zIndex: 1,
};

const trailingIconStyle: CSSProperties = {
  position: 'absolute',
  insetInlineEnd: '0.625rem',
  insetBlockStart: '50%',
  transform: 'translateY(-50%)',
  color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
  lineHeight: 0,
  pointerEvents: 'none',
  zIndex: 1,
};

export const Basic: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic</h3>

      <Field style={frameStyle}>
        <FieldLabel htmlFor="input-basic-name">Name</FieldLabel>

        <FieldContent>
          <Input id="input-basic-name" placeholder="Enter your full name" />
          <FieldDescription>This value appears on your public profile.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Sizes</h3>

      <FieldGroup style={frameStyle}>
        <Field>
          <FieldLabel htmlFor="input-size-xs">Extra Small</FieldLabel>

          <FieldContent>
            <Input id="input-size-xs" size="xs" placeholder="XS input" />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="input-size-sm">Small</FieldLabel>

          <FieldContent>
            <Input id="input-size-sm" size="sm" placeholder="SM input" />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="input-size-md">Medium</FieldLabel>

          <FieldContent>
            <Input id="input-size-md" size="md" placeholder="MD input" />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="input-size-lg">Large</FieldLabel>

          <FieldContent>
            <Input id="input-size-lg" size="lg" placeholder="LG input" />
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Required</h3>

      <Field required style={frameStyle}>
        <FieldLabel htmlFor="input-required-email">Email</FieldLabel>

        <FieldContent>
          <Input id="input-required-email" type="email" required placeholder="name@example.com" />
          <FieldDescription>This field is marked as required.</FieldDescription>
        </FieldContent>
      </Field>

      <Field invalid required style={frameStyle}>
        <FieldLabel htmlFor="input-required-error">PAN Number</FieldLabel>

        <FieldContent>
          <Input id="input-required-error" required invalid placeholder="ABCDE1234F" />
          <FieldError>This field is required.</FieldError>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Disabled</h3>

      <Field disabled style={frameStyle}>
        <FieldLabel htmlFor="input-disabled-account">Account ID</FieldLabel>

        <FieldContent>
          <Input
            id="input-disabled-account"
            disabled
            defaultValue="KTN-ACCT-0042"
            placeholder="Account ID"
          />
          <FieldDescription>Account ID is managed by the system.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const WithIcon: Story = {
  name: 'With Icon',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>With Icon</h3>

      <FieldGroup style={frameStyle}>
        <Field>
          <FieldLabel htmlFor="input-icon-search">Search Symbol</FieldLabel>

          <FieldContent>
            <div style={iconWrapStyle}>
              <span aria-hidden style={leadingIconStyle}>
                <FiSearch size={14} />
              </span>
              <Input
                id="input-icon-search"
                type="search"
                placeholder="Search by symbol or company"
                style={{ paddingInlineStart: '2rem' }}
              />
            </div>

            <FieldDescription>Leading icons are useful for search fields.</FieldDescription>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="input-icon-email">Email</FieldLabel>

          <FieldContent>
            <div style={iconWrapStyle}>
              <Input
                id="input-icon-email"
                type="email"
                placeholder="name@example.com"
                style={{ paddingInlineEnd: '2rem' }}
              />
              <span aria-hidden style={trailingIconStyle}>
                <FiAtSign size={14} />
              </span>
            </div>

            <FieldDescription>Trailing icons work for semantic hints too.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  ),
};

export const InputPlayground: Story = {
  name: 'Input Playground',
  args: {
    size: 'md',
    type: 'text',
    disabled: false,
    required: false,
    invalid: false,
    placeholder: 'Enter value',
    withAction: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'number', 'password', 'search', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    placeholder: { control: 'text' },
    withAction: { control: 'boolean' },
    onAction: { action: 'action' },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onChange: { action: 'change' },
    onBlur: { action: 'blur' },
    onFocus: { action: 'focus' },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;

    return (
      <Field
        disabled={args.disabled}
        invalid={args.invalid}
        required={args.required}
        style={frameStyle}
      >
        <FieldLabel htmlFor="input-playground">Input Label</FieldLabel>

        <FieldContent>
          <Input
            id="input-playground"
            key={`${args.size}-${args.type}-${args.disabled}-${args.required}-${args.invalid}`}
            size={args.size}
            type={args.type}
            disabled={args.disabled}
            required={args.required}
            invalid={args.invalid}
            placeholder={args.placeholder}
            onAction={withAction ? args.onAction : undefined}
            onChange={withAction ? args.onChange : undefined}
            onBlur={withAction ? args.onBlur : undefined}
            onFocus={withAction ? args.onFocus : undefined}
          />

          {args.invalid ? (
            <FieldError>Please provide a valid value.</FieldError>
          ) : args.required ? (
            <FieldDescription>This field is required.</FieldDescription>
          ) : (
            <FieldDescription>Use controls to test size and state props.</FieldDescription>
          )}
        </FieldContent>
      </Field>
    );
  },
};
