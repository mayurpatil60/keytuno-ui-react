import type {
  TableExportFormat,
  TableExportHandler,
  TableExportPayload,
} from "../components/Table";

type AddonTableExportFormat = Extract<TableExportFormat, "xlsx" | "pdf">;

export type AddonTableExportHandlers = Partial<
  Record<AddonTableExportFormat, TableExportHandler>
>;

type XlsxLikeModule = {
  utils: {
    json_to_sheet: (records: Record<string, string>[]) => unknown;
    book_new: () => unknown;
    book_append_sheet: (
      workbook: unknown,
      worksheet: unknown,
      name: string,
    ) => void;
  };
  writeFile: (workbook: unknown, fileName: string) => void;
};

type JsPdfLikeModule = {
  jsPDF: new (options: { orientation: "landscape" | "portrait" }) => {
    save: (fileName: string) => void;
  };
};

type AutoTableLikeModule = {
  default: (doc: unknown, options: Record<string, unknown>) => void;
};

function toSheetRows(
  rows: TableExportPayload["rows"],
): Record<string, string>[] {
  return rows.records.map((row) => {
    const record: Record<string, string> = {};

    rows.headers.forEach((header, headerIndex) => {
      record[header] = row[headerIndex] ?? "";
    });

    return record;
  });
}

export const exportTableAsXlsx: TableExportHandler = async ({
  rows,
  fileNameBase,
}): Promise<void> => {
  const xlsxSpecifier = "xlsx";
  const xlsxModule = (await import(xlsxSpecifier)) as XlsxLikeModule;
  const records = toSheetRows(rows);
  const worksheet = xlsxModule.utils.json_to_sheet(records);
  const workbook = xlsxModule.utils.book_new();

  xlsxModule.utils.book_append_sheet(workbook, worksheet, "Table");
  xlsxModule.writeFile(workbook, `${fileNameBase}.xlsx`);
};

export const exportTableAsPdf: TableExportHandler = async ({
  rows,
  fileNameBase,
}): Promise<void> => {
  const jspdfSpecifier = "jspdf";
  const autoTableSpecifier = "jspdf-autotable";

  const [{ jsPDF }, autoTableModule] = (await Promise.all([
    import(jspdfSpecifier),
    import(autoTableSpecifier),
  ])) as [JsPdfLikeModule, AutoTableLikeModule];

  const doc = new jsPDF({ orientation: "landscape" });
  const autoTable = autoTableModule.default;

  autoTable(doc, {
    head: [rows.headers],
    body: rows.records,
    margin: { top: 16, right: 10, bottom: 10, left: 10 },
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
  });

  doc.save(`${fileNameBase}.pdf`);
};

export const tableExportHandlers: AddonTableExportHandlers = {
  xlsx: exportTableAsXlsx,
  pdf: exportTableAsPdf,
};

export function createTableExportHandlers(
  formats: AddonTableExportFormat[] = ["xlsx", "pdf"],
): AddonTableExportHandlers {
  const handlers: AddonTableExportHandlers = {};

  formats.forEach((format) => {
    if (format === "xlsx") {
      handlers.xlsx = exportTableAsXlsx;
      return;
    }

    if (format === "pdf") {
      handlers.pdf = exportTableAsPdf;
    }
  });

  return handlers;
}
