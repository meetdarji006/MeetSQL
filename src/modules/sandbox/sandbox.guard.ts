/**
 * SQL Keyword Blacklist Guard
 *
 * First-pass filter that rejects dangerous SQL patterns before they reach Oracle.
 * This is a defense-in-depth layer — Oracle privileges are the primary protection.
 */

const BLACKLISTED_PATTERNS: { pattern: RegExp; description: string }[] = [
  { pattern: /\bGRANT\b/i, description: "GRANT statements are not allowed" },
  { pattern: /\bREVOKE\b/i, description: "REVOKE statements are not allowed" },
  { pattern: /\bALTER\s+SYSTEM\b/i, description: "ALTER SYSTEM is not allowed" },
  { pattern: /\bALTER\s+SESSION\b/i, description: "ALTER SESSION is not allowed" },
  { pattern: /\bCREATE\s+USER\b/i, description: "CREATE USER is not allowed" },
  { pattern: /\bDROP\s+USER\b/i, description: "DROP USER is not allowed" },
  { pattern: /\bALTER\s+USER\b/i, description: "ALTER USER is not allowed" },
  { pattern: /\bCREATE\s+DATABASE\s+LINK\b/i, description: "Database links are not allowed" },
  { pattern: /\bCREATE\s+DIRECTORY\b/i, description: "CREATE DIRECTORY is not allowed" },
  { pattern: /\bEXECUTE\s+IMMEDIATE\b/i, description: "Dynamic SQL (EXECUTE IMMEDIATE) is not allowed" },
  { pattern: /\bDBMS_/i, description: "DBMS_ packages are not allowed" },
  { pattern: /\bUTL_/i, description: "UTL_ packages are not allowed" },
  { pattern: /\bCTXSYS\b/i, description: "CTXSYS access is not allowed" },
  { pattern: /\bEXPDP\b/i, description: "Data pump operations are not allowed" },
  { pattern: /\bIMPDP\b/i, description: "Data pump operations are not allowed" },
  { pattern: /\bCREATE\s+TABLESPACE\b/i, description: "CREATE TABLESPACE is not allowed" },
  { pattern: /\bDROP\s+TABLESPACE\b/i, description: "DROP TABLESPACE is not allowed" },
  { pattern: /\bSHUTDOWN\b/i, description: "SHUTDOWN is not allowed" },
  { pattern: /\bSTARTUP\b/i, description: "STARTUP is not allowed" },
];

export interface GuardResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Check student SQL against the keyword blacklist.
 * Returns { allowed: true } if safe, or { allowed: false, reason: "..." } if blocked.
 */
export function checkSqlSafety(sql: string): GuardResult {
  // Remove SQL comments (both -- line comments and /* block comments */)
  const cleanedSql = sql
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");

  for (const { pattern, description } of BLACKLISTED_PATTERNS) {
    if (pattern.test(cleanedSql)) {
      return { allowed: false, reason: description };
    }
  }

  return { allowed: true };
}
