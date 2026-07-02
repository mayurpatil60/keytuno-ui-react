import { type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FileUpload,
} from "../src/index";

const meta: Meta<typeof FileUpload> = {
  title: "Forms/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

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

type ProfileSide = "left" | "center" | "right";

const profileFrameStyle: CSSProperties = {
  width: "100%",
  maxWidth: "36rem",
};

function toProfileSupportTextStyle(side: ProfileSide): CSSProperties {
  const alignSelf =
    side === "left" ? "flex-start" : side === "right" ? "flex-end" : "center";

  return {
    width: "min(100%, 28rem)",
    alignSelf,
    textAlign: side,
  };
}

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

export const ProfilePhotoVariant: Story = {
  name: "Profile Photo Variant",
  render: () => (
    <div style={stackStyle}>
      <Field style={profileFrameStyle}>
        <FieldLabel>Profile Photo Upload</FieldLabel>

        <FieldContent>
          <FileUpload
            variant="profile"
            size="md"
            side="center"
            profileConfig={{
              hint: "JPG, PNG or WEBP - Max 5 MB",
            }}
          />

          <FieldDescription style={toProfileSupportTextStyle("center")}>
            Circular profile upload with a default user icon. Hover shows upload
            action, and after upload hover shows remove action in the same round
            overlay.
          </FieldDescription>
        </FieldContent>
      </Field>

      <Field required invalid style={profileFrameStyle}>
        <FieldLabel required>Profile Photo Required</FieldLabel>

        <FieldContent>
          <FileUpload
            variant="profile"
            size="md"
            side="left"
            required
            invalid
            errorMessage="Profile photo is required."
            profileConfig={{
              hint: "JPG, PNG or WEBP - Max 5 MB",
            }}
          />

          <FieldDescription style={toProfileSupportTextStyle("left")}>
            Uses required and invalid state with an error message for profile
            photo validation.
          </FieldDescription>
        </FieldContent>
      </Field>

      <Field disabled style={profileFrameStyle}>
        <FieldLabel>Profile Photo Disabled</FieldLabel>

        <FieldContent>
          <FileUpload
            variant="profile"
            size="md"
            side="right"
            disabled
            profileConfig={{
              hint: "JPG, PNG or WEBP - Max 5 MB",
            }}
          />

          <FieldDescription style={toProfileSupportTextStyle("right")}>
            Disabled state keeps the same circular layout and side-aware text
            alignment.
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

      <Field style={frameStyle}>
        <FieldLabel>Profile Disabled</FieldLabel>

        <FieldContent>
          <FileUpload
            variant="profile"
            size="md"
            side="center"
            disabled
            profileConfig={{
              hint: "JPG, PNG or WEBP - Max 5 MB",
            }}
          />
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
    side: "center",
    disabled: false,
    required: false,
    invalid: false,
    errorMessage: "",
    multiple: true,
    accept: "",
    placeholder: "Upload files to continue.",
    dropzoneHint: "Drag and drop files here, or use Browse to pick files.",
    browseLabel: "Upload",
    profileConfig: {
      hint: "JPG, PNG or WEBP - Max 5 MB",
    },
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
      options: ["compact", "dropzone", "profile"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    side: {
      control: "select",
      options: ["left", "center", "right"],
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    errorMessage: { control: "text" },
    multiple: { control: "boolean" },
    accept: { control: "text" },
    placeholder: { control: "text" },
    dropzoneHint: { control: "text" },
    browseLabel: { control: "text" },
    profileConfig: {
      control: "object",
      description:
        "Optional profile-variant settings (hint, icons, labels, imageAlt).",
    },
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
  },
  render: (args) => {
    const resolvedSide: ProfileSide =
      args.side === "left" || args.side === "right" ? args.side : "center";

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

    const normalizedErrorMessage =
      typeof args.errorMessage === "string" && args.errorMessage.trim() !== ""
        ? args.errorMessage
        : undefined;

    return (
      <Field
        disabled={args.disabled}
        required={args.required}
        invalid={args.invalid}
        style={args.variant === "profile" ? profileFrameStyle : frameStyle}
      >
        <FieldLabel>File Upload Playground</FieldLabel>

        <FieldContent>
          <FileUpload
            key={`${args.variant}-${args.size}-${resolvedSide}-${args.disabled}-${args.required}-${args.invalid}-${args.multiple}-${normalizedAccept}-${String(normalizedPlaceholder)}-${String(normalizedDropzoneHint)}-${String(normalizedBrowseLabel)}-${String(normalizedErrorMessage)}`}
            variant={args.variant}
            size={args.size}
            side={resolvedSide}
            disabled={args.disabled}
            required={args.required}
            invalid={args.invalid}
            errorMessage={normalizedErrorMessage}
            multiple={args.multiple}
            accept={normalizedAccept}
            placeholder={normalizedPlaceholder}
            dropzoneHint={normalizedDropzoneHint}
            browseLabel={normalizedBrowseLabel}
            profileConfig={args.profileConfig}
            browseButtonProps={args.browseButtonProps}
            dialogProps={args.dialogProps}
          />

          <FieldDescription
            style={
              args.variant === "profile"
                ? toProfileSupportTextStyle(resolvedSide)
                : undefined
            }
          >
            Supports compact, dropzone, and profile variants with disabled,
            required, invalid, side alignment, and configurable profile UI.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};

export const CompactVariantPlayground: Story = {
  name: "Compact Variant Playground",
  args: {
    variant: "compact",
    size: "md",
    disabled: false,
    required: false,
    invalid: false,
    errorMessage: "",
    multiple: true,
    accept: "",
    placeholder: "Upload files to continue.",
    browseLabel: "Upload",
    fileListEmptyText: "No files uploaded yet.",
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
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    errorMessage: { control: "text" },
    multiple: { control: "boolean" },
    accept: { control: "text" },
    placeholder: { control: "text" },
    browseLabel: { control: "text" },
    fileListEmptyText: { control: "text" },
    browseButtonProps: {
      control: "object",
      description: "Props forwarded to the compact browse button.",
    },
    dialogProps: {
      control: "object",
      description: "Dialog settings for compact uploaded-file preview.",
    },
    side: { table: { disable: true } },
    dropzoneHint: { table: { disable: true } },
    dropzoneTitle: { table: { disable: true } },
    profileConfig: { table: { disable: true } },
    onFilesChange: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const normalizedAccept = typeof args.accept === "string" ? args.accept : "";

    const normalizedPlaceholder =
      typeof args.placeholder === "string" && args.placeholder.trim() !== ""
        ? args.placeholder
        : undefined;

    const normalizedBrowseLabel =
      typeof args.browseLabel === "string" && args.browseLabel.trim() !== ""
        ? args.browseLabel
        : undefined;

    const normalizedErrorMessage =
      typeof args.errorMessage === "string" && args.errorMessage.trim() !== ""
        ? args.errorMessage
        : undefined;

    const normalizedFileListEmptyText =
      typeof args.fileListEmptyText === "string" &&
      args.fileListEmptyText.trim() !== ""
        ? args.fileListEmptyText
        : undefined;

    return (
      <Field
        disabled={args.disabled}
        required={args.required}
        invalid={args.invalid}
        style={frameStyle}
      >
        <FieldLabel>Compact Variant Playground</FieldLabel>

        <FieldContent>
          <FileUpload
            key={`compact-${args.size}-${args.disabled}-${args.required}-${args.invalid}-${args.multiple}-${normalizedAccept}-${String(normalizedPlaceholder)}-${String(normalizedBrowseLabel)}-${String(normalizedErrorMessage)}-${String(normalizedFileListEmptyText)}`}
            variant="compact"
            size={args.size}
            disabled={args.disabled}
            required={args.required}
            invalid={args.invalid}
            errorMessage={normalizedErrorMessage}
            multiple={args.multiple}
            accept={normalizedAccept}
            placeholder={normalizedPlaceholder}
            browseLabel={normalizedBrowseLabel}
            fileListEmptyText={normalizedFileListEmptyText}
            browseButtonProps={args.browseButtonProps}
            dialogProps={args.dialogProps}
          />

          <FieldDescription>
            Compact-focused props playground with dialog, placeholder, and
            inline file-summary behavior.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};

export const DropzoneVariantPlayground: Story = {
  name: "Dropzone Variant Playground",
  args: {
    variant: "dropzone",
    size: "md",
    disabled: false,
    required: false,
    invalid: false,
    errorMessage: "",
    multiple: true,
    accept: "",
    dropzoneTitle: "Drop files here",
    dropzoneHint: "Drag and drop files here, or use Browse to pick files.",
    browseLabel: "Upload",
    fileListEmptyText: "No files uploaded yet.",
    browseButtonProps: {
      variant: "outline",
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    errorMessage: { control: "text" },
    multiple: { control: "boolean" },
    accept: { control: "text" },
    dropzoneTitle: { control: "text" },
    dropzoneHint: { control: "text" },
    browseLabel: { control: "text" },
    fileListEmptyText: { control: "text" },
    browseButtonProps: {
      control: "object",
      description: "Props forwarded to the dropzone browse button.",
    },
    side: { table: { disable: true } },
    placeholder: { table: { disable: true } },
    profileConfig: { table: { disable: true } },
    dialogProps: { table: { disable: true } },
    dialogTitle: { table: { disable: true } },
    dialogDescription: { table: { disable: true } },
    onFilesChange: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const normalizedAccept = typeof args.accept === "string" ? args.accept : "";

    const normalizedDropzoneTitle =
      typeof args.dropzoneTitle === "string" && args.dropzoneTitle.trim() !== ""
        ? args.dropzoneTitle
        : undefined;

    const normalizedDropzoneHint =
      typeof args.dropzoneHint === "string" && args.dropzoneHint.trim() !== ""
        ? args.dropzoneHint
        : undefined;

    const normalizedBrowseLabel =
      typeof args.browseLabel === "string" && args.browseLabel.trim() !== ""
        ? args.browseLabel
        : undefined;

    const normalizedErrorMessage =
      typeof args.errorMessage === "string" && args.errorMessage.trim() !== ""
        ? args.errorMessage
        : undefined;

    const normalizedFileListEmptyText =
      typeof args.fileListEmptyText === "string" &&
      args.fileListEmptyText.trim() !== ""
        ? args.fileListEmptyText
        : undefined;

    return (
      <Field
        disabled={args.disabled}
        required={args.required}
        invalid={args.invalid}
        style={frameStyle}
      >
        <FieldLabel>Dropzone Variant Playground</FieldLabel>

        <FieldContent>
          <FileUpload
            key={`dropzone-${args.size}-${args.disabled}-${args.required}-${args.invalid}-${args.multiple}-${normalizedAccept}-${String(normalizedDropzoneTitle)}-${String(normalizedDropzoneHint)}-${String(normalizedBrowseLabel)}-${String(normalizedErrorMessage)}-${String(normalizedFileListEmptyText)}`}
            variant="dropzone"
            size={args.size}
            disabled={args.disabled}
            required={args.required}
            invalid={args.invalid}
            errorMessage={normalizedErrorMessage}
            multiple={args.multiple}
            accept={normalizedAccept}
            dropzoneTitle={normalizedDropzoneTitle}
            dropzoneHint={normalizedDropzoneHint}
            browseLabel={normalizedBrowseLabel}
            fileListEmptyText={normalizedFileListEmptyText}
            browseButtonProps={args.browseButtonProps}
          />

          <FieldDescription>
            Dropzone-focused props playground for title, hint, drag/drop, and
            file-list behavior.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};

export const ProfileVariantPlayground: Story = {
  name: "Profile Variant Playground",
  args: {
    variant: "profile",
    size: "md",
    side: "center",
    disabled: false,
    required: false,
    invalid: false,
    errorMessage: "",
    accept: "",
    profileConfig: {
      hint: "JPG, PNG or WEBP - Max 5 MB",
      imageAlt: "Uploaded profile photo",
      uploadActionLabel: "Upload profile photo",
      removeActionLabel: "Remove profile photo",
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    side: {
      control: "select",
      options: ["left", "center", "right"],
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    errorMessage: { control: "text" },
    accept: { control: "text" },
    profileConfig: {
      control: "object",
      description:
        "Profile props: hint, labels, imageAlt, and optional custom icons.",
    },
    multiple: { table: { disable: true } },
    placeholder: { table: { disable: true } },
    dropzoneHint: { table: { disable: true } },
    dropzoneTitle: { table: { disable: true } },
    browseLabel: { table: { disable: true } },
    fileListEmptyText: { table: { disable: true } },
    browseButtonProps: { table: { disable: true } },
    dialogProps: { table: { disable: true } },
    dialogTitle: { table: { disable: true } },
    dialogDescription: { table: { disable: true } },
    onFilesChange: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const resolvedSide: ProfileSide =
      args.side === "left" || args.side === "right" ? args.side : "center";

    const normalizedAccept = typeof args.accept === "string" ? args.accept : "";

    const normalizedErrorMessage =
      typeof args.errorMessage === "string" && args.errorMessage.trim() !== ""
        ? args.errorMessage
        : undefined;

    return (
      <Field
        disabled={args.disabled}
        required={args.required}
        invalid={args.invalid}
        style={profileFrameStyle}
      >
        <FieldLabel>Profile Variant Playground</FieldLabel>

        <FieldContent>
          <FileUpload
            key={`profile-${args.size}-${resolvedSide}-${args.disabled}-${args.required}-${args.invalid}-${normalizedAccept}-${String(normalizedErrorMessage)}-${String(args.profileConfig?.hint ?? "")}`}
            variant="profile"
            size={args.size}
            side={resolvedSide}
            disabled={args.disabled}
            required={args.required}
            invalid={args.invalid}
            errorMessage={normalizedErrorMessage}
            accept={normalizedAccept}
            profileConfig={args.profileConfig}
          />

          <FieldDescription style={toProfileSupportTextStyle(resolvedSide)}>
            Profile-focused props playground with side alignment, helper text,
            validation message, and custom labels/icons.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};
