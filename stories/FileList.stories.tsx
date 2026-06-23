import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  FileList,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  type FileListItem,
  type FileListProps,
} from '@keytuno/ui-react';

const sampleImage =
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600&h=1000&fit=crop';
const sampleVideo = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const sampleAudio = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3';
const sampleCsv = 'https://raw.githubusercontent.com/cs109/2014_data/master/countries.csv';
const sampleXlsx = 'https://github.com/SheetJS/test_files/raw/master/xlsx/number_format.xlsx';

const demoFiles: FileListItem[] = [
  {
    id: 'img-1',
    name: 'Mountain-Lake-Cover.jpg',
    src: sampleImage,
    type: 'image',
    sizeBytes: 2_354_120,
    width: 1600,
    height: 1000,
    mimeType: 'image/jpeg',
    description: 'Hero cover image used in the campaign tile.',
  },
  {
    id: 'vid-1',
    name: 'Flower-Motion.mp4',
    src: sampleVideo,
    type: 'video',
    sizeBytes: 4_712_220,
    mimeType: 'video/mp4',
    description: 'Short looping background video clip.',
  },
  {
    id: 'audio-1',
    name: 'Alert-Sound.mp3',
    src: sampleAudio,
    type: 'audio',
    sizeBytes: 1_032_201,
    mimeType: 'audio/mpeg',
  },
  {
    id: 'csv-1',
    name: 'Countries.csv',
    src: sampleCsv,
    type: 'auto',
    sizeBytes: 84_021,
    mimeType: 'text/csv',
  },
  {
    id: 'xlsx-1',
    name: 'NumberFormat.xlsx',
    src: sampleXlsx,
    type: 'auto',
    sizeBytes: 153_640,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
];

const meta: Meta<FileListProps> = {
  title: 'Component/FileList',
  component: FileList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<FileListProps>;
type FileListPlaygroundArgs = FileListProps & {
  showHeroDescription: boolean;
  heroDescription: string;
};

const stackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
  maxWidth: '1080px',
};

const frameStyle: CSSProperties = {
  width: '100%',
};

function RemovableListDemo({
  size,
  variant,
  disabled,
}: {
  size: FileListProps['size'];
  variant: FileListProps['variant'];
  disabled: boolean;
}): JSX.Element {
  const [files, setFiles] = useState<FileListItem[]>(demoFiles);

  return (
    <div style={stackStyle}>
      <FileList
        files={files}
        size={size}
        variant={variant}
        disabled={disabled}
        onRemove={(fileToRemove) => {
          setFiles((current) => current.filter((file) => file.id !== fileToRemove.id));
        }}
        emptyText="All files removed."
      />
    </div>
  );
}

export const BasicDetailed: Story = {
  name: 'Basic Detailed',
  render: () => (
    <div style={stackStyle}>
      <Field style={frameStyle}>
        <FieldLabel>Detailed File List</FieldLabel>

        <FieldContent>
          <FileList files={demoFiles} variant="detailed" size="md" />

          <FieldDescription>
            Shows a thumbnail-style box for every file, image previews for image files, file icons
            for non-image files, and both the thumbnail/icon box and filename as preview links.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={stackStyle}>
      <Field style={frameStyle}>
        <FieldLabel>Compact Variant</FieldLabel>

        <FieldContent>
          <FileList files={demoFiles} variant="compact" size="sm" />

          <FieldDescription>
            Compact mode renders inline filename chips as preview links, with optional remove
            actions.
          </FieldDescription>
        </FieldContent>
      </Field>

      <Field style={frameStyle}>
        <FieldLabel>Detailed Variant</FieldLabel>

        <FieldContent>
          <FileList files={demoFiles} variant="detailed" size="md" />
        </FieldContent>
      </Field>

      <Field style={frameStyle}>
        <FieldLabel>Advanced Variant</FieldLabel>

        <FieldContent>
          <FileList files={demoFiles} variant="advanced" size="md" />

          <FieldDescription>
            Advanced mode includes the same thumbnail/icon box plus exact byte count and mime/type
            information.
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
      <Field style={frameStyle}>
        <FieldLabel>XS</FieldLabel>

        <FieldContent>
          <FileList files={demoFiles.slice(0, 3)} variant="compact" size="xs" />
        </FieldContent>
      </Field>

      <Field style={frameStyle}>
        <FieldLabel>SM</FieldLabel>

        <FieldContent>
          <FileList files={demoFiles.slice(0, 3)} variant="compact" size="sm" />
        </FieldContent>
      </Field>

      <Field style={frameStyle}>
        <FieldLabel>MD</FieldLabel>

        <FieldContent>
          <FileList files={demoFiles.slice(0, 3)} variant="compact" size="md" />
        </FieldContent>
      </Field>

      <Field style={frameStyle}>
        <FieldLabel>LG</FieldLabel>

        <FieldContent>
          <FileList files={demoFiles.slice(0, 3)} variant="compact" size="lg" />
        </FieldContent>
      </Field>

      <Field style={frameStyle}>
        <FieldLabel>Disabled</FieldLabel>

        <FieldContent>
          <FileList files={demoFiles.slice(0, 3)} variant="detailed" size="md" disabled />

          <FieldDescription>
            Disabled mode blocks remove actions and file preview interactions.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const RemovableList: Story = {
  name: 'Removable List',
  render: () => (
    <div style={stackStyle}>
      <Field style={frameStyle}>
        <FieldLabel>Remove Files with Trash Action</FieldLabel>

        <FieldContent>
          <RemovableListDemo size="md" variant="detailed" disabled={false} />

          <FieldDescription>Rounded compact trash action removes each file row.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const FileListPlayground: StoryObj<FileListPlaygroundArgs> = {
  name: 'FileList Playground',
  args: {
    variant: 'detailed',
    size: 'md',
    disabled: false,
    showRemoveAction: true,
    showSize: true,
    showDimensions: true,
    showMimeType: true,
    showBytes: true,
    emptyText: 'No files available.',
    compactChipProps: {
      variant: 'secondary',
      size: 'sm',
    },
    showHeroDescription: true,
    heroDescription: 'Hero cover image used in the campaign tile.',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['compact', 'detailed', 'advanced'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    showRemoveAction: { control: 'boolean' },
    showSize: { control: 'boolean' },
    showDimensions: { control: 'boolean' },
    showMimeType: { control: 'boolean' },
    showBytes: { control: 'boolean' },
    emptyText: { control: 'text' },
    compactChipProps: {
      control: 'object',
      description:
        'Configures compact chips. You can set badge variant/size/style/className and span attributes.',
    },
    showHeroDescription: {
      control: 'boolean',
      description: 'Toggle description for the hero cover image item.',
    },
    heroDescription: {
      control: 'text',
      description: 'Editable description text for the hero cover image item.',
    },
    files: { table: { disable: true } },
    onRemove: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const normalizedEmptyText =
      typeof args.emptyText === 'string' && args.emptyText.trim() !== ''
        ? args.emptyText
        : 'No files available.';

    const normalizedHeroDescription =
      typeof args.heroDescription === 'string' ? args.heroDescription.trim() : '';

    const playgroundFiles = demoFiles.map((file) => {
      if (file.id !== 'img-1') {
        return file;
      }

      return {
        ...file,
        description:
          args.showHeroDescription && normalizedHeroDescription !== ''
            ? normalizedHeroDescription
            : undefined,
      };
    });

    return (
      <FileList
        key={`${args.variant}-${args.size}-${args.disabled}-${args.showRemoveAction}-${args.showBytes}-${args.showHeroDescription}-${normalizedHeroDescription}`}
        files={playgroundFiles}
        variant={args.variant}
        size={args.size}
        disabled={args.disabled}
        showRemoveAction={args.showRemoveAction}
        showSize={args.showSize}
        showDimensions={args.showDimensions}
        showMimeType={args.showMimeType}
        showBytes={args.showBytes}
        compactChipProps={args.compactChipProps}
        emptyText={normalizedEmptyText}
      />
    );
  },
};
