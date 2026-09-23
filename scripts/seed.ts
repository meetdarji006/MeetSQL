/**
 * Seed Script — Load 80 Comprehensive Oracle SQL Problems across 8 Topics from PDF Checklist into PostgreSQL.
 * EXCLUDES: Views (Topic 9) & Sequences (Topic 10) as requested.
 *
 * 8 Core Topics (10 problems per topic):
 * 1. Basic SQL
 * 2. DDL & DML
 * 3. Constraints
 * 4. Functions
 * 5. GROUP BY & HAVING
 * 6. Joins
 * 7. Subqueries
 * 8. Set Operations
 *
 * Run: npm run seed
 */

import dotenv from "dotenv";
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/db/schema";
import { sql } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

const sampleProblems = [
  // =========================================================================
  // TOPIC 1: BASIC SQL (10 Problems)
  // =========================================================================
  {
    title: "Select All Employees",
    slug: "basic-select-all-employees",
    description: `## Problem Description
Retrieve all columns and records from the \`EMPLOYEES\` table to inspect employee details.

### Table Schema: \`EMPLOYEES\`
- \`EMP_ID\` (NUMBER, PK)
- \`FIRST_NAME\` (VARCHAR2(50))
- \`LAST_NAME\` (VARCHAR2(50))
- \`SALARY\` (NUMBER)
- \`DEPT_ID\` (NUMBER)

### Expected Action
Write a \`SELECT\` query to list all columns from \`EMPLOYEES\` ordered by \`EMP_ID\`.`,
    difficulty: "easy" as const,
    topicTags: ["Basic SQL", "SELECT"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), LAST_NAME VARCHAR2(50), SALARY NUMBER, DEPT_ID NUMBER);
INSERT INTO EMPLOYEES VALUES (101, 'John', 'Doe', 5000, 10);
INSERT INTO EMPLOYEES VALUES (102, 'Jane', 'Smith', 6500, 20);
INSERT INTO EMPLOYEES VALUES (103, 'Robert', 'Johnson', 4200, 10);
INSERT INTO EMPLOYEES VALUES (104, 'Emily', 'Davis', 8000, 30);`,
    solutionQuery: `SELECT * FROM EMPLOYEES ORDER BY EMP_ID`,
  },
  {
    title: "Select Specific Employee Columns",
    slug: "basic-select-specific-columns",
    description: `## Problem Description
Select only the \`FIRST_NAME\`, \`LAST_NAME\`, and \`SALARY\` columns for all records in the \`EMPLOYEES\` table.

### Table Schema: \`EMPLOYEES\`
- \`EMP_ID\` (NUMBER, PK)
- \`FIRST_NAME\` (VARCHAR2(50))
- \`LAST_NAME\` (VARCHAR2(50))
- \`SALARY\` (NUMBER)

### Expected Action
Write a query selecting \`FIRST_NAME\`, \`LAST_NAME\`, and \`SALARY\` ordered by \`FIRST_NAME\` ASC.`,
    difficulty: "easy" as const,
    topicTags: ["Basic SQL", "Selecting Specific Columns"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), LAST_NAME VARCHAR2(50), SALARY NUMBER);
INSERT INTO EMPLOYEES VALUES (101, 'John', 'Doe', 5000);
INSERT INTO EMPLOYEES VALUES (102, 'Alice', 'Smith', 6500);
INSERT INTO EMPLOYEES VALUES (103, 'Bob', 'Johnson', 4200);`,
    solutionQuery: `SELECT FIRST_NAME, LAST_NAME, SALARY FROM EMPLOYEES ORDER BY FIRST_NAME`,
  },
  {
    title: "Filter Employees with WHERE & Logical Operators",
    slug: "basic-filter-where-logical",
    description: `## Problem Description
Filter employees using \`WHERE\` combined with \`AND\`, \`OR\`, and \`NOT\`.

### Goal
Find all employees who work in department \`10\` AND have a salary greater than \`4500\`, OR work in department \`20\` with a salary NOT equal to \`3000\`.

### Expected Action
Select all columns from \`EMPLOYEES\` matching the conditions ordered by \`EMP_ID\`.`,
    difficulty: "easy" as const,
    topicTags: ["Basic SQL", "WHERE", "AND / OR / NOT"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), SALARY NUMBER, DEPT_ID NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 'John', 5000, 10);
INSERT INTO EMPLOYEES VALUES (2, 'Jane', 4000, 10);
INSERT INTO EMPLOYEES VALUES (3, 'Bob', 6000, 20);
INSERT INTO EMPLOYEES VALUES (4, 'Dave', 3000, 20);`,
    solutionQuery: `SELECT * FROM EMPLOYEES WHERE (DEPT_ID = 10 AND SALARY > 4500) OR (DEPT_ID = 20 AND SALARY != 3000) ORDER BY EMP_ID`,
  },
  {
    title: "Retrieve Distinct Job Titles",
    slug: "basic-distinct-job-titles",
    description: `## Problem Description
Retrieve a unique list of all job titles present in the \`EMPLOYEES\` table using \`DISTINCT\`.

### Expected Action
Select distinct \`JOB_TITLE\` values from \`EMPLOYEES\` sorted in alphabetical order.`,
    difficulty: "easy" as const,
    topicTags: ["Basic SQL", "DISTINCT"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), JOB_TITLE VARCHAR2(50));
INSERT INTO EMPLOYEES VALUES (101, 'John', 'DEVELOPER');
INSERT INTO EMPLOYEES VALUES (102, 'Jane', 'ANALYST');
INSERT INTO EMPLOYEES VALUES (103, 'Robert', 'DEVELOPER');
INSERT INTO EMPLOYEES VALUES (104, 'Emily', 'MANAGER');
INSERT INTO EMPLOYEES VALUES (105, 'Michael', 'ANALYST');`,
    solutionQuery: `SELECT DISTINCT JOB_TITLE FROM EMPLOYEES ORDER BY JOB_TITLE`,
  },
  {
    title: "Sort Employees using ORDER BY",
    slug: "basic-order-by-sorting",
    description: `## Problem Description
List all employees sorted by \`DEPT_ID\` in ascending order, and then by \`SALARY\` in descending order.

### Expected Action
Select all columns from \`EMPLOYEES\` ordered by \`DEPT_ID ASC, SALARY DESC\`.`,
    difficulty: "easy" as const,
    topicTags: ["Basic SQL", "ORDER BY"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), SALARY NUMBER, DEPT_ID NUMBER);
INSERT INTO EMPLOYEES VALUES (101, 'John', 5000, 20);
INSERT INTO EMPLOYEES VALUES (102, 'Jane', 7000, 10);
INSERT INTO EMPLOYEES VALUES (103, 'Robert', 4000, 20);
INSERT INTO EMPLOYEES VALUES (104, 'Emily', 8000, 10);`,
    solutionQuery: `SELECT * FROM EMPLOYEES ORDER BY DEPT_ID ASC, SALARY DESC`,
  },
  {
    title: "Filter Salary Range using BETWEEN",
    slug: "basic-between-salary-range",
    description: `## Problem Description
Retrieve all employees whose \`SALARY\` falls inclusively within the range of \`4000\` and \`8000\` using the \`BETWEEN\` operator.

### Expected Action
Select all columns from \`EMPLOYEES\` where \`SALARY BETWEEN 4000 AND 8000\` ordered by \`EMP_ID\`.`,
    difficulty: "easy" as const,
    topicTags: ["Basic SQL", "BETWEEN"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), SALARY NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 3000);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 4500);
INSERT INTO EMPLOYEES VALUES (3, 'Charlie', 6000);
INSERT INTO EMPLOYEES VALUES (4, 'David', 8000);
INSERT INTO EMPLOYEES VALUES (5, 'Eve', 9500);`,
    solutionQuery: `SELECT * FROM EMPLOYEES WHERE SALARY BETWEEN 4000 AND 8000 ORDER BY EMP_ID`,
  },
  {
    title: "Filter Department List using IN Operator",
    slug: "basic-in-department-list",
    description: `## Problem Description
Select all employees who work in department \`10\`, \`20\`, or \`30\` using the \`IN\` clause.

### Expected Action
Select all columns from \`EMPLOYEES\` where \`DEPT_ID IN (10, 20, 30)\` ordered by \`EMP_ID\`.`,
    difficulty: "easy" as const,
    topicTags: ["Basic SQL", "IN"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), DEPT_ID NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 10);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 20);
INSERT INTO EMPLOYEES VALUES (3, 'Charlie', 40);
INSERT INTO EMPLOYEES VALUES (4, 'David', 30);
INSERT INTO EMPLOYEES VALUES (5, 'Eve', 50);`,
    solutionQuery: `SELECT * FROM EMPLOYEES WHERE DEPT_ID IN (10, 20, 30) ORDER BY EMP_ID`,
  },
  {
    title: "Search Names using LIKE Pattern Matching",
    slug: "basic-like-pattern-matching",
    description: `## Problem Description
Find all employees whose \`FIRST_NAME\` starts with 'A' or contains the substring 'an'.

### Expected Action
Select all columns from \`EMPLOYEES\` where \`FIRST_NAME LIKE 'A%' OR FIRST_NAME LIKE '%an%'\` ordered by \`EMP_ID\`.`,
    difficulty: "easy" as const,
    topicTags: ["Basic SQL", "LIKE"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50));
INSERT INTO EMPLOYEES VALUES (1, 'Alexander');
INSERT INTO EMPLOYEES VALUES (2, 'Brian');
INSERT INTO EMPLOYEES VALUES (3, 'Amanda');
INSERT INTO EMPLOYEES VALUES (4, 'Daniel');
INSERT INTO EMPLOYEES VALUES (5, 'Samantha');`,
    solutionQuery: `SELECT * FROM EMPLOYEES WHERE FIRST_NAME LIKE 'A%' OR FIRST_NAME LIKE '%an%' ORDER BY EMP_ID`,
  },
  {
    title: "Check Null Data with IS NULL / IS NOT NULL",
    slug: "basic-is-null-check",
    description: `## Problem Description
Find employees who either do NOT have a manager assigned (\`MANAGER_ID IS NULL\`) OR have a non-null commission percentage (\`COMMISSION_PCT IS NOT NULL\`).

### Expected Action
Select all columns from \`EMPLOYEES\` matching the null evaluation rule ordered by \`EMP_ID\`.`,
    difficulty: "easy" as const,
    topicTags: ["Basic SQL", "IS NULL / IS NOT NULL"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), MANAGER_ID NUMBER, COMMISSION_PCT NUMBER(3,2));
INSERT INTO EMPLOYEES VALUES (1, 'CEO', NULL, NULL);
INSERT INTO EMPLOYEES VALUES (2, 'VP', 1, 0.15);
INSERT INTO EMPLOYEES VALUES (3, 'Dev', 2, NULL);
INSERT INTO EMPLOYEES VALUES (4, 'Sales', 2, 0.20);`,
    solutionQuery: `SELECT * FROM EMPLOYEES WHERE MANAGER_ID IS NULL OR COMMISSION_PCT IS NOT NULL ORDER BY EMP_ID`,
  },
  {
    title: "Create Table and Insert Initial Record",
    slug: "basic-create-table-insert",
    description: `## Problem Description
Create a basic database table named \`STUDENTS\` to store student profile information.

### Required Columns:
- \`STUDENT_ID\` (NUMBER)
- \`NAME\` (VARCHAR2(50))
- \`AGE\` (NUMBER)

### Expected Action
Execute a \`CREATE TABLE\` DDL statement to define \`STUDENTS\`.`,
    difficulty: "easy" as const,
    topicTags: ["Basic SQL", "CREATE TABLE", "INSERT"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `SELECT 1 FROM DUAL`,
    solutionQuery: `CREATE TABLE STUDENTS (STUDENT_ID NUMBER, NAME VARCHAR2(50), AGE NUMBER)`,
    expectedOutput: {
      tableName: "STUDENTS",
      columns: [
        { name: "STUDENT_ID", dataType: "NUMBER", nullable: "Y" },
        { name: "NAME", dataType: "VARCHAR2", nullable: "Y" },
        { name: "AGE", dataType: "NUMBER", nullable: "Y" },
      ],
      constraints: [],
    },
  },

  // =========================================================================
  // TOPIC 2: DDL & DML (10 Problems)
  // =========================================================================
  {
    title: "Create Projects Table",
    slug: "ddl-create-projects-table",
    description: `## Problem Description
Create a table named \`PROJECTS\` to store organizational software projects.

### Schema Specification
- \`PROJECT_ID\` (NUMBER)
- \`PROJECT_NAME\` (VARCHAR2(100))
- \`START_DATE\` (DATE)`,
    difficulty: "easy" as const,
    topicTags: ["DDL & DML", "CREATE TABLE"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `SELECT 1 FROM DUAL`,
    solutionQuery: `CREATE TABLE PROJECTS (PROJECT_ID NUMBER, PROJECT_NAME VARCHAR2(100), START_DATE DATE)`,
    expectedOutput: {
      tableName: "PROJECTS",
      columns: [
        { name: "PROJECT_ID", dataType: "NUMBER", nullable: "Y" },
        { name: "PROJECT_NAME", dataType: "VARCHAR2", nullable: "Y" },
        { name: "START_DATE", dataType: "DATE", nullable: "Y" },
      ],
      constraints: [],
    },
  },
  {
    title: "Add Column via ALTER TABLE ADD",
    slug: "ddl-alter-table-add-column",
    description: `## Problem Description
Add a new numeric column named \`BUDGET\` with scale \`NUMBER(12,2)\` to the existing \`PROJECTS\` table using \`ALTER TABLE ADD\`.`,
    difficulty: "easy" as const,
    topicTags: ["DDL & DML", "ALTER TABLE ADD"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE PROJECTS (PROJECT_ID NUMBER, PROJECT_NAME VARCHAR2(100))`,
    solutionQuery: `ALTER TABLE PROJECTS ADD (BUDGET NUMBER(12,2))`,
    expectedOutput: {
      tableName: "PROJECTS",
      columns: [
        { name: "PROJECT_ID", dataType: "NUMBER", nullable: "Y" },
        { name: "PROJECT_NAME", dataType: "VARCHAR2", nullable: "Y" },
        { name: "BUDGET", dataType: "NUMBER", nullable: "Y" },
      ],
      constraints: [],
    },
  },
  {
    title: "Modify Column via ALTER TABLE MODIFY",
    slug: "ddl-alter-table-modify-column",
    description: `## Problem Description
Modify the data type size of column \`PROJECT_NAME\` in table \`PROJECTS\` from \`VARCHAR2(50)\` to \`VARCHAR2(150)\` using \`ALTER TABLE MODIFY\`.`,
    difficulty: "easy" as const,
    topicTags: ["DDL & DML", "ALTER TABLE MODIFY"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE PROJECTS (PROJECT_ID NUMBER, PROJECT_NAME VARCHAR2(50))`,
    solutionQuery: `ALTER TABLE PROJECTS MODIFY (PROJECT_NAME VARCHAR2(150))`,
    expectedOutput: {
      tableName: "PROJECTS",
      columns: [
        { name: "PROJECT_ID", dataType: "NUMBER", nullable: "Y" },
        { name: "PROJECT_NAME", dataType: "VARCHAR2", nullable: "Y" },
      ],
      constraints: [],
    },
  },
  {
    title: "Rename Column in Table",
    slug: "ddl-rename-column",
    description: `## Problem Description
Rename column \`BUDGET\` to \`TOTAL_BUDGET\` in the \`PROJECTS\` table using \`ALTER TABLE RENAME COLUMN\`.`,
    difficulty: "easy" as const,
    topicTags: ["DDL & DML", "Rename a column"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE PROJECTS (PROJECT_ID NUMBER, BUDGET NUMBER(12,2))`,
    solutionQuery: `ALTER TABLE PROJECTS RENAME COLUMN BUDGET TO TOTAL_BUDGET`,
    expectedOutput: {
      tableName: "PROJECTS",
      columns: [
        { name: "PROJECT_ID", dataType: "NUMBER", nullable: "Y" },
        { name: "TOTAL_BUDGET", dataType: "NUMBER", nullable: "Y" },
      ],
      constraints: [],
    },
  },
  {
    title: "Rename Database Table",
    slug: "ddl-rename-table",
    description: `## Problem Description
Rename the existing table \`PROJECTS\` to \`COMPANY_PROJECTS\` using the Oracle \`RENAME\` command.`,
    difficulty: "easy" as const,
    topicTags: ["DDL & DML", "Rename a table"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE PROJECTS (PROJECT_ID NUMBER, PROJECT_NAME VARCHAR2(100))`,
    solutionQuery: `RENAME PROJECTS TO COMPANY_PROJECTS`,
    expectedOutput: {
      tableName: "COMPANY_PROJECTS",
      columns: [
        { name: "PROJECT_ID", dataType: "NUMBER", nullable: "Y" },
        { name: "PROJECT_NAME", dataType: "VARCHAR2", nullable: "Y" },
      ],
      constraints: [],
    },
  },
  {
    title: "Drop Column from Table",
    slug: "ddl-drop-column",
    description: `## Problem Description
Drop the unnecessary column \`TEMP_NOTE\` from the \`EMPLOYEES\` table using \`ALTER TABLE DROP COLUMN\`.`,
    difficulty: "easy" as const,
    topicTags: ["DDL & DML", "Drop a column"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER, FIRST_NAME VARCHAR2(50), TEMP_NOTE VARCHAR2(100))`,
    solutionQuery: `ALTER TABLE EMPLOYEES DROP COLUMN TEMP_NOTE`,
    expectedOutput: {
      tableName: "EMPLOYEES",
      columns: [
        { name: "EMP_ID", dataType: "NUMBER", nullable: "Y" },
        { name: "FIRST_NAME", dataType: "VARCHAR2", nullable: "Y" },
      ],
      constraints: [],
    },
  },
  {
    title: "Update Employee Salaries by Department",
    slug: "dml-update-salaries-dept",
    description: `## Problem Description
Give a 15% salary increase to all employees working in department \`10\` using an \`UPDATE\` statement (\`SALARY = SALARY * 1.15\`).`,
    difficulty: "medium" as const,
    topicTags: ["DDL & DML", "UPDATE"],
    validationType: "dml_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, DEPT_ID NUMBER, SALARY NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 10, 4000);
INSERT INTO EMPLOYEES VALUES (2, 20, 5000);
INSERT INTO EMPLOYEES VALUES (3, 10, 6000);`,
    solutionQuery: `UPDATE EMPLOYEES SET SALARY = SALARY * 1.15 WHERE DEPT_ID = 10`,
  },
  {
    title: "Delete Inactive User Records",
    slug: "dml-delete-inactive-records",
    description: `## Problem Description
Delete all records from the \`EMPLOYEES\` table where employment status is marked as 'INACTIVE' using a \`DELETE\` statement.`,
    difficulty: "medium" as const,
    topicTags: ["DDL & DML", "DELETE"],
    validationType: "dml_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, NAME VARCHAR2(50), STATUS VARCHAR2(20));
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 'ACTIVE');
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 'INACTIVE');
INSERT INTO EMPLOYEES VALUES (3, 'Charlie', 'ACTIVE');
INSERT INTO EMPLOYEES VALUES (4, 'Dave', 'INACTIVE');`,
    solutionQuery: `DELETE FROM EMPLOYEES WHERE STATUS = 'INACTIVE'`,
  },
  {
    title: "Truncate Audit Logs Table",
    slug: "ddl-truncate-table",
    description: `## Problem Description
Empty all rows from the table \`AUDIT_LOGS\` instantly using \`TRUNCATE TABLE\`.`,
    difficulty: "easy" as const,
    topicTags: ["DDL & DML", "TRUNCATE TABLE"],
    validationType: "dml_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE AUDIT_LOGS (LOG_ID NUMBER PRIMARY KEY, ACTION VARCHAR2(100));
INSERT INTO AUDIT_LOGS VALUES (1, 'LOGIN');
INSERT INTO AUDIT_LOGS VALUES (2, 'UPDATE');`,
    solutionQuery: `TRUNCATE TABLE AUDIT_LOGS`,
  },
  {
    title: "Drop Temporary Table",
    slug: "ddl-drop-table",
    description: `## Problem Description
Permanently delete table \`TEMP_IMPORT_DATA\` from the schema using \`DROP TABLE\`.`,
    difficulty: "easy" as const,
    topicTags: ["DDL & DML", "DROP TABLE"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE TEMP_IMPORT_DATA (ID NUMBER, DATA VARCHAR2(100))`,
    solutionQuery: `DROP TABLE TEMP_IMPORT_DATA`,
    expectedOutput: {
      tableName: "TEMP_IMPORT_DATA",
      dropped: true,
    },
  },

  // =========================================================================
  // TOPIC 3: CONSTRAINTS (10 Problems)
  // =========================================================================
  {
    title: "Create Table with Primary Key and Not Null",
    slug: "constraints-create-pk-notnull",
    description: `## Problem Description
Create table \`DEPARTMENTS\` with \`DEPT_ID NUMBER PRIMARY KEY\` and \`DEPT_NAME VARCHAR2(50) NOT NULL\`.`,
    difficulty: "easy" as const,
    topicTags: ["Constraints", "PRIMARY KEY", "NOT NULL"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `SELECT 1 FROM DUAL`,
    solutionQuery: `CREATE TABLE DEPARTMENTS (DEPT_ID NUMBER PRIMARY KEY, DEPT_NAME VARCHAR2(50) NOT NULL)`,
    expectedOutput: {
      tableName: "DEPARTMENTS",
      columns: [
        { name: "DEPT_ID", dataType: "NUMBER", nullable: "N" },
        { name: "DEPT_NAME", dataType: "VARCHAR2", nullable: "N" },
      ],
      constraints: [{ type: "P" }],
    },
  },
  {
    title: "Create Table with Unique Constraint",
    slug: "constraints-create-unique",
    description: `## Problem Description
Create table \`USERS\` with \`USER_ID NUMBER PRIMARY KEY\`, \`USERNAME VARCHAR2(50) NOT NULL\`, and \`EMAIL VARCHAR2(100) UNIQUE\`.`,
    difficulty: "easy" as const,
    topicTags: ["Constraints", "UNIQUE"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `SELECT 1 FROM DUAL`,
    solutionQuery: `CREATE TABLE USERS (USER_ID NUMBER PRIMARY KEY, USERNAME VARCHAR2(50) NOT NULL, EMAIL VARCHAR2(100) UNIQUE)`,
    expectedOutput: {
      tableName: "USERS",
      columns: [
        { name: "USER_ID", dataType: "NUMBER", nullable: "N" },
        { name: "USERNAME", dataType: "VARCHAR2", nullable: "N" },
        { name: "EMAIL", dataType: "VARCHAR2", nullable: "Y" },
      ],
      constraints: [{ type: "P" }, { type: "U" }],
    },
  },
  {
    title: "Create Table with Check Constraints",
    slug: "constraints-create-check",
    description: `## Problem Description
Create table \`PRODUCTS\` enforcing \`PRICE NUMBER CHECK (PRICE > 0)\` and \`STOCK NUMBER CHECK (STOCK >= 0)\`.`,
    difficulty: "easy" as const,
    topicTags: ["Constraints", "CHECK"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `SELECT 1 FROM DUAL`,
    solutionQuery: `CREATE TABLE PRODUCTS (PRODUCT_ID NUMBER PRIMARY KEY, PRICE NUMBER CHECK (PRICE > 0), STOCK NUMBER CHECK (STOCK >= 0))`,
    expectedOutput: {
      tableName: "PRODUCTS",
      columns: [
        { name: "PRODUCT_ID", dataType: "NUMBER", nullable: "N" },
        { name: "PRICE", dataType: "NUMBER", nullable: "Y" },
        { name: "STOCK", dataType: "NUMBER", nullable: "Y" },
      ],
      constraints: [{ type: "P" }, { type: "C" }],
    },
  },
  {
    title: "Create Table with Default Column Values",
    slug: "constraints-create-default",
    description: `## Problem Description
Create table \`ORDERS\` with default values: \`STATUS VARCHAR2(20) DEFAULT 'PENDING'\` and \`ORDER_DATE DATE DEFAULT SYSDATE\`.`,
    difficulty: "easy" as const,
    topicTags: ["Constraints", "DEFAULT"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `SELECT 1 FROM DUAL`,
    solutionQuery: `CREATE TABLE ORDERS (ORDER_ID NUMBER PRIMARY KEY, STATUS VARCHAR2(20) DEFAULT 'PENDING', ORDER_DATE DATE DEFAULT SYSDATE)`,
    expectedOutput: {
      tableName: "ORDERS",
      columns: [
        { name: "ORDER_ID", dataType: "NUMBER", nullable: "N" },
        { name: "STATUS", dataType: "VARCHAR2", nullable: "Y" },
        { name: "ORDER_DATE", dataType: "DATE", nullable: "Y" },
      ],
      constraints: [{ type: "P" }],
    },
  },
  {
    title: "Create Table with Foreign Key Constraint",
    slug: "constraints-create-foreign-key",
    description: `## Problem Description
Given parent table \`DEPARTMENTS(DEPT_ID NUMBER PRIMARY KEY)\`, create child table \`EMPLOYEES\` referencing \`DEPARTMENTS(DEPT_ID)\`.`,
    difficulty: "medium" as const,
    topicTags: ["Constraints", "FOREIGN KEY"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE DEPARTMENTS (DEPT_ID NUMBER PRIMARY KEY)`,
    solutionQuery: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, NAME VARCHAR2(50), DEPT_ID NUMBER REFERENCES DEPARTMENTS(DEPT_ID))`,
    expectedOutput: {
      tableName: "EMPLOYEES",
      columns: [
        { name: "EMP_ID", dataType: "NUMBER", nullable: "N" },
        { name: "NAME", dataType: "VARCHAR2", nullable: "Y" },
        { name: "DEPT_ID", dataType: "NUMBER", nullable: "Y" },
      ],
      constraints: [{ type: "P" }, { type: "R" }],
    },
  },
  {
    title: "Create Composite Primary Key Constraint",
    slug: "constraints-composite-primary-key",
    description: `## Problem Description
Create table \`ENROLLMENTS\` with table-level composite primary key on \`(STUDENT_ID, COURSE_ID)\`.`,
    difficulty: "medium" as const,
    topicTags: ["Constraints", "PRIMARY KEY", "Multiple constraints in a table"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `SELECT 1 FROM DUAL`,
    solutionQuery: `CREATE TABLE ENROLLMENTS (STUDENT_ID NUMBER, COURSE_ID NUMBER, SEMESTER VARCHAR2(10), PRIMARY KEY (STUDENT_ID, COURSE_ID))`,
    expectedOutput: {
      tableName: "ENROLLMENTS",
      columns: [
        { name: "STUDENT_ID", dataType: "NUMBER", nullable: "N" },
        { name: "COURSE_ID", dataType: "NUMBER", nullable: "N" },
        { name: "SEMESTER", dataType: "VARCHAR2", nullable: "Y" },
      ],
      constraints: [{ type: "P" }],
    },
  },
  {
    title: "Multiple Constraints in Table Definition",
    slug: "constraints-multiple-constraints",
    description: `## Problem Description
Create table \`ACCOUNTS\` with primary key on \`ACC_ID\`, unique constraint on \`EMAIL\`, and check constraint \`BALANCE >= 0\`.`,
    difficulty: "medium" as const,
    topicTags: ["Constraints", "Multiple constraints in a table"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `SELECT 1 FROM DUAL`,
    solutionQuery: `CREATE TABLE ACCOUNTS (ACC_ID NUMBER PRIMARY KEY, EMAIL VARCHAR2(100) UNIQUE, BALANCE NUMBER CHECK (BALANCE >= 0))`,
    expectedOutput: {
      tableName: "ACCOUNTS",
      columns: [
        { name: "ACC_ID", dataType: "NUMBER", nullable: "N" },
        { name: "EMAIL", dataType: "VARCHAR2", nullable: "Y" },
        { name: "BALANCE", dataType: "NUMBER", nullable: "Y" },
      ],
      constraints: [{ type: "P" }, { type: "U" }, { type: "C" }],
    },
  },
  {
    title: "Add Check Constraint using ALTER TABLE",
    slug: "constraints-add-check-alter-table",
    description: `## Problem Description
Add a named CHECK constraint \`EMP_AGE_CK\` to existing table \`EMPLOYEES\` ensuring \`AGE >= 18\`.`,
    difficulty: "medium" as const,
    topicTags: ["Constraints", "Add a constraint using ALTER TABLE"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, AGE NUMBER)`,
    solutionQuery: `ALTER TABLE EMPLOYEES ADD CONSTRAINT EMP_AGE_CK CHECK (AGE >= 18)`,
    expectedOutput: {
      tableName: "EMPLOYEES",
      columns: [
        { name: "EMP_ID", dataType: "NUMBER", nullable: "N" },
        { name: "AGE", dataType: "NUMBER", nullable: "Y" },
      ],
      constraints: [{ type: "P" }, { type: "C" }],
    },
  },
  {
    title: "Add Foreign Key Constraint using ALTER TABLE",
    slug: "constraints-add-fk-alter-table",
    description: `## Problem Description
Add foreign key constraint \`EMP_DEPT_FK\` linking \`EMPLOYEES(DEPT_ID)\` to \`DEPARTMENTS(DEPT_ID)\` using \`ALTER TABLE\`.`,
    difficulty: "medium" as const,
    topicTags: ["Constraints", "Add a constraint using ALTER TABLE", "FOREIGN KEY"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE DEPARTMENTS (DEPT_ID NUMBER PRIMARY KEY); CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, DEPT_ID NUMBER);`,
    solutionQuery: `ALTER TABLE EMPLOYEES ADD CONSTRAINT EMP_DEPT_FK FOREIGN KEY (DEPT_ID) REFERENCES DEPARTMENTS(DEPT_ID)`,
    expectedOutput: {
      tableName: "EMPLOYEES",
      columns: [
        { name: "EMP_ID", dataType: "NUMBER", nullable: "N" },
        { name: "DEPT_ID", dataType: "NUMBER", nullable: "Y" },
      ],
      constraints: [{ type: "P" }, { type: "R" }],
    },
  },
  {
    title: "Drop a Constraint using ALTER TABLE",
    slug: "constraints-drop-constraint",
    description: `## Problem Description
Drop constraint named \`EMP_SALARY_CK\` from table \`EMPLOYEES\` using \`ALTER TABLE DROP CONSTRAINT\`.`,
    difficulty: "medium" as const,
    topicTags: ["Constraints", "Drop a constraint"],
    validationType: "ddl_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, SALARY NUMBER, CONSTRAINT EMP_SALARY_CK CHECK (SALARY > 0))`,
    solutionQuery: `ALTER TABLE EMPLOYEES DROP CONSTRAINT EMP_SALARY_CK`,
    expectedOutput: {
      tableName: "EMPLOYEES",
      columns: [
        { name: "EMP_ID", dataType: "NUMBER", nullable: "N" },
        { name: "SALARY", dataType: "NUMBER", nullable: "Y" },
      ],
      constraints: [{ type: "P" }],
    },
  },

  // =========================================================================
  // TOPIC 4: FUNCTIONS (10 Problems)
  // =========================================================================
  {
    title: "Aggregate Functions — Salary Summary",
    slug: "functions-aggregate-salary-summary",
    description: `## Problem Description
Compute aggregate statistical functions across all employees in \`EMPLOYEES\`:
- \`COUNT(*)\` AS \`TOTAL_EMP\`
- \`SUM(SALARY)\` AS \`TOTAL_SAL\`
- \`AVG(SALARY)\` AS \`AVG_SAL\`
- \`MAX(SALARY)\` AS \`MAX_SAL\`
- \`MIN(SALARY)\` AS \`MIN_SAL\``,
    difficulty: "easy" as const,
    topicTags: ["Functions", "Aggregate"],
    validationType: "select_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, SALARY NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 4000);
INSERT INTO EMPLOYEES VALUES (2, 6000);
INSERT INTO EMPLOYEES VALUES (3, 8000);
INSERT INTO EMPLOYEES VALUES (4, 10000);`,
    solutionQuery: `SELECT COUNT(*) AS TOTAL_EMP, SUM(SALARY) AS TOTAL_SAL, AVG(SALARY) AS AVG_SAL, MAX(SALARY) AS MAX_SAL, MIN(SALARY) AS MIN_SAL FROM EMPLOYEES`,
  },
  {
    title: "String Functions — UPPER and LOWER",
    slug: "functions-string-upper-lower",
    description: `## Problem Description
Convert employee \`FIRST_NAME\` to uppercase (\`UPPER_NAME\`) and \`EMAIL\` to lowercase (\`LOWER_EMAIL\`).

### Expected Action
Select \`UPPER(FIRST_NAME) AS UPPER_NAME\` and \`LOWER(EMAIL) AS LOWER_EMAIL\` ordered by \`EMP_ID\`.`,
    difficulty: "easy" as const,
    topicTags: ["Functions", "String"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), EMAIL VARCHAR2(100));
INSERT INTO EMPLOYEES VALUES (1, 'john', 'JOHN.DOE@COMPANY.COM');
INSERT INTO EMPLOYEES VALUES (2, 'alice', 'ALICE.SMITH@COMPANY.COM');`,
    solutionQuery: `SELECT UPPER(FIRST_NAME) AS UPPER_NAME, LOWER(EMAIL) AS LOWER_EMAIL FROM EMPLOYEES ORDER BY EMP_ID`,
  },
  {
    title: "String Functions — LENGTH and SUBSTR",
    slug: "functions-string-length-substr",
    description: `## Problem Description
Display \`FIRST_NAME\`, first 3 characters of \`FIRST_NAME\` as \`SHORT_NAME\`, and length of \`LAST_NAME\` as \`NAME_LEN\`.

### Expected Action
Select \`FIRST_NAME\`, \`SUBSTR(FIRST_NAME, 1, 3) AS SHORT_NAME\`, \`LENGTH(LAST_NAME) AS NAME_LEN\` ordered by \`EMP_ID\`.`,
    difficulty: "easy" as const,
    topicTags: ["Functions", "String"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), LAST_NAME VARCHAR2(50));
INSERT INTO EMPLOYEES VALUES (1, 'Christopher', 'Nolan');
INSERT INTO EMPLOYEES VALUES (2, 'Elizabeth', 'Olsen');`,
    solutionQuery: `SELECT FIRST_NAME, SUBSTR(FIRST_NAME, 1, 3) AS SHORT_NAME, LENGTH(LAST_NAME) AS NAME_LEN FROM EMPLOYEES ORDER BY EMP_ID`,
  },
  {
    title: "String Search — INSTR Function",
    slug: "functions-string-instr",
    description: `## Problem Description
Find the 1-based index position of the '@' symbol in the \`EMAIL\` column using \`INSTR(EMAIL, '@')\`.

### Expected Action
Select \`EMAIL\` and \`INSTR(EMAIL, '@') AS AT_POSITION\` from \`EMPLOYEES\` ordered by \`EMP_ID\`.`,
    difficulty: "easy" as const,
    topicTags: ["Functions", "String"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, EMAIL VARCHAR2(100));
INSERT INTO EMPLOYEES VALUES (1, 'alex.turner@gmail.com');
INSERT INTO EMPLOYEES VALUES (2, 'sarah.connor@cyberdyne.org');`,
    solutionQuery: `SELECT EMAIL, INSTR(EMAIL, '@') AS AT_POSITION FROM EMPLOYEES ORDER BY EMP_ID`,
  },
  {
    title: "Numeric Functions — ROUND, CEIL, and FLOOR",
    slug: "functions-numeric-round-ceil-floor",
    description: `## Problem Description
Perform numeric calculations on daily rates (\`SALARY / 30\`):
- \`ROUND(SALARY / 30, 2)\` AS \`ROUNDED_RATE\`
- \`CEIL(SALARY / 30)\` AS \`CEIL_RATE\`
- \`FLOOR(SALARY / 30)\` AS \`FLOOR_RATE\``,
    difficulty: "easy" as const,
    topicTags: ["Functions", "Numeric"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, SALARY NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 5500);
INSERT INTO EMPLOYEES VALUES (2, 7250);`,
    solutionQuery: `SELECT SALARY, ROUND(SALARY / 30, 2) AS ROUNDED_RATE, CEIL(SALARY / 30) AS CEIL_RATE, FLOOR(SALARY / 30) AS FLOOR_RATE FROM EMPLOYEES ORDER BY EMP_ID`,
  },
  {
    title: "Numeric Functions — MOD and ABS",
    slug: "functions-numeric-mod-abs",
    description: `## Problem Description
Compute remainder using \`MOD(SALARY, 1000)\` as \`SALARY_REM\` and absolute difference \`ABS(BONUS - DEDUCTION)\` as \`NET_VARIANCE\`.`,
    difficulty: "easy" as const,
    topicTags: ["Functions", "Numeric"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, SALARY NUMBER, BONUS NUMBER, DEDUCTION NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 5400, 1000, 1500);
INSERT INTO EMPLOYEES VALUES (2, 6800, 2000, 1200);`,
    solutionQuery: `SELECT EMP_ID, SALARY, MOD(SALARY, 1000) AS SALARY_REM, ABS(BONUS - DEDUCTION) AS NET_VARIANCE FROM EMPLOYEES ORDER BY EMP_ID`,
  },
  {
    title: "Date Functions — ADD_MONTHS",
    slug: "functions-date-add-months",
    description: `## Problem Description
Calculate probation completion date exactly 6 months after \`HIRE_DATE\` using \`ADD_MONTHS(HIRE_DATE, 6)\`.

### Expected Action
Select \`FIRST_NAME\`, \`HIRE_DATE\`, and \`ADD_MONTHS(HIRE_DATE, 6) AS PROBATION_END\` ordered by \`EMP_ID\`.`,
    difficulty: "medium" as const,
    topicTags: ["Functions", "Date"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), HIRE_DATE DATE);
INSERT INTO EMPLOYEES VALUES (1, 'John', TO_DATE('2023-01-15', 'YYYY-MM-DD'));
INSERT INTO EMPLOYEES VALUES (2, 'Jane', TO_DATE('2023-04-01', 'YYYY-MM-DD'));`,
    solutionQuery: `SELECT FIRST_NAME, HIRE_DATE, ADD_MONTHS(HIRE_DATE, 6) AS PROBATION_END FROM EMPLOYEES ORDER BY EMP_ID`,
  },
  {
    title: "Date Functions — MONTHS_BETWEEN",
    slug: "functions-date-months-between",
    description: `## Problem Description
Calculate difference in months between \`LEAVE_DATE\` and \`HIRE_DATE\` using \`MONTHS_BETWEEN\`.

### Expected Action
Select \`EMP_ID\`, \`FIRST_NAME\`, and \`ROUND(MONTHS_BETWEEN(LEAVE_DATE, HIRE_DATE), 1) AS TENURE_MONTHS\` ordered by \`EMP_ID\`.`,
    difficulty: "medium" as const,
    topicTags: ["Functions", "Date"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), HIRE_DATE DATE, LEAVE_DATE DATE);
INSERT INTO EMPLOYEES VALUES (1, 'Bob', TO_DATE('2022-01-01', 'YYYY-MM-DD'), TO_DATE('2023-07-01', 'YYYY-MM-DD'));
INSERT INTO EMPLOYEES VALUES (2, 'Carol', TO_DATE('2021-06-01', 'YYYY-MM-DD'), TO_DATE('2023-12-01', 'YYYY-MM-DD'));`,
    solutionQuery: `SELECT EMP_ID, FIRST_NAME, ROUND(MONTHS_BETWEEN(LEAVE_DATE, HIRE_DATE), 1) AS TENURE_MONTHS FROM EMPLOYEES ORDER BY EMP_ID`,
  },
  {
    title: "Date Functions — NEXT_DAY and LAST_DAY",
    slug: "functions-date-next-last-day",
    description: `## Problem Description
Display the last calendar day of the hire month using \`LAST_DAY(HIRE_DATE)\` as \`MONTH_END\` and the date of the next Monday using \`NEXT_DAY(HIRE_DATE, 'MONDAY')\` as \`NEXT_MONDAY\`.`,
    difficulty: "medium" as const,
    topicTags: ["Functions", "Date"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, HIRE_DATE DATE);
INSERT INTO EMPLOYEES VALUES (1, TO_DATE('2023-02-10', 'YYYY-MM-DD'));
INSERT INTO EMPLOYEES VALUES (2, TO_DATE('2023-03-15', 'YYYY-MM-DD'));`,
    solutionQuery: `SELECT HIRE_DATE, LAST_DAY(HIRE_DATE) AS MONTH_END, NEXT_DAY(HIRE_DATE, 'MONDAY') AS NEXT_MONDAY FROM EMPLOYEES ORDER BY EMP_ID`,
  },
  {
    title: "String Concatenation & Character Counting",
    slug: "functions-string-concat-length",
    description: `## Problem Description
Concatenate \`FIRST_NAME\` and \`LAST_NAME\` with a space into \`FULL_NAME\` and calculate total characters (\`TOTAL_CHARS\`).`,
    difficulty: "easy" as const,
    topicTags: ["Functions", "String"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), LAST_NAME VARCHAR2(50));
INSERT INTO EMPLOYEES VALUES (1, 'Bruce', 'Wayne');
INSERT INTO EMPLOYEES VALUES (2, 'Clark', 'Kent');`,
    solutionQuery: `SELECT FIRST_NAME || ' ' || LAST_NAME AS FULL_NAME, LENGTH(FIRST_NAME || LAST_NAME) AS TOTAL_CHARS FROM EMPLOYEES ORDER BY EMP_ID`,
  },

  // =========================================================================
  // TOPIC 5: GROUP BY & HAVING (10 Problems)
  // =========================================================================
  {
    title: "Department-wise Employee Count",
    slug: "groupby-department-count",
    description: `## Problem Description
Group employees by \`DEPT_ID\` and calculate total headcount (\`EMP_COUNT\`) using \`GROUP BY\`.`,
    difficulty: "easy" as const,
    topicTags: ["GROUP BY & HAVING", "GROUP BY", "COUNT with GROUP BY"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, DEPT_ID NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 10);
INSERT INTO EMPLOYEES VALUES (2, 10);
INSERT INTO EMPLOYEES VALUES (3, 20);
INSERT INTO EMPLOYEES VALUES (4, 20);
INSERT INTO EMPLOYEES VALUES (5, 20);`,
    solutionQuery: `SELECT DEPT_ID, COUNT(*) AS EMP_COUNT FROM EMPLOYEES GROUP BY DEPT_ID ORDER BY DEPT_ID`,
  },
  {
    title: "Department-wise Average Salary",
    slug: "groupby-department-average-salary",
    description: `## Problem Description
Calculate the average salary rounded to 2 decimal places for each department using \`GROUP BY DEPT_ID\`.`,
    difficulty: "easy" as const,
    topicTags: ["GROUP BY & HAVING", "Department/course-wise average"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, DEPT_ID NUMBER, SALARY NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 10, 5000);
INSERT INTO EMPLOYEES VALUES (2, 10, 7000);
INSERT INTO EMPLOYEES VALUES (3, 20, 4000);
INSERT INTO EMPLOYEES VALUES (4, 20, 8000);`,
    solutionQuery: `SELECT DEPT_ID, ROUND(AVG(SALARY), 2) AS AVG_SALARY FROM EMPLOYEES GROUP BY DEPT_ID ORDER BY DEPT_ID`,
  },
  {
    title: "Department-wise Maximum & Minimum Salary",
    slug: "groupby-department-max-min",
    description: `## Problem Description
Find the highest (\`MAX_SALARY\`) and lowest (\`MIN_SALARY\`) salary per department using \`GROUP BY DEPT_ID\`.`,
    difficulty: "easy" as const,
    topicTags: ["GROUP BY & HAVING", "Department-wise maximum/minimum"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, DEPT_ID NUMBER, SALARY NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 10, 5000);
INSERT INTO EMPLOYEES VALUES (2, 10, 7000);
INSERT INTO EMPLOYEES VALUES (3, 20, 4000);
INSERT INTO EMPLOYEES VALUES (4, 20, 8000);`,
    solutionQuery: `SELECT DEPT_ID, MAX(SALARY) AS MAX_SALARY, MIN(SALARY) AS MIN_SALARY FROM EMPLOYEES GROUP BY DEPT_ID ORDER BY DEPT_ID`,
  },
  {
    title: "Job Title-wise Employee Count & Total Salary",
    slug: "groupby-job-title-count-sum",
    description: `## Problem Description
Group employees by \`JOB_ID\` and output \`JOB_ID\`, count of staff (\`TOTAL_STAFF\`), and total salary (\`TOTAL_PAYOUT\`).`,
    difficulty: "easy" as const,
    topicTags: ["GROUP BY & HAVING", "COUNT with GROUP BY"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, JOB_ID VARCHAR2(20), SALARY NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 'DEV', 6000);
INSERT INTO EMPLOYEES VALUES (2, 'DEV', 7000);
INSERT INTO EMPLOYEES VALUES (3, 'MGR', 10000);
INSERT INTO EMPLOYEES VALUES (4, 'MGR', 12000);`,
    solutionQuery: `SELECT JOB_ID, COUNT(*) AS TOTAL_STAFF, SUM(SALARY) AS TOTAL_PAYOUT FROM EMPLOYEES GROUP BY JOB_ID ORDER BY JOB_ID`,
  },
  {
    title: "Filter Groups using HAVING Clause",
    slug: "groupby-having-high-average",
    description: `## Problem Description
Find departments where the average employee salary is strictly greater than \`6000\` using \`HAVING AVG(SALARY) > 6000\`.`,
    difficulty: "medium" as const,
    topicTags: ["GROUP BY & HAVING", "HAVING"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, DEPT_ID NUMBER, SALARY NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 10, 4000);
INSERT INTO EMPLOYEES VALUES (2, 10, 5000);
INSERT INTO EMPLOYEES VALUES (3, 20, 7000);
INSERT INTO EMPLOYEES VALUES (4, 20, 9000);`,
    solutionQuery: `SELECT DEPT_ID, AVG(SALARY) AS AVG_SALARY FROM EMPLOYEES GROUP BY DEPT_ID HAVING AVG(SALARY) > 6000 ORDER BY DEPT_ID`,
  },
  {
    title: "WHERE vs HAVING Filtering Comparison",
    slug: "groupby-where-vs-having",
    description: `## Problem Description
Demonstrate \`WHERE vs HAVING\`: Filter active employees (\`WHERE STATUS = 'ACTIVE'\`), group by \`DEPT_ID\`, and return departments having more than 2 active employees (\`HAVING COUNT(*) > 2\`).`,
    difficulty: "medium" as const,
    topicTags: ["GROUP BY & HAVING", "WHERE vs HAVING"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, DEPT_ID NUMBER, STATUS VARCHAR2(20));
INSERT INTO EMPLOYEES VALUES (1, 10, 'ACTIVE');
INSERT INTO EMPLOYEES VALUES (2, 10, 'ACTIVE');
INSERT INTO EMPLOYEES VALUES (3, 10, 'INACTIVE');
INSERT INTO EMPLOYEES VALUES (4, 20, 'ACTIVE');
INSERT INTO EMPLOYEES VALUES (5, 20, 'ACTIVE');
INSERT INTO EMPLOYEES VALUES (6, 20, 'ACTIVE');`,
    solutionQuery: `SELECT DEPT_ID, COUNT(*) AS ACTIVE_COUNT FROM EMPLOYEES WHERE STATUS = 'ACTIVE' GROUP BY DEPT_ID HAVING COUNT(*) > 2 ORDER BY DEPT_ID`,
  },
  {
    title: "Course-wise Student Count Filter",
    slug: "groupby-course-student-count",
    description: `## Problem Description
Group students by \`COURSE_ID\` and display courses having at least 3 enrolled students using \`HAVING COUNT(*) >= 3\`.`,
    difficulty: "easy" as const,
    topicTags: ["GROUP BY & HAVING", "Department/course-wise average"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE STUDENTS (STUDENT_ID NUMBER PRIMARY KEY, COURSE_ID NUMBER);
INSERT INTO STUDENTS VALUES (1, 101);
INSERT INTO STUDENTS VALUES (2, 101);
INSERT INTO STUDENTS VALUES (3, 101);
INSERT INTO STUDENTS VALUES (4, 102);
INSERT INTO STUDENTS VALUES (5, 102);`,
    solutionQuery: `SELECT COURSE_ID, COUNT(*) AS STUDENT_COUNT FROM STUDENTS GROUP BY COURSE_ID HAVING COUNT(*) >= 3 ORDER BY COURSE_ID`,
  },
  {
    title: "Category-wise Sales Volume with HAVING",
    slug: "groupby-category-sales-having",
    description: `## Problem Description
Group sales transactions by \`CATEGORY\` and return categories where total revenue (\`SUM(AMOUNT)\`) exceeds \`10000\`.`,
    difficulty: "medium" as const,
    topicTags: ["GROUP BY & HAVING", "HAVING"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE SALES (SALE_ID NUMBER PRIMARY KEY, CATEGORY VARCHAR2(50), AMOUNT NUMBER);
INSERT INTO SALES VALUES (1, 'Electronics', 6000);
INSERT INTO SALES VALUES (2, 'Electronics', 5000);
INSERT INTO SALES VALUES (3, 'Clothing', 3000);
INSERT INTO SALES VALUES (4, 'Clothing', 4000);`,
    solutionQuery: `SELECT CATEGORY, SUM(AMOUNT) AS TOTAL_SALES FROM SALES GROUP BY CATEGORY HAVING SUM(AMOUNT) > 10000 ORDER BY CATEGORY`,
  },
  {
    title: "Group By Multiple Columns (Dept & Job)",
    slug: "groupby-multiple-columns-dept-job",
    description: `## Problem Description
Group employees by both \`DEPT_ID\` and \`JOB_ID\` simultaneously and output employee count and average salary.`,
    difficulty: "medium" as const,
    topicTags: ["GROUP BY & HAVING", "GROUP BY"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, DEPT_ID NUMBER, JOB_ID VARCHAR2(20), SALARY NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 10, 'DEV', 5000);
INSERT INTO EMPLOYEES VALUES (2, 10, 'DEV', 6000);
INSERT INTO EMPLOYEES VALUES (3, 10, 'MGR', 9000);
INSERT INTO EMPLOYEES VALUES (4, 20, 'DEV', 5500);`,
    solutionQuery: `SELECT DEPT_ID, JOB_ID, COUNT(*) AS EMP_COUNT, AVG(SALARY) AS AVG_SALARY FROM EMPLOYEES GROUP BY DEPT_ID, JOB_ID ORDER BY DEPT_ID, JOB_ID`,
  },
  {
    title: "Filter Department Total Payroll Range",
    slug: "groupby-payroll-range-having",
    description: `## Problem Description
Identify departments whose total salary payroll (\`SUM(SALARY)\`) falls between \`15000\` and \`50000\` using \`HAVING SUM(SALARY) BETWEEN ...\`.`,
    difficulty: "medium" as const,
    topicTags: ["GROUP BY & HAVING", "HAVING"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, DEPT_ID NUMBER, SALARY NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 10, 10000);
INSERT INTO EMPLOYEES VALUES (2, 10, 10000);
INSERT INTO EMPLOYEES VALUES (3, 20, 5000);
INSERT INTO EMPLOYEES VALUES (4, 30, 30000);
INSERT INTO EMPLOYEES VALUES (5, 30, 30000);`,
    solutionQuery: `SELECT DEPT_ID, SUM(SALARY) AS TOTAL_PAYROLL FROM EMPLOYEES GROUP BY DEPT_ID HAVING SUM(SALARY) BETWEEN 15000 AND 50000 ORDER BY DEPT_ID`,
  },

  // =========================================================================
  // TOPIC 6: JOINS (10 Problems)
  // =========================================================================
  {
    title: "INNER JOIN — Employees & Departments",
    slug: "joins-inner-join-emp-dept",
    description: `## Problem Description
Join \`EMPLOYEES\` and \`DEPARTMENTS\` on \`DEPT_ID\` to retrieve \`FIRST_NAME\`, \`LAST_NAME\`, \`DEPT_ID\`, and \`DEPT_NAME\`.`,
    difficulty: "easy" as const,
    topicTags: ["Joins", "INNER JOIN", "Joining students/employees with department/course details"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE DEPARTMENTS (DEPT_ID NUMBER PRIMARY KEY, DEPT_NAME VARCHAR2(50));
CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), LAST_NAME VARCHAR2(50), DEPT_ID NUMBER);
INSERT INTO DEPARTMENTS VALUES (10, 'Sales');
INSERT INTO DEPARTMENTS VALUES (20, 'Engineering');
INSERT INTO EMPLOYEES VALUES (1, 'John', 'Doe', 10);
INSERT INTO EMPLOYEES VALUES (2, 'Jane', 'Smith', 20);`,
    solutionQuery: `SELECT e.FIRST_NAME, e.LAST_NAME, e.DEPT_ID, d.DEPT_NAME FROM EMPLOYEES e INNER JOIN DEPARTMENTS d ON e.DEPT_ID = d.DEPT_ID ORDER BY e.EMP_ID`,
  },
  {
    title: "LEFT OUTER JOIN — All Departments & Employees",
    slug: "joins-left-outer-join-dept",
    description: `## Problem Description
Display all departments along with employee names, ensuring departments without employees are also listed using \`LEFT OUTER JOIN\`.`,
    difficulty: "easy" as const,
    topicTags: ["Joins", "LEFT OUTER JOIN"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE DEPARTMENTS (DEPT_ID NUMBER PRIMARY KEY, DEPT_NAME VARCHAR2(50));
CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), DEPT_ID NUMBER);
INSERT INTO DEPARTMENTS VALUES (10, 'Sales');
INSERT INTO DEPARTMENTS VALUES (20, 'Engineering');
INSERT INTO DEPARTMENTS VALUES (30, 'Marketing');
INSERT INTO EMPLOYEES VALUES (1, 'John', 10);`,
    solutionQuery: `SELECT d.DEPT_ID, d.DEPT_NAME, e.FIRST_NAME FROM DEPARTMENTS d LEFT OUTER JOIN EMPLOYEES e ON d.DEPT_ID = e.DEPT_ID ORDER BY d.DEPT_ID, e.FIRST_NAME`,
  },
  {
    title: "RIGHT OUTER JOIN — Employees & Projects",
    slug: "joins-right-outer-join-projects",
    description: `## Problem Description
Perform a \`RIGHT OUTER JOIN\` between \`EMPLOYEES\` and \`PROJECTS\` to ensure all project records are displayed.`,
    difficulty: "medium" as const,
    topicTags: ["Joins", "RIGHT OUTER JOIN"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE PROJECTS (PROJECT_ID NUMBER PRIMARY KEY, PROJECT_NAME VARCHAR2(50));
CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), PROJECT_ID NUMBER);
INSERT INTO PROJECTS VALUES (101, 'Alpha');
INSERT INTO PROJECTS VALUES (102, 'Beta');
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 101);`,
    solutionQuery: `SELECT e.FIRST_NAME, p.PROJECT_ID, p.PROJECT_NAME FROM EMPLOYEES e RIGHT OUTER JOIN PROJECTS p ON e.PROJECT_ID = p.PROJECT_ID ORDER BY p.PROJECT_ID`,
  },
  {
    title: "FULL OUTER JOIN — Employee & Department Audit",
    slug: "joins-full-outer-join-audit",
    description: `## Problem Description
Perform a \`FULL OUTER JOIN\` between \`EMPLOYEES\` and \`DEPARTMENTS\` to include all unmatched employees and departments.`,
    difficulty: "medium" as const,
    topicTags: ["Joins", "FULL OUTER JOIN"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE DEPARTMENTS (DEPT_ID NUMBER PRIMARY KEY, DEPT_NAME VARCHAR2(50));
CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), DEPT_ID NUMBER);
INSERT INTO DEPARTMENTS VALUES (10, 'HR');
INSERT INTO DEPARTMENTS VALUES (20, 'IT');
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 10);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 99);`,
    solutionQuery: `SELECT e.FIRST_NAME, d.DEPT_ID, d.DEPT_NAME FROM EMPLOYEES e FULL OUTER JOIN DEPARTMENTS d ON e.DEPT_ID = d.DEPT_ID ORDER BY e.FIRST_NAME, d.DEPT_ID`,
  },
  {
    title: "SELF JOIN — Employee & Manager Hierarchy",
    slug: "joins-self-join-hierarchy",
    description: `## Problem Description
Join \`EMPLOYEES\` table with itself to list employee names (\`EMP_NAME\`) alongside their manager's name (\`MANAGER_NAME\`).`,
    difficulty: "medium" as const,
    topicTags: ["Joins", "SELF JOIN"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), MANAGER_ID NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 'King', NULL);
INSERT INTO EMPLOYEES VALUES (2, 'Blake', 1);
INSERT INTO EMPLOYEES VALUES (3, 'Clark', 1);`,
    solutionQuery: `SELECT e.FIRST_NAME AS EMP_NAME, m.FIRST_NAME AS MANAGER_NAME FROM EMPLOYEES e INNER JOIN EMPLOYEES m ON e.MANAGER_ID = m.EMP_ID ORDER BY e.EMP_ID`,
  },
  {
    title: "CROSS JOIN — Product & Region Matrix",
    slug: "joins-cross-join-matrix",
    description: `## Problem Description
Generate a cartesian product matrix of all products and sales regions using \`CROSS JOIN\`.`,
    difficulty: "easy" as const,
    topicTags: ["Joins", "CROSS JOIN"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE PRODUCTS (PRODUCT_NAME VARCHAR2(50));
CREATE TABLE REGIONS (REGION_NAME VARCHAR2(50));
INSERT INTO PRODUCTS VALUES ('Laptop');
INSERT INTO PRODUCTS VALUES ('Phone');
INSERT INTO REGIONS VALUES ('North');
INSERT INTO REGIONS VALUES ('South');`,
    solutionQuery: `SELECT p.PRODUCT_NAME, r.REGION_NAME FROM PRODUCTS p CROSS JOIN REGIONS r ORDER BY p.PRODUCT_NAME, r.REGION_NAME`,
  },
  {
    title: "Three-Table Join — Employees, Depts & Locations",
    slug: "joins-three-tables-emp-dept-loc",
    description: `## Problem Description
Join three tables (\`EMPLOYEES\`, \`DEPARTMENTS\`, \`LOCATIONS\`) to output employee name, department name, and city.`,
    difficulty: "hard" as const,
    topicTags: ["Joins", "Joining three tables"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE LOCATIONS (LOCATION_ID NUMBER PRIMARY KEY, CITY VARCHAR2(50));
CREATE TABLE DEPARTMENTS (DEPT_ID NUMBER PRIMARY KEY, DEPT_NAME VARCHAR2(50), LOCATION_ID NUMBER);
CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), DEPT_ID NUMBER);
INSERT INTO LOCATIONS VALUES (100, 'New York');
INSERT INTO DEPARTMENTS VALUES (10, 'Finance', 100);
INSERT INTO EMPLOYEES VALUES (1, 'David', 10);`,
    solutionQuery: `SELECT e.FIRST_NAME, d.DEPT_NAME, l.CITY FROM EMPLOYEES e INNER JOIN DEPARTMENTS d ON e.DEPT_ID = d.DEPT_ID INNER JOIN LOCATIONS l ON d.LOCATION_ID = l.LOCATION_ID ORDER BY e.EMP_ID`,
  },
  {
    title: "Student & Course Registration Join",
    slug: "joins-student-course-details",
    description: `## Problem Description
Join \`STUDENTS\`, \`ENROLLMENTS\`, and \`COURSES\` to list student name, course code, and course title.`,
    difficulty: "hard" as const,
    topicTags: ["Joins", "Joining students/employees with department/course details"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE STUDENTS (STUDENT_ID NUMBER PRIMARY KEY, STUDENT_NAME VARCHAR2(50));
CREATE TABLE COURSES (COURSE_ID NUMBER PRIMARY KEY, COURSE_CODE VARCHAR2(20), COURSE_TITLE VARCHAR2(50));
CREATE TABLE ENROLLMENTS (STUDENT_ID NUMBER, COURSE_ID NUMBER);
INSERT INTO STUDENTS VALUES (1, 'Alice');
INSERT INTO COURSES VALUES (101, 'CS101', 'Database Systems');
INSERT INTO ENROLLMENTS VALUES (1, 101);`,
    solutionQuery: `SELECT s.STUDENT_NAME, c.COURSE_CODE, c.COURSE_TITLE FROM STUDENTS s INNER JOIN ENROLLMENTS e ON s.STUDENT_ID = e.STUDENT_ID INNER JOIN COURSES c ON e.COURSE_ID = c.COURSE_ID ORDER BY s.STUDENT_NAME`,
  },
  {
    title: "LEFT JOIN — Identify Unassigned Employees",
    slug: "joins-left-join-unassigned-emp",
    description: `## Problem Description
Use a \`LEFT JOIN\` between \`EMPLOYEES\` and \`DEPARTMENTS\` filtering where \`d.DEPT_ID IS NULL\` to find unassigned employees.`,
    difficulty: "medium" as const,
    topicTags: ["Joins", "LEFT OUTER JOIN"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE DEPARTMENTS (DEPT_ID NUMBER PRIMARY KEY, DEPT_NAME VARCHAR2(50));
CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), DEPT_ID NUMBER);
INSERT INTO DEPARTMENTS VALUES (10, 'Sales');
INSERT INTO EMPLOYEES VALUES (1, 'John', 10);
INSERT INTO EMPLOYEES VALUES (2, 'Mark', 999);`,
    solutionQuery: `SELECT e.EMP_ID, e.FIRST_NAME FROM EMPLOYEES e LEFT JOIN DEPARTMENTS d ON e.DEPT_ID = d.DEPT_ID WHERE d.DEPT_ID IS NULL ORDER BY e.EMP_ID`,
  },
  {
    title: "Customer & Orders Filtered Join",
    slug: "joins-customer-orders-filtered",
    description: `## Problem Description
Join \`CUSTOMERS\` and \`ORDERS\` to display customer name, order date, and total order amount for all orders strictly above \`500\`.`,
    difficulty: "medium" as const,
    topicTags: ["Joins", "INNER JOIN"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE CUSTOMERS (CUSTOMER_ID NUMBER PRIMARY KEY, CUSTOMER_NAME VARCHAR2(50));
CREATE TABLE ORDERS (ORDER_ID NUMBER PRIMARY KEY, CUSTOMER_ID NUMBER, ORDER_DATE DATE, AMOUNT NUMBER);
INSERT INTO CUSTOMERS VALUES (1, 'Acme Corp');
INSERT INTO ORDERS VALUES (101, 1, TO_DATE('2023-05-10', 'YYYY-MM-DD'), 750);
INSERT INTO ORDERS VALUES (102, 1, TO_DATE('2023-05-12', 'YYYY-MM-DD'), 200);`,
    solutionQuery: `SELECT c.CUSTOMER_NAME, o.ORDER_DATE, o.AMOUNT FROM CUSTOMERS c INNER JOIN ORDERS o ON c.CUSTOMER_ID = o.CUSTOMER_ID WHERE o.AMOUNT > 500 ORDER BY o.ORDER_DATE`,
  },

  // =========================================================================
  // TOPIC 7: SUBQUERIES (10 Problems)
  // =========================================================================
  {
    title: "Single-Row Subquery — Earning Above Average",
    slug: "subquery-single-row-above-avg",
    description: `## Problem Description
Retrieve all employees whose salary is strictly greater than the overall company average salary using a single-row subquery.`,
    difficulty: "medium" as const,
    topicTags: ["Subqueries", "Single-row subquery", "Find values above average"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), SALARY NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 4000);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 6000);
INSERT INTO EMPLOYEES VALUES (3, 'Charlie', 8000);`,
    solutionQuery: `SELECT * FROM EMPLOYEES WHERE SALARY > (SELECT AVG(SALARY) FROM EMPLOYEES) ORDER BY EMP_ID`,
  },
  {
    title: "Subquery with IN — Filter by Location",
    slug: "subquery-with-in-location",
    description: `## Problem Description
Find all employees working in departments located in 'New York' or 'Chicago' using \`DEPT_ID IN (SELECT ...)\`.`,
    difficulty: "medium" as const,
    topicTags: ["Subqueries", "Subquery with IN", "Multi-row subquery"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE DEPARTMENTS (DEPT_ID NUMBER PRIMARY KEY, LOCATION VARCHAR2(50));
CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), DEPT_ID NUMBER);
INSERT INTO DEPARTMENTS VALUES (10, 'New York');
INSERT INTO DEPARTMENTS VALUES (20, 'Chicago');
INSERT INTO DEPARTMENTS VALUES (30, 'Dallas');
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 10);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 20);
INSERT INTO EMPLOYEES VALUES (3, 'Charlie', 30);`,
    solutionQuery: `SELECT * FROM EMPLOYEES WHERE DEPT_ID IN (SELECT DEPT_ID FROM DEPARTMENTS WHERE LOCATION IN ('New York', 'Chicago')) ORDER BY EMP_ID`,
  },
  {
    title: "Find Employee with Maximum Salary",
    slug: "subquery-find-maximum-salary",
    description: `## Problem Description
Retrieve details of the employee earning the absolute maximum salary using a subquery with \`MAX(SALARY)\`.`,
    difficulty: "easy" as const,
    topicTags: ["Subqueries", "Single-row subquery", "Find maximum value"],
    validationType: "select_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), SALARY NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 4000);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 6000);
INSERT INTO EMPLOYEES VALUES (3, 'Charlie', 8000);`,
    solutionQuery: `SELECT * FROM EMPLOYEES WHERE SALARY = (SELECT MAX(SALARY) FROM EMPLOYEES)`,
  },
  {
    title: "Find Second-Highest Salary",
    slug: "subquery-find-second-highest-salary",
    description: `## Problem Description
Find the second-highest salary value from the \`EMPLOYEES\` table using a subquery.`,
    difficulty: "hard" as const,
    topicTags: ["Subqueries", "Find second-highest salary/marks"],
    validationType: "select_diff" as const,
    orderSensitive: false,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), SALARY NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 4000);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 6000);
INSERT INTO EMPLOYEES VALUES (3, 'Charlie', 8000);`,
    solutionQuery: `SELECT MAX(SALARY) AS SECOND_HIGHEST_SALARY FROM EMPLOYEES WHERE SALARY < (SELECT MAX(SALARY) FROM EMPLOYEES)`,
  },
  {
    title: "Multi-Row Subquery with ANY Operator",
    slug: "subquery-any-operator-comparison",
    description: `## Problem Description
Select employees whose salary is strictly greater than ANY employee salary in department \`30\`.`,
    difficulty: "medium" as const,
    topicTags: ["Subqueries", "ANY / ALL", "Multi-row subquery"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), SALARY NUMBER, DEPT_ID NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 3000, 30);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 5000, 30);
INSERT INTO EMPLOYEES VALUES (3, 'Charlie', 4000, 10);
INSERT INTO EMPLOYEES VALUES (4, 'David', 6000, 10);`,
    solutionQuery: `SELECT * FROM EMPLOYEES WHERE SALARY > ANY (SELECT SALARY FROM EMPLOYEES WHERE DEPT_ID = 30) ORDER BY EMP_ID`,
  },
  {
    title: "Multi-Row Subquery with ALL Operator",
    slug: "subquery-all-operator-comparison",
    description: `## Problem Description
Select employees whose salary is strictly greater than ALL employee salaries in department \`30\`.`,
    difficulty: "medium" as const,
    topicTags: ["Subqueries", "ANY / ALL", "Multi-row subquery"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), SALARY NUMBER, DEPT_ID NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 3000, 30);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 5000, 30);
INSERT INTO EMPLOYEES VALUES (3, 'Charlie', 4000, 10);
INSERT INTO EMPLOYEES VALUES (4, 'David', 6000, 10);`,
    solutionQuery: `SELECT * FROM EMPLOYEES WHERE SALARY > ALL (SELECT SALARY FROM EMPLOYEES WHERE DEPT_ID = 30) ORDER BY EMP_ID`,
  },
  {
    title: "Correlated Subquery — Earning Above Dept Average",
    slug: "subquery-correlated-dept-avg",
    description: `## Problem Description
Find employees who earn more than the average salary of their OWN department using a correlated subquery.`,
    difficulty: "hard" as const,
    topicTags: ["Subqueries", "Correlated subquery", "Find values above average"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), DEPT_ID NUMBER, SALARY NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 'Alice', 10, 5000);
INSERT INTO EMPLOYEES VALUES (2, 'Bob', 10, 9000);
INSERT INTO EMPLOYEES VALUES (3, 'Charlie', 20, 4000);
INSERT INTO EMPLOYEES VALUES (4, 'David', 20, 8000);`,
    solutionQuery: `SELECT e.EMP_ID, e.FIRST_NAME, e.DEPT_ID, e.SALARY FROM EMPLOYEES e WHERE e.SALARY > (SELECT AVG(d.SALARY) FROM EMPLOYEES d WHERE d.DEPT_ID = e.DEPT_ID) ORDER BY e.EMP_ID`,
  },
  {
    title: "Subquery with NOT IN — Customers with No Orders",
    slug: "subquery-not-in-no-orders",
    description: `## Problem Description
Find customers who have never placed an order using \`CUSTOMER_ID NOT IN (SELECT CUSTOMER_ID FROM ORDERS WHERE CUSTOMER_ID IS NOT NULL)\`.`,
    difficulty: "medium" as const,
    topicTags: ["Subqueries", "Subquery with IN"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE CUSTOMERS (CUSTOMER_ID NUMBER PRIMARY KEY, CUSTOMER_NAME VARCHAR2(50));
CREATE TABLE ORDERS (ORDER_ID NUMBER PRIMARY KEY, CUSTOMER_ID NUMBER);
INSERT INTO CUSTOMERS VALUES (1, 'Alice');
INSERT INTO CUSTOMERS VALUES (2, 'Bob');
INSERT INTO ORDERS VALUES (101, 1);`,
    solutionQuery: `SELECT CUSTOMER_ID, CUSTOMER_NAME FROM CUSTOMERS WHERE CUSTOMER_ID NOT IN (SELECT CUSTOMER_ID FROM ORDERS WHERE CUSTOMER_ID IS NOT NULL) ORDER BY CUSTOMER_ID`,
  },
  {
    title: "Correlated Subquery with EXISTS Operator",
    slug: "subquery-correlated-exists",
    description: `## Problem Description
Find departments that have at least one active assigned employee using \`EXISTS (SELECT 1 FROM EMPLOYEES e WHERE e.DEPT_ID = d.DEPT_ID)\`.`,
    difficulty: "hard" as const,
    topicTags: ["Subqueries", "Correlated subquery"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE DEPARTMENTS (DEPT_ID NUMBER PRIMARY KEY, DEPT_NAME VARCHAR2(50));
CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, DEPT_ID NUMBER);
INSERT INTO DEPARTMENTS VALUES (10, 'Sales');
INSERT INTO DEPARTMENTS VALUES (20, 'HR');
INSERT INTO EMPLOYEES VALUES (1, 10);`,
    solutionQuery: `SELECT d.DEPT_ID, d.DEPT_NAME FROM DEPARTMENTS d WHERE EXISTS (SELECT 1 FROM EMPLOYEES e WHERE e.DEPT_ID = d.DEPT_ID) ORDER BY d.DEPT_ID`,
  },
  {
    title: "Compare Employee Salary with Manager",
    slug: "subquery-compare-emp-manager-salary",
    description: `## Problem Description
Find employees who earn a higher salary than their direct manager using a subquery comparison.`,
    difficulty: "hard" as const,
    topicTags: ["Subqueries", "Compare one employee/student with another"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY, FIRST_NAME VARCHAR2(50), SALARY NUMBER, MANAGER_ID NUMBER);
INSERT INTO EMPLOYEES VALUES (1, 'Manager', 8000, NULL);
INSERT INTO EMPLOYEES VALUES (2, 'SuperDev', 10000, 1);
INSERT INTO EMPLOYEES VALUES (3, 'JuniorDev', 4000, 1);`,
    solutionQuery: `SELECT e.EMP_ID, e.FIRST_NAME, e.SALARY FROM EMPLOYEES e WHERE e.SALARY > (SELECT m.SALARY FROM EMPLOYEES m WHERE m.EMP_ID = e.MANAGER_ID) ORDER BY e.EMP_ID`,
  },

  // =========================================================================
  // TOPIC 8: SET OPERATIONS (10 Problems)
  // =========================================================================
  {
    title: "UNION — Combine Customer & Supplier Cities",
    slug: "setop-union-cities",
    description: `## Problem Description
Combine city names from \`CUSTOMERS\` and \`SUPPLIERS\` into a distinct list using \`UNION\`.`,
    difficulty: "easy" as const,
    topicTags: ["Set Operations", "UNION"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE CUSTOMERS (CITY VARCHAR2(50));
CREATE TABLE SUPPLIERS (CITY VARCHAR2(50));
INSERT INTO CUSTOMERS VALUES ('London');
INSERT INTO CUSTOMERS VALUES ('Paris');
INSERT INTO SUPPLIERS VALUES ('Paris');
INSERT INTO SUPPLIERS VALUES ('Tokyo');`,
    solutionQuery: `SELECT CITY FROM CUSTOMERS UNION SELECT CITY FROM SUPPLIERS ORDER BY CITY`,
  },
  {
    title: "UNION ALL — Combined Transaction Log",
    slug: "setop-union-all-transactions",
    description: `## Problem Description
Combine all sales transactions from \`ONLINE_SALES\` and \`RETAIL_SALES\` retaining all duplicate rows using \`UNION ALL\`.`,
    difficulty: "easy" as const,
    topicTags: ["Set Operations", "UNION ALL"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE ONLINE_SALES (TRANS_ID NUMBER, AMOUNT NUMBER);
CREATE TABLE RETAIL_SALES (TRANS_ID NUMBER, AMOUNT NUMBER);
INSERT INTO ONLINE_SALES VALUES (1, 100);
INSERT INTO RETAIL_SALES VALUES (1, 100);`,
    solutionQuery: `SELECT TRANS_ID, AMOUNT FROM ONLINE_SALES UNION ALL SELECT TRANS_ID, AMOUNT FROM RETAIL_SALES ORDER BY TRANS_ID`,
  },
  {
    title: "INTERSECT — Cities with Both Customers & Suppliers",
    slug: "setop-intersect-cities",
    description: `## Problem Description
Find common cities present in both \`CUSTOMERS\` and \`SUPPLIERS\` tables using \`INTERSECT\`.`,
    difficulty: "medium" as const,
    topicTags: ["Set Operations", "INTERSECT"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE CUSTOMERS (CITY VARCHAR2(50));
CREATE TABLE SUPPLIERS (CITY VARCHAR2(50));
INSERT INTO CUSTOMERS VALUES ('London');
INSERT INTO CUSTOMERS VALUES ('Paris');
INSERT INTO SUPPLIERS VALUES ('Paris');
INSERT INTO SUPPLIERS VALUES ('Tokyo');`,
    solutionQuery: `SELECT CITY FROM CUSTOMERS INTERSECT SELECT CITY FROM SUPPLIERS ORDER BY CITY`,
  },
  {
    title: "MINUS — Employees Not Assigned to Any Project",
    slug: "setop-minus-unassigned-staff",
    description: `## Problem Description
Find \`EMP_ID\` values present in \`EMPLOYEES\` table MINUS \`EMP_ID\` values present in \`PROJECT_ASSIGNMENTS\` table using \`MINUS\`.`,
    difficulty: "medium" as const,
    topicTags: ["Set Operations", "MINUS"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EMPLOYEES (EMP_ID NUMBER PRIMARY KEY);
CREATE TABLE PROJECT_ASSIGNMENTS (EMP_ID NUMBER);
INSERT INTO EMPLOYEES VALUES (1);
INSERT INTO EMPLOYEES VALUES (2);
INSERT INTO EMPLOYEES VALUES (3);
INSERT INTO PROJECT_ASSIGNMENTS VALUES (1);`,
    solutionQuery: `SELECT EMP_ID FROM EMPLOYEES MINUS SELECT EMP_ID FROM PROJECT_ASSIGNMENTS ORDER BY EMP_ID`,
  },
  {
    title: "UNION — Combine Active & Past Employee Emails",
    slug: "setop-union-active-past-emails",
    description: `## Problem Description
Combine distinct emails from \`ACTIVE_EMPLOYEES\` and \`PAST_EMPLOYEES\` using \`UNION\`.`,
    difficulty: "easy" as const,
    topicTags: ["Set Operations", "UNION"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE ACTIVE_EMPLOYEES (EMAIL VARCHAR2(100));
CREATE TABLE PAST_EMPLOYEES (EMAIL VARCHAR2(100));
INSERT INTO ACTIVE_EMPLOYEES VALUES ('a@co.com');
INSERT INTO ACTIVE_EMPLOYEES VALUES ('b@co.com');
INSERT INTO PAST_EMPLOYEES VALUES ('b@co.com');
INSERT INTO PAST_EMPLOYEES VALUES ('c@co.com');`,
    solutionQuery: `SELECT EMAIL FROM ACTIVE_EMPLOYEES UNION SELECT EMAIL FROM PAST_EMPLOYEES ORDER BY EMAIL`,
  },
  {
    title: "INTERSECT — Courses Offered in Both Semesters",
    slug: "setop-intersect-semester-courses",
    description: `## Problem Description
Find \`COURSE_ID\` values offered in Semester 1 (\`SEM1_COURSES\`) AND Semester 2 (\`SEM2_COURSES\`) using \`INTERSECT\`.`,
    difficulty: "medium" as const,
    topicTags: ["Set Operations", "INTERSECT"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE SEM1_COURSES (COURSE_ID NUMBER);
CREATE TABLE SEM2_COURSES (COURSE_ID NUMBER);
INSERT INTO SEM1_COURSES VALUES (101);
INSERT INTO SEM1_COURSES VALUES (102);
INSERT INTO SEM2_COURSES VALUES (102);
INSERT INTO SEM2_COURSES VALUES (103);`,
    solutionQuery: `SELECT COURSE_ID FROM SEM1_COURSES INTERSECT SELECT COURSE_ID FROM SEM2_COURSES ORDER BY COURSE_ID`,
  },
  {
    title: "MINUS — Products Never Ordered",
    slug: "setop-minus-unordered-products",
    description: `## Problem Description
Find \`PRODUCT_ID\` values present in \`PRODUCTS\` MINUS \`PRODUCT_ID\` values present in \`ORDER_ITEMS\` using \`MINUS\`.`,
    difficulty: "medium" as const,
    topicTags: ["Set Operations", "MINUS"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE PRODUCTS (PRODUCT_ID NUMBER PRIMARY KEY);
CREATE TABLE ORDER_ITEMS (PRODUCT_ID NUMBER);
INSERT INTO PRODUCTS VALUES (10);
INSERT INTO PRODUCTS VALUES (20);
INSERT INTO PRODUCTS VALUES (30);
INSERT INTO ORDER_ITEMS VALUES (10);`,
    solutionQuery: `SELECT PRODUCT_ID FROM PRODUCTS MINUS SELECT PRODUCT_ID FROM ORDER_ITEMS ORDER BY PRODUCT_ID`,
  },
  {
    title: "UNION ALL — East & West Sales Reps",
    slug: "setop-union-all-sales-reps",
    description: `## Problem Description
Combine sales representative lists from \`EAST_REPS\` and \`WEST_REPS\` retaining overlap using \`UNION ALL\`.`,
    difficulty: "easy" as const,
    topicTags: ["Set Operations", "UNION ALL"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE EAST_REPS (REP_NAME VARCHAR2(50), REGION VARCHAR2(20));
CREATE TABLE WEST_REPS (REP_NAME VARCHAR2(50), REGION VARCHAR2(20));
INSERT INTO EAST_REPS VALUES ('Alice', 'EAST');
INSERT INTO WEST_REPS VALUES ('Bob', 'WEST');`,
    solutionQuery: `SELECT REP_NAME, REGION FROM EAST_REPS UNION ALL SELECT REP_NAME, REGION FROM WEST_REPS ORDER BY REP_NAME`,
  },
  {
    title: "INTERSECT — High Performers in Both Quarters",
    slug: "setop-intersect-top-performers",
    description: `## Problem Description
Find employee IDs who scored rating 'A' in both Q1 (\`Q1_RATINGS\`) and Q2 (\`Q2_RATINGS\`) using \`INTERSECT\`.`,
    difficulty: "medium" as const,
    topicTags: ["Set Operations", "INTERSECT"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE Q1_RATINGS (EMP_ID NUMBER, RATING VARCHAR2(5));
CREATE TABLE Q2_RATINGS (EMP_ID NUMBER, RATING VARCHAR2(5));
INSERT INTO Q1_RATINGS VALUES (1, 'A');
INSERT INTO Q1_RATINGS VALUES (2, 'A');
INSERT INTO Q2_RATINGS VALUES (2, 'A');
INSERT INTO Q2_RATINGS VALUES (3, 'A');`,
    solutionQuery: `SELECT EMP_ID FROM Q1_RATINGS WHERE RATING = 'A' INTERSECT SELECT EMP_ID FROM Q2_RATINGS WHERE RATING = 'A' ORDER BY EMP_ID`,
  },
  {
    title: "MINUS — Departments Without Active Projects",
    slug: "setop-minus-departments-no-projects",
    description: `## Problem Description
Find \`DEPT_ID\` values from \`DEPARTMENTS\` MINUS \`DEPT_ID\` values present in \`ACTIVE_PROJECTS\` using \`MINUS\`.`,
    difficulty: "medium" as const,
    topicTags: ["Set Operations", "MINUS"],
    validationType: "select_diff" as const,
    orderSensitive: true,
    setupScript: `CREATE TABLE DEPARTMENTS (DEPT_ID NUMBER PRIMARY KEY);
CREATE TABLE ACTIVE_PROJECTS (DEPT_ID NUMBER);
INSERT INTO DEPARTMENTS VALUES (10);
INSERT INTO DEPARTMENTS VALUES (20);
INSERT INTO DEPARTMENTS VALUES (30);
INSERT INTO ACTIVE_PROJECTS VALUES (10);`,
    solutionQuery: `SELECT DEPT_ID FROM DEPARTMENTS MINUS SELECT DEPT_ID FROM ACTIVE_PROJECTS ORDER BY DEPT_ID`,
  },
];

async function main() {
  console.log("🌱 Seeding database with 80 Oracle SQL problems across 8 topics...");

  // Delete existing submissions and problems
  await db.execute(sql`TRUNCATE TABLE submissions, problems RESTART IDENTITY CASCADE;`);

  for (const prob of sampleProblems) {
    await db.insert(schema.problems).values({
      title: prob.title,
      slug: prob.slug,
      description: prob.description,
      difficulty: prob.difficulty,
      topicTags: prob.topicTags,
      setupScript: prob.setupScript,
      solutionQuery: prob.solutionQuery,
      validationType: prob.validationType,
      expectedOutput: (prob as any).expectedOutput || null,
      orderSensitive: prob.orderSensitive ?? false,
    });
  }

  console.log(`✅ Successfully seeded ${sampleProblems.length} problems!`);
  await pool.end();
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
