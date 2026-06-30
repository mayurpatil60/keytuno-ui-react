# @keytuno/ui-react — Copilot Reference

> Drop this file as `.github/copilot-instructions.md` in any consuming project so Copilot reads it automatically for every chat in that workspace.

---

## Installation

```bash
# private GitHub tag install (current recommended release path)
pnpm add git+https://github.com/mayurpatil60/keytuno-ui-react.git#v0.1.0

# optional registry install (only if your environment publishes @keytuno/ui-react)
pnpm add @keytuno/ui-react

# peer deps: react ^18, react-dom ^18
# optional heavy peers (only needed if you use table export):
# pnpm add jspdf jspdf-autotable xlsx
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

Available subpath roots: `@keytuno/ui-react/components/*`, `@keytuno/ui-react/themes/*`, `@keytuno/ui-react/tokens/*`, `@keytuno/ui-react/adapters/*`, `@keytuno/ui-react/contracts/*`, `@keytuno/ui-react/addons/table-exporters`.

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
- `Seperator` (typo alias) and `varient` props (typo aliases) exist for backward compatibility — prefer the correctly spelled versions (`Separator`, `variant`) in all new code.
- Most component roots accept native HTML attributes (including `aria-*` and `data-*`), which enables custom accessibility wiring and test selectors.

---

## Release verification snapshot (2026-07-01)

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
  decorative?={boolean}
/>
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
  placeholder?={string}
  searchPlaceholder?={string}
  emptyText?={string}
  size?={'xs'|'sm'|'md'|'lg'}
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

<DatePicker
  mode?={'date'|'range'|'time'}     // default 'date'
  value?={DatePickerValue}
  defaultValue?={DatePickerValue}
  onValueChange?={(value) => void}
  size?={'xs'|'sm'|'md'|'lg'}
  variant?={'primary'|'outline'|'ghost'|'secondary'|'destructive'|'link'}
  disabled?={boolean}
  invalid?={boolean}
  placeholder?={string}
  rangeSeparator?={string}           // separator shown between start and end dates
/>
```

### TimezonePicker

```ts
import { TimezonePicker } from '@keytuno/ui-react';

// Uses Select (combobox) behavior from ui-react Select component

<TimezonePicker
  size?={'xs'|'sm'|'md'|'lg'}
  variant?={'compact'|'detailed'}
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
  varient?={'compact'|'detailed'}    // backwards-compatible alias; prefer variant
  value?={string | null}             // controlled HEX value (for example '#2563eb')
  defaultValue?={string | null}      // uncontrolled initial HEX value
  swatches?={string[]}               // optional curated palette
  showClear?={boolean}
  showSwatches?={boolean}            // show/hide rounded swatch buttons below picker
  disabled?={boolean}
  required?={boolean}
  invalid?={boolean}
  placeholder?={string}              // used in detailed hex input
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
  page?={number}                    // 1-based current page
  defaultPage?={number}
  totalPages={number}
  pageSize?={number}
  pageSizeOptions?={number[]}       // default [10, 25, 50, 100]
  onPageChange?={(page: number) => void}
  onPageSizeChange?={(size: number) => void}
  maxVisiblePages?={number}
  showPageSizeSelector?={boolean}
  showSummary?={boolean}
  showShowingPage?={boolean}
  labels?={PaginationLabels}
/>
```

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
  onAction?: (e: MouseEvent) => void;
}

<Breadcrumb
  items={BreadcrumbItem[]}
  size?={'xs'|'sm'|'md'|'lg'}
  separator?={ReactNode}
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
  items?: NavbarItem[];
  onAction?: (event?: MouseEvent) => void;
}

<Navbar
  brand?={ReactNode}                // custom brand node (overrides structured brand props)
  showBrand?={boolean}              // set false to hide brand block completely
  brandLogo?={ReactNode}            // logo/icon on the left side of brand block
  brandName?={ReactNode}            // company name/title on top row
  brandTagline?={ReactNode}         // optional text below company name
  items?={NavbarItem[]}
  actions?={ReactNode}
  size?={'xs'|'sm'|'md'|'lg'}
  variant?={'default'|'outline'|'soft'}
  sticky?={boolean}
  responsive?={boolean}
  mobileBreakpoint?={number}
  mobileMenuSide?={'left'|'right'}
  mobileTitle?={ReactNode}
  showMobileToggle?={boolean}
  mobileToggleLabel?={string}
  mobileOpen?={boolean}
  defaultMobileOpen?={boolean}
  onMobileOpenChange?={(open: boolean) => void}
  closeMobileOnSelect?={boolean}
  activeItemId?={string}
  defaultActiveItemId?={string}
  onActiveItemChange?={(itemId: string) => void}
  onItemSelect?={(item: NavbarItem, parentItem?: NavbarItem) => void}
  onAction?={(ctx: NavbarActionContext) => void}
/>

// Layout behavior:
// - Brand shows on the left (logo + text stack where tagline appears below name)
// - Menu/actions area is right-aligned on desktop
// - Set showBrand={false} when you want only right-aligned controls
```

### Sidebar

```ts
import { Sidebar } from '@keytuno/ui-react';

interface SidebarItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  href?: string;
  disabled?: boolean;
  active?: boolean;
  items?: SidebarItem[];
}

interface SidebarSection {
  id?: string;
  title?: ReactNode;
  items: SidebarItem[];
}

<Sidebar
  sections?={SidebarSection[]}
  header?={ReactNode}
  footer?={ReactNode}
  size?={'xs'|'sm'|'md'|'lg'}
  variant?={'default'|'outline'|'soft'}
  collapsed?={boolean}
  defaultCollapsed?={boolean}
  onCollapsedChange?={(collapsed: boolean) => void}
  mobileOpen?={boolean}
  defaultMobileOpen?={boolean}
  onMobileOpenChange?={(open: boolean) => void}
  responsive?={boolean}
  collapseBreakpoint?={number}
  iconOnly?={boolean}
  showCollapseToggle?={boolean}
  showMobileToggle?={boolean}
  closeMobileOnSelect?={boolean}
  activeItemId?={string}
  defaultActiveItemId?={string}
  onActiveItemChange?={(itemId: string) => void}
  onItemSelect?={(item: SidebarItem) => void}
  showSectionSeparators?={boolean}
  sectionSeparatorSize?={'xs'|'sm'|'md'|'lg'}
  onAction?={(ctx: SidebarActionContext) => void}
/>
```

### Card

```ts
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@keytuno/ui-react';

<Card
  size?={'xs'|'sm'|'md'|'lg'}
  spacing?={'xs'|'sm'|'md'|'lg'}
  collapse?={boolean}               // enable collapse/expand
  defaultCollapsed?={boolean}
  onCollapseChange?={(collapsed: boolean) => void}
>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Subtitle</CardDescription>
    <CardAction>…buttons…</CardAction>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter>…</CardFooter>
</Card>
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
  <DialogContent showCloseButton?={boolean} scrollable?={boolean} maxContentHeight?={string}>
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

### Sheet

```ts
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@keytuno/ui-react';

<Sheet
  open?={boolean}
  defaultOpen?={boolean}
  onOpenChange?={(open: boolean) => void}
  trigger?={ReactNode}
  side?={'top'|'bottom'|'left'|'right'}  // default 'right'
  closeOnOverlayClick?={boolean}
  closeOnEscape?={boolean}
>
  <SheetContent showCloseButton?={boolean} scrollable?={boolean} maxContentHeight?={string}>
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
      <SheetDescription>Description</SheetDescription>
    </SheetHeader>
    …body…
    <SheetFooter sticky?={boolean}>…</SheetFooter>
  </SheetContent>
</Sheet>
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
  <DropdownMenuTrigger>
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

  // Features (all off by default)
  sortable?={boolean}
  searchable?={boolean}             // global text search input
  filterable?={boolean}             // per-column filter dropdowns
  columnFilters?={string[]}         // limit filterable columns by id
  globalFilter?={boolean}
  selectable?={boolean}
  multiSelect?={boolean}
  columnVisibility?={boolean}
  defaultHiddenColumns?={string[]}
  fullscreen?={boolean}

  // Toolbar controls
  showToolbar?={boolean}
  showColumnToggle?={boolean}
  showRefresh?={boolean}
  onRefresh?={() => void | Promise<void>}
  showExport?={boolean}
  exportable?={boolean}
  exportFormats?={('csv'|'xlsx'|'pdf')[]}
  exportFileName?={string}

  // Row actions
  rowActions={rowActions}

  // Loading
  loading?={boolean}
  skeleton?={boolean}               // show skeleton rows while loading
  loadingRows?={number}

  // Pagination (built-in, enabled by default)
  showPagination?={boolean}
  paginationVariant?={'basic'|'advance'|'compact'}
  paginationDefaultPageSize?={number}
  paginationPageSizeOptions?={number[]}
  paginationShowPageSizeSelector?={boolean}
  paginationShowSummary?={boolean}

  // Server-side mode
  serverSide?={boolean}
  totalRows?={number}
  pageIndex?={number}
  onPageChange?={(page: number) => void}
  onPageSizeChange?={(size: number) => void}
  onSortChange?={(sort) => void}
  onFilterChange?={(filters) => void}

  // Events
  onSelectionChange?={(rows: User[]) => void}
  onAction?={(ctx: TableActionContext<User>) => void}
  emptyText?={ReactNode}
/>
```

#### Table export (xlsx / pdf)

```ts
// Auto-included CSV export needs no extra deps.
// For xlsx / pdf — install optional peers then use built-in handlers:
import { exportTableAsXlsx, exportTableAsPdf } from '@keytuno/ui-react/addons/table-exporters';

<Table
  exportable
  exportFormats={['csv', 'xlsx', 'pdf']}
  exportHandlers={{ xlsx: exportTableAsXlsx, pdf: exportTableAsPdf }}
/>
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
  disabled?={boolean}
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

interface FileUploadFile {
  id: string;
  file: File;                       // native File object
  name: string;
  src: string;                      // object URL
  sizeBytes: number;
  mimeType?: string;
  extension: string;
  previewType: 'auto'|'image'|'pdf'|'video'|'audio'|'file';
  width?: number;
  height?: number;
}

<FileUpload
  variant?={'compact'|'dropzone'}
  size?={'xs'|'sm'|'md'|'lg'}
  multiple?={boolean}
  accept?={string}                  // MIME type or extension filter, e.g. 'image/*,.pdf'
  disabled?={boolean}
  placeholder?={ReactNode}
  dropzoneHint?={ReactNode}
  browseLabel?={ReactNode}
  onFilesChange?={(files: FileUploadFile[]) => void}
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

### Data table with server-side pagination

```tsx
<Table
  data={data}
  columns={columns}
  serverSide
  totalRows={total}
  pageIndex={page}
  loading={isLoading}
  skeleton
  onPageChange={setPage}
  onSortChange={setSort}
  sortable
  searchable
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
