/**
 * Seed Script — Load 35 Comprehensive Oracle SQL Problems (No Syntax Code Snippets) and Badges into PostgreSQL.
 *
 * Covers:
 * - CREATE TABLE (Column-level & Table-level Constraints: PK, FK, NOT NULL, UNIQUE, CHECK, DEFAULT)
 * - ALTER TABLE (ADD, MODIFY, DROP COLUMN, ADD CONSTRAINT)
 * - DROP & TRUNCATE
 * - INSERT (with column list, without column list, subquery insert)
 * - UPDATE & DELETE (WHERE clauses, multi-column update, subquery delete)
 * - SELECT (Filtering, ORDER BY, GROUP BY & HAVING, Inner/Left Joins, Subqueries)
 *
 * Run: npx tsx scripts/seed.ts
 */

import dotenv from "dotenv";
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/db/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// ─── 35 Comprehensive Oracle SQL Problems ──────────────────────────────
const sampleProblems = [
  // =========================================================================
  // GROUP 1: DDL — CREATE TABLE & CONSTRAINTS (8 Problems)
  // =========================================================================

  {
    title: "Create Departments Table",
    slug: "create-departments-table",
    description: `## Problem Description

Create a database table named \`DEPARTMENTS\` to store organizational department records.

### Required Table Specifications

| Column Name | Data Type | Constraints | Explanation |
|:---|:---|:---|:---|
| \`DEPT_ID\` | \`NUMBER\` | \`PRIMARY KEY\` | Unique identifier for each department. Cannot be NULL or duplicated. |
| \`DEPT_NAME\` | \`VARCHAR2(50)\` | \`NOT NULL\`, \`UNIQUE\` | Name of the department. Must be provided and unique across all rows. |
| \`LOCATION\` | \`VARCHAR2(100)\` | *None* | Physical location/building of the department (optional). |

### Key Oracle SQL Concepts
- **PRIMARY KEY**: Uniquely identifies each record in a table. Implies \`NOT NULL\` and \`UNIQUE\`.
- **NOT NULL**: Ensures that a column cannot store NULL values.
- **UNIQUE**: Guarantees that all values in a column are distinct.`,
    difficulty: "easy" as const,
    topicTags: ["ddl", "create-table", "primary-key", "unique", "not-null"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: "SELECT 1 FROM DUAL",
    solutionQuery: `CREATE TABLE DEPARTMENTS (
  DEPT_ID NUMBER PRIMARY KEY,
  DEPT_NAME VARCHAR2(50) NOT NULL UNIQUE,
  LOCATION VARCHAR2(100)
)`,
    expectedOutput: {
      tableName: "DEPARTMENTS",
      columns: [
        { name: "DEPT_ID", dataType: "NUMBER", nullable: "N" },
        { name: "DEPT_NAME", dataType: "VARCHAR2", nullable: "N" },
        { name: "LOCATION", dataType: "VARCHAR2", nullable: "Y" },
      ],
      constraints: [
        { type: "P" },
        { type: "U" },
      ],
    },
  },

  {
    title: "Create Employees Table with Foreign Key & Check",
    slug: "create-employees-fk-check",
    description: `## Problem Description

Assume a parent table \`DEPARTMENTS(DEPT_ID)\` already exists. Create an \`EMPLOYEES\` table enforcing relational integrity and validation rules.

### Required Table Specifications

| Column Name | Data Type | Constraints | Explanation |
|:---|:---|:---|:---|
| \`EMP_ID\` | \`NUMBER\` | \`PRIMARY KEY\` | Unique employee ID. |
| \`FIRST_NAME\` | \`VARCHAR2(50)\` | \`NOT NULL\` | Employee first name. |
| \`LAST_NAME\` | \`VARCHAR2(50)\` | \`NOT NULL\` | Employee last name. |
| \`DEPT_ID\` | \`NUMBER\` | \`REFERENCES DEPARTMENTS(DEPT_ID)\` | Foreign key referencing parent department. |
| \`SALARY\` | \`NUMBER(10,2)\` | \`CHECK (SALARY > 0)\` | Validates that salary is strictly positive. |
| \`STATUS\` | \`VARCHAR2(20)\` | \`DEFAULT 'ACTIVE'\` | Sets default employment status if unspecified. |

### Key Oracle SQL Concepts
- **FOREIGN KEY (\`REFERENCES\`)**: Links a column to a primary key in another table to enforce Referential Integrity.
- **CHECK Constraint**: Validates that values inserted into a column satisfy a logical boolean condition.
- **DEFAULT Value**: Provides an automatic default value when a column is omitted in an \`INSERT\` statement.`,
    difficulty: "easy" as const,
    topicTags: ["ddl", "create-table", "foreign-key", "check", "default"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE DEPARTMENTS (
  DEPT_ID NUMBER PRIMARY KEY,
  DEPT_NAME VARCHAR2(50) NOT NULL
);`,
    solutionQuery: `CREATE TABLE EMPLOYEES (
  EMP_ID NUMBER PRIMARY KEY,
  FIRST_NAME VARCHAR2(50) NOT NULL,
  LAST_NAME VARCHAR2(50) NOT NULL,
  DEPT_ID NUMBER REFERENCES DEPARTMENTS(DEPT_ID),
  SALARY NUMBER(10,2) CHECK (SALARY > 0),
  STATUS VARCHAR2(20) DEFAULT 'ACTIVE'
)`,
    expectedOutput: {
      tableName: "EMPLOYEES",
      columns: [
        { name: "EMP_ID", dataType: "NUMBER", nullable: "N" },
        { name: "FIRST_NAME", dataType: "VARCHAR2", nullable: "N" },
        { name: "LAST_NAME", dataType: "VARCHAR2", nullable: "N" },
        { name: "DEPT_ID", dataType: "NUMBER", nullable: "Y" },
        { name: "SALARY", dataType: "NUMBER", nullable: "Y" },
        { name: "STATUS", dataType: "VARCHAR2", nullable: "Y" },
      ],
      constraints: [
        { type: "P" },
        { type: "R" },
        { type: "C" },
      ],
    },
  },

  {
    title: "Create Orders Table with Table-Level Constraints",
    slug: "create-orders-table-level",
    description: `## Problem Description

Given an existing \`CUSTOMERS(CUSTOMER_ID)\` table, create an \`ORDERS\` table using **table-level constraint definitions**.

### Required Column Specifications

| Column | Type | Nullable | Description |
|:---|:---|:---|:---|
| \`ORDER_ID\` | \`NUMBER\` | \`NOT NULL\` | Primary key column. |
| \`CUSTOMER_ID\` | \`NUMBER\` | \`NOT NULL\` | Foreign key column referencing \`CUSTOMERS\`. |
| \`ORDER_DATE\` | \`DATE\` | \`DEFAULT SYSDATE\` | Order placement date (defaults to current date). |
| \`TOTAL_AMOUNT\` | \`NUMBER(10,2)\` | \`NOT NULL\` | Total order amount. |

### Required Table-Level Constraint Definitions
Define explicit named constraints at the bottom of your table definition:
- Primary Key: Name \`pk_orders\` on \`ORDER_ID\`
- Foreign Key: Name \`fk_orders_customer\` on \`CUSTOMER_ID\` referencing \`CUSTOMERS(CUSTOMER_ID)\`
- Check Constraint: Name \`chk_order_amount\` ensuring \`TOTAL_AMOUNT >= 0\`

### Column-Level vs Table-Level Constraints
- **Column-level**: Written inline next to column definition.
- **Table-level**: Written at the end of the \`CREATE TABLE\` clause. Required when creating composite keys or named constraints.`,
    difficulty: "medium" as const,
    topicTags: ["ddl", "create-table", "table-constraints", "primary-key", "foreign-key"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE CUSTOMERS (
  CUSTOMER_ID NUMBER PRIMARY KEY,
  NAME VARCHAR2(100) NOT NULL
);`,
    solutionQuery: `CREATE TABLE ORDERS (
  ORDER_ID NUMBER NOT NULL,
  CUSTOMER_ID NUMBER NOT NULL,
  ORDER_DATE DATE DEFAULT SYSDATE,
  TOTAL_AMOUNT NUMBER(10,2) NOT NULL,
  CONSTRAINT pk_orders PRIMARY KEY (ORDER_ID),
  CONSTRAINT fk_orders_customer FOREIGN KEY (CUSTOMER_ID) REFERENCES CUSTOMERS(CUSTOMER_ID),
  CONSTRAINT chk_order_amount CHECK (TOTAL_AMOUNT >= 0)
)`,
    expectedOutput: {
      tableName: "ORDERS",
      columns: [
        { name: "ORDER_ID", dataType: "NUMBER", nullable: "N" },
        { name: "CUSTOMER_ID", dataType: "NUMBER", nullable: "N" },
        { name: "ORDER_DATE", dataType: "DATE", nullable: "Y" },
        { name: "TOTAL_AMOUNT", dataType: "NUMBER", nullable: "N" },
      ],
      constraints: [
        { type: "P" },
        { type: "R" },
        { type: "C" },
      ],
    },
  },

  {
    title: "Create Products Table with Column Check Constraints",
    slug: "create-products-check",
    description: `## Problem Description

Create a \`PRODUCTS\` inventory table enforcing business validation rules using column-level \`CHECK\` constraints.

### Required Table Specifications

| Column Name | Data Type | Constraints | Description |
|:---|:---|:---|:---|
| \`PRODUCT_ID\` | \`NUMBER\` | \`PRIMARY KEY\` | Product ID. |
| \`PRODUCT_NAME\` | \`VARCHAR2(100)\` | \`NOT NULL\` | Product display name. |
| \`PRICE\` | \`NUMBER(8,2)\` | \`NOT NULL\`, \`CHECK (PRICE > 0)\` | Price must be strictly greater than zero. |
| \`STOCK_QUANTITY\` | \`NUMBER\` | \`DEFAULT 0\`, \`CHECK (STOCK_QUANTITY >= 0)\` | Quantity cannot be negative. Defaults to 0. |

### Key Oracle SQL Concepts
- \`CHECK (PRICE > 0)\` prevents inserting 0 or negative prices into the database.
- \`DEFAULT 0\` ensures newly created products start with 0 stock if unspecified.`,
    difficulty: "easy" as const,
    topicTags: ["ddl", "create-table", "check", "default"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: "SELECT 1 FROM DUAL",
    solutionQuery: `CREATE TABLE PRODUCTS (
  PRODUCT_ID NUMBER PRIMARY KEY,
  PRODUCT_NAME VARCHAR2(100) NOT NULL,
  PRICE NUMBER(8,2) NOT NULL CHECK (PRICE > 0),
  STOCK_QUANTITY NUMBER DEFAULT 0 CHECK (STOCK_QUANTITY >= 0)
)`,
    expectedOutput: {
      tableName: "PRODUCTS",
      columns: [
        { name: "PRODUCT_ID", dataType: "NUMBER", nullable: "N" },
        { name: "PRODUCT_NAME", dataType: "VARCHAR2", nullable: "N" },
        { name: "PRICE", dataType: "NUMBER", nullable: "N" },
        { name: "STOCK_QUANTITY", dataType: "NUMBER", nullable: "Y" },
      ],
      constraints: [
        { type: "P" },
        { type: "C" },
      ],
    },
  },

  {
    title: "Create Course Enrollments with Composite Primary Key",
    slug: "create-enrollments-composite-pk",
    description: `## Problem Description

Given two parent tables \`STUDENTS(STUDENT_ID)\` and \`COURSES(COURSE_ID)\`, create a junction table named \`ENROLLMENTS\` with a **Composite Primary Key**.

### Required Specifications

| Column Name | Data Type | Constraints | Description |
|:---|:---|:---|:---|
| \`STUDENT_ID\` | \`NUMBER\` | \`REFERENCES STUDENTS(STUDENT_ID)\` | Foreign key to Students table. |
| \`COURSE_ID\` | \`NUMBER\` | \`REFERENCES COURSES(COURSE_ID)\` | Foreign key to Courses table. |
| \`ENROLL_DATE\` | \`DATE\` | \`DEFAULT SYSDATE\` | Registration date. |
| \`GRADE\` | \`VARCHAR2(2)\` | *Optional* | Letter grade achieved. |

### Composite Primary Key Requirement
Define a table-level composite primary key across both foreign key columns:
\`PRIMARY KEY (STUDENT_ID, COURSE_ID)\`

### Why Composite Primary Keys?
A composite primary key guarantees that a specific student cannot be enrolled in the exact same course more than once.`,
    difficulty: "medium" as const,
    topicTags: ["ddl", "create-table", "composite-pk", "foreign-key"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE STUDENTS (STUDENT_ID NUMBER PRIMARY KEY);
CREATE TABLE COURSES (COURSE_ID NUMBER PRIMARY KEY);`,
    solutionQuery: `CREATE TABLE ENROLLMENTS (
  STUDENT_ID NUMBER REFERENCES STUDENTS(STUDENT_ID),
  COURSE_ID NUMBER REFERENCES COURSES(COURSE_ID),
  ENROLL_DATE DATE DEFAULT SYSDATE,
  GRADE VARCHAR2(2),
  PRIMARY KEY (STUDENT_ID, COURSE_ID)
)`,
    expectedOutput: {
      tableName: "ENROLLMENTS",
      columns: [
        { name: "STUDENT_ID", dataType: "NUMBER", nullable: "N" },
        { name: "COURSE_ID", dataType: "NUMBER", nullable: "N" },
        { name: "ENROLL_DATE", dataType: "DATE", nullable: "Y" },
        { name: "GRADE", dataType: "VARCHAR2", nullable: "Y" },
      ],
      constraints: [
        { type: "P" },
        { type: "R" },
      ],
    },
  },

  {
    title: "Create Inventory Table with Default Values",
    slug: "create-inventory-defaults",
    description: `## Problem Description

Create an \`INVENTORY\` table practicing Oracle **DEFAULT** column clause syntax.

### Required Table Specifications

| Column Name | Data Type | Constraints / Defaults | Description |
|:---|:---|:---|:---|
| \`ITEM_ID\` | \`NUMBER\` | \`PRIMARY KEY\` | Inventory item identifier. |
| \`ITEM_NAME\` | \`VARCHAR2(100)\` | \`NOT NULL\` | Item name. |
| \`CATEGORY\` | \`VARCHAR2(50)\` | \`DEFAULT 'GENERAL'\` | Default category if unspecified. |
| \`REORDER_LEVEL\` | \`NUMBER\` | \`DEFAULT 10\` | Default minimum stock threshold. |
| \`LAST_RESTOCK\` | \`DATE\` | \`DEFAULT SYSDATE\` | Defaults to current Oracle timestamp. |

### Key Concept: Oracle \`SYSDATE\`
\`SYSDATE\` is an Oracle built-in function that returns the current date and time on the database server. Using \`DEFAULT SYSDATE\` automatically timestamps newly created records.`,
    difficulty: "easy" as const,
    topicTags: ["ddl", "create-table", "default"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: "SELECT 1 FROM DUAL",
    solutionQuery: `CREATE TABLE INVENTORY (
  ITEM_ID NUMBER PRIMARY KEY,
  ITEM_NAME VARCHAR2(100) NOT NULL,
  CATEGORY VARCHAR2(50) DEFAULT 'GENERAL',
  REORDER_LEVEL NUMBER DEFAULT 10,
  LAST_RESTOCK DATE DEFAULT SYSDATE
)`,
    expectedOutput: {
      tableName: "INVENTORY",
      columns: [
        { name: "ITEM_ID", dataType: "NUMBER", nullable: "N" },
        { name: "ITEM_NAME", dataType: "VARCHAR2", nullable: "N" },
        { name: "CATEGORY", dataType: "VARCHAR2", nullable: "Y" },
        { name: "REORDER_LEVEL", dataType: "NUMBER", nullable: "Y" },
        { name: "LAST_RESTOCK", dataType: "DATE", nullable: "Y" },
      ],
      constraints: [
        { type: "P" },
      ],
    },
  },

  {
    title: "Create Accounts Table with Table-Level Unique Constraint",
    slug: "create-accounts-table-unique",
    description: `## Problem Description

Create a \`BANK_ACCOUNTS\` table with a **table-level UNIQUE constraint** combining branch code and account number.

### Required Table Specifications

| Column Name | Data Type | Constraints | Description |
|:---|:---|:---|:---|
| \`ACCOUNT_ID\` | \`NUMBER\` | \`PRIMARY KEY\` | Unique surrogate key. |
| \`BRANCH_CODE\` | \`VARCHAR2(10)\` | \`NOT NULL\` | Bank branch identifier code. |
| \`ACCOUNT_NO\` | \`VARCHAR2(20)\` | \`NOT NULL\` | Account number within branch. |
| \`BALANCE\` | \`NUMBER(12,2)\` | \`DEFAULT 0.00\` | Account balance. |

### Required Constraint Definition
Add a named table-level unique constraint:
- Constraint Name: \`uq_branch_acc\`
- Unique Columns: \`(BRANCH_CODE, ACCOUNT_NO)\``,
    difficulty: "medium" as const,
    topicTags: ["ddl", "create-table", "unique", "table-constraints"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: "SELECT 1 FROM DUAL",
    solutionQuery: `CREATE TABLE BANK_ACCOUNTS (
  ACCOUNT_ID NUMBER PRIMARY KEY,
  BRANCH_CODE VARCHAR2(10) NOT NULL,
  ACCOUNT_NO VARCHAR2(20) NOT NULL,
  BALANCE NUMBER(12,2) DEFAULT 0.00,
  CONSTRAINT uq_branch_acc UNIQUE (BRANCH_CODE, ACCOUNT_NO)
)`,
    expectedOutput: {
      tableName: "BANK_ACCOUNTS",
      columns: [
        { name: "ACCOUNT_ID", dataType: "NUMBER", nullable: "N" },
        { name: "BRANCH_CODE", dataType: "VARCHAR2", nullable: "N" },
        { name: "ACCOUNT_NO", dataType: "VARCHAR2", nullable: "N" },
        { name: "BALANCE", dataType: "NUMBER", nullable: "Y" },
      ],
      constraints: [
        { type: "P" },
        { type: "U" },
      ],
    },
  },

  {
    title: "Create Project Assignments with Cascade Foreign Keys",
    slug: "create-project-assignments-cascade",
    description: `## Problem Description

Given \`PROJECTS(PROJECT_ID)\` and \`EMPLOYEES(EMP_ID)\`, create a \`PROJECT_ASSIGNMENTS\` table with Foreign Key **CASCADE DELETE** behavior.

### Required Table Specifications

| Column Name | Data Type | Constraints | Description |
|:---|:---|:---|:---|
| \`ASSIGNMENT_ID\` | \`NUMBER\` | \`PRIMARY KEY\` | Assignment ID. |
| \`PROJECT_ID\` | \`NUMBER\` | \`NOT NULL\`, \`REFERENCES PROJECTS(PROJECT_ID) ON DELETE CASCADE\` | References parent project. |
| \`EMP_ID\` | \`NUMBER\` | \`NOT NULL\`, \`REFERENCES EMPLOYEES(EMP_ID) ON DELETE CASCADE\` | References assigned employee. |
| \`ROLE\` | \`VARCHAR2(50)\` | \`NOT NULL\` | Assignment role (e.g. 'Lead'). |`,
    difficulty: "medium" as const,
    topicTags: ["ddl", "create-table", "foreign-key", "cascade"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE PROJECTS (PROJECT_ID NUMBER PRIMARY KEY);
CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY);`,
    solutionQuery: `CREATE TABLE PROJECT_ASSIGNMENTS (
  ASSIGNMENT_ID NUMBER PRIMARY KEY,
  PROJECT_ID NUMBER NOT NULL REFERENCES PROJECTS(PROJECT_ID) ON DELETE CASCADE,
  EMP_ID NUMBER NOT NULL REFERENCES EMPLOYEES(EMP_ID) ON DELETE CASCADE,
  ROLE VARCHAR2(50) NOT NULL
)`,
    expectedOutput: {
      tableName: "PROJECT_ASSIGNMENTS",
      columns: [
        { name: "ASSIGNMENT_ID", dataType: "NUMBER", nullable: "N" },
        { name: "PROJECT_ID", dataType: "NUMBER", nullable: "N" },
        { name: "EMP_ID", dataType: "NUMBER", nullable: "N" },
        { name: "ROLE", dataType: "VARCHAR2", nullable: "N" },
      ],
      constraints: [
        { type: "P" },
        { type: "R" },
      ],
    },
  },

  // =========================================================================
  // GROUP 2: DDL — ALTER TABLE, DROP & TRUNCATE (6 Problems)
  // =========================================================================

  {
    title: "Add Column to Customers Table",
    slug: "alter-add-column-customers",
    description: `## Problem Description

Modify an existing \`CUSTOMERS\` table by appending a new column using \`ALTER TABLE ... ADD\`.

### Requirement
Add the following column to \`CUSTOMERS\`:
- Column Name: \`PHONE_NUMBER\`
- Data Type: \`VARCHAR2(20)\``,
    difficulty: "easy" as const,
    topicTags: ["alter-table", "add-column", "ddl"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE CUSTOMERS (
  CUSTOMER_ID NUMBER PRIMARY KEY,
  NAME VARCHAR2(100) NOT NULL,
  EMAIL VARCHAR2(100)
);`,
    solutionQuery: `ALTER TABLE CUSTOMERS ADD PHONE_NUMBER VARCHAR2(20)`,
    expectedOutput: {
      tableName: "CUSTOMERS",
      columns: [
        { name: "CUSTOMER_ID", dataType: "NUMBER", nullable: "N" },
        { name: "NAME", dataType: "VARCHAR2", nullable: "N" },
        { name: "EMAIL", dataType: "VARCHAR2", nullable: "Y" },
        { name: "PHONE_NUMBER", dataType: "VARCHAR2", nullable: "Y" },
      ],
    },
  },

  {
    title: "Modify Column Data Type in Products Table",
    slug: "alter-modify-column-products",
    description: `## Problem Description

Use \`ALTER TABLE ... MODIFY\` to change an existing column's size and nullability constraint.

### Requirement
In the \`PRODUCTS\` table, modify the \`DESCRIPTION\` column:
- Increase data length from \`VARCHAR2(100)\` to \`VARCHAR2(250)\`
- Add a \`NOT NULL\` constraint to the column`,
    difficulty: "easy" as const,
    topicTags: ["alter-table", "modify-column", "ddl"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE PRODUCTS (
  PRODUCT_ID NUMBER PRIMARY KEY,
  PRODUCT_NAME VARCHAR2(100) NOT NULL,
  DESCRIPTION VARCHAR2(100)
);`,
    solutionQuery: `ALTER TABLE PRODUCTS MODIFY DESCRIPTION VARCHAR2(250) NOT NULL`,
    expectedOutput: {
      tableName: "PRODUCTS",
      columns: [
        { name: "PRODUCT_ID", dataType: "NUMBER", nullable: "N" },
        { name: "PRODUCT_NAME", dataType: "VARCHAR2", nullable: "N" },
        { name: "DESCRIPTION", dataType: "VARCHAR2", nullable: "N" },
      ],
    },
  },

  {
    title: "Drop Column from Employees Table",
    slug: "alter-drop-column-employees",
    description: `## Problem Description

Remove an obsolete column from the \`EMPLOYEES\` table using Oracle \`ALTER TABLE ... DROP COLUMN\`.

### Requirement
Drop the column \`TEMPORARY_ADDRESS\` from \`EMPLOYEES\`.`,
    difficulty: "easy" as const,
    topicTags: ["alter-table", "drop-column", "ddl"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (
  EMP_ID NUMBER PRIMARY KEY,
  NAME VARCHAR2(100) NOT NULL,
  SALARY NUMBER(10,2),
  TEMPORARY_ADDRESS VARCHAR2(200)
);`,
    solutionQuery: `ALTER TABLE EMPLOYEES DROP COLUMN TEMPORARY_ADDRESS`,
    expectedOutput: {
      tableName: "EMPLOYEES",
      columns: [
        { name: "EMP_ID", dataType: "NUMBER", nullable: "N" },
        { name: "NAME", dataType: "VARCHAR2", nullable: "N" },
        { name: "SALARY", dataType: "NUMBER", nullable: "Y" },
      ],
    },
  },

  {
    title: "Add Foreign Key Constraint via Alter Table",
    slug: "alter-add-fk-orders",
    description: `## Problem Description

Add a named Foreign Key constraint to an existing table using \`ALTER TABLE ... ADD CONSTRAINT\`.

### Requirement
Given existing tables \`CUSTOMERS(CUSTOMER_ID)\` and \`ORDERS(ORDER_ID, CUSTOMER_ID)\`:
- Add a foreign key constraint named \`fk_orders_cust\`
- Column \`CUSTOMER_ID\` in \`ORDERS\` must reference \`CUSTOMER_ID\` in \`CUSTOMERS\`.`,
    difficulty: "medium" as const,
    topicTags: ["alter-table", "add-constraint", "foreign-key", "ddl"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE CUSTOMERS (CUSTOMER_ID NUMBER PRIMARY KEY);
CREATE TABLE ORDERS (ORDER_ID NUMBER PRIMARY KEY, CUSTOMER_ID NUMBER);`,
    solutionQuery: `ALTER TABLE ORDERS ADD CONSTRAINT fk_orders_cust FOREIGN KEY (CUSTOMER_ID) REFERENCES CUSTOMERS(CUSTOMER_ID)`,
    expectedOutput: {
      tableName: "ORDERS",
      columns: [
        { name: "ORDER_ID", dataType: "NUMBER", nullable: "N" },
        { name: "CUSTOMER_ID", dataType: "NUMBER", nullable: "Y" },
      ],
      constraints: [
        { type: "P" },
        { type: "R" },
      ],
    },
  },

  {
    title: "Add Check Constraint via Alter Table",
    slug: "alter-add-check-salary",
    description: `## Problem Description

Add a named \`CHECK\` validation constraint to an existing \`EMPLOYEES\` table.

### Requirement
Add a check constraint named \`chk_min_salary\` ensuring that \`SALARY >= 1000\`.`,
    difficulty: "easy" as const,
    topicTags: ["alter-table", "add-constraint", "check", "ddl"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (
  EMP_ID NUMBER PRIMARY KEY,
  NAME VARCHAR2(100) NOT NULL,
  SALARY NUMBER(10,2)
);`,
    solutionQuery: `ALTER TABLE EMPLOYEES ADD CONSTRAINT chk_min_salary CHECK (SALARY >= 1000)`,
    expectedOutput: {
      tableName: "EMPLOYEES",
      columns: [
        { name: "EMP_ID", dataType: "NUMBER", nullable: "N" },
        { name: "NAME", dataType: "VARCHAR2", nullable: "N" },
        { name: "SALARY", dataType: "NUMBER", nullable: "Y" },
      ],
      constraints: [
        { type: "P" },
        { type: "C" },
      ],
    },
  },

  {
    title: "Truncate Audit Logs Table",
    slug: "truncate-audit-logs",
    description: `## Problem Description

Instantly clear all rows from the \`AUDIT_LOGS\` table while preserving the table structure using Oracle \`TRUNCATE TABLE\`.`,
    difficulty: "easy" as const,
    topicTags: ["truncate", "ddl"],
    validationType: "dml_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE AUDIT_LOGS (
  LOG_ID NUMBER PRIMARY KEY,
  ACTION VARCHAR2(100),
  LOG_DATE DATE
);
INSERT INTO AUDIT_LOGS VALUES (1, 'LOGIN', SYSDATE);
INSERT INTO AUDIT_LOGS VALUES (2, 'LOGOUT', SYSDATE);
COMMIT;`,
    solutionQuery: `TRUNCATE TABLE AUDIT_LOGS`,
    expectedOutput: null,
  },

  // =========================================================================
  // GROUP 3: DML — INSERT, UPDATE, DELETE (8 Problems)
  // =========================================================================

  {
    title: "Insert Single Record with Explicit Column List",
    slug: "insert-with-column-list",
    description: `## Problem Description

Insert a new record into the \`CUSTOMERS\` table explicitly naming target columns.

### Target Record Details
- \`CUSTOMER_ID\`: \`101\`
- \`NAME\`: \`'Sophia Martinez'\`
- \`EMAIL\`: \`'sophia@example.com'\``,
    difficulty: "easy" as const,
    topicTags: ["dml", "insert", "column-list"],
    validationType: "dml_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE CUSTOMERS (
  CUSTOMER_ID NUMBER PRIMARY KEY,
  NAME VARCHAR2(100) NOT NULL,
  EMAIL VARCHAR2(100)
);`,
    solutionQuery: `INSERT INTO CUSTOMERS (CUSTOMER_ID, NAME, EMAIL) VALUES (101, 'Sophia Martinez', 'sophia@example.com')`,
    expectedOutput: null,
  },

  {
    title: "Insert Record without Column List",
    slug: "insert-without-column-list",
    description: `## Problem Description

Insert a record into \`DEPARTMENTS\` using positional value assignment without explicitly listing column names.

### Table Schema Order
\`DEPARTMENTS(DEPT_ID, DEPT_NAME, LOCATION)\`

### Values to Insert
- \`DEPT_ID\`: \`10\`
- \`DEPT_NAME\`: \`'Research'\`
- \`LOCATION\`: \`'Building X'\``,
    difficulty: "easy" as const,
    topicTags: ["dml", "insert", "positional"],
    validationType: "dml_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE DEPARTMENTS (
  DEPT_ID NUMBER PRIMARY KEY,
  DEPT_NAME VARCHAR2(50) NOT NULL,
  LOCATION VARCHAR2(100)
);`,
    solutionQuery: `INSERT INTO DEPARTMENTS VALUES (10, 'Research', 'Building X')`,
    expectedOutput: null,
  },

  {
    title: "Insert High Earners into Archive Table from Subquery",
    slug: "insert-from-subquery-select",
    description: `## Problem Description

Copy data from \`EMPLOYEES\` into \`HIGH_EARNERS\` table using an \`INSERT INTO ... SELECT\` subquery.

### Requirement
Select all employees from \`EMPLOYEES\` where \`SALARY >= 80000\` and insert their \`EMP_ID\`, \`NAME\`, and \`SALARY\` into \`HIGH_EARNERS\`.`,
    difficulty: "medium" as const,
    topicTags: ["dml", "insert", "subquery"],
    validationType: "dml_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (
  EMP_ID NUMBER PRIMARY KEY,
  NAME VARCHAR2(100),
  SALARY NUMBER(10,2)
);
CREATE TABLE HIGH_EARNERS (
  EMP_ID NUMBER PRIMARY KEY,
  NAME VARCHAR2(100),
  SALARY NUMBER(10,2)
);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 95000);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 60000);
INSERT INTO EMPLOYEES VALUES (3, 'Carol', 85000);
INSERT INTO EMPLOYEES VALUES (4, 'David', 72000);
COMMIT;`,
    solutionQuery: `INSERT INTO HIGH_EARNERS (EMP_ID, NAME, SALARY)
SELECT EMP_ID, NAME, SALARY FROM EMPLOYEES WHERE SALARY >= 80000`,
    expectedOutput: null,
  },

  {
    title: "Update Employee Salary by Department",
    slug: "update-employee-salary-dept",
    description: `## Problem Description

Increase the salary of all employees working in the \`'Marketing'\` department by **$5,000**.`,
    difficulty: "easy" as const,
    topicTags: ["dml", "update", "where"],
    validationType: "dml_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (
  EMP_ID NUMBER PRIMARY KEY,
  NAME VARCHAR2(100),
  DEPARTMENT VARCHAR2(50),
  SALARY NUMBER(10,2)
);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 'Engineering', 85000);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 'Marketing', 65000);
INSERT INTO EMPLOYEES VALUES (3, 'Eve', 'Marketing', 70000);
COMMIT;`,
    solutionQuery: `UPDATE EMPLOYEES SET SALARY = SALARY + 5000 WHERE DEPARTMENT = 'Marketing'`,
    expectedOutput: null,
  },

  {
    title: "Update Multiple Columns Simultaneously",
    slug: "update-multiple-columns",
    description: `## Problem Description

Update the record for employee \`EMP_ID = 2\` in the \`EMPLOYEES\` table:
- Set \`DEPARTMENT\` to \`'Executive'\`
- Set \`SALARY\` to \`120000\``,
    difficulty: "easy" as const,
    topicTags: ["dml", "update", "multi-column"],
    validationType: "dml_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (
  EMP_ID NUMBER PRIMARY KEY,
  NAME VARCHAR2(100),
  DEPARTMENT VARCHAR2(50),
  SALARY NUMBER(10,2)
);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 'Engineering', 85000);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 'Marketing', 65000);
COMMIT;`,
    solutionQuery: `UPDATE EMPLOYEES SET DEPARTMENT = 'Executive', SALARY = 120000 WHERE EMP_ID = 2`,
    expectedOutput: null,
  },

  {
    title: "Delete Inactive User Accounts",
    slug: "delete-inactive-users",
    description: `## Problem Description

Delete all records from the \`USERS\` table where \`STATUS = 'INACTIVE'\`.`,
    difficulty: "easy" as const,
    topicTags: ["dml", "delete", "where"],
    validationType: "dml_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE USERS (
  USER_ID NUMBER PRIMARY KEY,
  USERNAME VARCHAR2(50),
  STATUS VARCHAR2(20)
);
INSERT INTO USERS VALUES (1, 'john_doe', 'ACTIVE');
INSERT INTO USERS VALUES (2, 'jane_smith', 'INACTIVE');
INSERT INTO USERS VALUES (3, 'old_account', 'INACTIVE');
COMMIT;`,
    solutionQuery: `DELETE FROM USERS WHERE STATUS = 'INACTIVE'`,
    expectedOutput: null,
  },

  {
    title: "Delete Employees in Closed Department via Subquery",
    slug: "delete-employees-subquery",
    description: `## Problem Description

Delete all employees from \`EMPLOYEES\` whose department has \`LOCATION = 'Building C'\` in the \`DEPARTMENTS\` table.

### Requirement
Use a \`WHERE DEPT_ID IN (SELECT DEPT_ID FROM DEPARTMENTS WHERE ...)\` subquery.`,
    difficulty: "medium" as const,
    topicTags: ["dml", "delete", "subquery"],
    validationType: "dml_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE DEPARTMENTS (
  DEPT_ID NUMBER PRIMARY KEY,
  LOCATION VARCHAR2(100)
);
CREATE TABLE EMPLOYEES (
  EMP_ID NUMBER PRIMARY KEY,
  NAME VARCHAR2(100),
  DEPT_ID NUMBER REFERENCES DEPARTMENTS(DEPT_ID)
);
INSERT INTO DEPARTMENTS VALUES (1, 'Building A');
INSERT INTO DEPARTMENTS VALUES (2, 'Building C');
INSERT INTO EMPLOYEES VALUES (10, 'Alice', 1);
INSERT INTO EMPLOYEES VALUES (20, 'Bob', 2);
INSERT INTO EMPLOYEES VALUES (30, 'Carol', 2);
COMMIT;`,
    solutionQuery: `DELETE FROM EMPLOYEES WHERE DEPT_ID IN (SELECT DEPT_ID FROM DEPARTMENTS WHERE LOCATION = 'Building C')`,
    expectedOutput: null,
  },

  {
    title: "Update Product Prices with Percentage Boost",
    slug: "update-product-prices-percentage",
    description: `## Problem Description

Apply a **10% price increase** (\`PRICE = PRICE * 1.10\`) for all products under the \`'Electronics'\` category in \`PRODUCTS\`.`,
    difficulty: "easy" as const,
    topicTags: ["dml", "update", "expressions"],
    validationType: "dml_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE PRODUCTS (
  PRODUCT_ID NUMBER PRIMARY KEY,
  NAME VARCHAR2(100),
  CATEGORY VARCHAR2(50),
  PRICE NUMBER(10,2)
);
INSERT INTO PRODUCTS VALUES (1, 'Laptop', 'Electronics', 1000);
INSERT INTO PRODUCTS VALUES (2, 'Phone', 'Electronics', 500);
INSERT INTO PRODUCTS VALUES (3, 'Desk', 'Furniture', 300);
COMMIT;`,
    solutionQuery: `UPDATE PRODUCTS SET PRICE = PRICE * 1.10 WHERE CATEGORY = 'Electronics'`,
    expectedOutput: null,
  },

  // =========================================================================
  // GROUP 4: SELECT — BASICS, FILTERING & SORTING (6 Problems)
  // =========================================================================

  {
    title: "Select All Employees",
    slug: "select-all-employees",
    description: `## Problem Description

Write a query to select **all columns and all rows** from the \`EMPLOYEES\` table.

### Expected Output Columns
\`EMP_ID\`, \`FIRST_NAME\`, \`LAST_NAME\`, \`DEPARTMENT\`, \`SALARY\`, \`HIRE_DATE\``,
    difficulty: "easy" as const,
    topicTags: ["select", "basics"],
    validationType: "select_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (
  EMP_ID NUMBER PRIMARY KEY,
  FIRST_NAME VARCHAR2(50) NOT NULL,
  LAST_NAME VARCHAR2(50) NOT NULL,
  DEPARTMENT VARCHAR2(50),
  SALARY NUMBER(10,2),
  HIRE_DATE DATE
);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 'Johnson', 'Engineering', 85000, DATE '2022-01-15');
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 'Smith', 'Marketing', 65000, DATE '2021-06-20');
INSERT INTO EMPLOYEES VALUES (3, 'Carol', 'Williams', 'Engineering', 92000, DATE '2020-03-10');
INSERT INTO EMPLOYEES VALUES (4, 'David', 'Brown', 'Sales', 70000, DATE '2023-02-28');
INSERT INTO EMPLOYEES VALUES (5, 'Eve', 'Davis', 'Marketing', 72000, DATE '2022-11-05');
COMMIT;`,
    solutionQuery: "SELECT * FROM EMPLOYEES",
    expectedOutput: null,
  },

  {
    title: "Filter Employees with High Salary",
    slug: "select-high-salary-employees",
    description: `## Problem Description

Write a query to find all employees earning a salary **greater than 75,000**.

### Expected Columns
\`FIRST_NAME\`, \`LAST_NAME\`, \`SALARY\``,
    difficulty: "easy" as const,
    topicTags: ["select", "where", "comparison"],
    validationType: "select_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (
  EMP_ID NUMBER PRIMARY KEY,
  FIRST_NAME VARCHAR2(50) NOT NULL,
  LAST_NAME VARCHAR2(50) NOT NULL,
  SALARY NUMBER(10,2)
);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 'Johnson', 85000);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 'Smith', 65000);
INSERT INTO EMPLOYEES VALUES (3, 'Carol', 'Williams', 92000);
INSERT INTO EMPLOYEES VALUES (4, 'David', 'Brown', 70000);
COMMIT;`,
    solutionQuery: "SELECT FIRST_NAME, LAST_NAME, SALARY FROM EMPLOYEES WHERE SALARY > 75000",
    expectedOutput: null,
  },

  {
    title: "Filter Products in Price Range",
    slug: "select-products-price-range",
    description: `## Problem Description

Find all products with price **between 100 and 500** (inclusive), sorted by \`PRICE\` in descending order.

### Expected Columns
\`PRODUCT_NAME\`, \`PRICE\``,
    difficulty: "easy" as const,
    topicTags: ["select", "where", "between", "order-by"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE PRODUCTS (
  PRODUCT_ID NUMBER PRIMARY KEY,
  PRODUCT_NAME VARCHAR2(100),
  PRICE NUMBER(10,2)
);
INSERT INTO PRODUCTS VALUES (1, 'Headphones', 150);
INSERT INTO PRODUCTS VALUES (2, 'Monitor', 350);
INSERT INTO PRODUCTS VALUES (3, 'Keyboard', 80);
INSERT INTO PRODUCTS VALUES (4, 'Laptop', 1200);
INSERT INTO PRODUCTS VALUES (5, 'Chair', 450);
COMMIT;`,
    solutionQuery: "SELECT PRODUCT_NAME, PRICE FROM PRODUCTS WHERE PRICE BETWEEN 100 AND 500 ORDER BY PRICE DESC",
    expectedOutput: null,
  },

  {
    title: "Search Customers by Email Pattern",
    slug: "select-like-email-domain",
    description: `## Problem Description

Find all customers whose email address ends with \`'@gmail.com'\` using the Oracle \`LIKE\` wildcards.

### Expected Columns
\`NAME\`, \`EMAIL\``,
    difficulty: "easy" as const,
    topicTags: ["select", "where", "like"],
    validationType: "select_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE CUSTOMERS (
  CUSTOMER_ID NUMBER PRIMARY KEY,
  NAME VARCHAR2(100),
  EMAIL VARCHAR2(100)
);
INSERT INTO CUSTOMERS VALUES (1, 'Alice', 'alice@gmail.com');
INSERT INTO CUSTOMERS VALUES (2, 'Bob', 'bob@yahoo.com');
INSERT INTO CUSTOMERS VALUES (3, 'Carol', 'carol@gmail.com');
INSERT INTO CUSTOMERS VALUES (4, 'David', 'david@outlook.com');
COMMIT;`,
    solutionQuery: "SELECT NAME, EMAIL FROM CUSTOMERS WHERE EMAIL LIKE '%@gmail.com'",
    expectedOutput: null,
  },

  {
    title: "Find Employees Without a Manager",
    slug: "select-is-null-manager",
    description: `## Problem Description

Find all top-level executives who do **not** have a manager assigned (\`MANAGER_ID IS NULL\`).

### Expected Columns
\`EMP_ID\`, \`FIRST_NAME\`, \`LAST_NAME\``,
    difficulty: "easy" as const,
    topicTags: ["select", "where", "null"],
    validationType: "select_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (
  EMP_ID NUMBER PRIMARY KEY,
  FIRST_NAME VARCHAR2(50),
  LAST_NAME VARCHAR2(50),
  MANAGER_ID NUMBER
);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 'CEO', NULL);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 'Smith', 1);
INSERT INTO EMPLOYEES VALUES (3, 'Carol', 'White', 1);
INSERT INTO EMPLOYEES VALUES (4, 'David', 'Director', NULL);
COMMIT;`,
    solutionQuery: "SELECT EMP_ID, FIRST_NAME, LAST_NAME FROM EMPLOYEES WHERE MANAGER_ID IS NULL",
    expectedOutput: null,
  },

  {
    title: "Order Employees by Department and Salary",
    slug: "select-order-by-multiple-columns",
    description: `## Problem Description

Retrieve all employees sorted first by \`DEPARTMENT\` alphabetically (ascending), and then by \`SALARY\` from highest to lowest (descending).

### Expected Columns
\`DEPARTMENT\`, \`FIRST_NAME\`, \`LAST_NAME\`, \`SALARY\``,
    difficulty: "easy" as const,
    topicTags: ["select", "order-by", "multi-column"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (
  EMP_ID NUMBER PRIMARY KEY,
  FIRST_NAME VARCHAR2(50),
  LAST_NAME VARCHAR2(50),
  DEPARTMENT VARCHAR2(50),
  SALARY NUMBER(10,2)
);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 'Johnson', 'Sales', 70000);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 'Smith', 'Engineering', 90000);
INSERT INTO EMPLOYEES VALUES (3, 'Carol', 'Williams', 'Engineering', 95000);
INSERT INTO EMPLOYEES VALUES (4, 'David', 'Brown', 'Sales', 85000);
COMMIT;`,
    solutionQuery: "SELECT DEPARTMENT, FIRST_NAME, LAST_NAME, SALARY FROM EMPLOYEES ORDER BY DEPARTMENT ASC, SALARY DESC",
    expectedOutput: null,
  },

  // =========================================================================
  // GROUP 5: SELECT — AGGREGATIONS, JOINS & SUBQUERIES (7 Problems)
  // =========================================================================

  {
    title: "Department Salary Averages",
    slug: "department-salary-averages",
    description: `## Problem Description

Compute summary statistics for each department:
- Average salary rounded to 2 decimal places (\`ROUND(AVG(SALARY), 2) AS AVG_SALARY\`)
- Count of total employees (\`COUNT(*) AS EMP_COUNT\`)

### Expected Columns
\`DEPARTMENT\`, \`AVG_SALARY\`, \`EMP_COUNT\``,
    difficulty: "medium" as const,
    topicTags: ["select", "group-by", "aggregate"],
    validationType: "select_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (
  EMP_ID NUMBER PRIMARY KEY,
  FIRST_NAME VARCHAR2(50),
  DEPARTMENT VARCHAR2(50),
  SALARY NUMBER(10,2)
);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 'Engineering', 85000);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 'Marketing', 65000);
INSERT INTO EMPLOYEES VALUES (3, 'Carol', 'Engineering', 92000);
INSERT INTO EMPLOYEES VALUES (4, 'David', 'Sales', 70000);
INSERT INTO EMPLOYEES VALUES (5, 'Eve', 'Marketing', 72000);
COMMIT;`,
    solutionQuery: "SELECT DEPARTMENT, ROUND(AVG(SALARY), 2) AS AVG_SALARY, COUNT(*) AS EMP_COUNT FROM EMPLOYEES GROUP BY DEPARTMENT",
    expectedOutput: null,
  },

  {
    title: "Departments with High Minimum Salary via HAVING",
    slug: "select-having-high-min-salary",
    description: `## Problem Description

Find departments where the minimum employee salary is at least **70,000**.

### Expected Columns
\`DEPARTMENT\`, \`MIN_SALARY\``,
    difficulty: "medium" as const,
    topicTags: ["select", "group-by", "having"],
    validationType: "select_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (
  EMP_ID NUMBER PRIMARY KEY,
  FIRST_NAME VARCHAR2(50),
  DEPARTMENT VARCHAR2(50),
  SALARY NUMBER(10,2)
);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 'Engineering', 85000);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 'Marketing', 45000);
INSERT INTO EMPLOYEES VALUES (3, 'Carol', 'Engineering', 92000);
INSERT INTO EMPLOYEES VALUES (4, 'David', 'Sales', 75000);
COMMIT;`,
    solutionQuery: "SELECT DEPARTMENT, MIN(SALARY) AS MIN_SALARY FROM EMPLOYEES GROUP BY DEPARTMENT HAVING MIN(SALARY) >= 70000",
    expectedOutput: null,
  },

  {
    title: "List Orders with Customer Details (Inner Join)",
    slug: "select-inner-join-orders-customers",
    description: `## Problem Description

Perform an **INNER JOIN** between \`ORDERS\` and \`CUSTOMERS\` on \`CUSTOMER_ID\` to retrieve combined order details.

### Expected Columns
\`ORDER_ID\`, \`NAME\`, \`TOTAL_AMOUNT\`, \`ORDER_DATE\``,
    difficulty: "medium" as const,
    topicTags: ["select", "joins", "inner-join"],
    validationType: "select_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE CUSTOMERS (
  CUSTOMER_ID NUMBER PRIMARY KEY,
  NAME VARCHAR2(100)
);
CREATE TABLE ORDERS (
  ORDER_ID NUMBER PRIMARY KEY,
  CUSTOMER_ID NUMBER REFERENCES CUSTOMERS(CUSTOMER_ID),
  TOTAL_AMOUNT NUMBER(10,2),
  ORDER_DATE DATE
);
INSERT INTO CUSTOMERS VALUES (1, 'Alice');
INSERT INTO CUSTOMERS VALUES (2, 'Bob');
INSERT INTO ORDERS VALUES (101, 1, 250.00, DATE '2023-05-01');
INSERT INTO ORDERS VALUES (102, 2, 499.99, DATE '2023-05-02');
COMMIT;`,
    solutionQuery: `SELECT O.ORDER_ID, C.NAME, O.TOTAL_AMOUNT, O.ORDER_DATE
FROM ORDERS O
INNER JOIN CUSTOMERS C ON O.CUSTOMER_ID = C.CUSTOMER_ID`,
    expectedOutput: null,
  },

  {
    title: "List All Departments and Assigned Employees (Left Join)",
    slug: "select-left-join-departments-employees",
    description: `## Problem Description

Perform a **LEFT JOIN** from \`DEPARTMENTS\` to \`EMPLOYEES\` to ensure departments without assigned employees are still included in output.

### Expected Columns
\`DEPT_NAME\`, \`FIRST_NAME\`, \`LAST_NAME\``,
    difficulty: "medium" as const,
    topicTags: ["select", "joins", "left-join"],
    validationType: "select_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE DEPARTMENTS (
  DEPT_ID NUMBER PRIMARY KEY,
  DEPT_NAME VARCHAR2(50)
);
CREATE TABLE EMPLOYEES (
  EMP_ID NUMBER PRIMARY KEY,
  FIRST_NAME VARCHAR2(50),
  LAST_NAME VARCHAR2(50),
  DEPT_ID NUMBER REFERENCES DEPARTMENTS(DEPT_ID)
);
INSERT INTO DEPARTMENTS VALUES (1, 'Engineering');
INSERT INTO DEPARTMENTS VALUES (2, 'Research');
INSERT INTO EMPLOYEES VALUES (10, 'Alice', 'Smith', 1);
COMMIT;`,
    solutionQuery: `SELECT D.DEPT_NAME, E.FIRST_NAME, E.LAST_NAME
FROM DEPARTMENTS D
LEFT JOIN EMPLOYEES E ON D.DEPT_ID = E.DEPT_ID`,
    expectedOutput: null,
  },

  {
    title: "Subquery — Employees Earning Above Company Average",
    slug: "select-subquery-above-avg",
    description: `## Problem Description

Find all employees whose salary is strictly greater than the overall company average salary using a subquery.

### Expected Columns
\`FIRST_NAME\`, \`LAST_NAME\`, \`SALARY\``,
    difficulty: "hard" as const,
    topicTags: ["select", "subquery", "where"],
    validationType: "select_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (
  EMP_ID NUMBER PRIMARY KEY,
  FIRST_NAME VARCHAR2(50),
  LAST_NAME VARCHAR2(50),
  SALARY NUMBER(10,2)
);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 'Johnson', 85000);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 'Smith', 45000);
INSERT INTO EMPLOYEES VALUES (3, 'Carol', 'Williams', 92000);
INSERT INTO EMPLOYEES VALUES (4, 'David', 'Brown', 55000);
INSERT INTO EMPLOYEES VALUES (5, 'Frank', 'Miller', 120000);
COMMIT;`,
    solutionQuery: `SELECT FIRST_NAME, LAST_NAME, SALARY
FROM EMPLOYEES
WHERE SALARY > (SELECT AVG(SALARY) FROM EMPLOYEES)`,
    expectedOutput: null,
  },

  {
    title: "Find Customers Who Have Never Placed an Order",
    slug: "select-customers-no-orders-subquery",
    description: `## Problem Description

Find all customers whose \`CUSTOMER_ID\` does **not** appear in the \`ORDERS\` table using a \`NOT IN\` subquery.

### Expected Columns
\`CUSTOMER_ID\`, \`NAME\``,
    difficulty: "hard" as const,
    topicTags: ["select", "subquery", "not-in"],
    validationType: "select_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE CUSTOMERS (
  CUSTOMER_ID NUMBER PRIMARY KEY,
  NAME VARCHAR2(100)
);
CREATE TABLE ORDERS (
  ORDER_ID NUMBER PRIMARY KEY,
  CUSTOMER_ID NUMBER REFERENCES CUSTOMERS(CUSTOMER_ID)
);
INSERT INTO CUSTOMERS VALUES (1, 'Alice');
INSERT INTO CUSTOMERS VALUES (2, 'Bob');
INSERT INTO CUSTOMERS VALUES (3, 'Charlie');
INSERT INTO ORDERS VALUES (101, 1);
COMMIT;`,
    solutionQuery: `SELECT CUSTOMER_ID, NAME FROM CUSTOMERS WHERE CUSTOMER_ID NOT IN (SELECT CUSTOMER_ID FROM ORDERS WHERE CUSTOMER_ID IS NOT NULL)`,
    expectedOutput: null,
  },

  {
    title: "Find Second Highest Salary",
    slug: "select-second-highest-salary",
    description: `## Problem Description

Find the **second highest salary** in the \`EMPLOYEES\` table using a subquery.

### Expected Columns
\`SECOND_HIGHEST_SALARY\``,
    difficulty: "hard" as const,
    topicTags: ["select", "subquery", "max"],
    validationType: "select_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (
  EMP_ID NUMBER PRIMARY KEY,
  NAME VARCHAR2(100),
  SALARY NUMBER(10,2)
);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 95000);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 120000);
INSERT INTO EMPLOYEES VALUES (3, 'Carol', 80000);
INSERT INTO EMPLOYEES VALUES (4, 'David', 110000);
COMMIT;`,
    solutionQuery: `SELECT MAX(SALARY) AS SECOND_HIGHEST_SALARY FROM EMPLOYEES WHERE SALARY < (SELECT MAX(SALARY) FROM EMPLOYEES)`,
    expectedOutput: null,
  },
];

// ─── Badges ───────────────────────────────────────────────────────
const sampleBadges = [
  {
    name: "First Blood",
    description: "Solve your first problem",
    icon: "🎯",
    criteria: { solvedCount: 1 },
  },
  {
    name: "Getting Started",
    description: "Solve 5 problems",
    icon: "🌱",
    criteria: { solvedCount: 5 },
  },
  {
    name: "Problem Crusher",
    description: "Solve 15 problems",
    icon: "💪",
    criteria: { solvedCount: 15 },
  },
  {
    name: "SQL Master",
    description: "Solve 30 problems",
    icon: "👑",
    criteria: { solvedCount: 30 },
  },
  {
    name: "Easy Peasy",
    description: "Solve 10 easy problems",
    icon: "🟢",
    criteria: { easySolved: 10 },
  },
  {
    name: "Medium Rare",
    description: "Solve 10 medium problems",
    icon: "🟡",
    criteria: { mediumSolved: 10 },
  },
  {
    name: "Hard Core",
    description: "Solve 5 hard problems",
    icon: "🔴",
    criteria: { hardSolved: 5 },
  },
  {
    name: "On Fire",
    description: "Maintain a 3-day streak",
    icon: "🔥",
    criteria: { streak: 3 },
  },
  {
    name: "Streak Legend",
    description: "Maintain a 7-day streak",
    icon: "⚡",
    criteria: { streak: 7 },
  },
  {
    name: "Join Master",
    description: "Solve 3 JOIN problems",
    icon: "🔗",
    criteria: { topic: "joins", topicCount: 3 },
  },
  {
    name: "DML Expert",
    description: "Solve 5 DML problems",
    icon: "✏️",
    criteria: { topic: "dml", topicCount: 5 },
  },
  {
    name: "DDL Architect",
    description: "Solve 5 DDL problems",
    icon: "🏗️",
    criteria: { topic: "ddl", topicCount: 5 },
  },
];

// ─── Run Seed ─────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Seeding database with questions...\n");

  // Seed problems (preserves existing problems & submissions)
  console.log("📝 Upserting SQL problems...");
  for (const problem of sampleProblems) {
    try {
      await db
        .insert(schema.problems)
        .values(problem)
        .onConflictDoNothing({ target: schema.problems.slug });
      console.log(`   ✅ ${problem.title}`);
    } catch (err: any) {
      console.log(`   ⚠️ ${problem.title}: ${err.message}`);
    }
  }

  // Seed badges
  console.log("\n🏅 Seeding badges...");
  for (const badge of sampleBadges) {
    try {
      await db
        .insert(schema.badges)
        .values(badge)
        .onConflictDoNothing();
      console.log(`   ✅ ${badge.name}`);
    } catch (err: any) {
      console.log(`   ⚠️ ${badge.name}: ${err.message}`);
    }
  }

  console.log("\n✅ Seeding complete!");
  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
