import ProductsRepository from './repositories/ProductsRepository';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import SyncStatusRepository from './repositories/SyncStatusRepository';
import { ISyncStatusRepository } from '../domain/repositories/ISyncStatusRepository';
import OrdersRepository from './repositories/OrdersRepository';
import { IOrdersRepository } from '../domain/repositories/IOrdersRepository';

const ENTITIES = {
    PRODUCTS: 'products',
    ORDERS: 'orders',
} as const;

type EntityType = typeof ENTITIES[keyof typeof ENTITIES];
type RepositoryMap = {
    [ENTITIES.PRODUCTS]: IProductsRepository;
    [ENTITIES.ORDERS]: IOrdersRepository;
};

class SyncManager {
    private syncStatusRepository: ISyncStatusRepository;
    private repositories: RepositoryMap;

    constructor(repositories: {
        syncStatusRepository: ISyncStatusRepository;
        productsRepository: IProductsRepository;
        ordersRepository: IOrdersRepository;
    }) {
        this.syncStatusRepository = repositories.syncStatusRepository;
        this.repositories = {
            [ENTITIES.PRODUCTS]: repositories.productsRepository,
            [ENTITIES.ORDERS]: repositories.ordersRepository
        };
        
        // Initialize sync status entities
        this.syncStatusRepository.initializeEntities(Object.values(ENTITIES));
    }

    private async syncEntity(entity: EntityType, repository: RepositoryMap[EntityType]): Promise<void> {
        try {
            await repository.sync();
            await this.syncStatusRepository.updateSyncStatus(entity, true);
        } catch (error) {
            console.error(`Sync failed for ${entity}:`, error);
            await this.syncStatusRepository.updateSyncStatus(entity, false);
        }
    }

    async syncAll(): Promise<void> {
        try {
            await Promise.all(
                Object.entries(this.repositories).map(([entity, repository]) => 
                    this.syncEntity(entity as EntityType, repository)
                )
            );
        } catch (error) {
            console.error('Sync failed:', error);
            throw error;
        }
    }

    async isEverythingSynced(): Promise<boolean> {
        return this.syncStatusRepository.isEverythingSynced();
    }

    async resetSyncStatus(): Promise<void> {
        await Promise.all(
            Object.values(ENTITIES).map(entity => 
                this.syncStatusRepository.updateSyncStatus(entity, false)
            )
        );
    }

    async clearAllData(): Promise<void> {
        try {
            // Clear all entity databases
            const clearPromises = [
                (this.repositories[ENTITIES.PRODUCTS] as any).clearProducts(),
                (this.repositories[ENTITIES.ORDERS] as any).clearOrders(),
            ];

            await Promise.all(clearPromises);
            console.log('All entity databases cleared successfully');

            // Reset sync status
            await this.resetSyncStatus();
        } catch (error) {
            console.error('Error clearing data:', error);
            throw error;
        }
    }
}

export default new SyncManager({
    syncStatusRepository: SyncStatusRepository,
    productsRepository: ProductsRepository,
    ordersRepository: OrdersRepository
});