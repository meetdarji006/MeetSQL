declare module "oracledb" {
  interface PoolAttributes {
    user?: string;
    password?: string;
    connectString?: string;
    poolMin?: number;
    poolMax?: number;
    poolTimeout?: number;
    [key: string]: any;
  }

  interface ConnectionAttributes {
    user?: string;
    password?: string;
    connectString?: string;
    [key: string]: any;
  }

  interface ExecuteOptions {
    outFormat?: number;
    maxRows?: number;
    autoCommit?: boolean;
    [key: string]: any;
  }

  interface Metadata<T = unknown> {
    name: string;
    [key: string]: any;
  }

  interface Result<T = any> {
    rows?: T[];
    metaData?: Metadata[];
    rowsAffected?: number;
    [key: string]: any;
  }

  interface Connection {
    callTimeout: number;
    execute(sql: string, binds?: any, options?: ExecuteOptions): Promise<Result>;
    commit(): Promise<void>;
    close(): Promise<void>;
    [key: string]: any;
  }

  interface Pool {
    getConnection(): Promise<Connection>;
    close(drainTime?: number): Promise<void>;
    [key: string]: any;
  }

  const OUT_FORMAT_OBJECT: number;

  function createPool(attrs: PoolAttributes): Promise<Pool>;
  function getConnection(attrs: ConnectionAttributes): Promise<Connection>;

  export default {
    OUT_FORMAT_OBJECT,
    createPool,
    getConnection,
  };

  export {
    Pool,
    Connection,
    Metadata,
    Result,
    PoolAttributes,
    ConnectionAttributes,
    ExecuteOptions,
    OUT_FORMAT_OBJECT,
    createPool,
    getConnection,
  };
}
