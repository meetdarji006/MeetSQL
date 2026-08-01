/**
 * SELECT Diff Validator
 *
 * Compares the student's SELECT result set against the expected result set.
 * Supports both order-sensitive and order-insensitive comparison.
 */

export interface SelectDiffResult {
  pass: boolean;
  message: string;
  expected?: any[];
  actual?: any[];
  columnMismatch?: boolean;
}

/**
 * Compare two result sets for SELECT-type problems.
 */
export function validateSelectDiff(
  studentRows: any[],
  expectedRows: any[],
  studentMeta: any[],
  expectedMeta: any[],
  orderSensitive: boolean
): SelectDiffResult {
  // 1. Compare column structure
  const studentCols = studentMeta.map((m: any) => m.name?.toUpperCase());
  const expectedCols = expectedMeta.map((m: any) => m.name?.toUpperCase());

  if (studentCols.length !== expectedCols.length) {
    return {
      pass: false,
      message: `Column count mismatch: expected ${expectedCols.length} columns, got ${studentCols.length}`,
      columnMismatch: true,
      expected: expectedRows.slice(0, 5),
      actual: studentRows.slice(0, 5),
    };
  }

  for (let i = 0; i < expectedCols.length; i++) {
    if (studentCols[i] !== expectedCols[i]) {
      return {
        pass: false,
        message: `Column name mismatch at position ${i + 1}: expected "${expectedCols[i]}", got "${studentCols[i]}"`,
        columnMismatch: true,
      };
    }
  }

  // 2. Compare row count
  if (studentRows.length !== expectedRows.length) {
    return {
      pass: false,
      message: `Row count mismatch: expected ${expectedRows.length} rows, got ${studentRows.length}`,
      expected: expectedRows.slice(0, 5),
      actual: studentRows.slice(0, 5),
    };
  }

  // 3. Compare rows
  if (orderSensitive) {
    return compareRowsOrdered(studentRows, expectedRows, expectedCols);
  } else {
    return compareRowsUnordered(studentRows, expectedRows, expectedCols);
  }
}

/**
 * Row-by-row ordered comparison.
 */
function compareRowsOrdered(
  studentRows: any[],
  expectedRows: any[],
  columns: string[]
): SelectDiffResult {
  for (let i = 0; i < expectedRows.length; i++) {
    const diff = compareRow(studentRows[i], expectedRows[i], columns);
    if (diff) {
      return {
        pass: false,
        message: `Row ${i + 1} mismatch: ${diff}`,
        expected: expectedRows.slice(i, i + 3),
        actual: studentRows.slice(i, i + 3),
      };
    }
  }

  return { pass: true, message: "All rows match (order-sensitive)" };
}

/**
 * Unordered comparison: sort both sets, then compare.
 */
function compareRowsUnordered(
  studentRows: any[],
  expectedRows: any[],
  columns: string[]
): SelectDiffResult {
  const sortedStudent = [...studentRows].sort((a, b) =>
    rowSortKey(a, columns).localeCompare(rowSortKey(b, columns))
  );
  const sortedExpected = [...expectedRows].sort((a, b) =>
    rowSortKey(a, columns).localeCompare(rowSortKey(b, columns))
  );

  for (let i = 0; i < sortedExpected.length; i++) {
    const diff = compareRow(sortedStudent[i], sortedExpected[i], columns);
    if (diff) {
      return {
        pass: false,
        message: `Data mismatch (after sorting): ${diff}`,
        expected: sortedExpected.slice(0, 5),
        actual: sortedStudent.slice(0, 5),
      };
    }
  }

  return { pass: true, message: "All rows match (order-insensitive)" };
}

/**
 * Compare two individual rows.
 */
function compareRow(
  studentRow: any,
  expectedRow: any,
  columns: string[]
): string | null {
  for (const col of columns) {
    const studentVal = normalizeValue(studentRow[col]);
    const expectedVal = normalizeValue(expectedRow[col]);

    if (studentVal !== expectedVal) {
      return `column "${col}": expected "${expectedVal}", got "${studentVal}"`;
    }
  }
  return null;
}

/**
 * Normalize a value for comparison (handle nulls, dates, numbers).
 */
function normalizeValue(val: any): string {
  if (val === null || val === undefined) return "NULL";
  if (val instanceof Date) return val.toISOString();
  if (typeof val === "number") return String(val);
  return String(val).trim();
}

/**
 * Generate a sort key for a row (used for unordered comparison).
 */
function rowSortKey(row: any, columns: string[]): string {
  return columns.map((col) => normalizeValue(row[col])).join("|");
}
