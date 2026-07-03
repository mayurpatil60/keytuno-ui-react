type TableCardView = "table" | "cards";
interface TableCardResponsiveBreakpoints {
    tablet?: number;
    web?: number;
}
interface UseResponsiveTableCardViewOptions {
    desktopView?: TableCardView;
    mobileTabletView?: TableCardView;
    breakpoints?: TableCardResponsiveBreakpoints;
}
interface UseResponsiveTableCardViewResult {
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
declare const defaultTableCardResponsiveBreakpoints: ResolvedTableCardResponsiveBreakpoints;
declare function useResponsiveTableCardView(options?: UseResponsiveTableCardViewOptions): UseResponsiveTableCardViewResult;

export { type TableCardResponsiveBreakpoints, type TableCardView, type UseResponsiveTableCardViewOptions, type UseResponsiveTableCardViewResult, defaultTableCardResponsiveBreakpoints, useResponsiveTableCardView };
