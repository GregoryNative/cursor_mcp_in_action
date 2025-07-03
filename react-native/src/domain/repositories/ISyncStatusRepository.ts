import { SyncStatus } from '../entities/SyncStatus';

export interface ISyncStatusRepository {
    initializeEntities(entities: string[]): Promise<void>;
    updateSyncStatus(entity: string, isSuccess: boolean): Promise<void>;
    getAllSyncStatus(): Promise<SyncStatus[]>;
    isEverythingSynced(): Promise<boolean>;
    clearAll(): Promise<void>;
} 