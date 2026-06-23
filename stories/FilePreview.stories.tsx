import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { FilePreview, Field, FieldContent, FieldDescription, FieldLabel } from '@keytuno/ui-react';

const sampleImage =
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&h=1000&fit=crop';
const samplePdf = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
const sampleVideo = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const sampleAudio = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3';
const sampleCsv = 'https://raw.githubusercontent.com/cs109/2014_data/master/countries.csv';
const sampleXlsx = 'https://github.com/SheetJS/test_files/raw/master/xlsx/number_format.xlsx';
const sampleFile = 'https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore';

const meta: Meta<typeof FilePreview> = {
  title: 'Component/FilePreview',
  component: FilePreview,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const stackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
  maxWidth: '1200px',
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gap: '0.85rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
  width: '100%',
};

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '0.8rem',
};

const frameStyle: CSSProperties = {
  width: '100%',
};

export const Basic: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Image, Video, Audio, PDF, CSV, XLSX, File</h3>

      <Field style={frameStyle}>
        <FieldLabel>Supported Preview Types</FieldLabel>

        <FieldContent>
          <div style={gridStyle}>
            <FilePreview
              src={sampleImage}
              name="Mountain Lake Cover"
              description="Click to open fullscreen image preview."
              type="image"
              size="md"
            />

            <FilePreview
              src={samplePdf}
              name="Dummy PDF"
              description="PDF opens directly in a new tab."
              type="pdf"
              size="md"
            />

            <FilePreview
              src={sampleVideo}
              name="Flower Video"
              description="Video preview with native player controls."
              type="video"
              size="md"
            />

            <FilePreview
              src={sampleAudio}
              name="Roar Audio"
              description="Audio preview with native player controls."
              type="audio"
              size="md"
            />

            <FilePreview
              src={sampleCsv}
              name="Countries.csv"
              description="CSV opens directly in a new tab."
              type="auto"
              size="md"
            />

            <FilePreview
              src={sampleXlsx}
              name="NumberFormat.xlsx"
              description="XLSX opens directly in a new tab."
              type="auto"
              size="md"
            />

            <FilePreview
              src={sampleFile}
              name="Node.gitignore"
              description="Generic files open directly in a new tab."
              type="file"
              size="md"
            />
          </div>

          <FieldDescription>
            Image, video, and audio open in fullscreen preview. PDF, CSV, XLSX, and other file types
            open in a new tab.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const LinkTrigger: Story = {
  name: 'Link Trigger',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Open Preview from Link</h3>

      <Field style={frameStyle}>
        <FieldLabel>Link and File Link Trigger</FieldLabel>

        <FieldContent>
          <div style={rowStyle}>
            <FilePreview
              asLink
              src={sampleImage}
              type="image"
              name="Open mountain image"
              linkLabel="Open image preview from link"
              size="md"
            />

            <FilePreview
              asLink
              src={sampleFile}
              type="file"
              name="Open node ignore file"
              linkLabel="Open file link preview"
              size="md"
            />

            <FilePreview
              asLink
              src={sampleCsv}
              type="auto"
              name="Open countries CSV"
              linkLabel="Open CSV in new tab"
              size="md"
            />

            <FilePreview
              asLink
              src={sampleXlsx}
              type="auto"
              name="Open workbook XLSX"
              linkLabel="Open XLSX in new tab"
              size="md"
            />
          </div>

          <FieldDescription>
            Link mode opens fullscreen for media files and directly opens PDF, CSV, XLSX, and other
            file types in a new tab.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const SizesAndDisabled: Story = {
  name: 'Sizes and Disabled',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Sizes and Disabled State</h3>

      <Field style={frameStyle}>
        <FieldLabel>Size Variants</FieldLabel>

        <FieldContent>
          <div style={rowStyle}>
            <FilePreview src={sampleImage} name="XS" type="image" size="xs" />
            <FilePreview src={sampleImage} name="SM" type="image" size="sm" />
            <FilePreview src={sampleImage} name="MD" type="image" size="md" />
            <FilePreview src={sampleImage} name="LG" type="image" size="lg" />
            <FilePreview
              src={sampleImage}
              name="Disabled"
              description="Disabled preview tile"
              type="image"
              size="md"
              disabled
            />
          </div>

          <FieldDescription>
            Disabled FilePreview does not open the fullscreen preview.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const FilePreviewPlayground: Story = {
  name: 'FilePreview Playground',
  args: {
    src: sampleImage,
    name: 'Mountain Lake Cover',
    description: 'Scroll/pinch in fullscreen for image zoom and pan.',
    size: 'md',
    type: 'auto',
    mimeType: '',
    thumbnailSrc: '',
    disabled: false,
    asLink: false,
    linkLabel: 'Open preview from link',
    closeOnOverlayClick: true,
    closeOnEscape: true,
  },
  argTypes: {
    src: { control: 'text' },
    name: { control: 'text' },
    description: { control: 'text' },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    type: {
      control: 'select',
      options: ['auto', 'image', 'pdf', 'video', 'audio', 'file'],
    },
    mimeType: { control: 'text' },
    thumbnailSrc: { control: 'text' },
    disabled: { control: 'boolean' },
    asLink: { control: 'boolean' },
    linkLabel: { control: 'text' },
    closeOnOverlayClick: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const normalizedName =
      typeof args.name === 'string' && args.name.trim() !== '' ? args.name : undefined;
    const normalizedDescription =
      typeof args.description === 'string' && args.description.trim() !== ''
        ? args.description
        : undefined;
    const normalizedMime =
      typeof args.mimeType === 'string' && args.mimeType.trim() !== '' ? args.mimeType : undefined;
    const normalizedThumbnail =
      typeof args.thumbnailSrc === 'string' && args.thumbnailSrc.trim() !== ''
        ? args.thumbnailSrc
        : undefined;
    const normalizedLinkLabel =
      typeof args.linkLabel === 'string' && args.linkLabel.trim() !== ''
        ? args.linkLabel
        : undefined;

    return (
      <FilePreview
        key={`${args.src}-${args.type}-${args.size}-${args.disabled}-${args.asLink}`}
        src={args.src}
        name={normalizedName}
        description={normalizedDescription}
        size={args.size}
        type={args.type}
        mimeType={normalizedMime}
        thumbnailSrc={normalizedThumbnail}
        disabled={args.disabled}
        asLink={args.asLink}
        linkLabel={normalizedLinkLabel}
        closeOnOverlayClick={args.closeOnOverlayClick}
        closeOnEscape={args.closeOnEscape}
      />
    );
  },
};
