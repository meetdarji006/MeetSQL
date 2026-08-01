/**
 * DDL Diff Validator
 *
 * After executing a student's DDL statement(s), queries the Oracle data dictionary
 * and compares the resulting table structure against the expected structure.
 */

export interface StructureDiff {
  category: "column" | "constraint" | "index";
  pass: boolean;
  message: string;
  expected?: any;
  actual?: any;
}

export interface DdlDiffResult {
  pass: boolean;
  message: string;
  structureDiffs: StructureDiff[];
}

interface ExpectedStructure {
  tableName: string;
  columns?: ExpectedColumn[];
  constraints?: ExpectedConstraint[];
  indexes?: ExpectedIndex[];
}

interface ExpectedColumn {
  name: string;
  dataType: string;
  nullable?: string; // "Y" or "N"
  dataLength?: number;
  dataPrecision?: number;
  dataScale?: number;
}

interface ExpectedConstraint {
  type: string; // "P" (PK), "R" (FK), "U" (UNIQUE), "C" (CHECK)
  columns?: string[];
  searchCondition?: string;
}

interface ExpectedIndex {
  columns?: string[];
  uniqueness?: string; // "UNIQUE" or "NONUNIQUE"
}

/**
 * Compare the actual table structure against the expected structure.
 */
export function validateDdlDiff(
  actualColumns: any[],
  actualConstraints: any[],
  actualIndexes: any[],
  expected: ExpectedStructure
): DdlDiffResult {
  const diffs: StructureDiff[] = [];

  // 1. Validate columns
  if (expected.columns) {
    validateColumns(actualColumns, expected.columns, diffs);
  }

  // 2. Validate constraints
  if (expected.constraints) {
    validateConstraints(actualConstraints, expected.constraints, diffs);
  }

  // 3. Validate indexes
  if (expected.indexes) {
    validateIndexes(actualIndexes, expected.indexes, diffs);
  }

  const allPass = diffs.every((d) => d.pass);

  return {
    pass: allPass,
    message: allPass
      ? "Table structure matches expected definition"
      : `Structure mismatches found: ${diffs.filter((d) => !d.pass).length} issue(s)`,
    structureDiffs: diffs,
  };
}

function validateColumns(
  actual: any[],
  expected: ExpectedColumn[],
  diffs: StructureDiff[]
): void {
  // Check all expected columns exist
  for (const exp of expected) {
    const col = actual.find(
      (a) => a.COLUMN_NAME?.toUpperCase() === exp.name.toUpperCase()
    );

    if (!col) {
      diffs.push({
        category: "column",
        pass: false,
        message: `Missing column: "${exp.name}"`,
        expected: exp,
      });
      continue;
    }

    // Check data type
    if (
      exp.dataType &&
      col.DATA_TYPE?.toUpperCase() !== exp.dataType.toUpperCase()
    ) {
      diffs.push({
        category: "column",
        pass: false,
        message: `Column "${exp.name}" type mismatch: expected "${exp.dataType}", got "${col.DATA_TYPE}"`,
        expected: exp.dataType,
        actual: col.DATA_TYPE,
      });
    } else {
      diffs.push({
        category: "column",
        pass: true,
        message: `Column "${exp.name}" type OK: ${col.DATA_TYPE}`,
      });
    }

    // Check nullable
    if (exp.nullable && col.NULLABLE !== exp.nullable) {
      diffs.push({
        category: "column",
        pass: false,
        message: `Column "${exp.name}" nullable mismatch: expected "${exp.nullable}", got "${col.NULLABLE}"`,
        expected: exp.nullable,
        actual: col.NULLABLE,
      });
    }
  }

  // Check no unexpected columns (optional strictness)
  const expectedNames = new Set(expected.map((e) => e.name.toUpperCase()));
  for (const col of actual) {
    if (!expectedNames.has(col.COLUMN_NAME?.toUpperCase())) {
      diffs.push({
        category: "column",
        pass: false,
        message: `Unexpected column: "${col.COLUMN_NAME}"`,
        actual: col,
      });
    }
  }
}

function validateConstraints(
  actual: any[],
  expected: ExpectedConstraint[],
  diffs: StructureDiff[]
): void {
  for (const exp of expected) {
    const matching = actual.filter(
      (a) => a.CONSTRAINT_TYPE === exp.type
    );

    if (matching.length === 0) {
      diffs.push({
        category: "constraint",
        pass: false,
        message: `Missing ${constraintTypeName(exp.type)} constraint`,
        expected: exp,
      });
    } else {
      diffs.push({
        category: "constraint",
        pass: true,
        message: `${constraintTypeName(exp.type)} constraint found`,
      });
    }
  }
}

function validateIndexes(
  actual: any[],
  expected: ExpectedIndex[],
  diffs: StructureDiff[]
): void {
  for (const exp of expected) {
    if (exp.uniqueness) {
      const matching = actual.filter(
        (a) => a.UNIQUENESS?.toUpperCase() === exp.uniqueness?.toUpperCase()
      );

      if (matching.length === 0) {
        diffs.push({
          category: "index",
          pass: false,
          message: `Missing ${exp.uniqueness} index`,
          expected: exp,
        });
      } else {
        diffs.push({
          category: "index",
          pass: true,
          message: `${exp.uniqueness} index found`,
        });
      }
    }
  }
}

function constraintTypeName(type: string): string {
  switch (type) {
    case "P": return "PRIMARY KEY";
    case "R": return "FOREIGN KEY";
    case "U": return "UNIQUE";
    case "C": return "CHECK/NOT NULL";
    default:  return type;
  }
}
