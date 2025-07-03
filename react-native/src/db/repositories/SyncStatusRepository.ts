import SQLite, { SQLError, Transaction, ResultSet } from 'react-native-sqlite-storage';
import { ISyncStatusRepository } from '../../domain/repositories/ISyncStatusRepository';
import { SyncStatus } from '../../domain/entities/SyncStatus';

const db = SQLite.openDatabase(
    "sync_status.db",
    "1.0",
    "Sync Status SQLite Database",
    // @ts-ignore
    200000,
    () => console.log("Sync status database opened successfully"),
    (error: SQLError) => console.error("Error opening sync status database:", error)
);

export async function initSyncStatusDatabase(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        db.transaction((tx: Transaction) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS sync_status (
                    entity TEXT PRIMARY KEY,
                    lastSyncedAt TEXT,
                    isSuccess INTEGER DEFAULT 0
                )`,
                [],
                () => {
                    console.log("Sync status table created successfully");
                    resolve(true);
                },
                (_, error) => {
                    console.error("Error creating sync status table:", error);
                    reject(error);
                }
            );
        });
    });
}

class SyncStatusRepository implements ISyncStatusRepository {
    async initializeEntities(entities: string[]): Promise<void> {
        await initSyncStatusDatabase();
        
        return new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
                entities.forEach(entity => {
                    tx.executeSql(
                        `INSERT OR IGNORE INTO sync_status (entity) VALUES (?)`,
                        [entity],
                        () => {},
                        (_, error) => {
                            console.error(`Error initializing entity ${entity}:`, error);
                            reject(error);
                        }
                    );
                });
            }, 
            (error) => {
                console.error("Transaction error:", error);
                reject(error);
            },
            () => {
                console.log("Entities initialized successfully");
                resolve();
            });
        });
    }

    async updateSyncStatus(entity: string, isSuccess: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
                tx.executeSql(
                    `UPDATE sync_status 
                     SET lastSyncedAt = ?, isSuccess = ? 
                     WHERE entity = ?`,
                    [new Date().toISOString(), isSuccess ? 1 : 0, entity],
                    () => {
                        console.log(`Sync status updated for ${entity}`);
                        resolve();
                    },
                    (_, error) => {
                        console.error(`Error updating sync status for ${entity}:`, error);
                        reject(error);
                    }
                );
            });
        });
    }

    async getAllSyncStatus(): Promise<SyncStatus[]> {
        return new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
                tx.executeSql(
                    "SELECT * FROM sync_status",
                    [],
                    (_, result: ResultSet) => {
                        const statuses: SyncStatus[] = [];
                        for (let i = 0; i < result.rows.length; i++) {
                            const row = result.rows.item(i);
                            statuses.push({
                                entity: row.entity,
                                lastSyncedAt: row.lastSyncedAt,
                                isSuccess: Boolean(row.isSuccess)
                            });
                        }
                        resolve(statuses);
                    },
                    (_, error) => {
                        console.error("Error fetching sync statuses:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    async isEverythingSynced(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
                tx.executeSql(
                    "SELECT COUNT(*) as count FROM sync_status WHERE isSuccess = 0 OR lastSyncedAt IS NULL",
                    [],
                    (_, result: ResultSet) => {
                        console.log('Sync status rows:', result.rows.raw());
                        const count = result.rows.item(0).count;
                        resolve(count === 0);
                    },
                    (_, error) => {
                        console.error("Error checking sync status:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    async clearAll(): Promise<void> {
        return new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
                tx.executeSql(
                    "DROP TABLE IF EXISTS sync_status",
                    [],
                    async () => {
                        console.log("Sync status table dropped successfully");
                        try {
                            await initSyncStatusDatabase();
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    },
                    (_, error) => {
                        console.error("Error dropping sync status table:", error);
                        reject(error);
                    }
                );
            });
        });
    }
}

export default new SyncStatusRepository(); 