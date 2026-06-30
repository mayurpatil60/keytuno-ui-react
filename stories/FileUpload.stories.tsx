import { type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FileUpload,
  type FileUploadProps,
} from "@keytuno/ui-react";

const meta: Meta<FileUploadProps> = {
  title: "Forms/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<FileUploadProps>;

const stackStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "100%",
  maxWidth: "1120px",
};

const frameStyle: CSSProperties = {
  width: "100%",
};

export const CompactVariant: Story = {
  name: "Compact Variant",
  render: () => (
    <div style={stackStyle}>
      <Field style={frameStyle}>
        <FieldLabel>Compact File Upload</FieldLabel>

        <FieldContent>
          <FileUpload variant="compact" size="md" multiple />

          <FieldDescription>
            Shows one single input-like box with upload action. Uploaded file
            names appear inline, and clicking a name or +N opens a dialog with
            link preview and trash actions.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const DropzoneVariant: Story = {
  name: "Dropzone Variant",
  render: () => (
    <div style={stackStyle}>
      <Field style={frameStyle}>
        <FieldLabel>Dropzone File Upload</FieldLabel>

        <FieldContent>
          <FileUpload variant="dropzone" size="md" multiple />

          <FieldDescription>
            Drag and drop files or browse. Uploaded rows are rendered through
            FileList, including clickable thumbnail/file boxes, filename preview
            links, size and dimensions, plus trash remove actions.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const SizesAndDisabled: Story = {
  name: "Sizes and Disabled",
  render: () => (
    <div style={stackStyle}>
      <Field style={frameStyle}>
        <FieldLabel>Compact XS</FieldLabel>

        <FieldContent>
          <FileUpload variant="compact" size="xs" multiple />
        </FieldContent>
      </Field>

      <Field style={frameStyle}>
        <FieldLabel>Compact SM</FieldLabel>

        <FieldContent>
          <FileUpload variant="compact" size="sm" multiple />
        </FieldContent>
      </Field>

      <Field style={frameStyle}>
        <FieldLabel>Compact MD</FieldLabel>

        <FieldContent>
          <FileUpload variant="compact" size="md" multiple />
        </FieldContent>
      </Field>

      <Field style={frameStyle}>
        <FieldLabel>Compact LG</FieldLabel>

        <FieldContent>
          <FileUpload variant="compact" size="lg" multiple />
        </FieldContent>
      </Field>

      <Field style={frameStyle}>
        <FieldLabel>Dropzone Disabled</FieldLabel>

        <FieldContent>
          <FileUpload variant="dropzone" size="md" disabled multiple />

          <FieldDescription>
            Disabled mode blocks browse, drop, preview interactions, and remove
            actions.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const FileUploadPlayground: Story = {
  name: "FileUpload Playground",
  args: {
    variant: "compact",
    size: "md",
    disabled: false,
    required: false,
    multiple: true,
    accept: "",
    placeholder: "Upload files to continue.",
    dropzoneHint: "Drag and drop files here, or use Browse to pick files.",
    browseLabel: "Upload",
    browseButtonProps: {
      variant: "outline",
    },
    dialogProps: {
      size: "lg",
      variant: "outline",
      closeOnEscape: true,
      closeOnOverlayClick: true,
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["compact", "dropzone"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    multiple: { control: "boolean" },
    accept: { control: "text" },
    placeholder: { control: "text" },
    dropzoneHint: { control: "text" },
    browseLabel: { control: "text" },
    browseButtonProps: {
      control: "object",
      description: "Pass-through props for the upload browse button.",
    },
    dialogProps: {
      control: "object",
      description: "Compact dialog behavior and styling props from Dialog.",
    },
    onFilesChange: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    varient: { table: { disable: true } },
  },
  render: (args) => {
    const normalizedAccept = typeof args.accept === "string" ? args.accept : "";

    const normalizedPlaceholder =
      typeof args.placeholder === "string" && args.placeholder.trim() !== ""
        ? args.placeholder
        : undefined;

    const normalizedDropzoneHint =
      typeof args.dropzoneHint === "string" && args.dropzoneHint.trim() !== ""
        ? args.dropzoneHint
        : undefined;

    const normalizedBrowseLabel =
      typeof args.browseLabel === "string" && args.browseLabel.trim() !== ""
        ? args.browseLabel
        : undefined;

    return (
      <Field
        disabled={args.disabled}
        required={args.required}
        style={frameStyle}
      >
        <FieldLabel>File Upload Playground</FieldLabel>

        <FieldContent>
          <FileUpload
            key={`${args.variant}-${args.size}-${args.disabled}-${args.required}-${args.multiple}-${normalizedAccept}-${String(normalizedPlaceholder)}-${String(normalizedDropzoneHint)}-${String(normalizedBrowseLabel)}`}
            variant={args.variant}
            size={args.size}
            disabled={args.disabled}
            required={args.required}
            multiple={args.multiple}
            accept={normalizedAccept}
            placeholder={normalizedPlaceholder}
            dropzoneHint={normalizedDropzoneHint}
            browseLabel={normalizedBrowseLabel}
            browseButtonProps={args.browseButtonProps}
            dialogProps={args.dialogProps}
          />

          <FieldDescription>
            Toggle required to show the marker and required semantics for file
            selection.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};
