import { TableExportFormat, TableExportHandler } from '../components/Table.js';
import 'react';
import '@tanstack/react-table';
import '../components/Button.js';
import '../components/Tooltip.js';
import '../components/Pagination.js';

type AddonTableExportFormat = Extract<TableExportFormat, "xlsx" | "pdf">;
type AddonTableExportHandlers = Partial<Record<AddonTableExportFormat, TableExportHandler>>;
declare const exportTableAsXlsx: TableExportHandler;
declare const exportTableAsPdf: TableExportHandler;
declare const tableExportHandlers: AddonTableExportHandlers;
declare function createTableExportHandlers(formats?: AddonTableExportFormat[]): AddonTableExportHandlers;

export { type AddonTableExportHandlers, createTableExportHandlers, exportTableAsPdf, exportTableAsXlsx, tableExportHandlers };
