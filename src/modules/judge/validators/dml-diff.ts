/**
 * DML Diff Validator
 *
 * After executing a student's DML (INSERT/UPDATE/DELETE),
 * compares the resulting table data against the expected state.
 */

export interface TableDiff {
  tableName: string;
  pass: boolean;
  message: string;
  expectedRows?: any[];
  actualRows?: any[];
}

export interface DmlDiffResult {
  pass: boolean;
  message: string;
  tableDiffs: TableDiff[];
}

/**
 * Compare table data after DML execution against expected data.
 * @param tables - Array of { tableName, actualRows, expectedRows }
 */
export function validateDmlDiff(
  tables: {
    tableName: string;
    actualRows: any[];
    expectedRows: any[];
  }[]
): DmlDiffResult {
  const tableDiffs: TableDiff[] = [];
  let allPass = true;

  for (const { tableName, actualRows, expectedRows } of tables) {
    const diff = compareTableData(tableName, actualRows, expectedRows);
    tableDiffs.push(diff);
    if (!diff.pass) allPass = false;
  }

  return {
    pass: allPass,
    message: allPass
      ? "All tables match expected state after DML"
      : `Data mismatch in: ${tableDiffs
          .filter((t) => !t.pass)
          .map((t) => t.tableName)
          .join(", ")}`,
    tableDiffs,
  };
}

/**
 * Compare actual vs expected rows for a single table.
 * Uses unordered comparison (sorted by all columns).
 */
function compareTableData(
  tableName: string,
  actualRows: any[],
  expectedRows: any[]
): TableDiff {
  // Row count check
  if (actualRows.length !== expectedRows.length) {
    return {
      tableName,
      pass: false,
      message: `Row count mismatch: expected ${expectedRows.length}, got ${actualRows.length}`,
      expectedRows: expectedRows.slice(0, 5),
      actualRows: actualRows.slice(0, 5),
    };
  }

  if (expectedRows.length === 0) {
    return { tableName, pass: true, message: "Table is correctly empty" };
  }

  // Get column keys from expected rows
  const columns = Object.keys(expectedRows[0]).map((k) => k.toUpperCase());

  // Sort both sets for unordered comparison
  const sortedActual = [...actualRows].sort((a, b) =>
    rowKey(a, columns).localeCompare(rowKey(b, columns))
  );
  const sortedExpected = [...expectedRows].sort((a, b) =>
    rowKey(a, columns).localeCompare(rowKey(b, columns))
  );

  // Compare row by row
  for (let i = 0; i < sortedExpected.length; i++) {
    for (const col of columns) {
      const actual = normalize(sortedActual[i]?.[col]);
      const expected = normalize(sortedExpected[i]?.[col]);

      if (actual !== expected) {
        return {
          tableName,
          pass: false,
          message: `Row ${i + 1}, column "${col}": expected "${expected}", got "${actual}"`,
          expectedRows: sortedExpected.slice(i, i + 3),
          actualRows: sortedActual.slice(i, i + 3),
        };
      }
    }
  }

  return { tableName, pass: true, message: "Table data matches" };
}

function normalize(val: any): string {
  if (val === null || val === undefined) return "NULL";
  if (val instanceof Date) return val.toISOString();
  return String(val).trim();
}

function rowKey(row: any, columns: string[]): string {
  return columns.map((col) => normalize(row[col])).join("|");
}
