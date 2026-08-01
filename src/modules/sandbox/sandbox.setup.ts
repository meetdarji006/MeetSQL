import { getAdminConnection } from "../../config/oracle";

/**
 * One-time Oracle setup: creates the STUDENT_GROUP resource consumer group
 * and STUDENT_PLAN resource plan. Best-effort on XE.
 *
 * Run this once during initial deployment.
 */
export async function setupOracleResourceManager(): Promise<void> {
  const conn = await getAdminConnection();

  try {
    await conn.execute(`
      BEGIN
        DBMS_RESOURCE_MANAGER.CREATE_PENDING_AREA();

        -- Create consumer group for students
        BEGIN
          DBMS_RESOURCE_MANAGER.CREATE_CONSUMER_GROUP(
            CONSUMER_GROUP => 'STUDENT_GROUP',
            COMMENT        => 'Resource group for student SQL submissions'
          );
        EXCEPTION
          WHEN OTHERS THEN
            IF SQLCODE = -29357 THEN NULL; -- already exists
            ELSE RAISE;
            END IF;
        END;

        -- Create resource plan
        BEGIN
          DBMS_RESOURCE_MANAGER.CREATE_PLAN(
            PLAN    => 'STUDENT_PLAN',
            COMMENT => 'Limits CPU and session resources for students'
          );
        EXCEPTION
          WHEN OTHERS THEN
            IF SQLCODE = -29358 THEN NULL; -- already exists
            ELSE RAISE;
            END IF;
        END;

        -- Create plan directive for student group
        BEGIN
          DBMS_RESOURCE_MANAGER.CREATE_PLAN_DIRECTIVE(
            PLAN                      => 'STUDENT_PLAN',
            GROUP_OR_SUBPLAN          => 'STUDENT_GROUP',
            COMMENT                   => 'Student resource limits',
            SWITCH_TIME               => 10,
            SWITCH_GROUP              => 'CANCEL_SQL',
            MAX_EST_EXEC_TIME         => 15,
            ACTIVE_SESS_POOL_P1       => 5
          );
        EXCEPTION
          WHEN OTHERS THEN
            IF SQLCODE = -29361 THEN NULL; -- already exists
            ELSE RAISE;
            END IF;
        END;

        -- Default group directive
        BEGIN
          DBMS_RESOURCE_MANAGER.CREATE_PLAN_DIRECTIVE(
            PLAN             => 'STUDENT_PLAN',
            GROUP_OR_SUBPLAN => 'OTHER_GROUPS',
            COMMENT          => 'Default group'
          );
        EXCEPTION
          WHEN OTHERS THEN
            IF SQLCODE = -29361 THEN NULL;
            ELSE RAISE;
            END IF;
        END;

        DBMS_RESOURCE_MANAGER.VALIDATE_PENDING_AREA();
        DBMS_RESOURCE_MANAGER.SUBMIT_PENDING_AREA();
      END;
    `);

    // Activate the plan
    await conn.execute(
      `ALTER SYSTEM SET RESOURCE_MANAGER_PLAN = 'STUDENT_PLAN'`
    );

    console.log("✅ Oracle Resource Manager configured (STUDENT_PLAN active)");
  } catch (err: any) {
    console.warn(
      "⚠️ Oracle Resource Manager setup failed (may not be supported on XE):",
      err.message
    );
    console.warn("   → callTimeout on node-oracledb will serve as primary timeout mechanism");
  } finally {
    await conn.close();
  }
}
