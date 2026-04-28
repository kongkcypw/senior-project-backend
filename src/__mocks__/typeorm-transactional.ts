export const Transactional = (): MethodDecorator => () => {};
export const initializeTransactionalContext = (): void => {};
export const addTransactionalDataSources = (): void => {};
export const runInTransaction = async <T>(fn: () => Promise<T> | T): Promise<T> => fn();
export const Propagation = {
    REQUIRED: 'REQUIRED',
    SUPPORTS: 'SUPPORTS',
    MANDATORY: 'MANDATORY',
    REQUIRES_NEW: 'REQUIRES_NEW',
    NOT_SUPPORTED: 'NOT_SUPPORTED',
    NEVER: 'NEVER',
    NESTED: 'NESTED',
};
export const StorageDriver = {
    AUTO: 'AUTO',
    ASYNC_LOCAL_STORAGE: 'ASYNC_LOCAL_STORAGE',
};
export const IsolationLevel = {
    READ_UNCOMMITTED: 'READ UNCOMMITTED',
    READ_COMMITTED: 'READ COMMITTED',
    REPEATABLE_READ: 'REPEATABLE READ',
    SERIALIZABLE: 'SERIALIZABLE',
};
