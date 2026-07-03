import { useCallback, useEffect, useMemo, useState } from "react";

export type TableCardView = "table" | "cards";

export interface TableCardResponsiveBreakpoints {
  tablet?: number;
  web?: number;
}

export interface UseResponsiveTableCardViewOptions {
  desktopView?: TableCardView;
  mobileTabletView?: TableCardView;
  breakpoints?: TableCardResponsiveBreakpoints;
}

export interface UseResponsiveTableCardViewResult {
  view: TableCardView;
  recommendedView: TableCardView;
  isAutoMode: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isMobileOrTablet: boolean;
  isDesktop: boolean;
  setView: (nextView: TableCardView) => void;
  switchToTableView: () => void;
  switchToCardView: () => void;
  resetToResponsiveDefault: () => void;
}

interface ResolvedTableCardResponsiveBreakpoints {
  tablet: number;
  web: number;
}

export const defaultTableCardResponsiveBreakpoints: ResolvedTableCardResponsiveBreakpoints =
  {
    tablet: 768,
    web: 1024,
  };

function normalizeBreakpoint(
  value: number | undefined,
  fallback: number,
): number {
  if (!(typeof value === "number" && Number.isFinite(value))) {
    return fallback;
  }

  const normalized = Math.floor(value);

  if (normalized <= 0) {
    return fallback;
  }

  return normalized;
}

function resolveBreakpoints(
  breakpoints: TableCardResponsiveBreakpoints | undefined,
): ResolvedTableCardResponsiveBreakpoints {
  const tablet = normalizeBreakpoint(
    breakpoints?.tablet,
    defaultTableCardResponsiveBreakpoints.tablet,
  );
  const webCandidate = normalizeBreakpoint(
    breakpoints?.web,
    defaultTableCardResponsiveBreakpoints.web,
  );

  return {
    tablet,
    web: webCandidate > tablet ? webCandidate : tablet + 1,
  };
}

function getViewportWidth(): number {
  if (typeof window === "undefined") {
    return Number.POSITIVE_INFINITY;
  }

  return window.innerWidth;
}

export function useResponsiveTableCardView(
  options: UseResponsiveTableCardViewOptions = {},
): UseResponsiveTableCardViewResult {
  const {
    desktopView = "table",
    mobileTabletView = "cards",
    breakpoints,
  } = options;

  const resolvedBreakpoints = useMemo(
    () => resolveBreakpoints(breakpoints),
    [breakpoints],
  );

  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    getViewportWidth(),
  );
  const [userSelectedView, setUserSelectedView] =
    useState<TableCardView | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    function updateViewportWidth(): void {
      setViewportWidth(window.innerWidth);
    }

    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);

    return () => {
      window.removeEventListener("resize", updateViewportWidth);
    };
  }, []);

  const isMobile = viewportWidth < resolvedBreakpoints.tablet;
  const isTablet =
    viewportWidth >= resolvedBreakpoints.tablet &&
    viewportWidth < resolvedBreakpoints.web;
  const isMobileOrTablet = viewportWidth < resolvedBreakpoints.web;
  const isDesktop = !isMobileOrTablet;
  const recommendedView = isMobileOrTablet ? mobileTabletView : desktopView;
  const view = userSelectedView ?? recommendedView;

  const setView = useCallback((nextView: TableCardView): void => {
    setUserSelectedView(nextView);
  }, []);

  const switchToTableView = useCallback((): void => {
    setUserSelectedView("table");
  }, []);

  const switchToCardView = useCallback((): void => {
    setUserSelectedView("cards");
  }, []);

  const resetToResponsiveDefault = useCallback((): void => {
    setUserSelectedView(null);
  }, []);

  return {
    view,
    recommendedView,
    isAutoMode: userSelectedView == null,
    isMobile,
    isTablet,
    isMobileOrTablet,
    isDesktop,
    setView,
    switchToTableView,
    switchToCardView,
    resetToResponsiveDefault,
  };
}
