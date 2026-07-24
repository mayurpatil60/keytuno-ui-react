# Keytuno UI React Storybook Master Documentation

Generated from all Storybook story files in `stories/` to provide Copilot-ready reference for component props, actions/events, accessibility signals, and usage patterns.

## 1. Component Index and Coverage Counts

- Total components documented: 46
- Total story exports covered: 281
- Total unique props detected across stories: 802
- Total callback/action props detected: 117
- Total unique accessibility signals detected: 13

Sequential index (component -> stories, props, actions, a11y signals):

1. Accordion -> stories: 4, props: 9, actions: 1, a11y signals: 0
2. Alert -> stories: 9, props: 27, actions: 2, a11y signals: 0
3. Avatar -> stories: 4, props: 13, actions: 2, a11y signals: 2
4. Badge -> stories: 4, props: 8, actions: 2, a11y signals: 2
5. Breadcrumb -> stories: 5, props: 10, actions: 1, a11y signals: 1
6. Button -> stories: 8, props: 21, actions: 2, a11y signals: 3
7. ButtonGroup -> stories: 3, props: 12, actions: 1, a11y signals: 1
8. Card -> stories: 6, props: 12, actions: 3, a11y signals: 0
9. DataToolbar -> stories: 3, props: 40, actions: 6, a11y signals: 0
10. Checkbox -> stories: 7, props: 15, actions: 3, a11y signals: 1
11. ColorPicker -> stories: 8, props: 18, actions: 2, a11y signals: 4
12. DatePicker -> stories: 10, props: 16, actions: 2, a11y signals: 0
13. Dialog -> stories: 10, props: 15, actions: 2, a11y signals: 0
14. DropdownMenu -> stories: 22, props: 14, actions: 2, a11y signals: 2
15. Field -> stories: 7, props: 14, actions: 1, a11y signals: 3
16. FileList -> stories: 6, props: 22, actions: 1, a11y signals: 0
17. FilePreview -> stories: 4, props: 15, actions: 0, a11y signals: 0
18. FileUpload -> stories: 9, props: 25, actions: 1, a11y signals: 0
19. Icons -> stories: 2, props: 3, actions: 0, a11y signals: 0
20. Input -> stories: 6, props: 17, actions: 4, a11y signals: 5
21. InputGroup -> stories: 5, props: 11, actions: 1, a11y signals: 1
22. List -> stories: 7, props: 24, actions: 1, a11y signals: 3
23. Navbar -> stories: 1, props: 14, actions: 3, a11y signals: 2
24. Pagination -> stories: 8, props: 27, actions: 3, a11y signals: 0
25. Progress -> stories: 5, props: 14, actions: 1, a11y signals: 0
26. Radio -> stories: 8, props: 23, actions: 2, a11y signals: 0
27. Scrollbar -> stories: 4, props: 9, actions: 4, a11y signals: 0
28. Select -> stories: 9, props: 20, actions: 2, a11y signals: 1
29. Separator -> stories: 4, props: 8, actions: 1, a11y signals: 0
30. Sheet -> stories: 7, props: 19, actions: 2, a11y signals: 0
31. Sidebar -> stories: 6, props: 18, actions: 5, a11y signals: 2
32. Skeleton -> stories: 6, props: 15, actions: 4, a11y signals: 4
33. Slider -> stories: 10, props: 22, actions: 2, a11y signals: 2
34. Spinner -> stories: 2, props: 12, actions: 4, a11y signals: 4
35. Stepper -> stories: 10, props: 37, actions: 5, a11y signals: 2
36. Switch -> stories: 7, props: 19, actions: 5, a11y signals: 5
37. Table -> stories: 3, props: 18, actions: 1, a11y signals: 0
38. Tabs -> stories: 5, props: 14, actions: 2, a11y signals: 2
39. Textarea -> stories: 5, props: 17, actions: 4, a11y signals: 4
40. Theme -> stories: 1, props: 0, actions: 0, a11y signals: 0
41. TimezonePicker -> stories: 9, props: 22, actions: 2, a11y signals: 3
42. Toast -> stories: 4, props: 14, actions: 2, a11y signals: 1
43. Toggle -> stories: 4, props: 18, actions: 5, a11y signals: 5
44. Tooltip -> stories: 5, props: 16, actions: 5, a11y signals: 6
45. AdaptiveCard -> stories: 5, props: 29, actions: 1, a11y signals: 0
46. AdvanceFilter -> stories: 4, props: 32, actions: 2, a11y signals: 1

## 2. Sequential Component Documentation

### 2.1 Accordion

- Story source file: stories/Accordion.stories.tsx
- Storybook title: Data/Accordion
- Story exports count: 4
- Props documented from stories: 9
- Callback/action props detected: 1
- Accessibility signals detected in stories: 0
- Canonical API section: docs/keytuno-ui-react.md -> ### Accordion

#### Story Exports

1. AccordionStory
2. AccordionPlayground
3. AccordionWithActions
4. AccordionMultiplePlayground

#### Imported Keytuno Components in Story File

1. Accordion
2. Button

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| className | argTypes, table-disabled | - | - | - | - |
| defaultOpenItems | argTypes, jsx-usage, table-disabled | - | - | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| items | argTypes, jsx-usage, table-disabled | - | - | - | - |
| multiple | argTypes, args, jsx-usage | boolean | true | - | Whether multiple items can be open at the same time. |
| onOpenItemsChange | argTypes, jsx-usage | - | - | - | action: open-items-change \| Fires with the currently open item IDs whenever expansion changes. |
| orientation | argTypes, args, jsx-usage | inline-radio | vertical | horizontal, vertical | - |
| size | argTypes, args, jsx-usage | select | md, sm | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |

#### Actions and Event Contracts

1. onOpenItemsChange -> open-items-change; Fires with the currently open item IDs whenever expansion changes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.2 Alert

- Story source file: stories/Alert.stories.tsx
- Storybook title: Feedback/Alert
- Story exports count: 9
- Props documented from stories: 27
- Callback/action props detected: 2
- Accessibility signals detected in stories: 0
- Canonical API section: docs/keytuno-ui-react.md -> ### Alert (toast / notification)

#### Story Exports

1. Basic
2. Variants
3. Sizes
4. AlertPlayground
5. AlertStackPlayground
6. DirectionSide
7. SideDebug
8. AlertActionRequiredPlayground
9. AlertCustomColorPlayground

#### Imported Keytuno Components in Story File

1. Alert
2. AlertAction
3. AlertActionContext
4. AlertDescription
5. AlertSide
6. AlertSize
7. AlertTitle
8. AlertVariant
9. AlertViewportInset
10. Badge
11. Button
12. Field
13. FieldContent
14. FieldDescription
15. FieldLabel

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| actionColor | argTypes, args, jsx-usage | color | #c2410c | - | - |
| actionRequired | argTypes, args, jsx-usage, table-disabled | boolean | false | - | - |
| areaMode | argTypes, args | inline-radio | full-viewport | custom-area, full-viewport | - |
| backgroundColor | argTypes, args, jsx-usage | color | #fff7ed | - | - |
| borderColor | argTypes, args, jsx-usage | color | #fb923c | - | - |
| children | argTypes, table-disabled | - | - | - | Main content renders in the top row with close button; direct AlertAction children flow to a separate action row below. |
| className | argTypes, table-disabled | - | - | - | - |
| closeOnEscape | argTypes, args, jsx-usage | boolean | true | - | - |
| customColors | jsx-usage | - | - | - | - |
| defaultOpen | argTypes, args, jsx-usage, table-disabled | boolean | true | - | - |
| descriptionColor | argTypes, args, jsx-usage | color | #7c2d12 | - | - |
| duration | argTypes, args, jsx-usage | number | 30000 | - | - |
| insetBottom | argTypes, args | number | 96 | - | - |
| insetLeft | argTypes, args | number | 80 | - | - |
| insetRight | argTypes, args | number | 80 | - | - |
| insetTop | argTypes, args | number | 72 | - | - |
| key | jsx-usage | - | - | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onOpenChange | argTypes, jsx-usage | - | - | - | action: open-change |
| open | argTypes, jsx-usage, table-disabled | - | - | - | - |
| side | argTypes, args, jsx-usage, table-disabled | select | bottom-right, top-center, top-right | - | - |
| size | argTypes, args, jsx-usage, table-disabled | select | md | - | - |
| style | argTypes, table-disabled | - | - | - | - |
| titleColor | argTypes, args, jsx-usage | color | #9a3412 | - | - |
| variant | argTypes, args, jsx-usage | select | destructive, outline, primary, secondary | - | - |
| viewportInset | jsx-usage | - | - | - | - |
| withAction | argTypes, args, jsx-usage | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onOpenChange -> open-change; No explicit description in argTypes.

Layout behavior notes:
1. Alert close button is row-scoped with the main content header.
2. Direct AlertAction children render in a dedicated row under content.
3. Alert no longer uses a full-height side column for close/action controls.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.3 Avatar

- Story source file: stories/Avatar.stories.tsx
- Storybook title: Data/Avatar
- Story exports count: 4
- Props documented from stories: 13
- Callback/action props detected: 2
- Accessibility signals detected in stories: 2
- Canonical API section: docs/keytuno-ui-react.md -> ### Avatar

#### Story Exports

1. AvatarExamples
2. AvatarSizes
3. AvatarActions
4. AvatarPlayground

#### Imported Keytuno Components in Story File

1. Avatar

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| avatarImage | argTypes, jsx-usage, table-disabled | - | - | - | - |
| badgeColor | argTypes, args, jsx-usage | color | #22c55e | - | - |
| badgeIcon | argTypes, jsx-usage, table-disabled | - | - | - | - |
| badgeType | argTypes, args, jsx-usage | inline-radio | none | color, icon, none | - |
| className | argTypes, table-disabled | - | - | - | - |
| imageAlt | argTypes, args | text | Avatar image | - | - |
| imageSrc | argTypes, args, jsx-usage | text | - | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onClick | argTypes | - | - | - | action: click |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| text | argTypes, args, jsx-usage | text | Mayur Joshi | - | - |
| withAction | argTypes, args | boolean | true | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onClick -> click; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. aria-label
2. keyboard

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.4 Badge

- Story source file: stories/Badge.stories.tsx
- Storybook title: Feedback/Badge
- Story exports count: 4
- Props documented from stories: 8
- Callback/action props detected: 2
- Accessibility signals detected in stories: 2
- Canonical API section: docs/keytuno-ui-react.md -> ### Badge

#### Story Exports

1. BadgeVariants
2. BadgeSizes
3. BadgeActions
4. BadgePlayground

#### Imported Keytuno Components in Story File

1. Badge

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| children | argTypes, args | text | Badge | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onClick | argTypes, jsx-usage | - | - | - | action: click |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| variant | argTypes, args, jsx-usage | select | primary | destructive, ghost, link, outline, primary, secondary | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onClick -> click; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. aria-label
2. keyboard

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.5 Breadcrumb

- Story source file: stories/Breadcrumb.stories.tsx
- Storybook title: Navigation/Breadcrumb
- Story exports count: 5
- Props documented from stories: 10
- Callback/action props detected: 1
- Accessibility signals detected in stories: 1
- Canonical API section: docs/keytuno-ui-react.md -> ### Breadcrumb

#### Story Exports

1. BreadcrumbLinks
2. BreadcrumbSizes
3. BreadcrumbEllipsisAndSeparator
4. BreadcrumbActions
5. BreadcrumbPlayground

#### Imported Keytuno Components in Story File

1. Breadcrumb
2. BreadcrumbActionContext
3. BreadcrumbItem

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| className | argTypes, table-disabled | - | - | - | - |
| includeActions | argTypes, args | boolean | true | - | - |
| includeLinks | argTypes, args | boolean | true | - | - |
| items | argTypes, jsx-usage, table-disabled | - | - | - | - |
| maxVisibleItems | argTypes, args, jsx-usage | number | 4 | - | - |
| onAction | argTypes, args, jsx-usage | - | undefined | - | action: action \| Fires when a breadcrumb item with href or action behavior is activated. |
| separator | argTypes, jsx-usage, table-disabled | - | - | - | - |
| separatorType | argTypes, args | inline-radio | slash | chevron, slash | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |

#### Actions and Event Contracts

1. onAction -> action; Fires when a breadcrumb item with href or action behavior is activated.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. aria-hidden

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.6 Button

- Story source file: stories/Button.stories.tsx
- Storybook title: Actions/Button
- Story exports count: 8
- Props documented from stories: 21
- Callback/action props detected: 2
- Accessibility signals detected in stories: 3
- Canonical API section: docs/keytuno-ui-react.md -> ### Button

#### Story Exports

1. ButtonVariants
2. ButtonSizes
3. ButtonIcon
4. CompactButtons
5. ButtonIconPlayground
6. ButtonWithIcon
7. ButtonWithIconPlayground
8. ButtonPlayground

#### Imported Keytuno Components in Story File

1. Button
2. Spinner

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| aria-label | jsx-usage | - | - | - | - |
| children | argTypes, args, table-disabled | text | Create, Playground Button | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| compact | argTypes, args, jsx-usage | boolean | false | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| iconColor | argTypes, args, jsx-usage | text | - | - | - |
| iconOnly | argTypes, args, jsx-usage | boolean | true | - | - |
| iconOnlyTone | argTypes, args, jsx-usage | boolean | true | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onClick | argTypes, jsx-usage | - | - | - | action: click |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| tooltip | argTypes, args, jsx-usage | text | Icon action tooltip | - | - |
| tooltipCloseDelay | argTypes, args, jsx-usage | number | 70 | - | - |
| tooltipDisabled | argTypes, args, jsx-usage | boolean | false | - | - |
| tooltipOpenDelay | argTypes, args, jsx-usage | number | 120 | - | - |
| tooltipSide | argTypes, args, jsx-usage | select | auto | auto, bottom, left, right, top | - |
| tooltipSize | argTypes, args, jsx-usage | select | sm | lg, md, sm, xs | - |
| type | argTypes, args, jsx-usage | select | button | button, reset, submit | - |
| typeof | jsx-usage | - | - | - | - |
| variant | argTypes, args, jsx-usage | select | primary | destructive, ghost, link, outline, primary, secondary | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onClick -> click; No explicit description in argTypes.

#### Accessibility Coverage

1. Prop: aria-label

Accessibility tokens/signals found in story code:
1. aria-busy
2. aria-hidden
3. aria-label

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.7 ButtonGroup

- Story source file: stories/ButtonGroup.stories.tsx
- Storybook title: Actions/Button Group
- Story exports count: 3
- Props documented from stories: 12
- Callback/action props detected: 1
- Accessibility signals detected in stories: 1
- Canonical API section: docs/keytuno-ui-react.md -> ### ButtonGroup

#### Story Exports

1. ButtonGroupStory
2. ButtonGroupPlayground
3. CompactTriplePlayground

#### Imported Keytuno Components in Story File

1. Button
2. ButtonGroup
3. ButtonGroupActionContext

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| aria-label | jsx-usage | - | - | - | - |
| children | argTypes, table-disabled | - | - | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| compact | argTypes, args, jsx-usage | boolean | false | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: group-action |
| orientation | argTypes, args, jsx-usage | inline-radio | horizontal | horizontal, vertical | - |
| size | argTypes, args, jsx-usage | select | md, sm | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| variant | argTypes, args, jsx-usage | select | outline, secondary | destructive, ghost, link, outline, primary, secondary | - |
| withLabels | argTypes, args | boolean | false | - | - |
| withTooltips | argTypes, args | boolean | true | - | - |

#### Actions and Event Contracts

1. onAction -> group-action; No explicit description in argTypes.

#### Accessibility Coverage

1. Prop: aria-label

Accessibility tokens/signals found in story code:
1. aria-label

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.8 Card

- Story source file: stories/Card.stories.tsx
- Storybook title: Data/Card
- Story exports count: 6
- Props documented from stories: 12
- Callback/action props detected: 3
- Accessibility signals detected in stories: 0
- Canonical API section: docs/keytuno-ui-react.md -> ### Card

#### Story Exports

1. CardBasic
2. CardSizes
3. CardSpacing
4. CardCollapse
5. CardActions
6. CardPlayground

#### Imported Keytuno Components in Story File

1. Button
2. Card
3. CardActionContext
4. CardContent
5. CardDescription
6. CardFooter
7. CardHeader
8. CardTitle

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| children | argTypes, table-disabled | - | - | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| collapse | argTypes, args, jsx-usage | boolean | false | - | - |
| defaultCollapsed | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| onAction | argTypes, args, jsx-usage | - | undefined | - | action: action \| Fires for card surface clicks and collapse toggle actions with source metadata. |
| onClick | argTypes, jsx-usage | - | - | - | action: click |
| onCollapseChange | argTypes, jsx-usage | - | - | - | action: collapse-change |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| spacing | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, jsx-usage, table-disabled | - | - | - | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; Fires for card surface clicks and collapse toggle actions with source metadata.
2. onClick -> click; No explicit description in argTypes.
3. onCollapseChange -> collapse-change; No explicit description in argTypes.

Card API update notes:
1. `CardTitle` supports optional `collapseTrigger` to collapse/reopen when parent `Card` has `collapse={true}`.
2. `CardDescription` supports optional `collapseTrigger` with the same behavior.
3. Title/description-triggered toggles follow the same action source path (`collapse-toggle`) used by the chevron control.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.9 DataToolbar

- Story source file: stories/DataToolbar.stories.tsx
- Storybook title: Data/DataToolbar
- Story exports count: 3
- Props documented from stories: 40
- Callback/action props detected: 6
- Accessibility signals detected in stories: 0
- Canonical API section: docs/keytuno-ui-react.md -> ### DataToolbar

#### Story Exports

1. Basic
2. ToolbarComposition
3. DataToolbarPlayground

#### Imported Keytuno Components in Story File

1. AdaptiveCard
2. DataToolbar
3. Table
4. AdaptiveCardAction
5. AdaptiveCardFieldSchema
6. AdvanceFilterColumn
7. DataToolbarProps
8. TableColumnDef

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| addFilterLabel | argTypes | text | Add filter | - | Label for add filter action in AdvanceFilter sheet. |
| addSortLabel | argTypes | text | Add sort | - | Label for add sort action in AdvanceFilter sheet. |
| advanceFilterCloseLabel | argTypes | text | Close | - | One-word close tooltip/label for filter trigger. |
| advanceFilterColumns | jsx-usage, table-disabled | - | - | - | Shared filterable/sortable column definitions. |
| advanceFilterDescription | argTypes | text | Configure filters and sorting | - | Sheet description copy. |
| advanceFilterEnableSorting | argTypes, args | boolean | true | - | Enables sorting rows in sheet. |
| advanceFilterOpenLabel | argTypes | text | Filter | - | One-word open tooltip/label for filter trigger. |
| advanceFilterTitle | argTypes | text | Advance Filter | - | Sheet title. |
| applyFiltersLabel | argTypes | text | Apply filters | - | Commit filters/sorting. |
| clearFiltersLabel | argTypes | text | Clear filters | - | Clear only filter rows. |
| defaultSearchValue | argTypes, args | text | - | - | Uncontrolled search initial value. |
| exitFullscreenLabel | argTypes | text | Exit | - | One-word fullscreen exit label. |
| fullscreen | argTypes, args | boolean | false | - | Controlled fullscreen state. |
| fullscreenLabel | argTypes | text | Fullscreen | - | One-word fullscreen entry label. |
| globalFilterPlaceholder | argTypes | text | Search all columns | - | Placeholder for sheet global search field. |
| onAction | argTypes | - | - | - | action: toolbar-action |
| onAdvanceFilterApply | argTypes | - | - | - | action: apply-filter |
| onFullscreenChange | argTypes | - | - | - | action: fullscreen-change |
| onRefresh | argTypes | - | - | - | action: refresh |
| onSearchChange | argTypes | - | - | - | action: search-change |
| onSwitch | argTypes | - | - | - | action: switch |
| refreshLabel | argTypes | text | Refresh | - | One-word refresh tooltip/label. |
| refreshingLabel | argTypes | text | Refreshing | - | Refresh loading label. |
| resetSortingLabel | argTypes | text | Reset sorting | - | Reset sorting rows in sheet. |
| searchAriaLabel | argTypes | text | Search records | - | Search input accessible name. |
| searchPlaceholder | argTypes, args | text | Search | - | Search input placeholder. |
| searchValue | argTypes, args | text | - | - | Controlled search value. |
| showAdvanceFilter | argTypes, args | boolean | true | - | Shows filter trigger and sheet. |
| showFullscreen | argTypes, args | boolean | true | - | Shows fullscreen toggle icon action. |
| showRefresh | argTypes, args | boolean | true | - | Shows refresh icon action. |
| showSearch | argTypes, args | boolean | true | - | Shows left-side global search input that can shrink in compact one-row layouts. |
| showSwitch | argTypes, args | boolean | true | - | Shows view-switch icon action. |
| size | argTypes, args | select | sm | lg, md, sm, xs | Control density for toolbar actions/input. |
| switchLabel | argTypes, args | text | Cards | - | One-word tooltip/aria-label for switch icon. |
| switchMode | argTypes, args | select | adaptive-card | adaptive-card, custom, table | Determines default switch icon and semantics. |

#### Actions and Event Contracts

1. onAction -> toolbar-action; Unified callback with source metadata for search/filter/switch/refresh/fullscreen.
2. onAdvanceFilterApply -> apply-filter; Receives `result` + `reason` from AdvanceFilter.
3. onFullscreenChange -> fullscreen-change; Receives next fullscreen state.
4. onRefresh -> refresh; Triggered from icon action.
5. onSearchChange -> search-change; Triggered on search input change.
6. onSwitch -> switch; Triggered from switch icon action.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Keep one toolbar row only: search field on the left, then filter/switch/refresh/fullscreen icon actions.
2. Keep search compact by default for narrow screens (`searchInputMinWidth` defaults to `20px`).
3. Use one-word icon labels for compact tooltips and clearer a11y naming.
4. Reuse the same toolbar state across composed `Table` and `AdaptiveCard` views.
5. Set `showToolbar={false}` on middle data components when composing with `DataToolbar`.

### 2.10 Checkbox

- Story source file: stories/Checkbox.stories.tsx
- Storybook title: Forms/Checkbox
- Story exports count: 7
- Props documented from stories: 15
- Callback/action props detected: 3
- Accessibility signals detected in stories: 1
- Canonical API section: docs/keytuno-ui-react.md -> ### Checkbox

#### Story Exports

1. Basic
2. Description
3. Disabled
4. Group
5. Table
6. Actions
7. CheckboxPlayground

#### Imported Keytuno Components in Story File

1. Checkbox
2. CheckboxActionContext

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| checked | argTypes, jsx-usage, table-disabled | - | - | - | - |
| children | argTypes, args | text | Enable notifications | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| defaultChecked | argTypes, args, jsx-usage | boolean | false | - | - |
| description | argTypes, args, jsx-usage | text | Receive release and product updates. | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| invalid | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| onAction | argTypes, args, jsx-usage | - | undefined | - | action: action \| Fires with checked state and native change event when checkbox toggles. |
| onChange | argTypes, table-disabled | - | - | - | action: callback |
| onCheckedChange | argTypes, args, jsx-usage | - | undefined | - | action: checked-change \| Fires with next checked value. |
| required | argTypes, args, jsx-usage | boolean | false | - | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; Fires with checked state and native change event when checkbox toggles.
2. onChange -> callback; No explicit description in argTypes.
3. onCheckedChange -> checked-change; Fires with next checked value.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. aria-label

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.11 ColorPicker

- Story source file: stories/ColorPicker.stories.tsx
- Storybook title: Forms/ColorPicker
- Story exports count: 8
- Props documented from stories: 18
- Callback/action props detected: 2
- Accessibility signals detected in stories: 4
- Canonical API section: docs/keytuno-ui-react.md -> ### ColorPicker

#### Story Exports

1. Basic
2. Variants
3. WithoutSwatches
4. Sizes
5. Accessibility
6. ColorPickerActions
7. ColorPickerPlayground
8. CompactColorPickerPlayground

#### Imported Keytuno Components in Story File

1. ColorPicker
2. ColorPickerActionContext
3. ColorPickerProps
4. Field
5. FieldContent
6. FieldDescription
7. FieldError
8. FieldGroup
9. FieldLabel

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| aria-describedby | jsx-usage | - | - | - | - |
| aria-label | jsx-usage | - | - | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| defaultValue | argTypes, jsx-usage, table-disabled | - | - | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| invalid | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| onAction | argTypes, args, jsx-usage | - | undefined | - | action: action \| Fires for color input updates, hex edits, swatch selection, clear, focus, and blur. |
| onValueChange | argTypes, args, jsx-usage | - | undefined | - | action: value-change \| Fires when a normalized color value changes. |
| placeholder | argTypes, args, jsx-usage | text | #111827, #2563EB | - | - |
| required | argTypes, args, jsx-usage | boolean | false | - | - |
| showClear | argTypes, args, jsx-usage | boolean | true | - | - |
| showSwatches | argTypes, args, jsx-usage | boolean | true | - | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, jsx-usage, table-disabled | - | - | - | - |
| swatches | argTypes, jsx-usage, table-disabled | - | - | - | - |
| value | argTypes, table-disabled | - | - | - | - |
| variant | argTypes, args, jsx-usage | inline-radio | compact, detailed | compact, detailed | - |

#### Actions and Event Contracts

1. onAction -> action; Fires for color input updates, hex edits, swatch selection, clear, focus, and blur.
2. onValueChange -> value-change; Fires when a normalized color value changes.

#### Accessibility Coverage

1. Prop: aria-describedby
2. Prop: aria-label

Accessibility tokens/signals found in story code:
1. aria-describedby
2. aria-label
3. focus
4. keyboard

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.12 DatePicker

- Story source file: stories/DatePicker.stories.tsx
- Storybook title: Forms/DatePicker
- Story exports count: 10
- Props documented from stories: 16
- Callback/action props detected: 2
- Accessibility signals detected in stories: 0
- Canonical API section: docs/keytuno-ui-react.md -> ### DatePicker

#### Story Exports

1. Datepicker
2. RangePickerInput
3. TimePicker
4. Invalid
5. Disabled
6. LargeDataScrollbar
7. DatePickerActions
8. DatePickerPlayground
9. RangePickerPlayground
10. TimePickerPlayground

#### Imported Keytuno Components in Story File

1. DatePicker
2. DatePickerActionContext
3. DateRangeValue
4. Field
5. FieldContent
6. FieldDescription
7. FieldError
8. FieldLabel

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| className | argTypes, table-disabled | - | - | - | - |
| defaultValue | argTypes, jsx-usage, table-disabled | - | - | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| invalid | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| mode | argTypes, args, jsx-usage | inline-radio | date, range, time | date, range, time | - |
| onAction | argTypes, args, jsx-usage | - | undefined | - | action: action \| Fires for open, close, input, clear, date/time select, and month/year navigation actions. |
| onValueChange | argTypes, args, jsx-usage | - | undefined | - | action: value-change \| Fires when a valid normalized value is committed. |
| placeholder | argTypes, args, jsx-usage | text | Select date, Select date range, Select time | - | - |
| rangeSeparator | argTypes, args, jsx-usage, table-disabled | text | - | - | - |
| required | argTypes, args, jsx-usage | boolean | false | - | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, jsx-usage, table-disabled | - | - | - | - |
| value | argTypes, table-disabled | - | - | - | - |
| variant | argTypes, args, jsx-usage | select | primary | destructive, ghost, link, outline, primary, secondary | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; Fires for open, close, input, clear, date/time select, and month/year navigation actions.
2. onValueChange -> value-change; Fires when a valid normalized value is committed.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.13 Dialog

- Story source file: stories/Dialog.stories.tsx
- Storybook title: Overlay/Dialog
- Story exports count: 10
- Props documented from stories: 15
- Callback/action props detected: 2
- Accessibility signals detected in stories: 0
- Canonical API section: docs/keytuno-ui-react.md -> ### Dialog

#### Story Exports

1. Basic
2. NoCloseButton
3. StickyFooter
4. ScrollableContent
5. MiddleScrollbarPlaybook
6. LargeDataScrollbar
7. DialogPlayground
8. DialogActions
9. DialogScrollablePlayground
10. DialogFooterPlayground

#### Imported Keytuno Components in Story File

1. Button
2. Dialog
3. DialogActionContext
4. DialogContent
5. DialogDescription
6. DialogFooter
7. DialogHeader
8. DialogTitle

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| children | argTypes, table-disabled | - | - | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| closeOnEscape | argTypes, args, jsx-usage | boolean | true | - | - |
| closeOnOverlayClick | argTypes, args, jsx-usage | boolean | true | - | - |
| defaultOpen | argTypes, args, jsx-usage, table-disabled | boolean | false | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| onAction | argTypes, args, jsx-usage | - | undefined | - | action: action \| Fires when open state changes from trigger, overlay click, escape key, or close button. |
| onOpenChange | argTypes, args, jsx-usage | - | undefined | - | action: open-change \| Fires with the next open state whenever the dialog toggles. |
| open | argTypes, table-disabled | - | - | - | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| trigger | argTypes, args, jsx-usage | text | Open Playground Dialog, Open Scrollable Playground, Open Sticky Footer Playground | - | - |
| variant | argTypes, args, jsx-usage | select | outline, primary, secondary | destructive, ghost, link, outline, primary, secondary | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; Fires when open state changes from trigger, overlay click, escape key, or close button.
2. onOpenChange -> open-change; Fires with the next open state whenever the dialog toggles.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.14 DropdownMenu

- Story source file: stories/DropdownMenu.stories.tsx
- Storybook title: Navigation/Dropdown Menu
- Story exports count: 22
- Props documented from stories: 14
- Callback/action props detected: 2
- Accessibility signals detected in stories: 2
- Canonical API section: docs/keytuno-ui-react.md -> ### DropdownMenu

#### Story Exports

1. Basic
2. Submenu
3. Shortcuts
4. Icons
5. Checkboxes
6. CheckboxesIcons
7. RadioGroup
8. RadioIcons
9. SelectGroup
10. Destructive
11. AvatarMenu
12. TriggerTypes
13. ButtonTriggerVariants
14. ButtonTriggerTypes
15. Complex
16. DeepNestedPlayground
17. MultiChildPlayground
18. SideDebug
19. LargeDataScrollbar
20. DropdownMenuActions
21. VerticalBlockList
22. DropdownMenuPlayground

#### Imported Keytuno Components in Story File

1. Avatar
2. Button
3. DropdownMenu
4. DropdownMenuActionContext
5. DropdownMenuCheckboxItem
6. DropdownMenuContent
7. DropdownMenuGroup
8. DropdownMenuItem
9. DropdownMenuLabel
10. DropdownMenuProps
11. DropdownMenuRadioGroup
12. DropdownMenuRadioItem
13. DropdownMenuSeparator
14. DropdownMenuSide
15. DropdownMenuTrigger
16. Field
17. FieldContent
18. FieldDescription
19. FieldLabel

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| children | argTypes, table-disabled | - | - | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| closeOnSelect | argTypes, args, jsx-usage | boolean | true | - | - |
| defaultOpen | argTypes, table-disabled | - | - | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| onAction | argTypes, args, jsx-usage | - | undefined | - | action: action \| Fires for trigger open/close, outside click close, escape close, and menu item selections. |
| onOpenChange | argTypes, args, jsx-usage | - | undefined | - | action: open-change \| Fires with the next open state whenever dropdown visibility changes. |
| open | argTypes, table-disabled | - | - | - | - |
| side | argTypes, args, jsx-usage | select | auto | auto, bottom, left, right, top | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| variant | argTypes, args, jsx-usage | select | default | default, outline, soft | - |
| withAction | argTypes, args | boolean | true | - | - |

#### Actions and Event Contracts

1. onAction -> action; Fires for trigger open/close, outside click close, escape close, and menu item selections.
2. onOpenChange -> open-change; Fires with the next open state whenever dropdown visibility changes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. aria-label
2. Keyboard

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.15 Field

- Story source file: stories/Field.stories.tsx
- Storybook title: Forms/Field
- Story exports count: 7
- Props documented from stories: 14
- Callback/action props detected: 1
- Accessibility signals detected in stories: 3
- Canonical API section: docs/keytuno-ui-react.md -> ### Field

#### Story Exports

1. BasicField
2. FieldWithSelect
3. FieldWithDatePicker
4. FieldActions
5. FieldPlayground
6. SelectFieldPlayground
7. DatePickerFieldPlayground

#### Imported Keytuno Components in Story File

1. DatePicker
2. DatePickerMode
3. DateRangeValue
4. Field
5. FieldActionContext
6. FieldContent
7. FieldDescription
8. FieldError
9. FieldGroup
10. FieldLabel
11. FieldSeparator
12. FieldTitle
13. Select
14. SelectOption

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| children | argTypes, table-disabled | - | - | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| invalid | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| mode | argTypes, args | inline-radio | date | date, range, time | - |
| multiple | argTypes, args | boolean | false | - | - |
| onAction | argTypes, args, jsx-usage | - | undefined | - | action: action \| Fires for focus-within, blur-within, label-click, and field-click events. |
| orientation | argTypes, args, jsx-usage | inline-radio | vertical | horizontal, responsive, vertical | - |
| required | argTypes, args, jsx-usage | boolean | false | - | - |
| size | argTypes, args | select | md | lg, md, sm, xs | - |
| style | argTypes, jsx-usage, table-disabled | - | - | - | - |
| variant | argTypes, args | select | outline | destructive, ghost, link, outline, primary, secondary | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; Fires for focus-within, blur-within, label-click, and field-click events.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. focus
2. Focus
3. htmlFor

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.16 FileList

- Story source file: stories/FileList.stories.tsx
- Storybook title: Data/FileList
- Story exports count: 6
- Props documented from stories: 22
- Callback/action props detected: 1
- Accessibility signals detected in stories: 0
- Canonical API section: docs/keytuno-ui-react.md -> ### FileList

#### Story Exports

1. BasicDetailed
2. Variants
3. SizesAndDisabled
4. RemovableList
5. VirtualizedLargeDataset
6. FileListPlayground

#### Imported Keytuno Components in Story File

1. Field
2. FieldContent
3. FieldDescription
4. FieldLabel
5. FileList
6. FileListItem
7. FileListProps

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| className | argTypes, table-disabled | - | - | - | - |
| compactChipProps | argTypes, args, jsx-usage | object | {object} | - | Configures compact chips. You can set badge variant/size/style/className and span attributes. |
| dataset | argTypes, args | inline-radio | default | default, large | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| emptyText | argTypes, args, jsx-usage | text | No files available. | - | - |
| files | argTypes, jsx-usage, table-disabled | - | - | - | - |
| heroDescription | argTypes, args | text | Hero cover image used in the campaign tile. | - | Editable description text for the hero cover image item. |
| key | jsx-usage | - | - | - | - |
| onRemove | argTypes, jsx-usage, table-disabled | - | - | - | action: callback |
| showBytes | argTypes, args, jsx-usage | boolean | true | - | - |
| showDimensions | argTypes, args, jsx-usage | boolean | true | - | - |
| showHeroDescription | argTypes, args | boolean | true | - | Toggle description for the hero cover image item. |
| showMimeType | argTypes, args, jsx-usage | boolean | true | - | - |
| showRemoveAction | argTypes, args, jsx-usage | boolean | true | - | - |
| showSize | argTypes, args, jsx-usage | boolean | true | - | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| variant | argTypes, args, jsx-usage | select | detailed | advanced, compact, detailed | - |
| virtualized | argTypes, args, jsx-usage | boolean | false | - | - |
| virtualizedEstimateSize | argTypes, args, jsx-usage | number | 84 | - | Estimated row height in pixels for virtualized detailed/advanced lists. |
| virtualizedMaxHeight | argTypes, args, jsx-usage | text | 24rem | - | Viewport max height when virtualization is enabled. |
| virtualizedOverscan | argTypes, args, jsx-usage | number | 8 | - | Extra rows rendered above/below viewport in virtual mode. |

#### Actions and Event Contracts

1. onRemove -> callback; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.17 FilePreview

- Story source file: stories/FilePreview.stories.tsx
- Storybook title: Data/FilePreview
- Story exports count: 4
- Props documented from stories: 15
- Callback/action props detected: 0
- Accessibility signals detected in stories: 0
- Canonical API section: docs/keytuno-ui-react.md -> ### FilePreview

#### Story Exports

1. Basic
2. LinkTrigger
3. SizesAndDisabled
4. FilePreviewPlayground

#### Imported Keytuno Components in Story File

1. Field
2. FieldContent
3. FieldDescription
4. FieldLabel
5. FilePreview

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| asLink | argTypes, args, jsx-usage | boolean | false | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| closeOnEscape | argTypes, args, jsx-usage | boolean | true | - | - |
| closeOnOverlayClick | argTypes, args, jsx-usage | boolean | true | - | - |
| description | argTypes, args, jsx-usage | text | Scroll/pinch in fullscreen for image zoom and pan. | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| linkLabel | argTypes, args, jsx-usage | text | Open preview from link | - | - |
| mimeType | argTypes, args, jsx-usage | text | - | - | - |
| name | argTypes, args, jsx-usage | text | Mountain Lake Cover | - | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| src | argTypes, args, jsx-usage | text | sampleImage | - | - |
| style | argTypes, table-disabled | - | - | - | - |
| thumbnailSrc | argTypes, args, jsx-usage | text | - | - | - |
| type | argTypes, args, jsx-usage | select | auto | audio, auto, file, image, pdf, video | - |

#### Actions and Event Contracts

1. No callback/action props were explicitly detected for this story file.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.18 FileUpload

- Story source file: stories/FileUpload.stories.tsx
- Storybook title: Forms/FileUpload
- Story exports count: 9
- Props documented from stories: 25
- Callback/action props detected: 1
- Accessibility signals detected in stories: 0
- Canonical API section: docs/keytuno-ui-react.md -> ### FileUpload

#### Story Exports

1. CompactVariant
2. DropzoneVariant
3. ProfilePhotoVariant
4. EditModeWithPreloadedFiles
5. SizesAndDisabled
6. FileUploadPlayground
7. CompactVariantPlayground
8. DropzoneVariantPlayground
9. ProfileVariantPlayground

#### Imported Keytuno Components in Story File

1. Field
2. FieldContent
3. FieldDescription
4. FieldLabel
5. FileUpload

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| accept | argTypes, args, jsx-usage | text | - | - | - |
| browseButtonProps | argTypes, args, jsx-usage, table-disabled | object | {object} | - | Pass-through props for the upload browse button. |
| browseLabel | argTypes, args, jsx-usage, table-disabled | text | Upload | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| dialogDescription | argTypes, table-disabled | - | - | - | - |
| dialogProps | argTypes, args, jsx-usage, table-disabled | object | {object} | - | Compact dialog behavior and styling props from Dialog. |
| dialogTitle | argTypes, table-disabled | - | - | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| dropzoneHint | argTypes, args, jsx-usage, table-disabled | text | Drag and drop files here, or use Browse to pick files. | - | - |
| dropzoneTitle | argTypes, args, jsx-usage, table-disabled | text | Drop files here | - | - |
| errorMessage | argTypes, args, jsx-usage | text | - | - | - |
| fileListEmptyText | argTypes, args, jsx-usage, table-disabled | text | No files uploaded yet. | - | - |
| hint | jsx-usage | - | - | - | - |
| initialFiles | argTypes, jsx-usage | object | - | - | Preloaded files for edit mode (already uploaded assets). |
| invalid | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| multiple | argTypes, args, jsx-usage, table-disabled | boolean | true | - | - |
| onFilesChange | argTypes, table-disabled | - | - | - | action: callback |
| placeholder | argTypes, args, jsx-usage, table-disabled | text | Upload files to continue. | - | - |
| profileConfig | argTypes, args, jsx-usage, table-disabled | object | {object} | - | Optional profile-variant settings (hint, icons, labels, imageAlt). |
| required | argTypes, args, jsx-usage | boolean | false | - | - |
| side | argTypes, args, jsx-usage, table-disabled | select | center | center, left, right | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| variant | argTypes, args, jsx-usage | select | compact, dropzone, profile | compact, dropzone, profile | - |

#### Actions and Event Contracts

1. onFilesChange -> callback; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.19 Icons

- Story source file: stories/Icons.stories.tsx
- Storybook title: Icons/Gallery
- Story exports count: 2
- Props documented from stories: 3
- Callback/action props detected: 0
- Accessibility signals detected in stories: 0
- Canonical API section: No direct heading match found in docs/keytuno-ui-react.md

#### Story Exports

1. IconGrid
2. IconPlayground

#### Imported Keytuno Components in Story File

1. Card
2. CardContent
3. CardHeader
4. CardTitle

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| color | argTypes, args | color | var(--ktn-action-primary-bg) | - | - |
| name | argTypes, args | select | activity | - | - |
| size | argTypes, args | number | 28 | - | - |

#### Actions and Event Contracts

1. No callback/action props were explicitly detected for this story file.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.20 Input

- Story source file: stories/Input.stories.tsx
- Storybook title: Forms/Input
- Story exports count: 6
- Props documented from stories: 17
- Callback/action props detected: 4
- Accessibility signals detected in stories: 5
- Canonical API section: docs/keytuno-ui-react.md -> ### Input

#### Story Exports

1. Basic
2. Sizes
3. Required
4. Disabled
5. WithIcon
6. InputPlayground

#### Imported Keytuno Components in Story File

1. Field
2. FieldContent
3. FieldDescription
4. FieldError
5. FieldGroup
6. FieldLabel
7. Input

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| className | argTypes, table-disabled | - | - | - | - |
| defaultValue | argTypes, jsx-usage, table-disabled | - | - | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| id | jsx-usage | - | - | - | - |
| invalid | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onBlur | argTypes, jsx-usage | - | - | - | action: blur |
| onChange | argTypes, jsx-usage | - | - | - | action: change |
| onFocus | argTypes, jsx-usage | - | - | - | action: focus |
| placeholder | argTypes, args, jsx-usage | text | Enter value | - | - |
| required | argTypes, args, jsx-usage | boolean | false | - | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, jsx-usage, table-disabled | - | - | - | - |
| type | argTypes, args, jsx-usage | select | text | email, number, password, search, tel, text, url | - |
| value | argTypes, table-disabled | - | - | - | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onBlur -> blur; No explicit description in argTypes.
3. onChange -> change; No explicit description in argTypes.
4. onFocus -> focus; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. aria-hidden
2. focus
3. htmlFor
4. onBlur
5. onFocus

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.21 InputGroup

- Story source file: stories/InputGroup.stories.tsx
- Storybook title: Forms/InputGroup
- Story exports count: 5
- Props documented from stories: 11
- Callback/action props detected: 1
- Accessibility signals detected in stories: 1
- Canonical API section: docs/keytuno-ui-react.md -> ### InputGroup

#### Story Exports

1. InlineStart
2. InlineEnd
3. BlockLayout
4. States
5. InputGroupPlayground

#### Imported Keytuno Components in Story File

1. Field
2. FieldContent
3. FieldDescription
4. FieldError
5. FieldGroup
6. FieldLabel
7. InputGroup
8. InputGroupAddon
9. InputGroupButton
10. InputGroupInput
11. InputGroupTextarea

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| align | argTypes, args, jsx-usage | inline-radio | inline-start | block-end, block-start, inline-end, inline-start | - |
| children | argTypes, table-disabled | - | - | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| required | argTypes, args, jsx-usage | boolean | false | - | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| variant | argTypes, args, jsx-usage | select | primary | destructive, ghost, link, outline, primary, secondary | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. htmlFor

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.22 List

- Story source file: stories/List.stories.tsx
- Storybook title: Data/List
- Story exports count: 7
- Props documented from stories: 24
- Callback/action props detected: 1
- Accessibility signals detected in stories: 3
- Canonical API section: docs/keytuno-ui-react.md -> ### List

#### Story Exports

1. OneColumnLayout
2. ZerodhaStyle
3. ThreeColumnLayout
4. MultiLineRows
5. CollapsibleRows
6. VirtualizedLargeDataset
7. ListPlayground

#### Imported Keytuno Components in Story File

1. None

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| aria-label | jsx-usage | - | - | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| collapsible | argTypes, args, jsx-usage | boolean | false | - | - |
| columns | argTypes, args, jsx-usage | inline-radio | two | auto, one, three, two | - |
| dataset | argTypes, args | inline-radio | two | extended, large, one, three, two | - |
| defaultCollapsed | argTypes, args, jsx-usage | boolean | false | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| emptyText | argTypes, args, jsx-usage | text | No data available. | - | - |
| hoverActionIds | argTypes, args, jsx-usage | check | [array] | delete, edit, view | - |
| items | argTypes, jsx-usage, table-disabled | - | - | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| role | argTypes, table-disabled | - | - | - | - |
| rowDivider | argTypes, args, jsx-usage | boolean | true | - | - |
| secondaryLineSize | argTypes, args, jsx-usage | select | xs | lg, md, sm, xs | - |
| secondaryLineTone | argTypes, args, jsx-usage | inline-radio | muted | default, muted, negative, positive | - |
| showCollapseIndicator | argTypes, args, jsx-usage | boolean | true | - | - |
| showHoverActions | argTypes, args, jsx-usage | boolean | true | - | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| virtualized | argTypes, args, jsx-usage | boolean | true | - | - |
| virtualizedEstimateSize | argTypes, args, jsx-usage | number | 66 | - | Estimated row height in pixels for the virtualizer. |
| virtualizedMaxHeight | argTypes, args, jsx-usage | text | 24rem | - | Viewport max height for virtualization (for example 24rem, 50vh, or 360). |
| virtualizedOverscan | argTypes, args, jsx-usage | number | 8 | - | Extra rows to render above and below the viewport. |
| withAction | argTypes, args | boolean | true | - | When enabled, row click/keyboard interaction emits onAction context. |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.

#### Accessibility Coverage

1. Prop: aria-label
2. Prop: role

Accessibility tokens/signals found in story code:
1. aria-label
2. keyboard
3. role

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.23 Navbar

- Story source file: stories/Navbar.stories.tsx
- Storybook title: Navigation/Navbar
- Story exports count: 1
- Props documented from stories: 14
- Callback/action props detected: 3
- Accessibility signals detected in stories: 2
- Canonical API section: docs/keytuno-ui-react.md -> ### Navbar

#### Story Exports

1. HamburgerBrandRightIconsPlaybook

#### Imported Keytuno Components in Story File

1. Badge
2. Button
3. Navbar
4. NavbarProps

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| args | jsx-usage | - | - | - | - |
| brandLogo | jsx-usage | - | - | - | - |
| brandName | args | - | Keytuno | - | - |
| brandTagline | args | - | Operations Platform | - | - |
| hamburgerAriaLabel | args, jsx-usage | - | Open app menu | - | - |
| hamburgerDisabled | args, jsx-usage | - | false | - | - |
| onAction | args | - | undefined | - | action: callback |
| onHamburgerAction | args | - | undefined | - | action: callback |
| onItemSelect | args | - | undefined | - | action: callback |
| showBrand | args, jsx-usage | - | true | - | - |
| showHamburger | args, jsx-usage | - | true | - | - |
| size | args, jsx-usage | - | md | - | - |
| sticky | args | - | false | - | - |
| variant | args, jsx-usage | - | light | - | - |

#### Actions and Event Contracts

1. onAction -> callback; No explicit description in argTypes.
2. onHamburgerAction -> callback; No explicit description in argTypes.
3. onItemSelect -> callback; No explicit description in argTypes.

#### Accessibility Coverage

1. Prop: hamburgerAriaLabel

Accessibility tokens/signals found in story code:
1. aria-hidden
2. aria-label

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.24 Pagination

- Story source file: stories/Pagination.stories.tsx
- Storybook title: Navigation/Pagination
- Story exports count: 8
- Props documented from stories: 27
- Callback/action props detected: 3
- Accessibility signals detected in stories: 0
- Canonical API section: docs/keytuno-ui-react.md -> ### Pagination

#### Story Exports

1. BasicVariant
2. AdvanceVariant
3. CompactVariant
4. VisiblePageCount
5. ConfigurableText
6. Controlled
7. PaginationActions
8. PaginationPlayground

#### Imported Keytuno Components in Story File

1. Field
2. FieldContent
3. FieldDescription
4. FieldGroup
5. FieldLabel
6. Pagination
7. PaginationActionContext
8. PaginationProps

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| className | argTypes, table-disabled | - | - | - | - |
| defaultPage | argTypes, args, jsx-usage | number | 1 | - | - |
| defaultPageSize | argTypes, args, jsx-usage | number | 12 | - | - |
| disabled | argTypes, args | boolean | false | - | - |
| item | jsx-usage | - | - | - | - |
| key | jsx-usage | - | - | - | - |
| labels | argTypes, args, jsx-usage | object | {object} | - | - |
| maxVisiblePages | argTypes, args, jsx-usage | number | 2 | - | - |
| onAction | argTypes, args, jsx-usage | - | undefined | - | action: action \| Fires for first/previous/next/last/page-number/page-size and page-size-reset interactions. |
| onPageChange | argTypes, args, jsx-usage | - | undefined | - | action: page-change \| Fires with the next page number whenever page navigation occurs. |
| onPageSizeChange | argTypes, args, jsx-usage | - | undefined | - | action: page-size-change \| Fires with the next page size when selector value changes. |
| page | argTypes, jsx-usage, table-disabled | - | - | - | - |
| pageSize | argTypes, jsx-usage, table-disabled | - | - | - | - |
| pageSizeSelectVariant | argTypes, args, jsx-usage | inline-radio | inline | inline, overlay | Variant used by the internal page-size Select. |
| pageSizeOptions | argTypes, args, jsx-usage | object | [array] | - | - |
| perPage | jsx-usage | - | - | - | - |
| resetPageOnPageSizeChange | argTypes, args | boolean | true | - | - |
| showingPage | jsx-usage | - | - | - | - |
| showingPageFormatter | argTypes, table-disabled | - | - | - | - |
| showPageSizeSelector | argTypes, args | boolean | true | - | - |
| showShowingPage | argTypes, args | boolean | true | - | - |
| showSummary | argTypes, args | boolean | true | - | - |
| size | argTypes, args | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| summaryFormatter | argTypes, table-disabled | - | - | - | - |
| totalPages | argTypes, args, jsx-usage | number | 12 | - | - |
| variant | argTypes, args, jsx-usage | inline-radio | basic | advance, basic, compact | - |

#### Actions and Event Contracts

1. onAction -> action; Fires for first/previous/next/last/page-number/page-size and page-size-reset interactions.
2. onPageChange -> page-change; Fires with the next page number whenever page navigation occurs.
3. onPageSizeChange -> page-size-change; Fires with the next page size when selector value changes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.25 Progress

- Story source file: stories/Progress.stories.tsx
- Storybook title: Feedback/Progress
- Story exports count: 5
- Props documented from stories: 14
- Callback/action props detected: 1
- Accessibility signals detected in stories: 0
- Canonical API section: docs/keytuno-ui-react.md -> ### Progress

#### Story Exports

1. Basic
2. WithLabelAndValue
3. ControlledWithSlider
4. Size
5. ProgressPlayground

#### Imported Keytuno Components in Story File

1. Field
2. FieldContent
3. FieldDescription
4. FieldGroup
5. FieldLabel
6. Progress
7. ProgressLabel
8. ProgressValue
9. Slider

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| children | argTypes, table-disabled | - | - | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| formatAriaValue | argTypes, table-disabled | - | - | - | - |
| key | jsx-usage | - | - | - | - |
| labelText | argTypes, args | text | Account Verification | - | - |
| max | argTypes, args, jsx-usage | number | 100 | - | - |
| min | argTypes, args, jsx-usage | number | 0 | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| showLabel | argTypes, args | boolean | true | - | - |
| showValue | argTypes, args | boolean | true | - | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| value | argTypes, args, jsx-usage | number | 64 | - | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.

#### Accessibility Coverage

1. Prop: formatAriaValue

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.26 Radio

- Story source file: stories/Radio.stories.tsx
- Storybook title: Forms/Radio
- Story exports count: 8
- Props documented from stories: 23
- Callback/action props detected: 2
- Accessibility signals detected in stories: 0
- Canonical API section: docs/keytuno-ui-react.md -> ### Radio

#### Story Exports

1. Basic
2. Description
3. ChoiceCard
4. Disabled
5. Invalid
6. RightControl
7. MiniOrientationAlignPlayground
8. RadioPlayground

#### Imported Keytuno Components in Story File

1. Field
2. FieldContent
3. FieldDescription
4. FieldError
5. FieldGroup
6. FieldLabel
7. Radio
8. RadioOption

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| align | argTypes, args, jsx-usage | inline-radio | inline-start | inline-end, inline-start | - |
| border | jsx-usage | - | - | - | - |
| borderRadius | jsx-usage | - | - | - | - |
| choiceCard | argTypes, args, jsx-usage, table-disabled | boolean | false | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| defaultValue | argTypes, jsx-usage, table-disabled | - | - | - | - |
| description | jsx-usage | - | - | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| invalid | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| label | jsx-usage | - | - | - | - |
| name | argTypes, table-disabled | - | - | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onValueChange | argTypes, jsx-usage | - | - | - | action: value-change |
| options | argTypes, jsx-usage, table-disabled | - | - | - | - |
| orientation | argTypes, args, jsx-usage | inline-radio | vertical | horizontal, vertical | - |
| padding | jsx-usage | - | - | - | - |
| required | argTypes, args, jsx-usage | boolean | false | - | - |
| size | argTypes, args, jsx-usage, table-disabled | select | md | lg, md, sm, xs | - |
| style | argTypes, jsx-usage, table-disabled | - | - | - | - |
| value | argTypes, jsx-usage, table-disabled | - | - | - | - |
| width | jsx-usage | - | - | - | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onValueChange -> value-change; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.27 Scrollbar

- Story source file: stories/Scrollbar.stories.tsx
- Storybook title: Layout/Scrollbar
- Story exports count: 4
- Props documented from stories: 9
- Callback/action props detected: 4
- Accessibility signals detected in stories: 0
- Canonical API section: docs/keytuno-ui-react.md -> ### Scrollbar

#### Story Exports

1. Vertical
2. Horizontal
3. BothAxes
4. ScrollbarPlayground

#### Imported Keytuno Components in Story File

1. Scrollbar

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| axis | argTypes, args, jsx-usage | inline-radio | y | both, x, y | - |
| children | argTypes, table-disabled | - | - | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onCopy | argTypes, table-disabled | - | - | - | action: callback |
| onCut | argTypes, table-disabled | - | - | - | action: callback |
| onPaste | argTypes, table-disabled | - | - | - | action: callback |
| style | argTypes, jsx-usage, table-disabled | - | - | - | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onCopy -> callback; No explicit description in argTypes.
3. onCut -> callback; No explicit description in argTypes.
4. onPaste -> callback; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.28 Select

- Story source file: stories/Select.stories.tsx
- Storybook title: Forms/Select
- Story exports count: 9
- Props documented from stories: 20
- Callback/action props detected: 2
- Accessibility signals detected in stories: 1
- Canonical API section: docs/keytuno-ui-react.md -> ### Select

#### Story Exports

1. Basic
2. Multiple
3. ClearButton
4. Groups
5. CustomItems
6. Invalid
7. Disabled
8. LargeDataScrollbar
9. SelectPlayground

#### Imported Keytuno Components in Story File

1. Field
2. FieldContent
3. FieldDescription
4. FieldError
5. FieldLabel
6. Select
7. SelectGroup
8. SelectOption
9. SelectValue

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| className | argTypes, table-disabled | - | - | - | - |
| defaultValue | argTypes, jsx-usage, table-disabled | - | - | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| emptyText | argTypes, args, jsx-usage | text | No frameworks found. | - | - |
| groups | argTypes, jsx-usage, table-disabled | - | - | - | - |
| invalid | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| multiple | argTypes, args, jsx-usage | boolean | false | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onValueChange | argTypes, jsx-usage | - | - | - | action: value-change |
| options | argTypes, jsx-usage, table-disabled | - | - | - | - |
| placeholder | argTypes, args, jsx-usage | text | Select framework | - | - |
| renderItem | argTypes, jsx-usage, table-disabled | - | - | - | - |
| required | argTypes, args, jsx-usage | boolean | false | - | - |
| searchPlaceholder | argTypes, args, jsx-usage | text | Search framework... | - | - |
| showClear | argTypes, args, jsx-usage | boolean | true | - | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, jsx-usage, table-disabled | - | - | - | - |
| value | argTypes, jsx-usage, table-disabled | - | - | - | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onValueChange -> value-change; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. aria-hidden

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.29 Separator

- Story source file: stories/Separator.stories.tsx
- Storybook title: Layout/Separator
- Story exports count: 4
- Props documented from stories: 8
- Callback/action props detected: 1
- Accessibility signals detected in stories: 0
- Canonical API section: docs/keytuno-ui-react.md -> ### Separator

#### Story Exports

1. Vertical
2. Menu
3. List
4. SeparatorPlayground

#### Imported Keytuno Components in Story File

1. Badge
2. Button
3. Field
4. FieldContent
5. FieldDescription
6. FieldGroup
7. FieldLabel
8. Separator

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| children | argTypes, table-disabled | - | - | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| decorative | argTypes, table-disabled | - | - | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| orientation | argTypes, args, jsx-usage | inline-radio | horizontal | horizontal, vertical | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, jsx-usage, table-disabled | - | - | - | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.30 Sheet

- Story source file: stories/Sheet.stories.tsx
- Storybook title: Overlay/Sheet
- Story exports count: 7
- Props documented from stories: 19
- Callback/action props detected: 2
- Accessibility signals detected in stories: 0
- Canonical API section: docs/keytuno-ui-react.md -> ### Sheet

#### Story Exports

1. Basic
2. SideVariants
3. NoCloseButton
4. Scrollable
5. MiddleScrollbarPlaybook
6. SheetScrollablePlayground
7. SheetPlayground

#### Imported Keytuno Components in Story File

1. Button
2. Sheet
3. SheetContent
4. SheetDescription
5. SheetFooter
6. SheetHeader
7. SheetTitle

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| children | argTypes, table-disabled | - | - | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| closeOnEscape | argTypes, args, jsx-usage | boolean | true | - | - |
| closeOnOverlayClick | argTypes, args, jsx-usage | boolean | true | - | - |
| contentRepeats | argTypes, args | range | 3 | - | - |
| defaultOpen | argTypes, args, jsx-usage, table-disabled | boolean | false | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| maxContentHeight | argTypes, args | text | min(85vh, 32rem) | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onOpenChange | argTypes, jsx-usage | - | - | - | action: open-change |
| open | argTypes, table-disabled | - | - | - | - |
| scrollable | argTypes, args | boolean | true | - | - |
| showCloseButton | argTypes, args, jsx-usage | boolean | true | - | - |
| side | argTypes, args, jsx-usage | select | right, top | bottom, left, right, top | - |
| stickyFooter | argTypes, args | boolean | true | - | - |
| style | argTypes, table-disabled | - | - | - | - |
| trigger | argTypes, args, jsx-usage | text | Open Playground Sheet, Open Scrollable Playground | - | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onOpenChange -> open-change; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.31 Sidebar

- Story source file: stories/Sidebar.stories.tsx
- Storybook title: Navigation/Sidebar
- Story exports count: 6
- Props documented from stories: 18
- Callback/action props detected: 5
- Accessibility signals detected in stories: 2
- Canonical API section: docs/keytuno-ui-react.md -> ### Sidebar

#### Story Exports

1. SidebarMenuAndSubmenuPlaybook
2. SidebarLongListScrollbarPlaybook
3. SidebarVariantPlaybook
4. SidebarPlayground
5. NavbarSidebarPagePlaybook
6. SidebarBackdropOverlayPlaybook

#### Imported Keytuno Components in Story File

1. Badge
2. Button
3. Card
4. CardContent
5. CardDescription
6. CardFooter
7. CardHeader
8. CardTitle
9. Navbar
10. Sidebar
11. SidebarActionContext
12. SidebarItem
13. SidebarProps
14. SidebarSection

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| activeItemId | jsx-usage | - | - | - | - |
| brandName | args, jsx-usage | - | Keytuno | - | - |
| brandTagline | args, jsx-usage | - | Operations | - | - |
| closeOnEscape | args | - | true | - | - |
| collapsed | jsx-usage | - | - | - | - |
| defaultCollapsed | args | - | false | - | - |
| defaultOpen | args | - | true | - | - |
| footer | jsx-usage | - | - | - | - |
| onAction | args | - | undefined | - | action: callback |
| onActiveItemChange | args, jsx-usage | - | undefined | - | action: callback |
| onCollapsedChange | args | - | undefined | - | action: callback |
| onItemSelect | args | - | undefined | - | action: callback |
| onOpenChange | args | - | undefined | - | action: callback |
| open | jsx-usage | - | - | - | - |
| sections | jsx-usage | - | - | - | - |
| showItemIcons | args, jsx-usage | - | true | - | - |
| size | args, jsx-usage | - | md | - | - |
| variant | args, jsx-usage | - | default | - | - |

#### Actions and Event Contracts

1. onAction -> callback; No explicit description in argTypes.
2. onActiveItemChange -> callback; No explicit description in argTypes.
3. onCollapsedChange -> callback; No explicit description in argTypes.
4. onItemSelect -> callback; No explicit description in argTypes.
5. onOpenChange -> callback; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. aria-hidden
2. aria-label

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.32 Skeleton

- Story source file: stories/Skeleton.stories.tsx
- Storybook title: Feedback/Skeleton
- Story exports count: 6
- Props documented from stories: 15
- Callback/action props detected: 4
- Accessibility signals detected in stories: 4
- Canonical API section: docs/keytuno-ui-react.md -> ### Skeleton

#### Story Exports

1. Avatar
2. CardSkeleton
3. Text
4. Form
5. Table
6. SkeletonPlayground

#### Imported Keytuno Components in Story File

1. Badge
2. Card
3. CardContent
4. CardHeader
5. CardTitle
6. Field
7. FieldContent
8. FieldDescription
9. FieldGroup
10. FieldLabel
11. Skeleton

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| animated | argTypes, args, jsx-usage | boolean | true | - | - |
| children | argTypes, table-disabled | - | - | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| decorative | argTypes, args, jsx-usage | boolean | true | - | - |
| height | argTypes, args, jsx-usage | text | 1rem | - | - |
| key | jsx-usage | - | - | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onBlur | argTypes, jsx-usage | - | - | - | action: blur |
| onClick | argTypes, jsx-usage | - | - | - | action: click |
| onFocus | argTypes, jsx-usage | - | - | - | action: focus |
| radius | argTypes, args, jsx-usage | select | md | full, lg, md, none, sm | - |
| style | argTypes, jsx-usage, table-disabled | - | - | - | - |
| tabIndex | jsx-usage | - | - | - | - |
| width | argTypes, args, jsx-usage | text | 100% | - | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onBlur -> blur; No explicit description in argTypes.
3. onClick -> click; No explicit description in argTypes.
4. onFocus -> focus; No explicit description in argTypes.

#### Accessibility Coverage

1. Prop: tabIndex

Accessibility tokens/signals found in story code:
1. focus
2. onBlur
3. onFocus
4. tabIndex

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.33 Slider

- Story source file: stories/Slider.stories.tsx
- Storybook title: Forms/Slider
- Story exports count: 10
- Props documented from stories: 22
- Callback/action props detected: 2
- Accessibility signals detected in stories: 2
- Canonical API section: docs/keytuno-ui-react.md -> ### Slider

#### Story Exports

1. Basic
2. Range
3. MultipleThumbs
4. Vertical
5. Controlled
6. Disabled
7. Size
8. Labels
9. SliderPlayground
10. BasicSliderPlayground

#### Imported Keytuno Components in Story File

1. Card
2. CardContent
3. Field
4. FieldContent
5. FieldDescription
6. FieldGroup
7. FieldLabel
8. Slider

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| className | argTypes, table-disabled | - | - | - | - |
| defaultValue | argTypes, jsx-usage, table-disabled | - | - | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| formatValueLabel | argTypes, table-disabled | - | - | - | - |
| id | jsx-usage | - | - | - | - |
| key | jsx-usage | - | - | - | - |
| max | argTypes, args, jsx-usage | number | 100 | - | - |
| maxLabel | argTypes, args, jsx-usage | text | - | - | - |
| min | argTypes, args, jsx-usage | number | 0 | - | - |
| minLabel | argTypes, args, jsx-usage | text | - | - | - |
| minStepsBetweenThumbs | argTypes, args, jsx-usage, table-disabled | number | 5 | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onValueChange | argTypes, jsx-usage | - | - | - | action: value-change |
| orientation | argTypes, args, jsx-usage | inline-radio | horizontal, vertical | horizontal, vertical | - |
| required | argTypes, args, jsx-usage | boolean | false | - | - |
| showLabels | argTypes, args, jsx-usage | boolean | true | - | - |
| showValueLabel | argTypes, args, jsx-usage | boolean | false | - | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| step | argTypes, args, jsx-usage | number | 1 | - | - |
| style | argTypes, table-disabled | - | - | - | - |
| value | argTypes, jsx-usage, table-disabled | - | - | - | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onValueChange -> value-change; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. htmlFor
2. keyboard

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.34 Spinner

- Story source file: stories/Spinner.stories.tsx
- Storybook title: Feedback/Spinner
- Story exports count: 2
- Props documented from stories: 12
- Callback/action props detected: 4
- Accessibility signals detected in stories: 4
- Canonical API section: docs/keytuno-ui-react.md -> ### Spinner

#### Story Exports

1. SpinnerSizes
2. SpinnerPlayground

#### Imported Keytuno Components in Story File

1. Spinner

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| children | argTypes, table-disabled | - | - | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| decorative | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onBlur | argTypes, jsx-usage | - | - | - | action: blur |
| onClick | argTypes, jsx-usage | - | - | - | action: click |
| onFocus | argTypes, jsx-usage | - | - | - | action: focus |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| tabIndex | jsx-usage | - | - | - | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onBlur -> blur; No explicit description in argTypes.
3. onClick -> click; No explicit description in argTypes.
4. onFocus -> focus; No explicit description in argTypes.

#### Accessibility Coverage

1. Prop: tabIndex

Accessibility tokens/signals found in story code:
1. focus
2. onBlur
3. onFocus
4. tabIndex

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.35 Stepper

- Story source file: stories/Stepper.stories.tsx
- Storybook title: Navigation/Stepper
- Story exports count: 10
- Props documented from stories: 37
- Callback/action props detected: 5
- Accessibility signals detected in stories: 2
- Canonical API section: docs/keytuno-ui-react.md -> ### Stepper

#### Story Exports

1. VerticalDefault
2. HorizontalVariant
3. CompactVariants
4. CollapsibleAndDisabled
5. WithSubstepsAndIcons
6. DisabledToggleNoLocks
7. ControlsModes
8. ControlledStateFromProps
9. StepperActions
10. StepperPlayground

#### Imported Keytuno Components in Story File

1. Button
2. Field
3. FieldContent
4. FieldDescription
5. FieldGroup
6. FieldLabel
7. Stepper
8. StepperActionContext
9. StepperProps
10. StepperStep

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| activeStepId | argTypes, jsx-usage, table-disabled | - | - | - | - |
| allowMultipleOpen | argTypes, args, jsx-usage | boolean | false | - | - |
| args | jsx-usage | - | - | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| collapsible | argTypes, args, jsx-usage | boolean | true | - | - |
| controlMode | argTypes, args | inline-radio | default | default, only-icons, with-icons, without-icons | - |
| controls | argTypes, jsx-usage, table-disabled | - | - | - | - |
| dataset | argTypes, args | inline-radio | basic | basic, disabled, with-substeps | - |
| defaultActiveStepId | argTypes, args, jsx-usage | text | identity | - | - |
| defaultOpenStepIds | argTypes, jsx-usage | object | - | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| hideNextWhenLastStep | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| onAction | argTypes, args, jsx-usage | - | undefined | - | action: action |
| onActiveStepChange | argTypes, args, jsx-usage | - | undefined | - | action: active-step-change |
| onActiveSubstepChange | argTypes, args, jsx-usage | - | undefined | - | action: active-substep-change |
| onOpenStepIdsChange | argTypes, args, jsx-usage | - | undefined | - | action: open-step-ids-change |
| onSubmit | argTypes, args, jsx-usage | - | undefined | - | action: submit |
| openStepIds | argTypes, jsx-usage, table-disabled | - | - | - | - |
| showControls | argTypes, args, jsx-usage | boolean | true | - | - |
| showControlsInside | argTypes, args, jsx-usage | boolean | false | - | - |
| showControlsOutside | argTypes, args, jsx-usage | boolean | true | - | - |
| showDescriptions | argTypes, args, jsx-usage | boolean | true | - | - |
| showDisabledSteps | argTypes, args, jsx-usage | boolean | true | - | - |
| showDisabledSubsteps | argTypes, args, jsx-usage | boolean | true | - | - |
| showIndicators | argTypes, args, jsx-usage | boolean | true | - | - |
| showNext | argTypes, args, jsx-usage | boolean | true | - | - |
| showPrevious | argTypes, args, jsx-usage | boolean | true | - | - |
| showShortDescriptions | argTypes, args, jsx-usage | boolean | true | - | - |
| showStepNumbers | argTypes, args, jsx-usage | boolean | true | - | - |
| showSubmit | argTypes, args, jsx-usage | boolean | true | - | - |
| showSubsteps | argTypes, args, jsx-usage | boolean | true | - | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| steps | argTypes, jsx-usage, table-disabled | - | - | - | - |
| style | argTypes, table-disabled | - | - | - | - |
| submitOnLastStep | argTypes, args, jsx-usage | boolean | true | - | - |
| variant | argTypes, args, jsx-usage | inline-radio | vertical | compact-horizontal, compact-vertical, horizontal, vertical | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onActiveStepChange -> active-step-change; No explicit description in argTypes.
3. onActiveSubstepChange -> active-substep-change; No explicit description in argTypes.
4. onOpenStepIdsChange -> open-step-ids-change; No explicit description in argTypes.
5. onSubmit -> submit; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. aria-hidden
2. keyboard

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.36 Switch

- Story source file: stories/Switch.stories.tsx
- Storybook title: Actions/Switch
- Story exports count: 7
- Props documented from stories: 19
- Callback/action props detected: 5
- Accessibility signals detected in stories: 5
- Canonical API section: docs/keytuno-ui-react.md -> ### Switch

#### Story Exports

1. Basic
2. Description
3. ChoiceCard
4. Disabled
5. Invalid
6. Size
7. SwitchPlayground

#### Imported Keytuno Components in Story File

1. Card
2. CardContent
3. Field
4. FieldContent
5. FieldDescription
6. FieldError
7. FieldGroup
8. FieldLabel
9. Switch

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| aria-label | jsx-usage | - | - | - | - |
| checked | argTypes, jsx-usage, table-disabled | - | - | - | - |
| children | argTypes, args | text | Switch Label | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| defaultChecked | argTypes, args, jsx-usage | boolean | false | - | - |
| description | argTypes, args, jsx-usage | text | Optional helper text for this switch. | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| id | jsx-usage | - | - | - | - |
| invalid | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onBlur | argTypes, jsx-usage | - | - | - | action: blur |
| onChange | argTypes, jsx-usage | - | - | - | action: change |
| onCheckedChange | argTypes, jsx-usage | - | - | - | action: checked-change |
| onFocus | argTypes, jsx-usage | - | - | - | action: focus |
| orientation | argTypes, args, jsx-usage | inline-radio | horizontal | horizontal, vertical | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onBlur -> blur; No explicit description in argTypes.
3. onChange -> change; No explicit description in argTypes.
4. onCheckedChange -> checked-change; No explicit description in argTypes.
5. onFocus -> focus; No explicit description in argTypes.

#### Accessibility Coverage

1. Prop: aria-label

Accessibility tokens/signals found in story code:
1. aria-label
2. focus
3. htmlFor
4. onBlur
5. onFocus

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.37 Table

- Story source file: stories/Table.stories.tsx
- Storybook title: Data/Table
- Story exports count: 3
- Props documented from stories: 18
- Callback/action props detected: 1
- Accessibility signals detected in stories: 0
- Canonical API section: docs/keytuno-ui-react.md -> ### Table

#### Story Exports

1. Basic
2. ToolbarComposedSwitch
3. TablePlayground

#### Imported Keytuno Components in Story File

1. AdaptiveCard
2. DataToolbar
3. Table
4. AdaptiveCardAction
5. AdaptiveCardFieldSchema
6. AdvanceFilterColumn
7. RowAction
8. TableColumnDef
9. TableProps

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| bordered | jsx-usage | - | - | - | - |
| columns | jsx-usage | - | - | - | - |
| compact | args | - | false | - | - |
| data | jsx-usage | - | - | - | - |
| hoverable | jsx-usage | - | - | - | - |
| rounded | args, jsx-usage | - | false | - | - |
| rowActions | jsx-usage | - | - | - | - |
| showToolbar | jsx-usage | - | - | - | - |
| size | args, jsx-usage | - | sm | - | - |
| paginationDefaultPageSize | args | number | 12 | - | - |
| paginationMaxVisiblePages | args | number | 5 | - | - |
| paginationPageSizeOptions | args | object | [array] | - | - |
| paginationResetPageOnPageSizeChange | args | boolean | true | - | - |
| paginationShowPageSizeSelector | args | boolean | true | - | - |
| paginationShowShowingPage | args | boolean | true | - | - |
| paginationShowSummary | args | boolean | true | - | - |
| paginationVariant | args | select | advance | advance, basic, compact | - |
| variant | jsx-usage | - | - | - | - |

#### Actions and Event Contracts

1. onAction -> table-action; Triggered from row action interactions in table mode.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.
5. Prefer composed data shells with `DataToolbar` on top and `Table` middle section with `showToolbar={false}`.

### 2.38 Tabs

- Story source file: stories/Tabs.stories.tsx
- Storybook title: Navigation/Tabs
- Story exports count: 5
- Props documented from stories: 14
- Callback/action props detected: 2
- Accessibility signals detected in stories: 2
- Canonical API section: docs/keytuno-ui-react.md -> ### Tabs

#### Story Exports

1. Basic
2. Variants
3. OrientationAndSide
4. WithoutIcons
5. TabsPlayground

#### Imported Keytuno Components in Story File

1. Badge
2. Button
3. Card
4. CardContent
5. Field
6. FieldContent
7. FieldDescription
8. FieldGroup
9. FieldLabel
10. Tabs
11. TabsItem

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| className | argTypes, table-disabled | - | - | - | - |
| defaultValue | argTypes, args, jsx-usage | select | overview | activity, overview, performance, settings | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| items | argTypes, jsx-usage, table-disabled | - | - | - | - |
| key | jsx-usage | - | - | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onValueChange | argTypes, jsx-usage | - | - | - | action: value-change |
| orientation | argTypes, args, jsx-usage | inline-radio | horizontal | horizontal, vertical | - |
| side | argTypes, args, jsx-usage | select | top | bottom, left, right, top | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| value | argTypes, table-disabled | - | - | - | - |
| variant | argTypes, args, jsx-usage | select | line | button, line, only icon | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onValueChange -> value-change; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. aria-hidden
2. htmlFor

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.39 Textarea

- Story source file: stories/Textarea.stories.tsx
- Storybook title: Forms/Textarea
- Story exports count: 5
- Props documented from stories: 17
- Callback/action props detected: 4
- Accessibility signals detected in stories: 4
- Canonical API section: docs/keytuno-ui-react.md -> ### Textarea

#### Story Exports

1. Basic
2. Sizes
3. Disabled
4. Invalid
5. TextareaPlayground

#### Imported Keytuno Components in Story File

1. Field
2. FieldContent
3. FieldDescription
4. FieldError
5. FieldGroup
6. FieldLabel
7. Textarea

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| className | argTypes, table-disabled | - | - | - | - |
| defaultValue | argTypes, jsx-usage, table-disabled | - | - | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| id | jsx-usage | - | - | - | - |
| invalid | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onBlur | argTypes, jsx-usage | - | - | - | action: blur |
| onChange | argTypes, jsx-usage | - | - | - | action: change |
| onFocus | argTypes, jsx-usage | - | - | - | action: focus |
| placeholder | argTypes, args, jsx-usage | text | Write details here... | - | - |
| required | argTypes, args, jsx-usage | boolean | false | - | - |
| rows | argTypes, args, jsx-usage | number | 4 | - | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| value | argTypes, table-disabled | - | - | - | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onBlur -> blur; No explicit description in argTypes.
3. onChange -> change; No explicit description in argTypes.
4. onFocus -> focus; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. focus
2. htmlFor
3. onBlur
4. onFocus

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.40 Theme

- Story source file: stories/Theme.stories.tsx
- Storybook title: Themes/Overview
- Story exports count: 1
- Props documented from stories: 0
- Callback/action props detected: 0
- Accessibility signals detected in stories: 0
- Canonical API section: No direct heading match found in docs/keytuno-ui-react.md

#### Story Exports

1. ThemeTokens

#### Imported Keytuno Components in Story File

1. Badge
2. Card
3. CardContent
4. CardDescription
5. CardHeader
6. CardTitle
7. themeNames
8. themeSubthemeModes

#### Props and Controls Matrix

No props were explicitly discovered via `argTypes`, `args`, or primary-component JSX usage in this story file.

#### Actions and Event Contracts

1. No callback/action props were explicitly detected for this story file.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.41 TimezonePicker

- Story source file: stories/TimezonePicker.stories.tsx
- Storybook title: Forms/TimezonePicker
- Story exports count: 9
- Props documented from stories: 22
- Callback/action props detected: 2
- Accessibility signals detected in stories: 3
- Canonical API section: docs/keytuno-ui-react.md -> ### TimezonePicker

#### Story Exports

1. Basic
2. WithSystemTimezone
3. WithoutSystemTimezone
4. Variants
5. Sizes
6. Accessibility
7. TimezonePickerActions
8. TimezonePickerPlayground
9. CompactTimezonePlayground

#### Imported Keytuno Components in Story File

1. Field
2. FieldContent
3. FieldDescription
4. FieldError
5. FieldLabel
6. TimezonePicker
7. TimezonePickerActionContext
8. TimezonePickerProps

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| aria-describedby | jsx-usage | - | - | - | - |
| aria-label | jsx-usage | - | - | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| defaultValue | argTypes, jsx-usage, table-disabled | - | - | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| emptyText | argTypes, args, jsx-usage | text | No timezone found. | - | - |
| includeSystemTimezone | argTypes, args, jsx-usage | boolean | false, true | - | - |
| invalid | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onValueChange | argTypes, jsx-usage | - | - | - | action: value-change |
| placeholder | argTypes, args, jsx-usage | text | Select timezone | - | - |
| preferredTimezones | argTypes, jsx-usage, table-disabled | - | - | - | - |
| required | argTypes, args, jsx-usage | boolean | false | - | - |
| selectVariant | argTypes, args, jsx-usage | inline-radio | inline | inline, overlay | Variant forwarded to underlying Select. |
| searchPlaceholder | argTypes, args, jsx-usage | text | Search timezone... | - | - |
| showClear | argTypes, args, jsx-usage | boolean | true | - | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, jsx-usage, table-disabled | - | - | - | - |
| timezones | argTypes, jsx-usage, table-disabled | - | - | - | - |
| value | argTypes, jsx-usage, table-disabled | - | - | - | - |
| variant | argTypes, args, jsx-usage | inline-radio | compact, detailed | compact, detailed | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onValueChange -> value-change; No explicit description in argTypes.

#### Accessibility Coverage

1. Prop: aria-describedby
2. Prop: aria-label

Accessibility tokens/signals found in story code:
1. aria-describedby
2. aria-label
3. keyboard

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.42 Toast

- Story source file: stories/Toast.stories.tsx
- Storybook title: Feedback/Toast
- Story exports count: 4
- Props documented from stories: 14
- Callback/action props detected: 2
- Accessibility signals detected in stories: 1
- Canonical API section: docs/keytuno-ui-react.md -> ### Toast

#### Story Exports

1. ToastVariants
2. ToastSizes
3. ToastPlayground
4. ToastControlledPlayground

#### Imported Keytuno Components in Story File

1. Button
2. Field
3. FieldContent
4. FieldDescription
5. FieldLabel
6. Toast
7. ToastActionContext
8. ToastSize
9. ToastVariant

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| bottomOffset | argTypes, args, jsx-usage | number | 20 | - | - |
| children | argTypes, table-disabled | - | - | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| contentStyle | argTypes, table-disabled | - | - | - | - |
| defaultOpen | argTypes, jsx-usage, table-disabled | - | - | - | - |
| duration | argTypes, args, jsx-usage | number | 0, 1800 | - | - |
| key | jsx-usage | - | - | - | - |
| message | argTypes, args | text | Controlled toast is visible., Saved successfully. | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onOpenChange | argTypes, jsx-usage | - | - | - | action: open-change |
| open | argTypes, args, jsx-usage, table-disabled | boolean | true | - | - |
| size | argTypes, args, jsx-usage | select | sm | - | - |
| style | argTypes, table-disabled | - | - | - | - |
| variant | argTypes, args, jsx-usage | select | default, success | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onOpenChange -> open-change; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. htmlFor

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.43 Toggle

- Story source file: stories/Toggle.stories.tsx
- Storybook title: Actions/Toggle
- Story exports count: 4
- Props documented from stories: 18
- Callback/action props detected: 5
- Accessibility signals detected in stories: 5
- Canonical API section: docs/keytuno-ui-react.md -> ### Toggle

#### Story Exports

1. Basic
2. Controlled
3. SizesAndVariants
4. TogglePlayground

#### Imported Keytuno Components in Story File

1. Field
2. FieldContent
3. FieldDescription
4. FieldGroup
5. FieldLabel
6. Toggle

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| children | argTypes, args | text | Toggle Action | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| defaultPressed | argTypes, args, jsx-usage | boolean | false | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| fillIconOnPressed | argTypes, args, jsx-usage | boolean | true | - | - |
| id | jsx-usage | - | - | - | - |
| key | jsx-usage | - | - | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onBlur | argTypes, jsx-usage | - | - | - | action: blur |
| onClick | argTypes, jsx-usage | - | - | - | action: click |
| onFocus | argTypes, jsx-usage | - | - | - | action: focus |
| onPressedChange | argTypes, jsx-usage | - | - | - | action: pressed-change |
| pressed | argTypes, jsx-usage, table-disabled | - | - | - | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| type | argTypes, args, jsx-usage | select | button | button, reset, submit | - |
| variant | argTypes, args, jsx-usage | select | outline | destructive, ghost, link, outline, primary, secondary | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onBlur -> blur; No explicit description in argTypes.
3. onClick -> click; No explicit description in argTypes.
4. onFocus -> focus; No explicit description in argTypes.
5. onPressedChange -> pressed-change; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. aria-hidden
2. focus
3. htmlFor
4. onBlur
5. onFocus

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.44 Tooltip

- Story source file: stories/Tooltip.stories.tsx
- Storybook title: Feedback/Tooltip
- Story exports count: 5
- Props documented from stories: 16
- Callback/action props detected: 5
- Accessibility signals detected in stories: 6
- Canonical API section: docs/keytuno-ui-react.md -> ### Tooltip

#### Story Exports

1. Basic
2. Sizes
3. Sides
4. WithField
5. TooltipPlayground

#### Imported Keytuno Components in Story File

1. Button
2. Field
3. FieldContent
4. FieldDescription
5. FieldGroup
6. FieldLabel
7. Input
8. Tooltip

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| children | argTypes, table-disabled | - | - | - | - |
| className | argTypes, table-disabled | - | - | - | - |
| closeDelay | argTypes, args, jsx-usage | number | 70 | - | - |
| disabled | argTypes, args, jsx-usage | boolean | false | - | - |
| key | jsx-usage | - | - | - | - |
| label | argTypes, args, jsx-usage | text | Tooltip message appears near trigger. | - | - |
| onAction | argTypes, jsx-usage | - | - | - | action: action |
| onBlur | argTypes, jsx-usage | - | - | - | action: blur |
| onFocus | argTypes, jsx-usage | - | - | - | action: focus |
| onMouseEnter | argTypes, jsx-usage | - | - | - | action: mouse-enter |
| onMouseLeave | argTypes, jsx-usage | - | - | - | action: mouse-leave |
| openDelay | argTypes, args, jsx-usage | number | 120 | - | - |
| side | argTypes, args, jsx-usage | select | auto | auto, bottom, left, right, top | - |
| size | argTypes, args, jsx-usage | select | md | lg, md, sm, xs | - |
| style | argTypes, table-disabled | - | - | - | - |
| withAction | argTypes, args | boolean | false | - | - |

#### Actions and Event Contracts

1. onAction -> action; No explicit description in argTypes.
2. onBlur -> blur; No explicit description in argTypes.
3. onFocus -> focus; No explicit description in argTypes.
4. onMouseEnter -> mouse-enter; No explicit description in argTypes.
5. onMouseLeave -> mouse-leave; No explicit description in argTypes.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. aria-label
2. focus
3. htmlFor
4. keyboard
5. onBlur
6. onFocus

#### Implementation Guidance for Future Projects

1. Start from this component's props matrix and action contract list when wiring app screens.
2. Keep icon-only controls paired with accessible naming (`aria-label` or equivalent label props).
3. Preserve callback prop signatures from story controls (`on*` props) for predictable integration.
4. Cross-check final production props with canonical API docs before release.

### 2.45 AdaptiveCard

- Story source file: stories/AdaptiveCard.stories.tsx
- Storybook title: Data/AdaptiveCard
- Story exports count: 5
- Props documented from stories: 29
- Callback/action props detected: 1
- Accessibility signals detected in stories: 0
- Canonical API section: docs/keytuno-ui-react.md -> ### AdaptiveCard

#### Story Exports

1. Basic
2. ToolbarComposedLayout
3. VirtualizedOneColumn
4. ActionPositionMatrix
5. AdaptiveCardPlayground

#### Imported Keytuno Components in Story File

1. AdaptiveCard
2. DataToolbar
3. Table
4. AdaptiveCardAction
5. AdaptiveCardFieldSchema
6. AdvanceFilterColumn
7. TableColumnDef

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| actionAlignment | argTypes, args, jsx-usage | inline-radio | right | left, right | Aligns actions inside the selected action row/section. |
| actionInlineMaxVisible | argTypes, args, jsx-usage | number | 4 | - | Max inline actions before auto/menu fallback. |
| actionLayout | argTypes, args, jsx-usage | inline-radio | own-row, same-row | own-row, same-row | `same-row` anchors actions to one row only (top or bottom based on `actionPlacement`). |
| actionMode | argTypes, args, jsx-usage | select | auto, inline | auto, inline, menu | - |
| actionPlacement | argTypes, args, jsx-usage | inline-radio | bottom, top | top, bottom | Chooses whether the action row is anchored at the top or bottom. |
| actions | argTypes, jsx-usage, table-disabled | - | - | - | - |
| columns | argTypes, args, jsx-usage | object | [object] | - | - |
| data | argTypes, jsx-usage, table-disabled | - | - | - | - |
| insideColumns | argTypes, args, jsx-usage | inline-radio | 2 | 1, 2, 3 | - |
| onAction | argTypes, jsx-usage | - | - | - | action: adaptive-action |
| paginationDefaultPageSize | argTypes, args, jsx-usage | number | 12 | - | - |
| paginationMaxVisiblePages | argTypes, args, jsx-usage | number | 5 | - | - |
| paginationPageSizeOptions | argTypes, args, jsx-usage | object | [array] | - | - |
| paginationResetPageOnPageSizeChange | argTypes, args, jsx-usage | boolean | true | - | - |
| paginationShowPageSizeSelector | argTypes, args, jsx-usage | boolean | true | - | - |
| paginationShowShowingPage | argTypes, args, jsx-usage | boolean | true | - | - |
| paginationShowSummary | argTypes, args, jsx-usage | boolean | true | - | - |
| paginationVariant | argTypes, args, jsx-usage | select | advance | advance, basic, compact | - |
| rowKey | argTypes, jsx-usage, table-disabled | - | - | - | - |
| schema | argTypes, jsx-usage, table-disabled | - | - | - | - |
| showPagination | argTypes, args, jsx-usage | boolean | false, true | - | - |
| showToolbar | argTypes, args, jsx-usage | boolean | false, true | - | - |
| size | argTypes, args, jsx-usage | select | sm | lg, md, sm, xs | - |
| variant | argTypes, args, jsx-usage | select | default | compact, default, ghost | - |
| virtualized | argTypes, args, jsx-usage | boolean | false, true | - | - |
| virtualizedEstimateSize | argTypes, args, jsx-usage | number | 240 | - | - |
| virtualizedMaxHeight | argTypes, args, jsx-usage | text | 38rem | - | - |
| virtualizedOverscan | argTypes, args, jsx-usage | number | 8 | - | - |

#### Actions and Event Contracts

1. onAction -> adaptive-action; Triggered from adaptive-card item actions in the rendered card surface.

#### Accessibility Coverage

1. No explicit accessibility-focused prop names were detected from argTypes/args/primary JSX props.

Accessibility tokens/signals found in story code:
1. None explicitly detected.

#### Implementation Guidance for Future Projects

1. Keep one-card-per-row as the default (`columns={1}`) for enterprise readability.
2. Compose `DataToolbar` externally when you need shared search/filter/switch behavior with table view.
3. Prefer `virtualized` mode for large feeds and keep `columns={1}` in that mode for predictable measurement.
4. Use `ActionPositionMatrix` to validate `top-left`, `top-right`, `bottom-left`, and `bottom-right` combinations for both `same-row` and `own-row`.
5. Reuse action contracts (`onAction`) to keep app integrations consistent across data components.

### 2.46 AdvanceFilter

- Story source file: stories/AdvanceFilter.stories.tsx
- Storybook title: Data/AdvanceFilter
- Story exports count: 4
- Props documented from stories: 32
- Callback/action props detected: 2
- Accessibility signals detected in stories: 1
- Canonical API section: docs/keytuno-ui-react.md -> ### AdvanceFilter

#### Story Exports

1. Basic
2. WithAdaptiveCard
3. ActionsAndAccessibility
4. AdvanceFilterPlayground

#### Imported Keytuno Components in Story File

1. AdvanceFilter
2. AdaptiveCard
3. Card
4. CardContent
5. CardDescription
6. CardHeader
7. CardTitle
8. Field
9. FieldContent
10. FieldDescription
11. FieldLabel

#### Props and Controls Matrix

| Prop | Source(s) | Control / Type | Default(s) in Stories | Options | Description / Notes |
| --- | --- | --- | --- | --- | --- |
| side | argTypes, args, jsx-usage | select | right | left, right, top, bottom | Sheet side where AdvanceFilter opens. |
| controlSize | argTypes, args, jsx-usage | select | sm | xs, sm, md, lg | Shared control size for trigger/rule controls/footer actions. |
| selectVariant | argTypes, args, jsx-usage | inline-radio | inline | inline, overlay | Shared Select variant for filter/sort dropdown controls. |
| showTrigger | argTypes, args, jsx-usage | boolean | true | - | Toggle icon-only trigger rendering. |
| triggerDisabled | argTypes, args, jsx-usage | boolean | false | - | Disables trigger interactions. |
| triggerOpenLabel | argTypes, args, jsx-usage | text | Advance Filter | - | Trigger tooltip/label while closed. |
| triggerCloseLabel | argTypes, args, jsx-usage | text | Close Advance Filter | - | Trigger tooltip/label while open. |
| triggerAriaLabel | argTypes, args, jsx-usage | text | Open advance filter sheet | - | Accessibility label for icon-only trigger. |
| canUseGlobalFilter | argTypes, args, jsx-usage | boolean | true | - | Controls global search field visibility in sheet body. |
| enableSorting | argTypes, args, jsx-usage | boolean | true | - | Controls sort rules section and reset sorting action. |
| title | argTypes, args, jsx-usage | text | Advance Filter | - | Sheet header title. |
| description | argTypes, args, jsx-usage | text | Filter columns with multiple rules and operators | - | Sheet header description. |
| filtersSectionLabel | argTypes, args, jsx-usage | text | Filter rules | - | Filter rules section heading. |
| sortSectionLabel | argTypes, args, jsx-usage | text | Sort rules | - | Sort rules section heading. |
| addFilterLabel | argTypes, args, jsx-usage | text | Add filter | - | Button label for adding a filter rule row. |
| addSortLabel | argTypes, args, jsx-usage | text | Add sort | - | Button label for adding a sort rule row. |
| clearFiltersLabel | argTypes, args, jsx-usage | text | Clear filters | - | Footer clear-filters action label. |
| resetSortingLabel | argTypes, args, jsx-usage | text | Reset filters | - | Footer sorting reset action label. |
| applyFiltersLabel | argTypes, args, jsx-usage | text | Apply filters | - | Footer apply action label. |
| globalFilterLabel | argTypes, args, jsx-usage | text | Global search | - | Field label for global search input. |
| globalFilterPlaceholder | argTypes, args, jsx-usage | text | Search all columns | - | Placeholder text for global search input. |
| ruleValuePlaceholder | argTypes, args, jsx-usage | text | Enter value | - | Placeholder text for filter rule value input. |
| onApply | argTypes, jsx-usage | action | - | - | action: apply \\ Emits normalized filter/sort payload with reason (`apply`, `clear-filters`, `reset-sorting`). |
| onAction | argTypes, jsx-usage | action | - | - | action: action \\ Emits trigger open/close and in-sheet rule/footer interactions. |

#### Actions and Event Contracts

1. onApply -> apply; Fires with normalized `columnFilters`, `sorting`, `globalSearch`, and apply reason.
2. onAction -> action; Fires for open state changes, add/reset rule operations, and footer action events.

#### Accessibility Coverage

1. `triggerAriaLabel` and icon-trigger labeling are exercised in stories.

Accessibility tokens/signals found in story code:
1. aria-label

#### Implementation Guidance for Future Projects

1. Use AdvanceFilter as the canonical icon-trigger + sheet experience for advanced data filtering and sorting.
2. Reuse the same filter token model when wiring server-side APIs (`~`, `^`, `$`, `=`, `!=`, `>`, `>=`, `<`, `<=`).
3. For card/table parity, share `columnFilters`, `sorting`, and `globalSearch` state and pass one onApply reducer.
4. Keep trigger labels short and explicit for repeated instances (example: `Open billing filters`, `Open risk filters`).

## 3. Global Notes for Copilot and Contributors

1. This file is generated from story coverage and captures what stories demonstrate directly.
2. For authoritative full API signatures, cross-reference `docs/keytuno-ui-react.md`.
3. If stories are updated, regenerate this document to keep props/actions/accessibility coverage current.
