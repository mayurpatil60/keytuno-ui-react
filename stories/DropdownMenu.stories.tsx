import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  FiArchive,
  FiBell,
  FiCheckSquare,
  FiCopy,
  FiDownload,
  FiEdit3,
  FiEye,
  FiFileText,
  FiFlag,
  FiFolder,
  FiGrid,
  FiHeart,
  FiImage,
  FiLayers,
  FiLink2,
  FiLogOut,
  FiMail,
  FiMic,
  FiMoon,
  FiPlay,
  FiPlus,
  FiScissors,
  FiSearch,
  FiSend,
  FiSettings,
  FiShare2,
  FiShield,
  FiStar,
  FiTrash2,
  FiUser,
  FiUsers,
} from 'react-icons/fi';

import {
  Avatar,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  type DropdownMenuActionContext,
  type DropdownMenuSide,
  type DropdownMenuProps,
} from '@keytuno/ui-react';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Component/Dropdown Menu',
  component: DropdownMenu,
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
  width: 'min(980px, 96vw)',
};

const frameStyle: CSSProperties = {
  width: 'min(860px, 96vw)',
};

const DEEP_NESTED_LEVEL_COUNT = 10;
const SIDE_DEBUG_SCROLL_ITEM_COUNT = 18;

const sideDebugViewportStyle: CSSProperties = {
  position: 'relative',
  width: 'min(1100px, 96vw)',
  height: '72vh',
  minHeight: '34rem',
  border: '1px dashed var(--ktn-border-muted, #94a3b8)',
  borderRadius: '0.85rem',
  background:
    'linear-gradient(145deg, color-mix(in srgb, var(--ktn-bg-surface, #ffffff) 88%, #e2e8f0 12%), var(--ktn-bg-surface, #ffffff))',
  overflow: 'hidden',
};

const sideDebugInfoStyle: CSSProperties = {
  position: 'absolute',
  insetInline: '0.75rem',
  insetBlockStart: '0.6rem',
  fontSize: '0.74rem',
  color: 'var(--ktn-text-secondary, #64748b)',
  lineHeight: 1.35,
  zIndex: 1,
};

const sideDebugAnchorTagStyle: CSSProperties = {
  marginTop: '0.35rem',
  fontSize: '0.66rem',
  lineHeight: 1.2,
  letterSpacing: '0.01em',
  color: 'var(--ktn-text-secondary, #64748b)',
  textTransform: 'uppercase',
};

const sideDebugAnchorPositions: Array<{
  label: string;
  side: DropdownMenuSide;
  style: CSSProperties;
}> = [
  {
    label: 'Top Center Auto',
    side: 'auto',
    style: {
      position: 'absolute',
      insetBlockStart: '2.2rem',
      insetInlineStart: '50%',
      transform: 'translateX(-50%)',
    },
  },
  {
    label: 'Top Left Bottom',
    side: 'bottom',
    style: {
      position: 'absolute',
      insetBlockStart: '5.2rem',
      insetInlineStart: '1rem',
    },
  },
  {
    label: 'Bottom Left Top',
    side: 'top',
    style: {
      position: 'absolute',
      insetBlockEnd: '1rem',
      insetInlineStart: '1rem',
    },
  },
  {
    label: 'Center Left Right',
    side: 'right',
    style: {
      position: 'absolute',
      insetBlockStart: '50%',
      insetInlineStart: '1rem',
      transform: 'translateY(-50%)',
    },
  },
  {
    label: 'Center Right Left',
    side: 'left',
    style: {
      position: 'absolute',
      insetBlockStart: '50%',
      insetInlineEnd: '1rem',
      transform: 'translateY(-50%)',
    },
  },
  {
    label: 'Bottom Right Auto',
    side: 'auto',
    style: {
      position: 'absolute',
      insetBlockEnd: '1rem',
      insetInlineEnd: '1rem',
    },
  },
];

function CheckboxesDemo(): JSX.Element {
  const [menuState, setMenuState] = useState({
    notifications: true,
    mentions: false,
    newsletter: true,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Preferences</DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Alerts</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuCheckboxItem
          checked={menuState.notifications}
          onCheckedChange={(checked) => {
            setMenuState((currentState) => ({
              ...currentState,
              notifications: checked,
            }));
          }}
        >
          Push Notifications
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={menuState.mentions}
          onCheckedChange={(checked) => {
            setMenuState((currentState) => ({
              ...currentState,
              mentions: checked,
            }));
          }}
        >
          Mention Alerts
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={menuState.newsletter}
          onCheckedChange={(checked) => {
            setMenuState((currentState) => ({
              ...currentState,
              newsletter: checked,
            }));
          }}
        >
          Weekly Newsletter
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CheckboxesIconsDemo(): JSX.Element {
  const [menuState, setMenuState] = useState({
    watchlist: true,
    voiceCommands: false,
    marketAudio: true,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Workspace</DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Tools</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuCheckboxItem
          icon={<FiGrid size={14} />}
          checked={menuState.watchlist}
          onCheckedChange={(checked) => {
            setMenuState((currentState) => ({
              ...currentState,
              watchlist: checked,
            }));
          }}
        >
          Watchlist Panel
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          icon={<FiMic size={14} />}
          checked={menuState.voiceCommands}
          onCheckedChange={(checked) => {
            setMenuState((currentState) => ({
              ...currentState,
              voiceCommands: checked,
            }));
          }}
        >
          Voice Commands
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          icon={<FiPlay size={14} />}
          checked={menuState.marketAudio}
          onCheckedChange={(checked) => {
            setMenuState((currentState) => ({
              ...currentState,
              marketAudio: checked,
            }));
          }}
        >
          Market Audio
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RadioGroupDemo(): JSX.Element {
  const [density, setDensity] = useState('comfortable');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Density</DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Table Density</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
          <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="expanded">Expanded</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RadioIconsDemo(): JSX.Element {
  const [theme, setTheme] = useState('dark');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Theme</DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light" icon={<FiSun size={14} />}>
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" icon={<FiMoon size={14} />}>
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" icon={<FiLayers size={14} />}>
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SelectGroupDemo(): JSX.Element {
  const [market, setMarket] = useState('nse');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Select Market</DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Select Group</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup value={market} onValueChange={setMarket}>
          <DropdownMenuRadioItem value="nse" icon={<FiGrid size={14} />}>
            NSE
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bse" icon={<FiLayers size={14} />}>
            BSE
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="mcx" icon={<FiShield size={14} />}>
            MCX
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function renderDeepNestedChildren(level: number, maxLevel: number): JSX.Element {
  const isLastLevel = level >= maxLevel;
  const nextLevel = level + 1;

  return (
    <>
      <DropdownMenuLabel>{`Level ${level}`}</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuItem icon={<FiEye size={14} />}>{`Inspect Level ${level}`}</DropdownMenuItem>
      <DropdownMenuItem
        icon={<FiSettings size={14} />}
      >{`Configure Level ${level}`}</DropdownMenuItem>

      {isLastLevel ? (
        <DropdownMenuItem
          icon={<FiCheckSquare size={14} />}
        >{`Reached Level ${level}`}</DropdownMenuItem>
      ) : (
        <DropdownMenuItem
          icon={<FiLayers size={14} />}
          submenu={renderDeepNestedChildren(nextLevel, maxLevel)}
          submenuSide="auto"
        >
          {`Open Level ${nextLevel}`}
        </DropdownMenuItem>
      )}
    </>
  );
}

function MultiChildPlaygroundDemo({
  onAction,
  onOpenChange,
}: {
  onAction?: DropdownMenuProps['onAction'];
  onOpenChange?: DropdownMenuProps['onOpenChange'];
}): JSX.Element {
  const [menuState, setMenuState] = useState({
    watchlist: true,
    voiceCommands: false,
    marketAudio: true,
  });
  const [theme, setTheme] = useState('dark');
  const [executionType, setExecutionType] = useState('limit');

  return (
    <DropdownMenu
      size="sm"
      variant="soft"
      side="auto"
      onAction={onAction}
      onOpenChange={onOpenChange}
    >
      <DropdownMenuTrigger>Trading Playground</DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem icon={<FiEye size={14} />}>Preview Workspace</DropdownMenuItem>
          <DropdownMenuItem icon={<FiCopy size={14} />}>Duplicate</DropdownMenuItem>
          <DropdownMenuItem
            icon={<FiShare2 size={14} />}
            submenu={
              <>
                <DropdownMenuLabel inset>Share With</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem icon={<FiUsers size={14} />}>Strategy Team</DropdownMenuItem>
                <DropdownMenuItem icon={<FiMail size={14} />}>Email Digest</DropdownMenuItem>
                <DropdownMenuItem
                  icon={<FiLayers size={14} />}
                  submenu={renderDeepNestedChildren(2, 5)}
                  submenuSide="auto"
                >
                  Nested Childs
                </DropdownMenuItem>
              </>
            }
          >
            Share
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Checkboxes Icons</DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuCheckboxItem
            icon={<FiGrid size={14} />}
            checked={menuState.watchlist}
            onCheckedChange={(checked) => {
              setMenuState((currentState) => ({
                ...currentState,
                watchlist: checked,
              }));
            }}
          >
            Watchlist Panel
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            icon={<FiMic size={14} />}
            checked={menuState.voiceCommands}
            onCheckedChange={(checked) => {
              setMenuState((currentState) => ({
                ...currentState,
                voiceCommands: checked,
              }));
            }}
          >
            Voice Commands
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            icon={<FiPlay size={14} />}
            checked={menuState.marketAudio}
            onCheckedChange={(checked) => {
              setMenuState((currentState) => ({
                ...currentState,
                marketAudio: checked,
              }));
            }}
          >
            Market Audio
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Radio Icons</DropdownMenuLabel>

        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light" icon={<FiSun size={14} />}>
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" icon={<FiMoon size={14} />}>
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" icon={<FiLayers size={14} />}>
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Select Group</DropdownMenuLabel>

        <DropdownMenuRadioGroup value={executionType} onValueChange={setExecutionType}>
          <DropdownMenuRadioItem value="market" icon={<FiPlay size={14} />}>
            Market Order
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="limit" icon={<FiFlag size={14} />}>
            Limit Order
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="stop" icon={<FiShield size={14} />}>
            Stop Loss
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface SideDebugAnchorProps {
  label: string;
  side: DropdownMenuSide;
  style: CSSProperties;
}

function SideDebugAnchor({ label, side, style }: SideDebugAnchorProps): JSX.Element {
  return (
    <div style={style}>
      <DropdownMenu side={side} size="sm" variant="outline">
        <DropdownMenuTrigger>{label}</DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel>{`side: ${side}`}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {Array.from({ length: SIDE_DEBUG_SCROLL_ITEM_COUNT }, (_, index) => (
            <DropdownMenuItem
              key={`${label}-${index + 1}`}
              icon={index % 2 === 0 ? <FiLayers size={14} /> : <FiFileText size={14} />}
            >
              {`Debug Item ${index + 1}`}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div style={sideDebugAnchorTagStyle}>{`side = ${side}`}</div>
    </div>
  );
}

export const Basic: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic</h3>

      <Field style={frameStyle}>
        <FieldLabel>Basic Menu</FieldLabel>

        <FieldContent>
          <DropdownMenu>
            <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={<FiUser size={14} />}>Profile</DropdownMenuItem>
              <DropdownMenuItem icon={<FiSettings size={14} />}>Settings</DropdownMenuItem>
              <DropdownMenuItem icon={<FiLogOut size={14} />}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <FieldDescription>Basic dropdown with label, items, and separator.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Submenu: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Submenu</h3>

      <Field style={frameStyle}>
        <FieldLabel>Nested Actions</FieldLabel>

        <FieldContent>
          <DropdownMenu side="auto">
            <DropdownMenuTrigger>Actions</DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem icon={<FiCopy size={14} />}>Duplicate</DropdownMenuItem>
              <DropdownMenuItem
                icon={<FiShare2 size={14} />}
                submenu={
                  <>
                    <DropdownMenuLabel inset>Share Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem icon={<FiLink2 size={14} />}>Copy Link</DropdownMenuItem>
                    <DropdownMenuItem icon={<FiMail size={14} />}>Email</DropdownMenuItem>
                    <DropdownMenuItem icon={<FiSend size={14} />}>Send to Team</DropdownMenuItem>
                  </>
                }
              >
                Share
              </DropdownMenuItem>
              <DropdownMenuItem icon={<FiArchive size={14} />}>Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <FieldDescription>
            Submenu opens on whichever side stays visible within the viewport.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Shortcuts: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Shortcuts</h3>

      <Field style={frameStyle}>
        <FieldLabel>Keyboard Actions</FieldLabel>

        <FieldContent>
          <DropdownMenu>
            <DropdownMenuTrigger>Command Palette</DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem icon={<FiSearch size={14} />} shortcut="Ctrl + K">
                Search
              </DropdownMenuItem>
              <DropdownMenuItem icon={<FiEdit3 size={14} />} shortcut="Ctrl + E">
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem icon={<FiScissors size={14} />} shortcut="Ctrl + X">
                Cut
              </DropdownMenuItem>
              <DropdownMenuItem icon={<FiDownload size={14} />} shortcut="Ctrl + D">
                Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <FieldDescription>Use shortcut badges for fast-action discovery.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Icons: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Icons</h3>

      <Field style={frameStyle}>
        <FieldLabel>Media Menu</FieldLabel>

        <FieldContent>
          <DropdownMenu>
            <DropdownMenuTrigger>Media</DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem icon={<FiImage size={14} />}>Image</DropdownMenuItem>
              <DropdownMenuItem icon={<FiFileText size={14} />}>Document</DropdownMenuItem>
              <DropdownMenuItem icon={<FiFolder size={14} />}>Folder</DropdownMenuItem>
              <DropdownMenuItem icon={<FiUsers size={14} />}>Shared</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <FieldDescription>Leading icons improve menu scanning speed.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Checkboxes: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Checkboxes</h3>

      <Field style={frameStyle}>
        <FieldLabel>Preference Toggles</FieldLabel>

        <FieldContent>
          <CheckboxesDemo />
          <FieldDescription>
            Checkbox items keep the menu open for multi-toggle workflows.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const CheckboxesIcons: Story = {
  name: 'Checkboxes Icons',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Checkboxes Icons</h3>

      <Field style={frameStyle}>
        <FieldLabel>Feature Flags</FieldLabel>

        <FieldContent>
          <CheckboxesIconsDemo />
          <FieldDescription>
            Checkbox indicators can be combined with feature icons in each row.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const RadioGroup: Story = {
  name: 'Radio Group',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Radio Group</h3>

      <Field style={frameStyle}>
        <FieldLabel>Single Choice</FieldLabel>

        <FieldContent>
          <RadioGroupDemo />
          <FieldDescription>Radio group keeps exactly one item selected.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const RadioIcons: Story = {
  name: 'Radio Icons',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Radio Icons</h3>

      <Field style={frameStyle}>
        <FieldLabel>Theme Mode</FieldLabel>

        <FieldContent>
          <RadioIconsDemo />
          <FieldDescription>
            Radio items support both state indicators and leading icons.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const SelectGroup: Story = {
  name: 'Select Group',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Select Group</h3>

      <Field style={frameStyle}>
        <FieldLabel>Single Select Options</FieldLabel>

        <FieldContent>
          <SelectGroupDemo />
          <FieldDescription>
            Select-only menu remains open after selection and closes on outside click.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Destructive: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Destructive</h3>

      <Field style={frameStyle}>
        <FieldLabel>Risky Actions</FieldLabel>

        <FieldContent>
          <DropdownMenu>
            <DropdownMenuTrigger>Danger Zone</DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem icon={<FiEdit3 size={14} />}>Rename</DropdownMenuItem>
              <DropdownMenuItem icon={<FiArchive size={14} />}>Archive</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive icon={<FiTrash2 size={14} />}>
                Delete Permanently
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <FieldDescription>
            Destructive item uses danger color and hover tone by default.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const AvatarMenu: Story = {
  name: 'Avatar',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Avatar</h3>

      <Field style={frameStyle}>
        <FieldLabel>User Menu</FieldLabel>

        <FieldContent>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar size="sm" text="Mayur" badgeColor="#22c55e" />
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel inset>Signed in as mayur@keytuno.app</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem icon={<Avatar size="xs" text="Mayur" />}>Profile</DropdownMenuItem>
              <DropdownMenuItem icon={<Avatar size="xs" text="Team" badgeColor="#22c55e" />}>
                Team Workspace
              </DropdownMenuItem>
              <DropdownMenuItem icon={<FiLogOut size={14} />}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <FieldDescription>Dropdown opens directly from avatar click.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Complex: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Complex</h3>

      <Field style={frameStyle}>
        <FieldLabel>Full Action Surface</FieldLabel>

        <FieldContent>
          <DropdownMenu size="md" variant="soft" side="auto">
            <DropdownMenuTrigger>Open Workflow Menu</DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>Trading Workspace</DropdownMenuLabel>

              <DropdownMenuGroup>
                <DropdownMenuItem icon={<FiPlus size={14} />} shortcut="N">
                  New Strategy
                </DropdownMenuItem>
                <DropdownMenuItem icon={<FiCopy size={14} />} shortcut="Ctrl + C">
                  Duplicate Sheet
                </DropdownMenuItem>
                <DropdownMenuItem
                  icon={<FiShare2 size={14} />}
                  submenu={
                    <>
                      <DropdownMenuLabel inset>Share with</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem icon={<FiUsers size={14} />}>Trading Team</DropdownMenuItem>
                      <DropdownMenuItem icon={<FiMail size={14} />}>Email Digest</DropdownMenuItem>
                      <DropdownMenuItem icon={<FiLink2 size={14} />}>
                        Copy Public Link
                      </DropdownMenuItem>
                    </>
                  }
                >
                  Share
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuCheckboxItem icon={<FiBell size={14} />} checked>
                  Notification Alerts
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem icon={<FiFlag size={14} />}>
                  Pinned
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Mode</DropdownMenuLabel>
              <DropdownMenuRadioGroup defaultValue="balanced">
                <DropdownMenuRadioItem value="safe" icon={<FiShield size={14} />}>
                  Safe
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="balanced" icon={<FiHeart size={14} />}>
                  Balanced
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="aggressive" icon={<FiStar size={14} />}>
                  Aggressive
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem destructive icon={<FiTrash2 size={14} />}>
                Delete Workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <FieldDescription>
            Complex menu combines submenu, shortcuts, checkbox items, radio group, and destructive
            actions.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const DeepNestedPlayground: Story = {
  name: 'Deep Nested Playground',
  args: {
    onAction: undefined,
    onOpenChange: undefined,
  },
  argTypes: {
    onAction: { action: 'action' },
    onOpenChange: { action: 'open-change' },
  },
  render: (args) => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Deep Nested Playground</h3>

      <Field style={frameStyle}>
        <FieldLabel>Nested Subchildrens</FieldLabel>

        <FieldContent>
          <DropdownMenu
            side="auto"
            size="sm"
            variant="outline"
            onAction={args.onAction}
            onOpenChange={args.onOpenChange}
          >
            <DropdownMenuTrigger>{`Open ${DEEP_NESTED_LEVEL_COUNT} Levels`}</DropdownMenuTrigger>

            <DropdownMenuContent>
              {renderDeepNestedChildren(1, DEEP_NESTED_LEVEL_COUNT)}
            </DropdownMenuContent>
          </DropdownMenu>

          <FieldDescription>
            Supports at least 10 levels and auto repositions each submenu to stay visible in the
            viewport.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const MultiChildPlayground: Story = {
  name: 'Multi Child Playground',
  args: {
    onAction: undefined,
    onOpenChange: undefined,
  },
  argTypes: {
    onAction: { action: 'action' },
    onOpenChange: { action: 'open-change' },
  },
  render: (args) => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Multi Child Playground</h3>

      <Field style={frameStyle}>
        <FieldLabel>Checkboxes, Radios, Select Group, Nested Childs</FieldLabel>

        <FieldContent>
          <MultiChildPlaygroundDemo onAction={args.onAction} onOpenChange={args.onOpenChange} />
          <FieldDescription>
            Combined playground with multiple child groups and nested subchildren for real usage
            flows.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const SideDebug: Story = {
  name: 'Side Debug',
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
      <div style={sideDebugViewportStyle}>
        <div style={sideDebugInfoStyle}>
          Auto mode tries bottom first, then falls back to other sides if bottom cannot fit. Menus
          include long content to validate scrollbar behavior.
        </div>

        {sideDebugAnchorPositions.map((anchor) => (
          <SideDebugAnchor
            key={`${anchor.label}-${anchor.side}`}
            label={anchor.label}
            side={anchor.side}
            style={anchor.style}
          />
        ))}
      </div>
    </div>
  ),
};

export const DropdownMenuActions: Story = {
  name: 'DropdownMenu Actions',
  args: {
    onAction: undefined,
    onOpenChange: undefined,
  },
  argTypes: {
    onAction: {
      action: 'action',
      description:
        'Fires for trigger open/close, outside click close, escape close, and menu item selections.',
    },
    onOpenChange: {
      action: 'open-change',
      description: 'Fires with the next open state whenever dropdown visibility changes.',
    },
  },
  render: (args) => {
    const onAction = args.onAction;
    const onOpenChange = args.onOpenChange;

    const handleAction =
      onAction == null
        ? undefined
        : (context: DropdownMenuActionContext) => {
            onAction(context);
          };

    return (
      <Field style={frameStyle}>
        <FieldLabel>Action Events</FieldLabel>

        <FieldContent>
          <DropdownMenu onAction={handleAction} onOpenChange={onOpenChange}>
            <DropdownMenuTrigger>Action Menu</DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem icon={<FiEye size={14} />}>Preview</DropdownMenuItem>
              <DropdownMenuItem icon={<FiSettings size={14} />}>Configure</DropdownMenuItem>
              <DropdownMenuCheckboxItem icon={<FiBell size={14} />} checked>
                Notifications
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <FieldDescription>
            Open, close, and select items to inspect action payloads in Storybook actions panel.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};

type DropdownMenuPlaygroundProps = DropdownMenuProps & {
  withAction?: boolean;
};

export const DropdownMenuPlayground: StoryObj<DropdownMenuPlaygroundProps> = {
  name: 'DropdownMenu Playground',
  args: {
    variant: 'default',
    size: 'md',
    side: 'auto',
    closeOnSelect: true,
    disabled: false,
    withAction: true,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'soft'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    side: {
      control: 'select',
      options: ['auto', 'bottom', 'top', 'left', 'right'],
    },
    closeOnSelect: { control: 'boolean' },
    disabled: { control: 'boolean' },
    withAction: { control: 'boolean' },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    onAction: { action: 'action' },
    onOpenChange: { action: 'open-change' },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;
    const onAction = withAction ? args.onAction : undefined;
    const onOpenChange = withAction ? args.onOpenChange : undefined;

    return (
      <Field style={frameStyle}>
        <FieldLabel>Interactive Playground</FieldLabel>

        <FieldContent>
          <DropdownMenu
            key={`${args.variant}-${args.size}-${args.side}-${args.closeOnSelect}-${args.disabled}`}
            variant={args.variant}
            size={args.size}
            side={args.side}
            closeOnSelect={args.closeOnSelect}
            disabled={args.disabled}
            onAction={onAction}
            onOpenChange={onOpenChange}
          >
            <DropdownMenuTrigger disabled={args.disabled}>Playground Trigger</DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>Playground Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem icon={<FiEye size={14} />}>Preview</DropdownMenuItem>
                <DropdownMenuItem icon={<FiSettings size={14} />}>Configure</DropdownMenuItem>
                <DropdownMenuItem
                  icon={<FiShare2 size={14} />}
                  submenu={
                    <>
                      <DropdownMenuLabel inset>Share Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem icon={<FiUsers size={14} />}>Team</DropdownMenuItem>
                      <DropdownMenuItem icon={<FiMail size={14} />}>Email</DropdownMenuItem>
                      <DropdownMenuItem
                        icon={<FiLayers size={14} />}
                        submenu={
                          <>
                            <DropdownMenuLabel inset>Nested Childs</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem icon={<FiLink2 size={14} />}>
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem icon={<FiSend size={14} />}>
                              Send Invite
                            </DropdownMenuItem>
                          </>
                        }
                      >
                        More
                      </DropdownMenuItem>
                    </>
                  }
                >
                  Share
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem icon={<FiTrash2 size={14} />} destructive>
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <FieldDescription>
            Test variant, size, side positioning, and close behavior with multi-child nested
            content.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};

function FiSun({ size = 14 }: { size?: number }): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M6.34 17.66l-1.41 1.41" />
      <path d="M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}
