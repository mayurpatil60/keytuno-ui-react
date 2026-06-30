import { useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  Card,
  CardContent,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Slider,
} from "@keytuno/ui-react";

const meta: Meta<typeof Slider> = {
  title: "Forms/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const stackStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "min(900px, 94vw)",
};

const frameStyle: CSSProperties = {
  width: "min(620px, 94vw)",
};

const verticalRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-end",
  gap: "1rem",
  minHeight: "13rem",
};

function ControlledDemo(): JSX.Element {
  const [values, setValues] = useState<number[]>([40]);

  return (
    <div style={{ width: "100%" }}>
      <Slider
        value={values}
        onValueChange={setValues}
        min={0}
        max={100}
        step={1}
      />
      <p
        style={{
          margin: "0.5rem 0 0",
          fontSize: "0.8rem",
          color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
        }}
      >
        Current value: {values[0]}
      </p>
    </div>
  );
}

export const Basic: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic</h3>

      <Field style={frameStyle}>
        <FieldLabel htmlFor="slider-basic">Risk Threshold</FieldLabel>

        <FieldContent>
          <Slider
            id="slider-basic"
            defaultValue={[55]}
            min={0}
            max={100}
            step={1}
          />
          <FieldDescription>
            Use slider for selecting numeric values in a bounded range.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Range: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Range</h3>

      <Field style={frameStyle}>
        <FieldLabel htmlFor="slider-range">Entry Window</FieldLabel>

        <FieldContent>
          <Slider
            id="slider-range"
            defaultValue={[20, 72]}
            min={0}
            max={100}
            step={1}
            minStepsBetweenThumbs={5}
          />
          <FieldDescription>
            Two thumbs create a range between lower and upper values.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const MultipleThumbs: Story = {
  name: "Multiple Thumbs",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Multiple Thumbs</h3>

      <Field style={frameStyle}>
        <FieldLabel htmlFor="slider-multiple">Allocation Buckets</FieldLabel>

        <FieldContent>
          <Card size="sm" spacing="sm">
            <CardContent>
              <Slider
                id="slider-multiple"
                defaultValue={[15, 40, 75]}
                min={0}
                max={100}
                step={1}
                minStepsBetweenThumbs={4}
              />
            </CardContent>
          </Card>

          <FieldDescription>
            Use three or more thumbs to split a scale into multiple segments.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Vertical</h3>

      <Field style={frameStyle}>
        <FieldLabel>Volume Ladders</FieldLabel>

        <FieldContent>
          <div style={verticalRowStyle}>
            <Slider
              orientation="vertical"
              size="sm"
              defaultValue={[28]}
              min={0}
              max={100}
              showValueLabel
            />
            <Slider
              orientation="vertical"
              size="md"
              defaultValue={[22, 68]}
              min={0}
              max={100}
              minStepsBetweenThumbs={6}
              showValueLabel
            />
            <Slider
              orientation="vertical"
              size="lg"
              defaultValue={[10, 42, 86]}
              min={0}
              max={100}
              minStepsBetweenThumbs={5}
              showValueLabel
            />
          </div>

          <FieldDescription>
            Vertical orientation works for compact side panels and dashboards.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Controlled</h3>

      <Field style={frameStyle}>
        <FieldLabel>Position Size</FieldLabel>

        <FieldContent>
          <ControlledDemo />
          <FieldDescription>
            Value is controlled by parent state using value and onValueChange.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Disabled</h3>

      <FieldGroup style={frameStyle}>
        <Field disabled>
          <FieldLabel htmlFor="slider-disabled-single">
            Single Thumb Disabled
          </FieldLabel>

          <FieldContent>
            <Slider
              id="slider-disabled-single"
              disabled
              defaultValue={[64]}
              min={0}
              max={100}
            />
            <FieldDescription>
              Disabled state prevents pointer and keyboard changes.
            </FieldDescription>
          </FieldContent>
        </Field>

        <Field disabled>
          <FieldLabel htmlFor="slider-disabled-range">
            Range Disabled
          </FieldLabel>

          <FieldContent>
            <Slider
              id="slider-disabled-range"
              disabled
              defaultValue={[25, 78]}
              min={0}
              max={100}
            />
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  ),
};

export const Size: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Size</h3>

      <FieldGroup style={frameStyle}>
        <Slider size="xs" defaultValue={[48]} />
        <Slider size="sm" defaultValue={[48]} />
        <Slider size="md" defaultValue={[48]} />
        <Slider size="lg" defaultValue={[48]} />
      </FieldGroup>
    </div>
  ),
};

export const Labels: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Labels</h3>

      <FieldGroup style={frameStyle}>
        <Field>
          <FieldLabel htmlFor="slider-labels-high-low">
            High / Low Labels
          </FieldLabel>

          <FieldContent>
            <Slider
              id="slider-labels-high-low"
              defaultValue={[38]}
              min={0}
              max={100}
              minLabel="Low"
              maxLabel="High"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="slider-labels-min-max">
            Default Min / Max Labels
          </FieldLabel>

          <FieldContent>
            <Slider
              id="slider-labels-min-max"
              defaultValue={[24, 72]}
              min={0}
              max={100}
              minStepsBetweenThumbs={4}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="slider-labels-hidden">Labels Hidden</FieldLabel>

          <FieldContent>
            <Slider
              id="slider-labels-hidden"
              defaultValue={[60]}
              showLabels={false}
            />
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  ),
};

export const SliderPlayground: Story = {
  name: "Range Slider Playground",
  args: {
    orientation: "horizontal",
    size: "md",
    disabled: false,
    required: false,
    min: 0,
    max: 100,
    step: 1,
    minStepsBetweenThumbs: 5,
    showLabels: true,
    minLabel: "",
    maxLabel: "",
    showValueLabel: false,
    withAction: false,
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    minStepsBetweenThumbs: { control: "number" },
    showLabels: { control: "boolean" },
    minLabel: { control: "text" },
    maxLabel: { control: "text" },
    showValueLabel: { control: "boolean" },
    withAction: { control: "boolean" },
    onAction: { action: "action" },
    onValueChange: { action: "value-change" },
    formatValueLabel: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;

    return (
      <Field
        required={args.required}
        style={{
          ...frameStyle,
          maxWidth:
            args.orientation === "vertical" ? "16rem" : frameStyle.width,
        }}
      >
        <FieldLabel htmlFor="slider-playground">
          Interactive Range Playground
        </FieldLabel>

        <FieldContent>
          <Slider
            key={`${args.orientation}-${args.size}-${args.disabled}-${args.required}-${args.min}-${args.max}-${args.step}-${args.minStepsBetweenThumbs}-${withAction}`}
            id="slider-playground"
            orientation={args.orientation}
            size={args.size}
            disabled={args.disabled}
            required={args.required}
            min={args.min}
            max={args.max}
            step={args.step}
            minStepsBetweenThumbs={args.minStepsBetweenThumbs}
            showLabels={args.showLabels}
            minLabel={args.minLabel}
            maxLabel={args.maxLabel}
            showValueLabel={args.showValueLabel}
            defaultValue={[20, 74]}
            onAction={withAction ? args.onAction : undefined}
            onValueChange={withAction ? args.onValueChange : undefined}
          />

          <FieldDescription>
            Adjust controls to test orientation, size, and min-steps constraints
            for a range slider.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};

export const BasicSliderPlayground: Story = {
  name: "Basic Slider Playground",
  args: {
    orientation: "vertical",
    size: "md",
    disabled: false,
    required: false,
    min: 0,
    max: 100,
    step: 1,
    showLabels: true,
    minLabel: "",
    maxLabel: "",
    showValueLabel: false,
    withAction: false,
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    showLabels: { control: "boolean" },
    minLabel: { control: "text" },
    maxLabel: { control: "text" },
    showValueLabel: { control: "boolean" },
    withAction: { control: "boolean" },
    onAction: { action: "action" },
    onValueChange: { action: "value-change" },
    formatValueLabel: { table: { disable: true } },
    minStepsBetweenThumbs: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;

    return (
      <Field
        required={args.required}
        style={{
          ...frameStyle,
          maxWidth:
            args.orientation === "vertical" ? "16rem" : frameStyle.width,
        }}
      >
        <FieldLabel htmlFor="slider-basic-playground">
          Interactive Basic Playground
        </FieldLabel>

        <FieldContent>
          <Slider
            key={`basic-${args.orientation}-${args.size}-${args.disabled}-${args.required}-${args.min}-${args.max}-${args.step}-${withAction}`}
            id="slider-basic-playground"
            orientation={args.orientation}
            size={args.size}
            disabled={args.disabled}
            required={args.required}
            min={args.min}
            max={args.max}
            step={args.step}
            showLabels={args.showLabels}
            minLabel={args.minLabel}
            maxLabel={args.maxLabel}
            showValueLabel={args.showValueLabel}
            defaultValue={[55]}
            onAction={withAction ? args.onAction : undefined}
            onValueChange={withAction ? args.onValueChange : undefined}
          />

          <FieldDescription>
            Use this playground for a single-thumb slider setup.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};
