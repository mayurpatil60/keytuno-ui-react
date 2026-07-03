import { fireEvent, render, screen } from "@testing-library/react";

import {
  type UseResponsiveTableCardViewOptions,
  useResponsiveTableCardView,
} from "./useResponsiveTableCardView";

function setViewportWidth(width: number): void {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });
}

function ResponsiveViewProbe(
  options: UseResponsiveTableCardViewOptions,
): JSX.Element {
  const {
    view,
    recommendedView,
    isAutoMode,
    isMobileOrTablet,
    switchToTableView,
    switchToCardView,
    resetToResponsiveDefault,
  } = useResponsiveTableCardView(options);

  return (
    <div>
      <output data-testid="view">{view}</output>
      <output data-testid="recommended">{recommendedView}</output>
      <output data-testid="is-auto">{isAutoMode ? "true" : "false"}</output>
      <output data-testid="is-mobile-or-tablet">
        {isMobileOrTablet ? "true" : "false"}
      </output>

      <button type="button" onClick={switchToTableView}>
        table
      </button>
      <button type="button" onClick={switchToCardView}>
        cards
      </button>
      <button type="button" onClick={resetToResponsiveDefault}>
        reset
      </button>
    </div>
  );
}

describe("useResponsiveTableCardView", () => {
  beforeEach(() => {
    setViewportWidth(1280);
  });

  it("defaults to cards on tablet widths", () => {
    setViewportWidth(900);

    render(<ResponsiveViewProbe />);

    expect(screen.getByTestId("view")).toHaveTextContent("cards");
    expect(screen.getByTestId("recommended")).toHaveTextContent("cards");
    expect(screen.getByTestId("is-mobile-or-tablet")).toHaveTextContent("true");
  });

  it("defaults to table on desktop widths", () => {
    setViewportWidth(1280);

    render(<ResponsiveViewProbe />);

    expect(screen.getByTestId("view")).toHaveTextContent("table");
    expect(screen.getByTestId("recommended")).toHaveTextContent("table");
    expect(screen.getByTestId("is-mobile-or-tablet")).toHaveTextContent(
      "false",
    );
  });

  it("keeps manual selection while resizing", () => {
    setViewportWidth(900);

    render(<ResponsiveViewProbe />);

    fireEvent.click(screen.getByRole("button", { name: "table" }));
    expect(screen.getByTestId("view")).toHaveTextContent("table");
    expect(screen.getByTestId("is-auto")).toHaveTextContent("false");

    setViewportWidth(640);
    fireEvent(window, new Event("resize"));

    expect(screen.getByTestId("recommended")).toHaveTextContent("cards");
    expect(screen.getByTestId("view")).toHaveTextContent("table");
  });

  it("can reset back to responsive default", () => {
    setViewportWidth(760);

    render(<ResponsiveViewProbe />);

    fireEvent.click(screen.getByRole("button", { name: "table" }));
    expect(screen.getByTestId("view")).toHaveTextContent("table");

    fireEvent.click(screen.getByRole("button", { name: "reset" }));

    expect(screen.getByTestId("is-auto")).toHaveTextContent("true");
    expect(screen.getByTestId("view")).toHaveTextContent("cards");
  });

  it("supports custom defaults and breakpoints", () => {
    setViewportWidth(900);

    render(
      <ResponsiveViewProbe
        desktopView="cards"
        mobileTabletView="table"
        breakpoints={{ tablet: 640, web: 1200 }}
      />,
    );

    expect(screen.getByTestId("view")).toHaveTextContent("table");
    expect(screen.getByTestId("recommended")).toHaveTextContent("table");
  });
});
