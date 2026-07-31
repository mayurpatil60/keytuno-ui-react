import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AdvanceFilter, type AdvanceFilterColumn } from "./AdvanceFilter";

const columns: AdvanceFilterColumn[] = [
  { id: "symbol", label: "Symbol" },
  { id: "status", label: "Status" },
  { id: "price", label: "Price" },
];

function renderAdvanceFilter(): void {
  render(
    <AdvanceFilter
      showTrigger={false}
      defaultOpen
      columns={columns}
      columnFilters={[]}
      sorting={[]}
      globalSearch=""
      canUseGlobalFilter={false}
      onApply={() => {}}
    />,
  );
}

describe("AdvanceFilter", () => {
  it("removes a newly added filter row", () => {
    renderAdvanceFilter();

    expect(
      screen.getByText("Add a filter row to start filtering."),
    ).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Add filter" }));

    expect(
      screen.queryByText("Add a filter row to start filtering."),
    ).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Remove filter 1" }));

    expect(
      screen.getByText("Add a filter row to start filtering."),
    ).not.toBeNull();
  });

  it("removes a newly added sort row", () => {
    renderAdvanceFilter();

    expect(screen.getByText("Add a sort row to start sorting.")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Add sort" }));

    expect(screen.queryByText("Add a sort row to start sorting.")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Remove sort 1" }));

    expect(screen.getByText("Add a sort row to start sorting.")).not.toBeNull();
  });
});
