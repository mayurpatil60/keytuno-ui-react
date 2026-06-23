import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@keytuno/ui-react';

const meta: Meta<typeof Sheet> = {
  title: 'Component/Sheet',
  component: Sheet,
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
  width: 'min(900px, 94vw)',
};

const mutedTextStyle: CSSProperties = {
  margin: 0,
  fontSize: '0.8125rem',
  color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
};

const longParagraphs = [
  'Review holdings, stop-loss settings, and exposure split before confirming your updated strategy.',
  'Large movements in implied volatility can affect option premium behavior across intraday sessions.',
  'Use watchlist tags to organize symbols by trend quality, momentum, and volatility clusters.',
  'This section demonstrates how the sheet body can be used for longer structured content.',
  'Sticky actions are useful when users need persistent confirm and cancel controls.',
  'For mobile layouts, side sheets are often preferred for step-by-step contextual actions.',
];

function renderStandardContent(): JSX.Element {
  return (
    <>
      <SheetHeader>
        <SheetTitle>Trade Controls</SheetTitle>
        <SheetDescription>
          Adjust strategy settings and risk parameters from this side panel.
        </SheetDescription>
      </SheetHeader>

      <p style={mutedTextStyle}>
        Update leverage, rebalance frequency, and alert behavior before applying changes.
      </p>

      <SheetFooter>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button variant="primary" size="sm">
          Save Changes
        </Button>
      </SheetFooter>
    </>
  );
}

export const Basic: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic</h3>

      <Sheet trigger="Open Sheet" side="right" showCloseButton>
        <SheetContent>{renderStandardContent()}</SheetContent>
      </Sheet>
    </div>
  ),
};

export const SideVariants: Story = {
  name: 'Side Variants',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Side Variants</h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
        <Sheet trigger="Left Sheet" side="left" showCloseButton>
          <SheetContent>{renderStandardContent()}</SheetContent>
        </Sheet>

        <Sheet trigger="Right Sheet" side="right" showCloseButton>
          <SheetContent>{renderStandardContent()}</SheetContent>
        </Sheet>

        <Sheet trigger="Top Sheet" side="top" showCloseButton>
          <SheetContent>{renderStandardContent()}</SheetContent>
        </Sheet>

        <Sheet trigger="Bottom Sheet" side="bottom" showCloseButton>
          <SheetContent>{renderStandardContent()}</SheetContent>
        </Sheet>
      </div>
    </div>
  ),
};

export const NoCloseButton: Story = {
  name: 'No Close Button',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>No Close Button</h3>

      <Sheet trigger="Open without close" side="right" showCloseButton={false}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Review Terms</SheetTitle>
            <SheetDescription>
              This sheet intentionally hides the top close button.
            </SheetDescription>
          </SheetHeader>

          <p style={mutedTextStyle}>
            Close the sheet using overlay click, Escape, or footer action buttons.
          </p>

          <SheetFooter>
            <Button variant="outline" size="sm">
              Back
            </Button>
            <Button variant="primary" size="sm">
              Continue
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  ),
};

export const Scrollable: Story = {
  name: 'Scrollable',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Scrollable</h3>

      <Sheet trigger="Open scrollable sheet" side="right" showCloseButton>
        <SheetContent scrollable>
          <SheetHeader>
            <SheetTitle>Strategy Notes</SheetTitle>
            <SheetDescription>
              Scroll long content while keeping footer actions available.
            </SheetDescription>
          </SheetHeader>

          {longParagraphs.concat(longParagraphs).map((text, index) => (
            <p key={`sheet-scroll-line-${index}`} style={mutedTextStyle}>
              {text}
            </p>
          ))}

          <SheetFooter sticky>
            <Button variant="outline" size="sm">
              Save Draft
            </Button>
            <Button variant="primary" size="sm">
              Confirm
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  ),
};

export const SheetPlayground: Story = {
  name: 'Sheet Playground',
  args: {
    side: 'right',
    showCloseButton: true,
    disabled: false,
    closeOnOverlayClick: true,
    closeOnEscape: true,
    defaultOpen: false,
    trigger: 'Open Playground Sheet',
    withAction: false,
  },
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    showCloseButton: { control: 'boolean' },
    disabled: { control: 'boolean' },
    closeOnOverlayClick: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    defaultOpen: { control: 'boolean' },
    trigger: { control: 'text' },
    withAction: { control: 'boolean' },
    onAction: { action: 'action' },
    onOpenChange: { action: 'open-change' },
    open: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;

    return (
      <Sheet
        key={`${args.side}-${args.showCloseButton}-${args.disabled}-${args.closeOnOverlayClick}-${args.closeOnEscape}-${args.defaultOpen}-${withAction}`}
        side={args.side}
        showCloseButton={args.showCloseButton}
        disabled={args.disabled}
        closeOnOverlayClick={args.closeOnOverlayClick}
        closeOnEscape={args.closeOnEscape}
        defaultOpen={args.defaultOpen}
        trigger={args.trigger}
        onAction={withAction ? args.onAction : undefined}
        onOpenChange={withAction ? args.onOpenChange : undefined}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Interactive Sheet Playground</SheetTitle>
            <SheetDescription>
              Use controls to test side placement and close button behavior.
            </SheetDescription>
          </SheetHeader>

          <p style={mutedTextStyle}>
            You can also override side and showCloseButton directly on SheetContent when needed.
          </p>

          <SheetFooter>
            <Button variant="outline" size="sm">
              Dismiss
            </Button>
            <Button variant="primary" size="sm">
              Apply
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  },
};
