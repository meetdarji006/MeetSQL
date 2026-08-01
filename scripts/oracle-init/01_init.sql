-- Oracle XE Initialization Script
-- This script runs once when the Oracle container starts for the first time.
-- It sets up the student resource manager plan (best-effort on XE).

-- Note: This file is mounted at /opt/oracle/scripts/startup/ in the container
-- and auto-executed by the Oracle Docker entrypoint.

ALTER SESSION SET CONTAINER = XEPDB1;

-- Grant necessary system privileges for student schema creation
GRANT UNLIMITED TABLESPACE TO SYSTEM;

-- Try to set up Resource Manager (may not fully work on XE)
BEGIN
  DBMS_RESOURCE_MANAGER.CREATE_PENDING_AREA();

  BEGIN
    DBMS_RESOURCE_MANAGER.CREATE_CONSUMER_GROUP(
      CONSUMER_GROUP => 'STUDENT_GROUP',
      COMMENT        => 'Resource group for MeetSQL student submissions'
    );
  EXCEPTION
    WHEN OTHERS THEN
      IF SQLCODE = -29357 THEN NULL;
      ELSE RAISE;
      END IF;
  END;

  DBMS_RESOURCE_MANAGER.VALIDATE_PENDING_AREA();
  DBMS_RESOURCE_MANAGER.SUBMIT_PENDING_AREA();

  DBMS_OUTPUT.PUT_LINE('STUDENT_GROUP consumer group created successfully');
EXCEPTION
  WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('Resource Manager setup skipped: ' || SQLERRM);
END;
/

-- Verify connectivity
SELECT 'Oracle XE initialized for MeetSQL' AS STATUS FROM DUAL;
