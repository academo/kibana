/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { reportingSchema } from './schema';

const flatten = (source: any, path: string[] = []): Record<string, string> => {
  if (!(source instanceof Object)) {
    return {
      [path.join('.')]: source,
    };
  }
  return Object.keys(source).reduce((result, key) => {
    const flattened = flatten(source[key], [...path, key]);
    return {
      ...result,
      ...flattened,
    };
  }, {});
};

describe('Reporting telemetry schema', () => {
  test('fields', () => {
    expect(flatten(reportingSchema, [])).toMatchInlineSnapshot(`
      Object {
        "PNG.app.canvas workpad.type": "long",
        "PNG.app.dashboard.type": "long",
        "PNG.app.search.type": "long",
        "PNG.app.visualization.type": "long",
        "PNG.available.type": "boolean",
        "PNG.deprecated.type": "long",
        "PNG.metrics.png_cpu.50.0.type": "long",
        "PNG.metrics.png_cpu.75.0.type": "long",
        "PNG.metrics.png_cpu.95.0.type": "long",
        "PNG.metrics.png_cpu.99.0.type": "long",
        "PNG.metrics.png_memory.50.0.type": "long",
        "PNG.metrics.png_memory.75.0.type": "long",
        "PNG.metrics.png_memory.95.0.type": "long",
        "PNG.metrics.png_memory.99.0.type": "long",
        "PNG.output_size.1.0.type": "long",
        "PNG.output_size.25.0.type": "long",
        "PNG.output_size.5.0.type": "long",
        "PNG.output_size.50.0.type": "long",
        "PNG.output_size.75.0.type": "long",
        "PNG.output_size.95.0.type": "long",
        "PNG.output_size.99.0.type": "long",
        "PNG.total.type": "long",
        "PNGV2.app.canvas workpad.type": "long",
        "PNGV2.app.dashboard.type": "long",
        "PNGV2.app.search.type": "long",
        "PNGV2.app.visualization.type": "long",
        "PNGV2.available.type": "boolean",
        "PNGV2.deprecated.type": "long",
        "PNGV2.metrics.png_cpu.50.0.type": "long",
        "PNGV2.metrics.png_cpu.75.0.type": "long",
        "PNGV2.metrics.png_cpu.95.0.type": "long",
        "PNGV2.metrics.png_cpu.99.0.type": "long",
        "PNGV2.metrics.png_memory.50.0.type": "long",
        "PNGV2.metrics.png_memory.75.0.type": "long",
        "PNGV2.metrics.png_memory.95.0.type": "long",
        "PNGV2.metrics.png_memory.99.0.type": "long",
        "PNGV2.output_size.1.0.type": "long",
        "PNGV2.output_size.25.0.type": "long",
        "PNGV2.output_size.5.0.type": "long",
        "PNGV2.output_size.50.0.type": "long",
        "PNGV2.output_size.75.0.type": "long",
        "PNGV2.output_size.95.0.type": "long",
        "PNGV2.output_size.99.0.type": "long",
        "PNGV2.total.type": "long",
        "_all.type": "long",
        "available.type": "boolean",
        "csv_searchsource.app.canvas workpad.type": "long",
        "csv_searchsource.app.dashboard.type": "long",
        "csv_searchsource.app.search.type": "long",
        "csv_searchsource.app.visualization.type": "long",
        "csv_searchsource.available.type": "boolean",
        "csv_searchsource.deprecated.type": "long",
        "csv_searchsource.metrics.csv_rows.50.0.type": "long",
        "csv_searchsource.metrics.csv_rows.75.0.type": "long",
        "csv_searchsource.metrics.csv_rows.95.0.type": "long",
        "csv_searchsource.metrics.csv_rows.99.0.type": "long",
        "csv_searchsource.output_size.1.0.type": "long",
        "csv_searchsource.output_size.25.0.type": "long",
        "csv_searchsource.output_size.5.0.type": "long",
        "csv_searchsource.output_size.50.0.type": "long",
        "csv_searchsource.output_size.75.0.type": "long",
        "csv_searchsource.output_size.95.0.type": "long",
        "csv_searchsource.output_size.99.0.type": "long",
        "csv_searchsource.total.type": "long",
        "csv_searchsource_immediate.app.canvas workpad.type": "long",
        "csv_searchsource_immediate.app.dashboard.type": "long",
        "csv_searchsource_immediate.app.search.type": "long",
        "csv_searchsource_immediate.app.visualization.type": "long",
        "csv_searchsource_immediate.available.type": "boolean",
        "csv_searchsource_immediate.deprecated.type": "long",
        "csv_searchsource_immediate.metrics.csv_rows.50.0.type": "long",
        "csv_searchsource_immediate.metrics.csv_rows.75.0.type": "long",
        "csv_searchsource_immediate.metrics.csv_rows.95.0.type": "long",
        "csv_searchsource_immediate.metrics.csv_rows.99.0.type": "long",
        "csv_searchsource_immediate.output_size.1.0.type": "long",
        "csv_searchsource_immediate.output_size.25.0.type": "long",
        "csv_searchsource_immediate.output_size.5.0.type": "long",
        "csv_searchsource_immediate.output_size.50.0.type": "long",
        "csv_searchsource_immediate.output_size.75.0.type": "long",
        "csv_searchsource_immediate.output_size.95.0.type": "long",
        "csv_searchsource_immediate.output_size.99.0.type": "long",
        "csv_searchsource_immediate.total.type": "long",
        "enabled.type": "boolean",
        "last7Days.PNG.app.canvas workpad.type": "long",
        "last7Days.PNG.app.dashboard.type": "long",
        "last7Days.PNG.app.search.type": "long",
        "last7Days.PNG.app.visualization.type": "long",
        "last7Days.PNG.available.type": "boolean",
        "last7Days.PNG.deprecated.type": "long",
        "last7Days.PNG.metrics.png_cpu.50.0.type": "long",
        "last7Days.PNG.metrics.png_cpu.75.0.type": "long",
        "last7Days.PNG.metrics.png_cpu.95.0.type": "long",
        "last7Days.PNG.metrics.png_cpu.99.0.type": "long",
        "last7Days.PNG.metrics.png_memory.50.0.type": "long",
        "last7Days.PNG.metrics.png_memory.75.0.type": "long",
        "last7Days.PNG.metrics.png_memory.95.0.type": "long",
        "last7Days.PNG.metrics.png_memory.99.0.type": "long",
        "last7Days.PNG.output_size.1.0.type": "long",
        "last7Days.PNG.output_size.25.0.type": "long",
        "last7Days.PNG.output_size.5.0.type": "long",
        "last7Days.PNG.output_size.50.0.type": "long",
        "last7Days.PNG.output_size.75.0.type": "long",
        "last7Days.PNG.output_size.95.0.type": "long",
        "last7Days.PNG.output_size.99.0.type": "long",
        "last7Days.PNG.total.type": "long",
        "last7Days.PNGV2.app.canvas workpad.type": "long",
        "last7Days.PNGV2.app.dashboard.type": "long",
        "last7Days.PNGV2.app.search.type": "long",
        "last7Days.PNGV2.app.visualization.type": "long",
        "last7Days.PNGV2.available.type": "boolean",
        "last7Days.PNGV2.deprecated.type": "long",
        "last7Days.PNGV2.metrics.png_cpu.50.0.type": "long",
        "last7Days.PNGV2.metrics.png_cpu.75.0.type": "long",
        "last7Days.PNGV2.metrics.png_cpu.95.0.type": "long",
        "last7Days.PNGV2.metrics.png_cpu.99.0.type": "long",
        "last7Days.PNGV2.metrics.png_memory.50.0.type": "long",
        "last7Days.PNGV2.metrics.png_memory.75.0.type": "long",
        "last7Days.PNGV2.metrics.png_memory.95.0.type": "long",
        "last7Days.PNGV2.metrics.png_memory.99.0.type": "long",
        "last7Days.PNGV2.output_size.1.0.type": "long",
        "last7Days.PNGV2.output_size.25.0.type": "long",
        "last7Days.PNGV2.output_size.5.0.type": "long",
        "last7Days.PNGV2.output_size.50.0.type": "long",
        "last7Days.PNGV2.output_size.75.0.type": "long",
        "last7Days.PNGV2.output_size.95.0.type": "long",
        "last7Days.PNGV2.output_size.99.0.type": "long",
        "last7Days.PNGV2.total.type": "long",
        "last7Days._all.type": "long",
        "last7Days.csv_searchsource.app.canvas workpad.type": "long",
        "last7Days.csv_searchsource.app.dashboard.type": "long",
        "last7Days.csv_searchsource.app.search.type": "long",
        "last7Days.csv_searchsource.app.visualization.type": "long",
        "last7Days.csv_searchsource.available.type": "boolean",
        "last7Days.csv_searchsource.deprecated.type": "long",
        "last7Days.csv_searchsource.metrics.csv_rows.50.0.type": "long",
        "last7Days.csv_searchsource.metrics.csv_rows.75.0.type": "long",
        "last7Days.csv_searchsource.metrics.csv_rows.95.0.type": "long",
        "last7Days.csv_searchsource.metrics.csv_rows.99.0.type": "long",
        "last7Days.csv_searchsource.output_size.1.0.type": "long",
        "last7Days.csv_searchsource.output_size.25.0.type": "long",
        "last7Days.csv_searchsource.output_size.5.0.type": "long",
        "last7Days.csv_searchsource.output_size.50.0.type": "long",
        "last7Days.csv_searchsource.output_size.75.0.type": "long",
        "last7Days.csv_searchsource.output_size.95.0.type": "long",
        "last7Days.csv_searchsource.output_size.99.0.type": "long",
        "last7Days.csv_searchsource.total.type": "long",
        "last7Days.csv_searchsource_immediate.app.canvas workpad.type": "long",
        "last7Days.csv_searchsource_immediate.app.dashboard.type": "long",
        "last7Days.csv_searchsource_immediate.app.search.type": "long",
        "last7Days.csv_searchsource_immediate.app.visualization.type": "long",
        "last7Days.csv_searchsource_immediate.available.type": "boolean",
        "last7Days.csv_searchsource_immediate.deprecated.type": "long",
        "last7Days.csv_searchsource_immediate.metrics.csv_rows.50.0.type": "long",
        "last7Days.csv_searchsource_immediate.metrics.csv_rows.75.0.type": "long",
        "last7Days.csv_searchsource_immediate.metrics.csv_rows.95.0.type": "long",
        "last7Days.csv_searchsource_immediate.metrics.csv_rows.99.0.type": "long",
        "last7Days.csv_searchsource_immediate.output_size.1.0.type": "long",
        "last7Days.csv_searchsource_immediate.output_size.25.0.type": "long",
        "last7Days.csv_searchsource_immediate.output_size.5.0.type": "long",
        "last7Days.csv_searchsource_immediate.output_size.50.0.type": "long",
        "last7Days.csv_searchsource_immediate.output_size.75.0.type": "long",
        "last7Days.csv_searchsource_immediate.output_size.95.0.type": "long",
        "last7Days.csv_searchsource_immediate.output_size.99.0.type": "long",
        "last7Days.csv_searchsource_immediate.total.type": "long",
        "last7Days.output_size.1.0.type": "long",
        "last7Days.output_size.25.0.type": "long",
        "last7Days.output_size.5.0.type": "long",
        "last7Days.output_size.50.0.type": "long",
        "last7Days.output_size.75.0.type": "long",
        "last7Days.output_size.95.0.type": "long",
        "last7Days.output_size.99.0.type": "long",
        "last7Days.printable_pdf.app.canvas workpad.type": "long",
        "last7Days.printable_pdf.app.dashboard.type": "long",
        "last7Days.printable_pdf.app.search.type": "long",
        "last7Days.printable_pdf.app.visualization.type": "long",
        "last7Days.printable_pdf.available.type": "boolean",
        "last7Days.printable_pdf.deprecated.type": "long",
        "last7Days.printable_pdf.layout.canvas.type": "long",
        "last7Days.printable_pdf.layout.preserve_layout.type": "long",
        "last7Days.printable_pdf.layout.print.type": "long",
        "last7Days.printable_pdf.metrics.pdf_cpu.50.0.type": "long",
        "last7Days.printable_pdf.metrics.pdf_cpu.75.0.type": "long",
        "last7Days.printable_pdf.metrics.pdf_cpu.95.0.type": "long",
        "last7Days.printable_pdf.metrics.pdf_cpu.99.0.type": "long",
        "last7Days.printable_pdf.metrics.pdf_memory.50.0.type": "long",
        "last7Days.printable_pdf.metrics.pdf_memory.75.0.type": "long",
        "last7Days.printable_pdf.metrics.pdf_memory.95.0.type": "long",
        "last7Days.printable_pdf.metrics.pdf_memory.99.0.type": "long",
        "last7Days.printable_pdf.metrics.pdf_pages.50.0.type": "long",
        "last7Days.printable_pdf.metrics.pdf_pages.75.0.type": "long",
        "last7Days.printable_pdf.metrics.pdf_pages.95.0.type": "long",
        "last7Days.printable_pdf.metrics.pdf_pages.99.0.type": "long",
        "last7Days.printable_pdf.output_size.1.0.type": "long",
        "last7Days.printable_pdf.output_size.25.0.type": "long",
        "last7Days.printable_pdf.output_size.5.0.type": "long",
        "last7Days.printable_pdf.output_size.50.0.type": "long",
        "last7Days.printable_pdf.output_size.75.0.type": "long",
        "last7Days.printable_pdf.output_size.95.0.type": "long",
        "last7Days.printable_pdf.output_size.99.0.type": "long",
        "last7Days.printable_pdf.total.type": "long",
        "last7Days.printable_pdf_v2.app.canvas workpad.type": "long",
        "last7Days.printable_pdf_v2.app.dashboard.type": "long",
        "last7Days.printable_pdf_v2.app.search.type": "long",
        "last7Days.printable_pdf_v2.app.visualization.type": "long",
        "last7Days.printable_pdf_v2.available.type": "boolean",
        "last7Days.printable_pdf_v2.deprecated.type": "long",
        "last7Days.printable_pdf_v2.layout.canvas.type": "long",
        "last7Days.printable_pdf_v2.layout.preserve_layout.type": "long",
        "last7Days.printable_pdf_v2.layout.print.type": "long",
        "last7Days.printable_pdf_v2.metrics.pdf_cpu.50.0.type": "long",
        "last7Days.printable_pdf_v2.metrics.pdf_cpu.75.0.type": "long",
        "last7Days.printable_pdf_v2.metrics.pdf_cpu.95.0.type": "long",
        "last7Days.printable_pdf_v2.metrics.pdf_cpu.99.0.type": "long",
        "last7Days.printable_pdf_v2.metrics.pdf_memory.50.0.type": "long",
        "last7Days.printable_pdf_v2.metrics.pdf_memory.75.0.type": "long",
        "last7Days.printable_pdf_v2.metrics.pdf_memory.95.0.type": "long",
        "last7Days.printable_pdf_v2.metrics.pdf_memory.99.0.type": "long",
        "last7Days.printable_pdf_v2.metrics.pdf_pages.50.0.type": "long",
        "last7Days.printable_pdf_v2.metrics.pdf_pages.75.0.type": "long",
        "last7Days.printable_pdf_v2.metrics.pdf_pages.95.0.type": "long",
        "last7Days.printable_pdf_v2.metrics.pdf_pages.99.0.type": "long",
        "last7Days.printable_pdf_v2.output_size.1.0.type": "long",
        "last7Days.printable_pdf_v2.output_size.25.0.type": "long",
        "last7Days.printable_pdf_v2.output_size.5.0.type": "long",
        "last7Days.printable_pdf_v2.output_size.50.0.type": "long",
        "last7Days.printable_pdf_v2.output_size.75.0.type": "long",
        "last7Days.printable_pdf_v2.output_size.95.0.type": "long",
        "last7Days.printable_pdf_v2.output_size.99.0.type": "long",
        "last7Days.printable_pdf_v2.total.type": "long",
        "last7Days.status.completed.type": "long",
        "last7Days.status.completed_with_warnings.type": "long",
        "last7Days.status.failed.type": "long",
        "last7Days.status.pending.type": "long",
        "last7Days.status.processing.type": "long",
        "last7Days.statuses.completed.PNG.canvas workpad.type": "long",
        "last7Days.statuses.completed.PNG.dashboard.type": "long",
        "last7Days.statuses.completed.PNG.search.type": "long",
        "last7Days.statuses.completed.PNG.visualization.type": "long",
        "last7Days.statuses.completed.PNGV2.canvas workpad.type": "long",
        "last7Days.statuses.completed.PNGV2.dashboard.type": "long",
        "last7Days.statuses.completed.PNGV2.search.type": "long",
        "last7Days.statuses.completed.PNGV2.visualization.type": "long",
        "last7Days.statuses.completed.csv_searchsource.canvas workpad.type": "long",
        "last7Days.statuses.completed.csv_searchsource.dashboard.type": "long",
        "last7Days.statuses.completed.csv_searchsource.search.type": "long",
        "last7Days.statuses.completed.csv_searchsource.visualization.type": "long",
        "last7Days.statuses.completed.csv_searchsource_immediate.canvas workpad.type": "long",
        "last7Days.statuses.completed.csv_searchsource_immediate.dashboard.type": "long",
        "last7Days.statuses.completed.csv_searchsource_immediate.search.type": "long",
        "last7Days.statuses.completed.csv_searchsource_immediate.visualization.type": "long",
        "last7Days.statuses.completed.printable_pdf.canvas workpad.type": "long",
        "last7Days.statuses.completed.printable_pdf.dashboard.type": "long",
        "last7Days.statuses.completed.printable_pdf.search.type": "long",
        "last7Days.statuses.completed.printable_pdf.visualization.type": "long",
        "last7Days.statuses.completed.printable_pdf_v2.canvas workpad.type": "long",
        "last7Days.statuses.completed.printable_pdf_v2.dashboard.type": "long",
        "last7Days.statuses.completed.printable_pdf_v2.search.type": "long",
        "last7Days.statuses.completed.printable_pdf_v2.visualization.type": "long",
        "last7Days.statuses.completed_with_warnings.PNG.canvas workpad.type": "long",
        "last7Days.statuses.completed_with_warnings.PNG.dashboard.type": "long",
        "last7Days.statuses.completed_with_warnings.PNG.search.type": "long",
        "last7Days.statuses.completed_with_warnings.PNG.visualization.type": "long",
        "last7Days.statuses.completed_with_warnings.PNGV2.canvas workpad.type": "long",
        "last7Days.statuses.completed_with_warnings.PNGV2.dashboard.type": "long",
        "last7Days.statuses.completed_with_warnings.PNGV2.search.type": "long",
        "last7Days.statuses.completed_with_warnings.PNGV2.visualization.type": "long",
        "last7Days.statuses.completed_with_warnings.csv_searchsource.canvas workpad.type": "long",
        "last7Days.statuses.completed_with_warnings.csv_searchsource.dashboard.type": "long",
        "last7Days.statuses.completed_with_warnings.csv_searchsource.search.type": "long",
        "last7Days.statuses.completed_with_warnings.csv_searchsource.visualization.type": "long",
        "last7Days.statuses.completed_with_warnings.csv_searchsource_immediate.canvas workpad.type": "long",
        "last7Days.statuses.completed_with_warnings.csv_searchsource_immediate.dashboard.type": "long",
        "last7Days.statuses.completed_with_warnings.csv_searchsource_immediate.search.type": "long",
        "last7Days.statuses.completed_with_warnings.csv_searchsource_immediate.visualization.type": "long",
        "last7Days.statuses.completed_with_warnings.printable_pdf.canvas workpad.type": "long",
        "last7Days.statuses.completed_with_warnings.printable_pdf.dashboard.type": "long",
        "last7Days.statuses.completed_with_warnings.printable_pdf.search.type": "long",
        "last7Days.statuses.completed_with_warnings.printable_pdf.visualization.type": "long",
        "last7Days.statuses.completed_with_warnings.printable_pdf_v2.canvas workpad.type": "long",
        "last7Days.statuses.completed_with_warnings.printable_pdf_v2.dashboard.type": "long",
        "last7Days.statuses.completed_with_warnings.printable_pdf_v2.search.type": "long",
        "last7Days.statuses.completed_with_warnings.printable_pdf_v2.visualization.type": "long",
        "last7Days.statuses.failed.PNG.canvas workpad.type": "long",
        "last7Days.statuses.failed.PNG.dashboard.type": "long",
        "last7Days.statuses.failed.PNG.search.type": "long",
        "last7Days.statuses.failed.PNG.visualization.type": "long",
        "last7Days.statuses.failed.PNGV2.canvas workpad.type": "long",
        "last7Days.statuses.failed.PNGV2.dashboard.type": "long",
        "last7Days.statuses.failed.PNGV2.search.type": "long",
        "last7Days.statuses.failed.PNGV2.visualization.type": "long",
        "last7Days.statuses.failed.csv_searchsource.canvas workpad.type": "long",
        "last7Days.statuses.failed.csv_searchsource.dashboard.type": "long",
        "last7Days.statuses.failed.csv_searchsource.search.type": "long",
        "last7Days.statuses.failed.csv_searchsource.visualization.type": "long",
        "last7Days.statuses.failed.csv_searchsource_immediate.canvas workpad.type": "long",
        "last7Days.statuses.failed.csv_searchsource_immediate.dashboard.type": "long",
        "last7Days.statuses.failed.csv_searchsource_immediate.search.type": "long",
        "last7Days.statuses.failed.csv_searchsource_immediate.visualization.type": "long",
        "last7Days.statuses.failed.printable_pdf.canvas workpad.type": "long",
        "last7Days.statuses.failed.printable_pdf.dashboard.type": "long",
        "last7Days.statuses.failed.printable_pdf.search.type": "long",
        "last7Days.statuses.failed.printable_pdf.visualization.type": "long",
        "last7Days.statuses.failed.printable_pdf_v2.canvas workpad.type": "long",
        "last7Days.statuses.failed.printable_pdf_v2.dashboard.type": "long",
        "last7Days.statuses.failed.printable_pdf_v2.search.type": "long",
        "last7Days.statuses.failed.printable_pdf_v2.visualization.type": "long",
        "last7Days.statuses.pending.PNG.canvas workpad.type": "long",
        "last7Days.statuses.pending.PNG.dashboard.type": "long",
        "last7Days.statuses.pending.PNG.search.type": "long",
        "last7Days.statuses.pending.PNG.visualization.type": "long",
        "last7Days.statuses.pending.PNGV2.canvas workpad.type": "long",
        "last7Days.statuses.pending.PNGV2.dashboard.type": "long",
        "last7Days.statuses.pending.PNGV2.search.type": "long",
        "last7Days.statuses.pending.PNGV2.visualization.type": "long",
        "last7Days.statuses.pending.csv_searchsource.canvas workpad.type": "long",
        "last7Days.statuses.pending.csv_searchsource.dashboard.type": "long",
        "last7Days.statuses.pending.csv_searchsource.search.type": "long",
        "last7Days.statuses.pending.csv_searchsource.visualization.type": "long",
        "last7Days.statuses.pending.csv_searchsource_immediate.canvas workpad.type": "long",
        "last7Days.statuses.pending.csv_searchsource_immediate.dashboard.type": "long",
        "last7Days.statuses.pending.csv_searchsource_immediate.search.type": "long",
        "last7Days.statuses.pending.csv_searchsource_immediate.visualization.type": "long",
        "last7Days.statuses.pending.printable_pdf.canvas workpad.type": "long",
        "last7Days.statuses.pending.printable_pdf.dashboard.type": "long",
        "last7Days.statuses.pending.printable_pdf.search.type": "long",
        "last7Days.statuses.pending.printable_pdf.visualization.type": "long",
        "last7Days.statuses.pending.printable_pdf_v2.canvas workpad.type": "long",
        "last7Days.statuses.pending.printable_pdf_v2.dashboard.type": "long",
        "last7Days.statuses.pending.printable_pdf_v2.search.type": "long",
        "last7Days.statuses.pending.printable_pdf_v2.visualization.type": "long",
        "last7Days.statuses.processing.PNG.canvas workpad.type": "long",
        "last7Days.statuses.processing.PNG.dashboard.type": "long",
        "last7Days.statuses.processing.PNG.search.type": "long",
        "last7Days.statuses.processing.PNG.visualization.type": "long",
        "last7Days.statuses.processing.PNGV2.canvas workpad.type": "long",
        "last7Days.statuses.processing.PNGV2.dashboard.type": "long",
        "last7Days.statuses.processing.PNGV2.search.type": "long",
        "last7Days.statuses.processing.PNGV2.visualization.type": "long",
        "last7Days.statuses.processing.csv_searchsource.canvas workpad.type": "long",
        "last7Days.statuses.processing.csv_searchsource.dashboard.type": "long",
        "last7Days.statuses.processing.csv_searchsource.search.type": "long",
        "last7Days.statuses.processing.csv_searchsource.visualization.type": "long",
        "last7Days.statuses.processing.csv_searchsource_immediate.canvas workpad.type": "long",
        "last7Days.statuses.processing.csv_searchsource_immediate.dashboard.type": "long",
        "last7Days.statuses.processing.csv_searchsource_immediate.search.type": "long",
        "last7Days.statuses.processing.csv_searchsource_immediate.visualization.type": "long",
        "last7Days.statuses.processing.printable_pdf.canvas workpad.type": "long",
        "last7Days.statuses.processing.printable_pdf.dashboard.type": "long",
        "last7Days.statuses.processing.printable_pdf.search.type": "long",
        "last7Days.statuses.processing.printable_pdf.visualization.type": "long",
        "last7Days.statuses.processing.printable_pdf_v2.canvas workpad.type": "long",
        "last7Days.statuses.processing.printable_pdf_v2.dashboard.type": "long",
        "last7Days.statuses.processing.printable_pdf_v2.search.type": "long",
        "last7Days.statuses.processing.printable_pdf_v2.visualization.type": "long",
        "output_size.1.0.type": "long",
        "output_size.25.0.type": "long",
        "output_size.5.0.type": "long",
        "output_size.50.0.type": "long",
        "output_size.75.0.type": "long",
        "output_size.95.0.type": "long",
        "output_size.99.0.type": "long",
        "printable_pdf.app.canvas workpad.type": "long",
        "printable_pdf.app.dashboard.type": "long",
        "printable_pdf.app.search.type": "long",
        "printable_pdf.app.visualization.type": "long",
        "printable_pdf.available.type": "boolean",
        "printable_pdf.deprecated.type": "long",
        "printable_pdf.layout.canvas.type": "long",
        "printable_pdf.layout.preserve_layout.type": "long",
        "printable_pdf.layout.print.type": "long",
        "printable_pdf.metrics.pdf_cpu.50.0.type": "long",
        "printable_pdf.metrics.pdf_cpu.75.0.type": "long",
        "printable_pdf.metrics.pdf_cpu.95.0.type": "long",
        "printable_pdf.metrics.pdf_cpu.99.0.type": "long",
        "printable_pdf.metrics.pdf_memory.50.0.type": "long",
        "printable_pdf.metrics.pdf_memory.75.0.type": "long",
        "printable_pdf.metrics.pdf_memory.95.0.type": "long",
        "printable_pdf.metrics.pdf_memory.99.0.type": "long",
        "printable_pdf.metrics.pdf_pages.50.0.type": "long",
        "printable_pdf.metrics.pdf_pages.75.0.type": "long",
        "printable_pdf.metrics.pdf_pages.95.0.type": "long",
        "printable_pdf.metrics.pdf_pages.99.0.type": "long",
        "printable_pdf.output_size.1.0.type": "long",
        "printable_pdf.output_size.25.0.type": "long",
        "printable_pdf.output_size.5.0.type": "long",
        "printable_pdf.output_size.50.0.type": "long",
        "printable_pdf.output_size.75.0.type": "long",
        "printable_pdf.output_size.95.0.type": "long",
        "printable_pdf.output_size.99.0.type": "long",
        "printable_pdf.total.type": "long",
        "printable_pdf_v2.app.canvas workpad.type": "long",
        "printable_pdf_v2.app.dashboard.type": "long",
        "printable_pdf_v2.app.search.type": "long",
        "printable_pdf_v2.app.visualization.type": "long",
        "printable_pdf_v2.available.type": "boolean",
        "printable_pdf_v2.deprecated.type": "long",
        "printable_pdf_v2.layout.canvas.type": "long",
        "printable_pdf_v2.layout.preserve_layout.type": "long",
        "printable_pdf_v2.layout.print.type": "long",
        "printable_pdf_v2.metrics.pdf_cpu.50.0.type": "long",
        "printable_pdf_v2.metrics.pdf_cpu.75.0.type": "long",
        "printable_pdf_v2.metrics.pdf_cpu.95.0.type": "long",
        "printable_pdf_v2.metrics.pdf_cpu.99.0.type": "long",
        "printable_pdf_v2.metrics.pdf_memory.50.0.type": "long",
        "printable_pdf_v2.metrics.pdf_memory.75.0.type": "long",
        "printable_pdf_v2.metrics.pdf_memory.95.0.type": "long",
        "printable_pdf_v2.metrics.pdf_memory.99.0.type": "long",
        "printable_pdf_v2.metrics.pdf_pages.50.0.type": "long",
        "printable_pdf_v2.metrics.pdf_pages.75.0.type": "long",
        "printable_pdf_v2.metrics.pdf_pages.95.0.type": "long",
        "printable_pdf_v2.metrics.pdf_pages.99.0.type": "long",
        "printable_pdf_v2.output_size.1.0.type": "long",
        "printable_pdf_v2.output_size.25.0.type": "long",
        "printable_pdf_v2.output_size.5.0.type": "long",
        "printable_pdf_v2.output_size.50.0.type": "long",
        "printable_pdf_v2.output_size.75.0.type": "long",
        "printable_pdf_v2.output_size.95.0.type": "long",
        "printable_pdf_v2.output_size.99.0.type": "long",
        "printable_pdf_v2.total.type": "long",
        "status.completed.type": "long",
        "status.completed_with_warnings.type": "long",
        "status.failed.type": "long",
        "status.pending.type": "long",
        "status.processing.type": "long",
        "statuses.completed.PNG.canvas workpad.type": "long",
        "statuses.completed.PNG.dashboard.type": "long",
        "statuses.completed.PNG.search.type": "long",
        "statuses.completed.PNG.visualization.type": "long",
        "statuses.completed.PNGV2.canvas workpad.type": "long",
        "statuses.completed.PNGV2.dashboard.type": "long",
        "statuses.completed.PNGV2.search.type": "long",
        "statuses.completed.PNGV2.visualization.type": "long",
        "statuses.completed.csv_searchsource.canvas workpad.type": "long",
        "statuses.completed.csv_searchsource.dashboard.type": "long",
        "statuses.completed.csv_searchsource.search.type": "long",
        "statuses.completed.csv_searchsource.visualization.type": "long",
        "statuses.completed.csv_searchsource_immediate.canvas workpad.type": "long",
        "statuses.completed.csv_searchsource_immediate.dashboard.type": "long",
        "statuses.completed.csv_searchsource_immediate.search.type": "long",
        "statuses.completed.csv_searchsource_immediate.visualization.type": "long",
        "statuses.completed.printable_pdf.canvas workpad.type": "long",
        "statuses.completed.printable_pdf.dashboard.type": "long",
        "statuses.completed.printable_pdf.search.type": "long",
        "statuses.completed.printable_pdf.visualization.type": "long",
        "statuses.completed.printable_pdf_v2.canvas workpad.type": "long",
        "statuses.completed.printable_pdf_v2.dashboard.type": "long",
        "statuses.completed.printable_pdf_v2.search.type": "long",
        "statuses.completed.printable_pdf_v2.visualization.type": "long",
        "statuses.completed_with_warnings.PNG.canvas workpad.type": "long",
        "statuses.completed_with_warnings.PNG.dashboard.type": "long",
        "statuses.completed_with_warnings.PNG.search.type": "long",
        "statuses.completed_with_warnings.PNG.visualization.type": "long",
        "statuses.completed_with_warnings.PNGV2.canvas workpad.type": "long",
        "statuses.completed_with_warnings.PNGV2.dashboard.type": "long",
        "statuses.completed_with_warnings.PNGV2.search.type": "long",
        "statuses.completed_with_warnings.PNGV2.visualization.type": "long",
        "statuses.completed_with_warnings.csv_searchsource.canvas workpad.type": "long",
        "statuses.completed_with_warnings.csv_searchsource.dashboard.type": "long",
        "statuses.completed_with_warnings.csv_searchsource.search.type": "long",
        "statuses.completed_with_warnings.csv_searchsource.visualization.type": "long",
        "statuses.completed_with_warnings.csv_searchsource_immediate.canvas workpad.type": "long",
        "statuses.completed_with_warnings.csv_searchsource_immediate.dashboard.type": "long",
        "statuses.completed_with_warnings.csv_searchsource_immediate.search.type": "long",
        "statuses.completed_with_warnings.csv_searchsource_immediate.visualization.type": "long",
        "statuses.completed_with_warnings.printable_pdf.canvas workpad.type": "long",
        "statuses.completed_with_warnings.printable_pdf.dashboard.type": "long",
        "statuses.completed_with_warnings.printable_pdf.search.type": "long",
        "statuses.completed_with_warnings.printable_pdf.visualization.type": "long",
        "statuses.completed_with_warnings.printable_pdf_v2.canvas workpad.type": "long",
        "statuses.completed_with_warnings.printable_pdf_v2.dashboard.type": "long",
        "statuses.completed_with_warnings.printable_pdf_v2.search.type": "long",
        "statuses.completed_with_warnings.printable_pdf_v2.visualization.type": "long",
        "statuses.failed.PNG.canvas workpad.type": "long",
        "statuses.failed.PNG.dashboard.type": "long",
        "statuses.failed.PNG.search.type": "long",
        "statuses.failed.PNG.visualization.type": "long",
        "statuses.failed.PNGV2.canvas workpad.type": "long",
        "statuses.failed.PNGV2.dashboard.type": "long",
        "statuses.failed.PNGV2.search.type": "long",
        "statuses.failed.PNGV2.visualization.type": "long",
        "statuses.failed.csv_searchsource.canvas workpad.type": "long",
        "statuses.failed.csv_searchsource.dashboard.type": "long",
        "statuses.failed.csv_searchsource.search.type": "long",
        "statuses.failed.csv_searchsource.visualization.type": "long",
        "statuses.failed.csv_searchsource_immediate.canvas workpad.type": "long",
        "statuses.failed.csv_searchsource_immediate.dashboard.type": "long",
        "statuses.failed.csv_searchsource_immediate.search.type": "long",
        "statuses.failed.csv_searchsource_immediate.visualization.type": "long",
        "statuses.failed.printable_pdf.canvas workpad.type": "long",
        "statuses.failed.printable_pdf.dashboard.type": "long",
        "statuses.failed.printable_pdf.search.type": "long",
        "statuses.failed.printable_pdf.visualization.type": "long",
        "statuses.failed.printable_pdf_v2.canvas workpad.type": "long",
        "statuses.failed.printable_pdf_v2.dashboard.type": "long",
        "statuses.failed.printable_pdf_v2.search.type": "long",
        "statuses.failed.printable_pdf_v2.visualization.type": "long",
        "statuses.pending.PNG.canvas workpad.type": "long",
        "statuses.pending.PNG.dashboard.type": "long",
        "statuses.pending.PNG.search.type": "long",
        "statuses.pending.PNG.visualization.type": "long",
        "statuses.pending.PNGV2.canvas workpad.type": "long",
        "statuses.pending.PNGV2.dashboard.type": "long",
        "statuses.pending.PNGV2.search.type": "long",
        "statuses.pending.PNGV2.visualization.type": "long",
        "statuses.pending.csv_searchsource.canvas workpad.type": "long",
        "statuses.pending.csv_searchsource.dashboard.type": "long",
        "statuses.pending.csv_searchsource.search.type": "long",
        "statuses.pending.csv_searchsource.visualization.type": "long",
        "statuses.pending.csv_searchsource_immediate.canvas workpad.type": "long",
        "statuses.pending.csv_searchsource_immediate.dashboard.type": "long",
        "statuses.pending.csv_searchsource_immediate.search.type": "long",
        "statuses.pending.csv_searchsource_immediate.visualization.type": "long",
        "statuses.pending.printable_pdf.canvas workpad.type": "long",
        "statuses.pending.printable_pdf.dashboard.type": "long",
        "statuses.pending.printable_pdf.search.type": "long",
        "statuses.pending.printable_pdf.visualization.type": "long",
        "statuses.pending.printable_pdf_v2.canvas workpad.type": "long",
        "statuses.pending.printable_pdf_v2.dashboard.type": "long",
        "statuses.pending.printable_pdf_v2.search.type": "long",
        "statuses.pending.printable_pdf_v2.visualization.type": "long",
        "statuses.processing.PNG.canvas workpad.type": "long",
        "statuses.processing.PNG.dashboard.type": "long",
        "statuses.processing.PNG.search.type": "long",
        "statuses.processing.PNG.visualization.type": "long",
        "statuses.processing.PNGV2.canvas workpad.type": "long",
        "statuses.processing.PNGV2.dashboard.type": "long",
        "statuses.processing.PNGV2.search.type": "long",
        "statuses.processing.PNGV2.visualization.type": "long",
        "statuses.processing.csv_searchsource.canvas workpad.type": "long",
        "statuses.processing.csv_searchsource.dashboard.type": "long",
        "statuses.processing.csv_searchsource.search.type": "long",
        "statuses.processing.csv_searchsource.visualization.type": "long",
        "statuses.processing.csv_searchsource_immediate.canvas workpad.type": "long",
        "statuses.processing.csv_searchsource_immediate.dashboard.type": "long",
        "statuses.processing.csv_searchsource_immediate.search.type": "long",
        "statuses.processing.csv_searchsource_immediate.visualization.type": "long",
        "statuses.processing.printable_pdf.canvas workpad.type": "long",
        "statuses.processing.printable_pdf.dashboard.type": "long",
        "statuses.processing.printable_pdf.search.type": "long",
        "statuses.processing.printable_pdf.visualization.type": "long",
        "statuses.processing.printable_pdf_v2.canvas workpad.type": "long",
        "statuses.processing.printable_pdf_v2.dashboard.type": "long",
        "statuses.processing.printable_pdf_v2.search.type": "long",
        "statuses.processing.printable_pdf_v2.visualization.type": "long",
      }
    `);
  });
});
