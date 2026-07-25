# @keytuno/ui-react — Copilot Reference

> Drop this file as `.github/copilot-instructions.md` in any consuming project so Copilot reads it automatically for every chat in that workspace.

---

## Installation

```bash
# private GitHub tag install (current recommended release path)
pnpm add git+https://github.com/mayurpatil60/keytuno-ui-react.git#v1.0.0

# optional registry install (only if your environment publishes @keytuno/ui-react)
pnpm add @keytuno/ui-react

# peer deps: react ^18, react-dom ^18
```

---

## Import patterns

Prefer **subpath imports** for best tree-shaking:

```ts
import { Button } from '@keytuno/ui-react/components/Button';
import { Table } from '@keytuno/ui-react/components/Table';
import { lightTheme } from '@keytuno/ui-react/themes/light';
import { themeToCssVariables } from '@keytuno/ui-react/adapters/web';
```

Barrel import also works and is fully tree-shakeable when `sideEffects: false`:

```ts
import { Button, Table, Badge } from '@keytuno/ui-react';
```

Available subpath roots: `@keytuno/ui-react/components/*`, `@keytuno/ui-react/themes/*`, `@keytuno/ui-react/tokens/*`, `@keytuno/ui-react/adapters/*`, `@keytuno/ui-react/contracts/*`.

---

## Story authoring in this repo

When editing stories inside the `keytuno-ui-react` repository itself, prefer local source imports so VS Code and TypeScript resolve symbols without package-install indirection:

```ts
import { Alert } from '../src/index';
```

Use standard Storybook typing for stable `args` inference and typed `render(args)` signatures:

```ts
const meta: Meta<typeof Alert> = { ... };
export default meta;

type Story = StoryObj<typeof meta>;
```

This avoids common red diagnostics such as unresolved `@keytuno/ui-react` imports in story files and implicit-any callback parameters.

---

## Theming setup

The library uses **CSS custom properties** (`--ktn-*`). Apply a theme by writing variables onto a root element:

```tsx
import { lightTheme, darkTheme } from '@keytuno/ui-react';
import { themeToCssVariables, selectorToCssBlock } from '@keytuno/ui-react';

// Option A — inject a <style> tag (SSR-friendly):
const css = selectorToCssBlock(':root', themeToCssVariables(lightTheme));
// → `:root { --ktn-bg-default: #fff; --ktn-text-primary: #0f172a; … }`

// Option B — inline style on a wrapper div:
function App() {
  const vars = themeToCssVariables(lightTheme);
  return <div style={vars as React.CSSProperties}><YourApp /></div>;
}
```

### CSS variable reference

| Variable | Purpose |
|---|---|
| `--ktn-bg-default` | Page background |
| `--ktn-bg-surface` | Card / panel background |
| `--ktn-bg-muted` | Subtle background (hover, striped rows) |
| `--ktn-text-primary` | Primary text |
| `--ktn-text-secondary` | Secondary / muted text |
| `--ktn-border-muted` | Default border |
| `--ktn-border-strong` | Focused / emphasized border |
| `--ktn-action-primary-bg` | Primary button / accent color |
| `--ktn-action-primary-fg` | Text on primary button |
| `--ktn-action-danger-bg` | Destructive / danger color |
| `--ktn-action-danger-fg` | Text on danger button |
| `--ktn-radius-sm/md/lg/pill` | Border radii |
| `--ktn-shadow-sm/md` | Box shadows |

### Custom theme / subtheme

```ts
import { createSemanticColors, basePrimitiveTokens } from '@keytuno/ui-react';
import type { ThemeContract } from '@keytuno/ui-react';

const myTheme: ThemeContract = {
  name: 'light',
  mode: 'default',
  primitives: basePrimitiveTokens,
  semantic: { colors: createSemanticColors({ actionPrimaryBackground: '#7c3aed', … }) },
};
```

---

## Design conventions

- Most controls use size `'xs' | 'sm' | 'md' | 'lg'` with default `'md'`, including navigation/layout components such as `Navbar` and `Sidebar`.
- Variant names are component-specific. Button-like variants are common, but navigation, tabs, table, alert, and upload components use their own variant unions.
- State-oriented components expose direct value callbacks (`onValueChange`, `onCheckedChange`, `onOpenChange`, `onPageChange`) and an `onAction(context)` callback for richer telemetry.
- Some lightweight components use event-style `onAction(event)` by design: `Button`, `Badge`, `Avatar`, and item-level actions in `Breadcrumb`, `Navbar`, and `Sidebar`.
- Components never import CSS files — all styles are inline or CSS vars. No stylesheet setup required.
- `sideEffects: false` in package.json — all tree-shaking safe.
- Canonical file/component naming uses `Separator` (`src/components/Separator.tsx`, `Separator`).
- Use `Separator` consistently in all code, exports, docs, and stories.
- Most component roots accept native HTML attributes (including `aria-*` and `data-*`), which enables custom accessibility wiring and test selectors.

---

## Release verification snapshot (2026-07-01)

Release baseline: `@keytuno/ui-react` v1.0.0.

- `pnpm lint`: pass with warnings only (0 errors, 24 warnings).
- `pnpm typecheck`: pass.
- `pnpm test`: pass (2 tests in `Spinner.test.tsx`).
- `pnpm build`: pass.
- `pnpm build-storybook`: pass.
- `pnpm size`: pass all configured bundle budgets.
- `pnpm audit --prod --audit-level high`: no known vulnerabilities.

Follow-up quality debt before broader adoption:

- Reduce lint warnings (primarily hook dependency warnings and unused symbols).
- Increase unit/integration coverage beyond the current spinner-only test file.

---

## Release contributor (v1.0.0)

- Name: Mayur Patil
- Email: mayurpatil60@gmail.com
- GitHub: https://github.com/mayurpatil60

---

## Action callback contract

Use this callback priority in consumer apps:

1. Bind state with direct callbacks first (`onValueChange`, `onCheckedChange`, `onOpenChange`, `onPageChange`).
2. Use `onAction(context)` for analytics/event pipelines.
3. Use event-style `onAction(event)` only for event-native controls.

Current callback groups:

- Event-style `onAction(event)`: `Button`, `Badge`, `Avatar`, item-level `NavbarItem`, item-level `SidebarItem`, and item-level breadcrumb actions.
- Context-style `onAction(context)`: all stateful form/data/overlay/navigation containers (`Select`, `DatePicker`, `ColorPicker`, `TimezonePicker`, `Radio`, `Switch`, `Checkbox`, `Slider`, `Table`, `Pagination`, `Dialog`, `Sheet`, `DropdownMenu`, `Tabs`, `Stepper`, `List`, `Field`, etc.).

When adding new components, keep this standard:

- If component value/open/checked state changes, provide both direct callback and context callback.
- Keep action context serializable and source-driven (`source`, current state, previous state, event optional).

---

## Accessibility contract

- Always provide a readable label for icon-only controls (`aria-label` or explicit visible label).
- Prefer semantic structures already implemented by components (`role="dialog"`, `role="listbox"`, `role="radiogroup"`, `role="navigation"`, `role="progressbar"`).
- Use `Field`, `FieldLabel`, `FieldDescription`, and `FieldError` to wire `htmlFor`, `aria-describedby`, and error announcements consistently.
- For repeated controls on the same page, provide unique accessible names so screen readers and tests can disambiguate actions.
- Keep `decorative` usage for spinner/skeleton when they should be hidden from assistive tech.

---

## Testing contract (Playwright + React Testing Library)

Prefer role/name selectors first, then fall back to `data-testid` when repeated instances need strict scoping.

Playwright pattern for repeated reusable components:

```ts
import { expect, test } from '@playwright/test';

test('updates the billing table page size only', async ({ page }) => {
  await page.goto('/settings');

  const billingPanel = page.getByTestId('billing-table-panel');
  await billingPanel.getByRole('button', { name: 'Open options' }).click();
  await billingPanel.getByRole('option', { name: '25' }).click();

  await expect(billingPanel.getByText('Showing page')).toBeVisible();
});
```

React Testing Library pattern with scoped queries:

```tsx
import { render, screen, within } from '@testing-library/react';

it('toggles only the notifications switch in profile card', async () => {
  render(<SettingsPage />);

  const profileCard = screen.getByTestId('profile-settings-card');
  const notificationsSwitch = within(profileCard).getByRole('switch', {
    name: 'Email notifications',
  });

  expect(notificationsSwitch).toBeInTheDocument();
});
```

Recommended selector strategy for reusable components:

- Assign stable container IDs per domain area (`data-testid="billing-table-panel"`).
- Use accessible names tied to business intent, not generic labels (`Open options` -> `Open billing status options` when needed).
- Avoid index-based selectors when the same component appears multiple times.

---

## Component API

This section is a practical quick reference. For exact source-of-truth props and unions, prefer generated declarations in `dist/components/*.d.ts`.

### Button

```ts
import { Button } from '@keytuno/ui-react';

// variant: 'primary' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link'
// size: 'xs' | 'sm' | 'md' | 'lg'
<Button
  variant="primary"
  size="md"
  compact?={boolean}          // reduce horizontal padding
  iconOnly?={boolean}         // square button, no padding
  iconOnlyTone?={boolean}     // icon inherits accent color
  iconColor?={string}
  tooltip?={ReactNode}        // built-in tooltip (wraps Tooltip internally)
  tooltipSide?={'left'|'top'|'bottom'|'right'|'auto'}
  tooltipSize?={'xs'|'sm'|'md'|'lg'}
  tooltipDisabled?={boolean}
  tooltipOpenDelay?={number}
  tooltipCloseDelay?={number}
  onAction?={(event) => void}
  // + all standard HTMLButtonElement props
/>
```

- `secondary` Button variant uses the same surface background token as Select (`--ktn-bg-surface`), so light and dark themes stay visually aligned.

### Toggle

```ts
import { Toggle } from '@keytuno/ui-react';

// Extends ButtonProps (same variant/size/compact/iconOnly/tooltip props)
<Toggle
  pressed?={boolean}
  defaultPressed?={boolean}
  onPressedChange?={(pressed: boolean) => void}
  fillIconOnPressed?={boolean}
  onAction?={(ctx: ToggleActionContext) => void}
/>
// ToggleActionContext: { source, pressed, previousPressed, variant, disabled, event }
```

### ButtonGroup
```ts
import { ButtonGroup } from '@keytuno/ui-react';

// Wraps multiple <Button> or <Toggle> children; shares size/variant/compact/disabled
<ButtonGroup
  orientation?={'horizontal'|'vertical'}   // default 'horizontal'
  size?={'xs'|'sm'|'md'|'lg'}
  variant?={'primary'|'outline'|'ghost'|'secondary'|'destructive'|'link'}
  compact?={boolean}
  disabled?={boolean}
  onAction?={(ctx: ButtonGroupActionContext) => void}
>
  <Button>…</Button>
  <Button>…</Button>
</ButtonGroup>
```

### Badge

```ts
import { Badge } from '@keytuno/ui-react';

<Badge
  variant?={'primary'|'outline'|'ghost'|'secondary'|'destructive'|'link'}
  size?={'xs'|'sm'|'md'|'lg'}
  onAction?={(e: MouseEvent) => void}
>
  Label
</Badge>
```

### Spinner

```ts
import { Spinner } from '@keytuno/ui-react';

<Spinner size?={'xs'|'sm'|'md'|'lg'} decorative?={boolean} />
```

### Skeleton

```ts
import { Skeleton } from '@keytuno/ui-react';

<Skeleton
  width?={CSSProperties['width']}    // e.g. '100%', '12rem'
  height?={CSSProperties['height']}
  radius?={'none'|'sm'|'md'|'lg'|'full'}
  animated?={boolean}                // default true
  decorative?={boolean}
/>
```

### Avatar

```ts
import { Avatar } from '@keytuno/ui-react';

<Avatar
  size?={'xs'|'sm'|'md'|'lg'}
  text?={string}                    // initials fallback when no image
  avatarImage?={{ src?: string; alt?: string }}
  badgeIcon?={ReactNode}            // status badge overlay
  badgeColor?={string}
  onAction?={(e: MouseEvent) => void}
/>
```

### Separator

```ts
import { Separator } from '@keytuno/ui-react';

<Separator
  orientation?={'horizontal'|'vertical'}
  size?={'xs'|'sm'|'md'|'lg'}
  variant?={'default'|'light'|'dark'|'brand-light'|'brand-dark'}
  decorative?={boolean}
/>

// Theme behavior:
// - Use variant to tune divider contrast by surface theme.
// - Sidebar uses matching separator variants internally for each sidebar variant.
```

### Tooltip

```ts
import { Tooltip } from '@keytuno/ui-react';

// Wraps any child — tooltip appears on hover/focus
<Tooltip
  label={ReactNode}                 // tooltip content (required)
  side?={'left'|'top'|'bottom'|'right'|'auto'}
  size?={'xs'|'sm'|'md'|'lg'}
  disabled?={boolean}
  openDelay?={number}               // ms, default 400
  closeDelay?={number}
  onAction?={(ctx: TooltipActionContext) => void}
>
  <Button>Hover me</Button>
</Tooltip>
```

### Input

```ts
import { Input } from '@keytuno/ui-react';

// Extends all standard HTMLInputElement props
<Input
  size?={'xs'|'sm'|'md'|'lg'}
  invalid?={boolean}
  onAction?={(ctx: InputActionContext) => void}
  // + onChange, onFocus, onBlur, value, defaultValue, placeholder, disabled, required, …
/>
```

### Textarea

```ts
import { Textarea } from '@keytuno/ui-react';

<Textarea
  size?={'xs'|'sm'|'md'|'lg'}
  invalid?={boolean}
  onAction?={(ctx: TextareaActionContext) => void}
  // + all standard textarea props
/>
```

### Checkbox

```ts
import { Checkbox } from '@keytuno/ui-react';

<Checkbox
  size?={'xs'|'sm'|'md'|'lg'}
  invalid?={boolean}
  description?={ReactNode}
  onCheckedChange?={(checked: boolean) => void}
  // + all standard input[checkbox] props: checked, defaultChecked, disabled, required, …
>
  Label text
</Checkbox>
```

### Switch

```ts
import { Switch } from '@keytuno/ui-react';

<Switch
  orientation?={'horizontal'|'vertical'}
  size?={'xs'|'sm'|'md'|'lg'}
  invalid?={boolean}
  description?={ReactNode}
  onCheckedChange?={(checked: boolean) => void}
  onAction?={(ctx: SwitchActionContext) => void}
  // + checked, defaultChecked, disabled, required, …
>
  Label text
</Switch>
```

### Radio

```ts
import { Radio } from '@keytuno/ui-react';

interface RadioOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

<Radio
  options={RadioOption[]}
  value?={string | null}
  defaultValue?={string | null}
  onValueChange?={(value: string) => void}
  orientation?={'horizontal'|'vertical'}
  size?={'xs'|'sm'|'md'|'lg'}
  align?={'inline-start'|'inline-end'}
  disabled?={boolean}
  required?={boolean}
  invalid?={boolean}
  choiceCard?={boolean}              // renders as card-style radio buttons
  name?={string}
/>
```

### Slider

```ts
import { Slider } from '@keytuno/ui-react';

<Slider
  value?={number[]}                 // e.g. [30] for single, [20, 80] for range
  defaultValue?={number[]}
  min?={number}
  max?={number}
  step?={number}
  minStepsBetweenThumbs?={number}
  orientation?={'horizontal'|'vertical'}
  size?={'xs'|'sm'|'md'|'lg'}
  disabled?={boolean}
  showLabels?={boolean}
  minLabel?={ReactNode}
  maxLabel?={ReactNode}
  showValueLabel?={boolean}
  formatValueLabel?={(value: number[]) => ReactNode}
  onValueChange?={(value: number[]) => void}
/>
```

### Progress

```ts
import { Progress, ProgressLabel, ProgressValue } from '@keytuno/ui-react';

<Progress value={65} min?={0} max?={100} size?={'xs'|'sm'|'md'|'lg'}>
  <ProgressLabel>Uploading…</ProgressLabel>
  <ProgressValue formatter?={(value, pct) => `${pct}%`} />
</Progress>
```

### Select

```ts
import { Select } from '@keytuno/ui-react';

interface SelectOption { value: string; label: string; description?: string; keywords?: string[]; disabled?: boolean; }
interface SelectGroup  { label: string; options: SelectOption[]; }

<Select
  options?={SelectOption[]}
  groups?={SelectGroup[]}           // use groups OR options, not both
  value?={string | string[] | null}
  defaultValue?={string | string[] | null}
  multiple?={boolean}
  showClear?={boolean}
  clearLabel?={string}
  openOptionsLabel?={string}
  closeOptionsLabel?={string}
  placeholder?={string}
  searchPlaceholder?={string}
  emptyText?={string}
  size?={'xs'|'sm'|'md'|'lg'}
  variant?={'inline'|'overlay'}      // default 'inline'
                                      // inline: panel consumes layout space
                                      // overlay: panel floats above content
  disabled?={boolean}
  invalid?={boolean}
  onValueChange?={(value) => void}
  renderItem?={(option, { selected }) => ReactNode}  // custom option renderer
/>
```

### DatePicker

```ts
import { DatePicker } from '@keytuno/ui-react';

// mode 'date'  → value is ISO string 'YYYY-MM-DD' or null
// mode 'range' → value is { start: string|null, end: string|null }
// mode 'time'  → value is 'HH:MM' string or null
// responsive panel:
// - date + range render one calendar viewport (mobile friendly)
// - range uses From/To selector row and switches the same calendar context

<DatePicker
  mode?={'date'|'range'|'time'}     // default 'date'
  value?={DatePickerValue}
  defaultValue?={DatePickerValue}
  onValueChange?={(value) => void}
  size?={'xs'|'sm'|'md'|'lg'}
  variant?={'default'|'compact'|'primary'|'outline'|'ghost'|'secondary'|'destructive'|'link'}
                                   // default/compact control picker density/layout
                                   // primary/outline/... keep tone compatibility
  disabled?={boolean}
  invalid?={boolean}
  placeholder?={string}
  datePlaceholder?={string}
  rangePlaceholder?={string}
  timePlaceholder?={string}
  inputAriaLabel?={string}
  panelAriaLabel?={string}
  clearLabel?={string}
  openPickerLabel?={string}
  closePickerLabel?={string}
  rangeFromLabel?={string}
  rangeToLabel?={string}
  rangeStartEmptyText?={string}
  rangeEndEmptyText?={string}
  timePanelTitle?={string}
  timeOptionAriaFormatter?={(time12Hour, time24Hour) => string}
  rangeSeparator?={string}           // separator shown between start and end dates
  calendarSelectVariant?={'inline'|'overlay'} // month/year Select panel behavior
  monthSelectProps?={DatePickerCalendarSelectProps}
  yearSelectProps?={DatePickerCalendarSelectProps}
  navigationButtonProps?={DatePickerControlButtonProps}
  dayButtonProps?={DatePickerControlButtonProps}
  timeOptionButtonProps?={DatePickerControlButtonProps}
  rangeFieldButtonProps?={DatePickerControlButtonProps}
/>
```

### TimezonePicker

```ts
import { TimezonePicker } from '@keytuno/ui-react';

// Uses Select (combobox) behavior from ui-react Select component

<TimezonePicker
  size?={'xs'|'sm'|'md'|'lg'}
  variant?={'compact'|'detailed'}
  selectVariant?={'inline'|'overlay'} // default 'inline' (forwarded to underlying Select)
  includeSystemTimezone?={boolean}   // include local/system timezone option at top
  systemTimezone?={string | null}    // override detected system timezone when needed
  timezones?={string[]}              // optional curated IANA list (defaults to important/common zones)
  preferredTimezones?={string[]}     // optional pinned timezone ordering
  value?={string | null}             // controlled value
  defaultValue?={string | null}      // uncontrolled initial value
  showClear?={boolean}
  disabled?={boolean}
  required?={boolean}
  invalid?={boolean}
  placeholder?={string}
  searchPlaceholder?={string}
  emptyText?={string}
  onValueChange?={(value: string | null) => void}
  onAction?={(context: TimezonePickerActionContext) => void} // open | close | search | select | clear | system-select
/>

// selected value remains concise (IANA timezone string)
// metadata like UTC offset stays in dropdown rows
```

### ColorPicker

```ts
import { ColorPicker } from '@keytuno/ui-react';

<ColorPicker
  size?={'xs'|'sm'|'md'|'lg'}
  variant?={'compact'|'detailed'}
  variant?={'compact'|'detailed'}    // backwards-compatible alias; prefer variant
  value?={string | null}             // controlled HEX value (for example '#2563eb')
  defaultValue?={string | null}      // uncontrolled initial HEX value
  swatches?={string[]}               // optional curated palette
  showClear?={boolean}
  showSwatches?={boolean}            // show/hide rounded swatch buttons below picker
  disabled?={boolean}
  required?={boolean}
  invalid?={boolean}
  placeholder?={string}              // used in detailed hex input
  colorInputAriaLabel?={string}
  hexInputAriaLabel?={string}
  emptyValueLabel?={ReactNode}
  clearButtonLabel?={ReactNode}
  clearButtonAriaLabel?={string}
  chooseColorAriaFormatter?={(hexColor: string) => string}
  onValueChange?={(value: string | null) => void}
  onAction?={(context: ColorPickerActionContext) => void}
  // action sources: picker-change | hex-input | swatch-select | clear | focus | blur
/>

// detailed variant: color control + editable hex input + swatches
// compact variant: compact inline value with optional swatches
  // hex input allows free typing and normalizes to valid HEX on commit/blur
```

### Scrollbar

```ts
import { Scrollbar } from '@keytuno/ui-react';

// Custom-styled scrollable container
<Scrollbar axis?={'x'|'y'|'both'}>
  {children}
</Scrollbar>
```

### Pagination

```ts
import { Pagination } from '@keytuno/ui-react';

<Pagination
  variant?={'basic'|'advance'|'compact'}
  size?={'xs'|'sm'|'md'|'lg'}
  pageSizeSelectVariant?={'inline'|'overlay'} // default 'inline' for page-size selector
  page?={number}                    // 1-based current page
  defaultPage?={number}
  totalPages={number}
  pageSize?={number}
  pageSizeOptions?={number[]}       // default [12, 24, 48]
  onPageChange?={(page: number) => void}
  onPageSizeChange?={(size: number) => void}
  maxVisiblePages?={number}
  showPageSizeSelector?={boolean}
  showSummary?={boolean}
  showShowingPage?={boolean}
  labels?={PaginationLabels}        // includes text labels + navigation/first/previous/next/last aria labels + pageAriaFormatter

  // Internal button overrides
  firstButtonProps?={PaginationButtonProps}
  previousButtonProps?={PaginationButtonProps}
  nextButtonProps?={PaginationButtonProps}
  lastButtonProps?={PaginationButtonProps}
  pageButtonProps?={PaginationButtonProps}
  activePageButtonProps?={PaginationButtonProps}
/>

// PaginationButtonProps = Omit<ButtonProps, 'children' | 'onAction' | 'size' | 'type'>
```

- Navigation buttons (`firstButtonProps`, `previousButtonProps`, `nextButtonProps`, `lastButtonProps`) now honor the provided `variant` override (for example `secondary`) instead of always forcing `outline`.
- `secondary` pagination buttons follow the same Button surface tokens in both light and dark themes.

### Accordion

```ts
import { Accordion } from '@keytuno/ui-react';

interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  actions?: ReactNode;
  disabled?: boolean;
}

<Accordion
  items={AccordionItem[]}
  orientation?={'horizontal'|'vertical'}
  size?={'xs'|'sm'|'md'|'lg'}
  multiple?={boolean}
  disabled?={boolean}
  defaultOpenItems?={string[]}
  onOpenItemsChange?={(ids: string[]) => void}
/>
```

### Tabs

```ts
import { Tabs } from '@keytuno/ui-react';

interface TabsItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

<Tabs
  items={TabsItem[]}
  value?={string}
  defaultValue?={string}
  onValueChange?={(value: string) => void}
  variant?={'line'|'button'|'only icon'}
  orientation?={'horizontal'|'vertical'}
  size?={'xs'|'sm'|'md'|'lg'}
  side?={'left'|'top'|'bottom'|'right'}
  disabled?={boolean}
  emptyText?={ReactNode}
/>
```

### Breadcrumb

```ts
import { Breadcrumb } from '@keytuno/ui-react';

interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  onAction?: (e: MouseEvent) => void;
}

<Breadcrumb
  items={BreadcrumbItem[]}
  size?={'xs'|'sm'|'md'|'lg'}
  separator?={ReactNode}            // primary separator content
  separatorFallback?={ReactNode}    // used when separator is not provided
  ellipsisContent?={ReactNode}      // visual content for collapsed entries
  ellipsisAriaLabelFormatter?={(hiddenItemsCount: number) => string}
  itemAriaLabelFormatter?={({ item, index, isCurrentPage }) => string | undefined}
  navigationAriaLabel?={string}
  maxVisibleItems?={number}
  onAction?={(ctx: BreadcrumbActionContext) => void}
/>
```

### Stepper

```ts
import { Stepper } from '@keytuno/ui-react';

interface StepperSubstep {
  id: string;
  title: ReactNode;
  shortDescription?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  completed?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

interface StepperStep {
  id: string;
  title: ReactNode;
  shortDescription?: ReactNode;
  description?: ReactNode;
  content?: ReactNode;
  icon?: ReactNode;
  substeps?: StepperSubstep[];
  completed?: boolean;
  disabled?: boolean;
  collapsible?: boolean;
  keepOpen?: boolean;             // seeds initial open state, not a permanent lock
  defaultOpen?: boolean;
  open?: boolean;                 // true seeds initial open state
  ariaLabel?: string;
}

<Stepper
  steps={StepperStep[]}
  variant?={'vertical'|'horizontal'|'compact-vertical'|'compact-horizontal'}
  size?={'xs'|'sm'|'md'|'lg'}
  activeStepId?={string}
  defaultActiveStepId?={string}
  onActiveStepChange?={(stepId: string) => void}
  activeSubstepId?={string}
  defaultActiveSubstepId?={string}
  onActiveSubstepChange?={(substepId: string, stepId: string) => void}
  openStepIds?={string[]}
  defaultOpenStepIds?={string[]}
  onOpenStepIdsChange?={(ids: string[]) => void}
  collapsible?={boolean}
  allowMultipleOpen?={boolean}
  disabled?={boolean}
  showDescriptions?={boolean}
  showShortDescriptions?={boolean}
  showSubsteps?={boolean}
  showDisabledSteps?={boolean}     // include disabled step cards in layout
  showDisabledSubsteps?={boolean}  // include disabled substeps in panel lists
  showStepNumbers?={boolean}
  showIndicators?={boolean}
  showControls?={boolean}
  showControlsInside?={boolean}    // render action controls inside each open step card
  showControlsOutside?={boolean}   // render action controls below the stepper
  showPrevious?={boolean}          // show/hide previous button
  showNext?={boolean}              // show/hide next button
  showSubmit?={boolean}            // show/hide submit button
  controls?={{ previous, next, submit }} // supports with-icon, text-only, icon-only
  submitOnLastStep?={boolean}
  hideNextWhenLastStep?={boolean}
  onSubmit?={(activeStepId: string | null) => void}
  onAction?={(ctx: StepperActionContext) => void}
/>
```

Stepper behavior notes:

- Any collapsible step card can be opened or closed from the step header (title/indicator area) or the up/down toggle button.
- Disabled steps are non-selectable as active steps, but their cards can still be expanded or collapsed when the Stepper itself is not globally disabled.
- First, middle, and last steps follow the same open/close behavior with no position-based lock.
- `defaultOpen`, `open`, and `keepOpen` are treated as initial open seeds. Runtime expand/collapse is driven by user interaction or `openStepIds` control.
- Action controls are right-aligned and include only previous, next, and submit.
- Submit button uses success styling by default, and completed step tick indicators use success styling.

### StepwiseForm

```ts
import { StepwiseForm } from '@keytuno/ui-react';

type StepwiseFormCardProps = Omit<
  CardProps,
  'children' | 'collapse' | 'defaultCollapsed' | 'onCollapseChange' | 'onAction'
>;

type StepwiseFormControlButtonProps = Omit<
  ButtonProps,
  'children' | 'type'
>;

interface StepwiseFormControlConfig {
  show?: boolean;
  label?: ReactNode;
  icon?: ReactNode;
  showIcon?: boolean;
  iconOnly?: boolean;
  iconPosition?: 'left' | 'right';
  ariaLabel?: string;
  buttonProps?: StepwiseFormControlButtonProps; // full Button props forwarding
}

interface StepwiseFormControls {
  previous?: StepwiseFormControlConfig;
  next?: StepwiseFormControlConfig;
  submit?: StepwiseFormControlConfig;
}

interface StepwiseFormStep {
  id: string;
  title: ReactNode;
  summary?: ReactNode;
  description?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  disabled?: boolean;
  completed?: boolean;
  collapsible?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  headerCollapseTrigger?: boolean;
  showScrollbar?: boolean;
  contentMaxHeight?: CSSProperties['maxHeight'];
  showContentDivider?: boolean;
  showFooterDivider?: boolean;
  cardProps?: StepwiseFormCardProps; // full Card props forwarding per step
  prevBtnProps?: StepwiseFormControlButtonProps;
  nextBtnProps?: StepwiseFormControlButtonProps;
  submitBtnProps?: StepwiseFormControlButtonProps;
  controls?: StepwiseFormControls;   // per-step control overrides
}

<StepwiseForm
  steps={StepwiseFormStep[]}
  size?={'xs'|'sm'|'md'|'lg'}
  spacing?={'xs'|'sm'|'md'|'lg'}
  activeStepId?={string}
  defaultActiveStepId?={string}
  onActiveStepChange?={(stepId: string) => void}
  openStepIds?={string[]}
  defaultOpenStepIds?={string[]}
  onOpenStepIdsChange?={(ids: string[]) => void}
  collapsible?={boolean}
  allowMultipleOpen?={boolean}
  disabled?={boolean}
  joined?={boolean}                  // default true, joins cards without spacing
  showSummary?={boolean}
  showFooterStepCounter?={boolean}
  headerCollapseTrigger?={boolean}   // default true
  contentScrollable?={boolean}
  contentMaxHeight?={CSSProperties['maxHeight']}
  showContentDivider?={boolean}      // optional line after header
  showFooterDivider?={boolean}       // optional line before footer
  showPrevious?={boolean}
  showNext?={boolean}
  showSubmit?={boolean}
  submitOnLastStep?={boolean}
  hideNextWhenLastStep?={boolean}
  prevBtnProps?={StepwiseFormControlButtonProps}
  nextBtnProps?={StepwiseFormControlButtonProps}
  submitBtnProps?={StepwiseFormControlButtonProps}
  controls?={{ previous, next, submit }}
  cardProps?={StepwiseFormCardProps} // shared Card props for all step cards
  onSubmit?={(activeStepId: string | null) => void}
  onAction?={(ctx: StepwiseFormActionContext) => void}
/>
```

StepwiseForm behavior notes:

- Header title follows a step summary pattern: `Step X of Y: {step title}`.
- Each step is rendered as a card in a collapsible group; `joined={true}` joins cards edge-to-edge with no visual gap between cards.
- Header and summary/description area can toggle open/close when the step is collapsible (`headerCollapseTrigger`, step-level override).
- Horizontal separators are optional with `showContentDivider` and `showFooterDivider`, with per-step overrides available.
- Footer actions are aligned as previous (left), step counter (center), and next/submit (right).
- Button APIs are reusable from three layers:
  - shared direct aliases (`prevBtnProps`, `nextBtnProps`, `submitBtnProps`)
  - shared structured overrides (`controls.*.buttonProps`)
  - per-step overrides (`step.prevBtnProps`, `step.nextBtnProps`, `step.submitBtnProps`, and `step.controls.*.buttonProps`)
- Precedence is most specific last: shared alias -> shared controls -> step alias -> step controls.
- `submitOnLastStep={false}` shows submit on every open step; `true` limits submit to the last enabled step.
- Middle content supports optional scrollbar with `contentScrollable` and `contentMaxHeight`, plus per-step overrides (`showScrollbar`, `contentMaxHeight`).

### Navbar

```ts
import { Navbar } from '@keytuno/ui-react';

interface NavbarItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  href?: string;
  disabled?: boolean;
  active?: boolean;
  ariaLabel?: string;
  items?: NavbarItem[];
  onAction?: (event?: MouseEvent) => void;
}

<Navbar
  brand?={ReactNode}                // custom brand node (overrides structured brand props)
  defaultBrandName?={ReactNode}     // fallback brand text when no custom brand/brandName is provided
  showBrand?={boolean}              // set false to hide brand block completely
  brandLogo?={ReactNode}            // logo/icon on the left side of brand block
  brandName?={ReactNode}            // company name/title on top row
  brandTagline?={ReactNode}         // optional text below company name
  showHamburger?={boolean}          // render optional hamburger button before brand/logo
  hamburgerAriaLabel?={string}
  hamburgerIcon?={ReactNode}
  hamburgerDisabled?={boolean}
  onHamburgerAction?={(event: MouseEvent<HTMLButtonElement>) => void}
  items?={NavbarItem[]}
  actions?={ReactNode}
  size?={'xs'|'sm'|'md'|'lg'}
  variant?={'light'|'dark'|'brand-light'|'brand-dark'|'default'|'outline'}
  sticky?={boolean}
  desktopNavigationLabel?={string}  // aria-label for desktop nav region
  activeItemId?={string}
  defaultActiveItemId?={string}
  onActiveItemChange?={(itemId: string) => void}
  onItemSelect?={(item: NavbarItem, parentItem?: NavbarItem) => void}
  onAction?={(ctx: NavbarActionContext) => void}
/>

// Layout behavior:
// - Optional hamburger renders before brand/logo and is fully callback-driven (no hardcoded open/close behavior)
// - Brand shows on the left (logo + text stack where tagline appears below name)
// - Menu/actions area is right-aligned on desktop
// - If `items` is empty and `emptyText={null}`, the menu area is hidden so navbar can render as a minimal header.
// - Set showBrand={false} when you want only right-aligned controls
// - Set defaultBrandName when you need fallback brand text (no project name is hardcoded)
// - Minimal header playbook: ghost hamburger + logo + company name + tagline on the left, with theme (moon) and notification (bell) icon actions on the right.
// Action behavior:
// - Use onHamburgerAction to run any app logic (open/close sidebar, dialog, drawer, etc.)
// - onAction emits source='hamburger-action' for hamburger clicks, and item/submenu sources for navigation
// Variant guide:
// - light: neutral enterprise header
// - dark: high-contrast dark header
// - brand-light: softer branded enterprise header
// - brand-dark: stronger branded dark header
// - default and outline: legacy compatibility variants
// - soft: removed from Navbar
```

### Sidebar

```ts
import { Sidebar } from '@keytuno/ui-react';
import type {
  SidebarActionContext,
  SidebarActionSource,
  SidebarItem,
  SidebarItemActionEvent,
  SidebarSection,
  SidebarSize,
  SidebarVariant,
} from '@keytuno/ui-react';

interface SidebarItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  href?: string;
  disabled?: boolean;
  active?: boolean;
  expanded?: boolean;
  defaultExpanded?: boolean;
  items?: SidebarItem[];
  ariaLabel?: string;
  onAction?: (event: SidebarItemActionEvent) => void;
}

interface SidebarSection {
  id?: string;
  title?: ReactNode;
  items: SidebarItem[];
}

type SidebarActionSource =
  | 'item-select'
  | 'submenu-toggle'
  | 'collapse-toggle'
  | 'escape-close';

interface SidebarActionContext {
  source: SidebarActionSource;
  itemId?: string;
  itemLabel?: string;
  collapsed: boolean;
  nextCollapsed?: boolean;
  open: boolean;
  nextOpen?: boolean;
  size: SidebarSize;
  variant: SidebarVariant;
  event?: unknown;
}

<Sidebar
  // data
  sections?={SidebarSection[]}

  // look
  size?={'xs'|'sm'|'md'|'lg'}
  variant?={'default'|'dark'|'light'|'brand-dark'|'brand-light'}
  brandLogo?={ReactNode}
  brandName?={ReactNode}
  brandTagline?={ReactNode}
  footer?={ReactNode}

  // open and collapse state
  open?={boolean}
  defaultOpen?={boolean}
  onOpenChange?={(open: boolean) => void}
  collapsed?={boolean}
  defaultCollapsed?={boolean}
  onCollapsedChange?={(collapsed: boolean) => void}

  // behavior
  closeOnEscape?={boolean}
  showItemIcons?={boolean}

  // selection
  activeItemId?={string}
  defaultActiveItemId?={string}
  onActiveItemChange?={(itemId: string) => void}
  onItemSelect?={(item: SidebarItem) => void}

  // accessibility
  panelAriaLabel?={string}
  navigationAriaLabel?={string}
  emptyText?={ReactNode}

  // analytics
  onAction?={(ctx: SidebarActionContext) => void}

  // plus native div props (className, style, onKeyDown, data-*, aria-*)
/>

// Notes:
// - Defaults:
//   size='md', defaultCollapsed=false, defaultOpen=true, closeOnEscape=true,
//   showItemIcons=true, panelAriaLabel='Sidebar', navigationAriaLabel='Sidebar navigation',
//   emptyText='No navigation items.'
// - Sidebar panel is full height (100vh) and square-edged (no rounded corners).
// - The middle navigation area uses the inbuilt themed Scrollbar.
// - Section and header dividers use matching Separator variant tones (default/light/dark/brand-light/brand-dark).
// - Collapse toggle is fixed at the bottom and is rendered only when showItemIcons=true.
// - Sidebar has no internal mobile toggle/backdrop button; control open state from parent
//   (for example via Navbar hamburger in app layout).
// - onOpenChange is emitted when Sidebar requests a close (for example Escape + closeOnEscape).
// - For mobile drawers, pass showItemIcons=false and control open from the parent layout.
// - For backdrop overlays on both desktop and mobile, keep Sidebar fixed-positioned,
//   drive open state from parent, and close via an external backdrop click handler.
// - Use showItemIcons=false for text-only overlay navigation (no icon mode / no collapse toggle).
// - Storybook reference: Sidebar Backdrop Overlay Playbook.
// - If open=false, Sidebar returns null (not rendered).
```

### Card

```ts
import { Card, CardGroup, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@keytuno/ui-react';

<Card
  size?={'xs'|'sm'|'md'|'lg'}
  spacing?={'xs'|'sm'|'md'|'lg'}
  collapse?={boolean}               // enable collapse/expand
  defaultCollapsed?={boolean}
  onCollapseChange?={(collapsed: boolean) => void}
>
  <CardHeader collapseTrigger?={boolean}>
    <CardTitle collapseTrigger?={boolean}>Title</CardTitle>
    <CardDescription collapseTrigger?={boolean}>Subtitle</CardDescription>
    <CardAction>…buttons…</CardAction>
  </CardHeader>
  <CardContent divider?={boolean}>…</CardContent>
  <CardFooter divider?={boolean}>…</CardFooter>
</Card>

<CardGroup joined?={boolean} gap?={CSSProperties['gap']}>
  <Card>…</Card>
  <Card>…</Card>
  <Card>…</Card>
</CardGroup>

// Notes:
// - CardHeader collapseTrigger is optional and only applies when Card has collapse={true}.
// - CardTitle/CardDescription collapseTrigger is optional and only applies when Card has collapse={true}.
// - CardContent/CardFooter divider is optional and adds horizontal separators.
// - CardGroup joined mode removes spacing between stacked cards and merges borders.
// - When collapseTrigger is enabled, header/title/description can collapse and reopen card content via click or keyboard (Enter/Space).
```

### Field

```ts
import { Field, FieldGroup, FieldLabel, FieldContent, FieldTitle, FieldDescription, FieldError, FieldSeparator } from '@keytuno/ui-react';

// Field wraps a single label + control pair
<Field
  orientation?={'vertical'|'horizontal'|'responsive'}
  disabled?={boolean}
  invalid?={boolean}
  required?={boolean}
>
  <FieldLabel htmlFor="email" required>Email</FieldLabel>
  <FieldContent>
    <Input id="email" />
  </FieldContent>
  <FieldError>This field is required</FieldError>
  <FieldDescription>We'll never share your email.</FieldDescription>
</Field>

// FieldGroup wraps multiple Field components
<FieldGroup orientation?={'vertical'|'horizontal'|'responsive'}>
  <Field>…</Field>
  <FieldSeparator />
  <Field>…</Field>
</FieldGroup>
```

### InputGroup

```ts
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea, InputGroupButton } from '@keytuno/ui-react';

// Combines addons + inputs + buttons into a visual unit
<InputGroup
  variant?={'primary'|'outline'|'ghost'|'secondary'|'destructive'|'link'}
  size?={'xs'|'sm'|'md'|'lg'}
  align?={'inline-start'|'inline-end'|'block-start'|'block-end'}
  disabled?={boolean}
>
  <InputGroupAddon>$</InputGroupAddon>
  <InputGroupInput placeholder="Amount" />
  <InputGroupButton variant="primary">Go</InputGroupButton>
</InputGroup>
```

### Dialog

```ts
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@keytuno/ui-react';

<Dialog
  open?={boolean}
  defaultOpen?={boolean}
  onOpenChange?={(open: boolean) => void}
  trigger?={ReactNode}              // element that opens the dialog
  variant?={'primary'|'outline'|'ghost'|'secondary'|'destructive'|'link'}
  size?={'xs'|'sm'|'md'|'lg'}
  closeOnOverlayClick?={boolean}
  closeOnEscape?={boolean}
>
  <DialogContent showCloseButton?={boolean} scrollable?={boolean} maxContentHeight?={string} closeButtonLabel?={string}>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    …body…
    <DialogFooter sticky?={boolean}>
      <Button>Cancel</Button>
      <Button variant="primary">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Dialog scroll behavior notes:

- When `scrollable` is enabled, `DialogContent` keeps header and footer visible and applies the inbuilt `Scrollbar` only to the middle content section.
- `maxContentHeight` defaults to `min(86vh, 40rem)` and is also clamped by viewport height (`calc(100vh - 2.5rem)`) so the full dialog remains visible.
- Header-to-body, body-to-footer, and scrollbar-to-content spacing are intentionally separated for clearer visual grouping.

Dialog playbook pattern (middle-only scrollbar + sticky footer):

```tsx
<Dialog trigger="Open review" variant="outline" size="md">
  <DialogContent scrollable maxContentHeight="min(85vh, 32rem)">
    <DialogHeader>
      <DialogTitle>Quarterly Rebalance Approval</DialogTitle>
      <DialogDescription>
        Header and footer stay visible while only the middle section scrolls.
      </DialogDescription>
    </DialogHeader>

    {/* long content */}

    <DialogFooter sticky>
      <Button variant="outline">Review Later</Button>
      <Button variant="primary">Approve Rebalance</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Scrollable playground pattern (for tuning in Storybook):

```tsx
const [maxContentHeight, setMaxContentHeight] = useState("min(85vh, 32rem)");
const [stickyFooter, setStickyFooter] = useState(true);

<DialogContent scrollable maxContentHeight={maxContentHeight}>
  {/* long content */}
  <DialogFooter sticky={stickyFooter}>...</DialogFooter>
</DialogContent>
```

### Sheet

```ts
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@keytuno/ui-react';

<Sheet
  open?={boolean}
  defaultOpen?={boolean}
  onOpenChange?={(open: boolean) => void}
  trigger?={ReactNode}
  side?={'top'|'bottom'|'left'|'right'}  // default 'right'
  closeButtonLabel?={string}
  closeOnOverlayClick?={boolean}
  closeOnEscape?={boolean}
>
  <SheetContent showCloseButton?={boolean} closeButtonLabel?={string} scrollable?={boolean} maxContentHeight?={string}>
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
      <SheetDescription>Description</SheetDescription>
    </SheetHeader>
    …body…
    <SheetFooter sticky?={boolean}>…</SheetFooter>
  </SheetContent>
</Sheet>
```

Sheet scroll behavior notes:

- When `scrollable` is enabled, `SheetContent` keeps header and footer visible and applies the inbuilt `Scrollbar` only to the middle content section.
- `maxContentHeight` defaults to `min(86vh, 40rem)`; for top and bottom sheets it is also clamped by viewport height (`calc(100vh - 2.5rem)`) so the sheet remains fully visible.
- Header-to-body, body-to-footer, and scrollbar-to-content spacing are intentionally separated for clearer visual grouping.

Sheet playbook pattern (middle-only scrollbar + sticky footer):

```tsx
<Sheet trigger="Open review" side="top" showCloseButton>
  <SheetContent scrollable maxContentHeight="min(85vh, 32rem)">
    <SheetHeader>
      <SheetTitle>Portfolio Rebalance Review</SheetTitle>
      <SheetDescription>
        Header and footer remain visible while the middle section scrolls.
      </SheetDescription>
    </SheetHeader>

    {/* long content */}

    <SheetFooter sticky>
      <Button variant="outline">Review Later</Button>
      <Button variant="primary">Confirm Rebalance</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

Scrollable playground pattern (for tuning in Storybook):

```tsx
const [maxContentHeight, setMaxContentHeight] = useState("min(85vh, 32rem)");
const [stickyFooter, setStickyFooter] = useState(true);

<SheetContent scrollable maxContentHeight={maxContentHeight}>
  {/* long content */}
  <SheetFooter sticky={stickyFooter}>...</SheetFooter>
</SheetContent>
```

### Alert (toast / notification)

```ts
import { Alert, AlertTitle, AlertDescription, AlertAction } from '@keytuno/ui-react';

// Stacked toast-style alerts — position via `side`, auto-dismiss via `duration`
<Alert
  open?={boolean}
  defaultOpen?={boolean}
  onOpenChange?={(open: boolean) => void}
  variant?={'primary'|'secondary'|'destructive'|'outline'|'link'|'compact'}
  side?={'top-left'|'top-center'|'top-right'|'bottom-left'|'bottom-center'|'bottom-right'}
  size?={'xs'|'sm'|'md'|'lg'}
  duration?={number}               // ms until auto-dismiss (0 = no auto-dismiss)
  actionRequired?={boolean}        // prevent dismiss until user acts
  closeOnEscape?={boolean}
  closeButtonLabel?={string}
  customColors?={{ backgroundColor, borderColor, titleColor, descriptionColor, actionColor }}
  viewportInset?={number | { top, right, bottom, left }}
>
  <AlertTitle>Saved!</AlertTitle>
  <AlertDescription>Your changes have been saved.</AlertDescription>
  <AlertAction closeOnAction>Undo</AlertAction>
</Alert>
```

Alert layout behavior:

- The close button is aligned in the top content row only.
- Direct `AlertAction` children are rendered in a dedicated row below the main content.
- The component does not reserve a full-height side column for close/action controls.

### Toast

```ts
import { Toast } from '@keytuno/ui-react';

<Toast
  open?={boolean}
  defaultOpen?={boolean}
  onOpenChange?={(open: boolean) => void}
  onAction?={(ctx: ToastActionContext) => void}
  variant?={'default'|'success'|'warning'|'danger'}
  size?={'xs'|'sm'|'md'}
  duration?={number}
  bottomOffset?={number}
  bordered?={boolean}
>
  Saved successfully.
</Toast>
```

### DropdownMenu

```ts
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuItem, DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup, DropdownMenuRadioItem,
} from '@keytuno/ui-react';

<DropdownMenu
  open?={boolean}
  defaultOpen?={boolean}
  onOpenChange?={(open: boolean) => void}
  size?={'xs'|'sm'|'md'|'lg'}
  variant?={'default'|'outline'|'soft'}
  side?={'auto'|'bottom'|'top'|'left'|'right'}
  closeOnSelect?={boolean}
>
  <DropdownMenuTrigger openLabel?={ReactNode} closeLabel?={ReactNode}>
    <Button>Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align?={'start'|'center'|'end'} sideOffset?={number}>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem icon?={ReactNode} shortcut?={ReactNode} destructive?={boolean} onSelect?={() => void}>
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem submenu?={ReactNode}>
        More options…
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuCheckboxItem checked?={boolean} onCheckedChange?={(v) => void}>
      Show labels
    </DropdownMenuCheckboxItem>
    <DropdownMenuRadioGroup value?={string} onValueChange?={(v) => void}>
      <DropdownMenuRadioItem value="a">Option A</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="b">Option B</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  </DropdownMenuContent>
</DropdownMenu>
```

### AdvanceFilter

```ts
import { AdvanceFilter } from '@keytuno/ui-react';
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';

interface AdvanceFilterColumn {
  id: string;
  label: string;
  canFilter?: boolean;
  canSort?: boolean;
}

<AdvanceFilter
  // open state
  open?={boolean}
  defaultOpen?={boolean}
  onOpenChange?={(open: boolean) => void}

  // filter/sort model
  columns={AdvanceFilterColumn[]}
  columnFilters={ColumnFiltersState}
  sorting={SortingState}
  globalSearch={string}

  // behavior
  canUseGlobalFilter?={boolean}
  enableSorting?={boolean}
  controlSize?={'xs'|'sm'|'md'|'lg'}
  selectVariant?={'inline'|'overlay'} // default 'inline' for all internal Select controls

  // trigger (icon-only filter button)
  showTrigger?={boolean}            // default true
  triggerDisabled?={boolean}
  triggerOpenLabel?={string}
  triggerCloseLabel?={string}
  triggerAriaLabel?={string}
  activeFilterCount?={number}       // optional external badge/count state
  triggerButtonProps?={AdvanceFilterButtonProps}

  // sheet
  side?={'left'|'right'|'top'|'bottom'}
  title?={ReactNode}                // default 'Advance Filter'

  // section labels
  filtersSectionLabel?={ReactNode}
  sortSectionLabel?={ReactNode}

  // button labels
  addFilterLabel?={string}
  addSortLabel?={string}
  clearFiltersLabel?={string}
  resetSortingLabel?={string}
  applyFiltersLabel?={string}
  addFilterButtonProps?={AdvanceFilterButtonProps}
  addSortButtonProps?={AdvanceFilterButtonProps}
  resetFilterButtonProps?={AdvanceFilterButtonProps}
  resetSortButtonProps?={AdvanceFilterButtonProps}
  clearFiltersButtonProps?={AdvanceFilterButtonProps}
  resetSortingButtonProps?={AdvanceFilterButtonProps}
  applyFiltersButtonProps?={AdvanceFilterButtonProps}

  // global search and rule text
  globalFilterLabel?={ReactNode}
  globalFilterPlaceholder?={string}
  ruleValuePlaceholder?={string}

  // callbacks
  onApply?={(result, reason) => void}
  onAction?={(context) => void}
/>

// reason: 'apply' | 'clear-filters' | 'reset-sorting'
// operator options:
//   contains | starts with | ends with | equals | not equals
//   greater than | greater than or equal | less than | less than or equal
// AdvanceFilterButtonProps = Omit<ButtonProps, 'children' | 'onAction' | 'size' | 'type'>
```

AdvanceFilter behavior notes:

- Trigger is an icon-only filter button that opens a responsive Sheet (mobile, tablet, desktop).
- Sheet layout includes global search, multiple filter rules, multiple sort rules, per-rule clear icon actions, and sticky footer actions.
- Footer actions: `Clear filters`, `Reset filters` (sorting reset label configurable), and `Apply filters`.
- Internally uses inbuilt primitives (`Button`, `Sheet`, `Field`, `Input`, `Select`) and token-based styling.
- Table and AdaptiveCard surfaces use the same filter token model, so behavior stays consistent across view modes.

### DataToolbar

```ts
import { DataToolbar } from '@keytuno/ui-react';
import type {
  AdvanceFilterColumn,
  DataToolbarActionContext,
  DataToolbarSwitchMode,
} from '@keytuno/ui-react';
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';

<DataToolbar
  size?={'xs'|'sm'|'md'|'lg'}

  // Search
  showSearch?={boolean}
  searchValue?={string}
  defaultSearchValue?={string}
  searchPlaceholder?={string}
  searchAriaLabel?={string}
  searchInputMinWidth?={CSSProperties['minWidth']} // default '20px'
  searchInputMaxWidth?={CSSProperties['maxWidth']} // default '100%'
  onSearchChange?={(value: string) => void}

  // AdvanceFilter (Sheet)
  showAdvanceFilter?={boolean}
  advanceFilterColumns?={AdvanceFilterColumn[]}
  advanceFilterColumnFilters?={ColumnFiltersState}
  advanceFilterSorting?={SortingState}
  advanceFilterGlobalSearch?={string}
  advanceFilterCanUseGlobalFilter?={boolean}
  advanceFilterEnableSorting?={boolean}
  advanceFilterOpen?={boolean}
  advanceFilterDefaultOpen?={boolean}
  onAdvanceFilterOpenChange?={(open: boolean) => void}
  onAdvanceFilterApply?={(result, reason) => void}
  advanceFilterOpenLabel?={string}   // one-word recommended: 'Filter'
  advanceFilterCloseLabel?={string}  // one-word recommended: 'Close'
  advanceFilterTitle?={ReactNode}
  advanceFilterTriggerButtonProps?={AdvanceFilterButtonProps}

  // Icon actions
  showSwitch?={boolean}
  switchMode?={DataToolbarSwitchMode} // 'table' | 'adaptive-card' | 'custom'
  switchLabel?={string}               // one-word recommended: 'Table' or 'Cards'
  switchButtonProps?={DataToolbarButtonProps}
  onSwitch?={(mode: DataToolbarSwitchMode) => void}

  showRefresh?={boolean}
  refreshLabel?={string}              // one-word recommended: 'Refresh'
  refreshingLabel?={string}
  refreshButtonProps?={DataToolbarButtonProps}
  onRefresh?={() => void | Promise<void>}

  showFullscreen?={boolean}
  fullscreen?={boolean}
  fullscreenLabel?={string}           // one-word recommended: 'Fullscreen'
  exitFullscreenLabel?={string}       // one-word recommended: 'Exit'
  fullscreenButtonProps?={DataToolbarButtonProps}
  onFullscreenChange?={(next: boolean) => void}

  // Unified event feed
  onAction?={(ctx: DataToolbarActionContext) => void}
/>

// DataToolbar action sources:
//   search | filter-open-change | filter-apply | switch | refresh | fullscreen
// DataToolbarButtonProps = Omit<ButtonProps, 'children' | 'onAction' | 'size' | 'type'>
```

DataToolbar behavior notes:

- One responsive row only: global search on the left, then filter/switch/refresh/fullscreen icon actions.
- Search is compact-first for small widths (`searchInputMinWidth='20px'`) so icon actions remain visible in one row.
- Reuses inbuilt primitives (`AdvanceFilter`, `Button`, `Input`) and inherits theme tokens.

### Table

```ts
import { Table } from '@keytuno/ui-react';
import type { TableColumnDef, RowAction } from '@keytuno/ui-react';
// Table uses @tanstack/react-table column definitions
// import type { ColumnDef } from '@tanstack/react-table' — TableColumnDef<TData> is an alias

interface User { id: number; name: string; email: string; }

const columns: TableColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
];

const rowActions: RowAction<User>[] = [
  { id: 'edit', label: 'Edit', onClick: (row) => handleEdit(row) },
  { id: 'delete', label: 'Delete', variant: 'destructive', onClick: (row) => handleDelete(row) },
];

<Table<User>
  data={users}
  columns={columns}
  rowKey="id"                       // or (row, i) => row.id

  // Appearance
  variant?={'basic'|'outline'|'ghost'|'filled'|'minimal'|'striped'}
  size?={'xs'|'sm'|'md'|'lg'}
  striped?={boolean}
  hoverable?={boolean}
  bordered?={boolean}
  rounded?={boolean}
  compact?={boolean}
  stickyHeader?={boolean}

  // Features (all off by default unless enabled)
  sortable?={boolean}
  filterable?={boolean}             // column filter function support
  columnFilters?={string[]}         // limit filterable columns by id
  selectable?={boolean}
  multiSelect?={boolean}
  selectAllRowsAriaLabel?={string}
  selectRowAriaLabelFormatter?={(rowNumber: number) => string}
  selectedCountFormatter?={(count: number) => ReactNode}
  columnVisibility?={boolean}
  defaultHiddenColumns?={string[]}

  // Row click
  rowClickable?={boolean | ((row: User, rowIndex: number) => boolean)}

  // Row actions
  rowActions={rowActions}

  // Loading
  loading?={boolean}
  skeleton?={boolean}               // show skeleton rows while loading
  loadingRows?={number}
  loadingText?={ReactNode}

  // Events
  onSelectionChange?={(rows: User[]) => void}
  onAction?={(ctx: TableActionContext<User>) => void}
  emptyText?={ReactNode}
/>

// Composition notes:
// - Table is a standalone data surface renderer.
// - Table viewport uses the inbuilt Scrollbar component (axis='both').
// - Sort headers and row actions use inbuilt Button controls and feather icons.
// - `rowClickable` emits `onAction({ source: 'row-click', row, rowIndex, event })`.
// - Row-click handling ignores nested interactive descendants (`a`, `button`, `input`, select/menu controls, and custom `[data-ktn-table-row-interactive='true']`).
// - Actionable row hover tone is transient only (no persisted visited styling).
// - Storybook references:
//   - Basic
//   - Selectable Sticky Header
//   - Actionable Row Clickable Playbook
//   - Table Playground
```

### AdaptiveCard

```ts
import { AdaptiveCard } from '@keytuno/ui-react';
import type {
  AdaptiveCardAction,
  AdaptiveCardActionAlignment,
  AdaptiveCardActionLayout,
  AdaptiveCardActionContext,
  AdaptiveCardActionMode,
  AdaptiveCardActionPlacement,
  AdaptiveCardActionSource,
  AdaptiveCardColumnBreakpoints,
  AdaptiveCardColumns,
  AdaptiveCardFieldSchema,
  AdaptiveCardFieldType,
  AdaptiveCardInnerColumns,
} from '@keytuno/ui-react';

<AdaptiveCard<User>
  data={users}
  rowKey="id"

  // Rendering model
  schema?={AdaptiveCardFieldSchema<User>[]}
  variant?={'default'|'compact'|'ghost'}
  size?={'xs'|'sm'|'md'|'lg'}
  locale?={string}
  currency?={string}
  showFieldLabels?={boolean}

  // Inside-card layout (field grid)
  insideColumns?={1|2|3}            // default 2

  // Outside-card layout (cards grid)
  columns?={number | AdaptiveCardColumns}
  columnBreakpoints?={AdaptiveCardColumnBreakpoints}
  cardGap?={number | string}
  listGap?={number | string}

  // Actions
  actions?={AdaptiveCardAction<User>[] | ((row: User, rowIndex: number) => AdaptiveCardAction<User>[])}
  cardClickable?={boolean | ((row: User, rowIndex: number) => boolean)}
  actionMode?={'auto'|'inline'|'menu'}
  actionInlineMaxVisible?={number}
  actionAlignment?={'left'|'right'}
  actionPlacement?={'top'|'bottom'}
  actionLayout?={'own-row'|'same-row'}
  actionMenuLabel?={ReactNode}
  onAction?={(ctx: AdaptiveCardActionContext<User>) => void}

  // Virtualization
  virtualized?={boolean}            // optimized for one-card-per-row mode
  virtualizedMaxHeight?={number | string}
  virtualizedEstimateSize?={number} // initial row-height estimate only (not spacing)
  virtualizedOverscan?={number}

  // Viewport/state
  viewportMaxHeight?={number | string}
  emptyText?={ReactNode}
/>

type AdaptiveCardInnerColumns = 1 | 2 | 3;

interface AdaptiveCardColumns {
  mobile?: number;
  tablet?: number;
  web?: number;
}

interface AdaptiveCardColumnBreakpoints {
  tablet?: number;   // default 768
  web?: number;      // default 1024
}

type AdaptiveCardFieldType =
  | 'auto'
  | 'text'
  | 'link'
  | 'number'
  | 'currency'
  | 'percent'
  | 'date'
  | 'phone'
  | 'status'
  | 'badge'
  | 'progress'
  | 'media';

type AdaptiveCardActionSource = 'item-action' | 'item-click';

type AdaptiveCardActionLayout = 'own-row' | 'same-row';

// Behavior notes:
// - This is the native enterprise card surface for app-owned data (no external Adaptive Cards SDK required).
// - `insideColumns` controls field layout inside each card (1, 2, or 3 columns).
// - `columns` + `columnBreakpoints` control the outer responsive grid of cards.
// - `listGap` controls spacing between cards in both multi-column grids and one-column virtualized mode.
// - `cardGap` controls internal spacing between field rows inside each card.
// - `cardClickable` enables row-level card click actions and emits `source='item-click'`.
// - Row-level card clicks ignore nested interactive targets (`a`, `button`, menu triggers, and other interactive controls),
//   so field links and action buttons continue working independently.
// - Actionable cards apply enterprise hover/focus treatment (muted surface + stronger border/shadow) when `cardClickable` is enabled.
// - `actionLayout='same-row'` attaches actions to one row only:
//   - `actionPlacement='top'` -> actions share only the first rendered field row.
//   - `actionPlacement='bottom'` -> actions share only the last rendered field row.
//   - Other field rows keep full-width card layout (no full-height side action column).
// - One-card-per-row enterprise mode: set `columns={1}` and optionally enable `virtualized`.
// - Uses inbuilt primitives (Card, Button, Badge, Progress, DropdownMenu, Scrollbar).
// - Storybook references:
//   - Basic
//   - Virtualized One Column
//   - Actionable Clickable Playbook
//   - Action Position Matrix
//   - AdaptiveCard Playground
//   - DataToolbar -> View Mode Switch (table/adaptive-card)
```

### List

```ts
import { List } from '@keytuno/ui-react';

interface ListLine {
  values: [ReactNode] | [ReactNode, ReactNode] | [ReactNode, ReactNode, ReactNode];
  size?: 'xs'|'sm'|'md'|'lg';
  tone?: 'default'|'muted'|'positive'|'negative';
}

interface ListItem {
  id?: string | number;
  values?: [ReactNode] | [ReactNode, ReactNode] | [ReactNode, ReactNode, ReactNode];
  lines?: ListLine[];
  disabled?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

<List
  items={ListItem[]}
  columns?={'auto'|'one'|'two'|'three'}
  size?={'xs'|'sm'|'md'|'lg'}
  secondaryLineSize?={'xs'|'sm'|'md'|'lg'}
  secondaryLineTone?={'default'|'muted'|'positive'|'negative'}
  disabled?={boolean}
  rowDivider?={boolean}
  collapsible?={boolean}
  defaultCollapsed?={boolean}
  showCollapseIndicator?={boolean}
  showHoverActions?={boolean}
  hoverActionIds?={('view'|'edit'|'delete')[]}
  virtualized?={boolean}
  virtualizedMaxHeight?={number | string}
  virtualizedEstimateSize?={number}
  virtualizedOverscan?={number}
  emptyText?={ReactNode}
  onAction?={(ctx: ListActionContext) => void}
/>
```

### FilePreview

```ts
import { FilePreview } from '@keytuno/ui-react';

// Renders thumbnail + click-to-expand viewer for image/pdf/video/audio/file
<FilePreview
  src={string}                      // URL or data URL (required)
  name?={string}
  description?={ReactNode}
  size?={'xs'|'sm'|'md'|'lg'}
  type?={'auto'|'image'|'pdf'|'video'|'audio'|'file'}  // 'auto' = infer from mime/ext
  mimeType?={string}
  thumbnailSrc?={string}
  asLink?={boolean}                 // show as external link instead of in-page viewer
  linkLabel?={ReactNode}
  previewAriaLabelFormatter?={(fileName: string) => string}
  closeButtonLabel?={string}
  openInNewTabLabel?={ReactNode}
  typeDescriptionFormatter?={(typeLabel: string) => ReactNode}
  imageInteractionHint?={ReactNode}
  defaultInteractionHint?={ReactNode}
  disabled?={boolean}
  closeOnOverlayClick?={boolean}
  closeOnEscape?={boolean}
/>
```

### FileList

```ts
import { FileList } from '@keytuno/ui-react';

interface FileListItem {
  id: string;
  name: string;
  src: string;
  sizeBytes?: number;
  sizeLabel?: string;
  width?: number;
  height?: number;
  mimeType?: string;
  type?: 'auto'|'image'|'pdf'|'video'|'audio'|'file';
  thumbnailSrc?: string;
  description?: ReactNode;
  disabled?: boolean;
}

<FileList
  files={FileListItem[]}
  variant?={'compact'|'detailed'|'advanced'}
  size?={'xs'|'sm'|'md'|'lg'}
  disabled?={boolean}
  emptyText?={ReactNode}
  showRemoveAction?={boolean}
  showSize?={boolean}
  showDimensions?={boolean}
  showMimeType?={boolean}
  showBytes?={boolean}
  onRemove?={(file: FileListItem, index: number) => void}
/>
```

### FileUpload

```ts
import { FileUpload } from '@keytuno/ui-react';

type FileUploadSide = 'left' | 'center' | 'right';

interface FileUploadFile {
  id: string;
  file?: File;                      // present for newly selected local files
  name: string;
  src: string;                      // object URL or remote URL
  sizeBytes?: number;
  mimeType?: string;
  extension: string;
  previewType: 'auto'|'image'|'pdf'|'video'|'audio'|'file';
  width?: number;
  height?: number;
}

interface FileUploadInitialFile {
  id?: string;
  name?: string;
  src: string;
  sizeBytes?: number;
  mimeType?: string;
  extension?: string;
  previewType?: 'auto'|'image'|'pdf'|'video'|'audio'|'file';
  width?: number;
  height?: number;
}

interface FileUploadProfileConfig {
  hint?: ReactNode;                 // optional content below round upload
  imageAlt?: string;
  accept?: string;                  // defaults to image/jpeg,image/png,image/webp
  uploadActionLabel?: string;
  removeActionLabel?: string;
  placeholderIcon?: ReactNode;
  uploadHoverIcon?: ReactNode;
  removeHoverIcon?: ReactNode;
}

<FileUpload
  variant?={'compact'|'dropzone'|'profile'}
  size?={'xs'|'sm'|'md'|'lg'}
  side?={'left'|'center'|'right'}   // default: 'center' (primarily for profile variant)
  required?={boolean}
  invalid?={boolean}
  errorMessage?={ReactNode}
  multiple?={boolean}
  accept?={string}                  // MIME type or extension filter, e.g. 'image/*,.pdf'
  disabled?={boolean}
  placeholder?={ReactNode}
  dropzoneHint?={ReactNode}
  dropzoneTitle?={ReactNode}
  browseLabel?={ReactNode}
  dialogTitle?={ReactNode}
  dialogDescription?={ReactNode}
  fileListEmptyText?={ReactNode}
  initialFiles?={FileUploadInitialFile[]} // preloaded files for edit screens
  profileConfig?={FileUploadProfileConfig}
  onFilesChange?={(files: FileUploadFile[]) => void} // fires on add/remove updates; may include preloaded items without file
/>
```

```tsx
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FileUpload,
} from '@keytuno/ui-react';

// Compact with Field wrapper
<Field required>
  <FieldLabel required>Attachments</FieldLabel>
  <FieldContent>
    <FileUpload variant="compact" required />
    <FieldDescription>Upload one or more supporting files.</FieldDescription>
  </FieldContent>
</Field>

// Dropzone with Field wrapper
<Field>
  <FieldLabel>Documents</FieldLabel>
  <FieldContent>
    <FileUpload variant="dropzone" multiple />
  </FieldContent>
</Field>

// Profile variant with optional hint, side alignment, required + error state
<Field required invalid>
  <FieldLabel required>Profile Photo</FieldLabel>
  <FieldContent>
    <FileUpload
      variant="profile"
      side="center"
      required
      invalid
      errorMessage="Profile photo is required."
      profileConfig={{
        hint: 'JPG, PNG or WEBP - Max 5 MB',
      }}
    />
  </FieldContent>
</Field>

// Edit mode profile: existing photo is shown in the same round avatar slot
<FileUpload
  variant="profile"
  side="center"
  initialFiles={[
    {
      id: 'profile-photo-existing',
      name: 'profile-photo.png',
      src: user.profilePhotoUrl,
      mimeType: 'image/png',
      previewType: 'image',
    },
  ]}
  profileConfig={{
    hint: 'Hover/focus the round image to remove it, then click to upload a new one.',
  }}
/>

// Edit mode attachments: already uploaded files appear inside the same field
<FileUpload
  variant="dropzone"
  multiple
  initialFiles={[
    {
      id: 'invoice-v4',
      name: 'invoice-v4.pdf',
      src: invoiceUrl,
      mimeType: 'application/pdf',
      previewType: 'pdf',
    },
    {
      id: 'site-photo-1',
      name: 'site-photo.jpg',
      src: sitePhotoUrl,
      mimeType: 'image/jpeg',
      previewType: 'image',
    },
  ]}
/>
```

---

## Common patterns

### Form field with validation

```tsx
<Field orientation="vertical" invalid={!!errors.email} required>
  <FieldLabel htmlFor="email" required>Email</FieldLabel>
  <FieldContent>
    <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} invalid={!!errors.email} />
  </FieldContent>
  {errors.email && <FieldError>{errors.email}</FieldError>}
</Field>
```

### Controlled select

```tsx
const [value, setValue] = useState<string | null>(null);
<Select options={options} value={value} onValueChange={setValue} placeholder="Choose one" />
```

### Toast notification

```tsx
const [open, setOpen] = useState(false);
<Alert open={open} onOpenChange={setOpen} variant="primary" side="bottom-right" duration={4000}>
  <AlertTitle>Changes saved</AlertTitle>
</Alert>
<Button onClick={() => setOpen(true)}>Save</Button>
```

### Data table with sorting and filtering

```tsx
<Table
  data={rows}
  columns={columns}
  loading={isLoading}
  skeleton
  sortable
  filterable
/>
```

### Light/dark theme toggle

```tsx
import { lightTheme, darkTheme, themeToCssVariables } from '@keytuno/ui-react';

function ThemeProvider({ mode, children }) {
  const vars = themeToCssVariables(mode === 'dark' ? darkTheme : lightTheme);
  return <div style={vars as React.CSSProperties}>{children}</div>;
}
```

