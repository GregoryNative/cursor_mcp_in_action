import SQLite, { SQLError, Transaction, ResultSet } from 'react-native-sqlite-storage';

import { IProductsRepository } from '../../domain/repositories/IProductsRepository';
import { Product } from '../../domain/entities/Product';
import { ProductDTO } from '../../domain/dto/ProductDTO';
import { ProductMapper } from '../../domain/mappers/ProductMapper';
import { BASE_URL } from '../../constants';
import { ProductsApi } from '../../api/productsApi';

const database_name = "products.db";
const database_version = "1.0";
const database_displayname = "Products SQLite Database";
const database_size = 200000;

const db = SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    // @ts-ignore
    database_size,
    () => {
        console.log("Products Database opened successfully");
    },
    (error: SQLError) => {
        console.error("Error opening database:", error);
    }
);

export async function initDatabase(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        db.transaction((tx: Transaction) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS products (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    price REAL NOT NULL,
                    image TEXT NOT NULL,
                    options TEXT NOT NULL,
                    sku TEXT NOT NULL,
                    barcode INTEGER NOT NULL,
                    inventory TEXT NOT NULL,
                    createdAt TEXT NOT NULL,
                    updatedAt TEXT NOT NULL
                )`,
                [],
                () => {
                    console.log("Table created successfully");
                    resolve(true);
                },
                (_, error) => {
                    console.error("Error creating table:", error);
                    reject(error);
                }
            );
        });
    });
}

class ProductsRepository implements IProductsRepository {
    private serializeProduct(product: Product): any[] {
        return [
            product.id,
            product.name,
            product.price,
            product.image,
            JSON.stringify(product.options),
            product.sku,
            product.barcode,
            JSON.stringify(product.inventory),
            product.createdAt,
            product.updatedAt
        ];
    }

    private deserializeProduct(row: any): Product {
        return {
            id: row.id,
            name: row.name,
            price: row.price,
            image: row.image,
            options: JSON.parse(row.options),
            sku: row.sku,
            barcode: row.barcode,
            inventory: JSON.parse(row.inventory),
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        };
    }

    async saveProduct(product: Product): Promise<void> {
        return new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
                tx.executeSql(
                    `INSERT OR REPLACE INTO products 
                    (id, name, price, image, options, sku, barcode, inventory, createdAt, updatedAt) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    this.serializeProduct(product),
                    (_: Transaction, result: ResultSet) => {
                        console.log("Product saved successfully");
                        resolve();
                    },
                    (_: Transaction, error: SQLError) => {
                        console.error("Error saving product:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    async saveProducts(products: Product[]): Promise<void> {
        return new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
                products.forEach((product) => {
                    tx.executeSql(
                        `INSERT OR REPLACE INTO products 
                        (id, name, price, image, options, sku, barcode, inventory, createdAt, updatedAt) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        this.serializeProduct(product),
                        () => {},
                        (_: Transaction, error: SQLError) => {
                            console.error("Error saving product:", error);
                            reject(error);
                        }
                    );
                });
            }, 
            (error: SQLError) => {
                console.error("Transaction error:", error);
                reject(error);
            },
            () => {
                console.log("All products saved successfully");
                resolve();
            });
        });
    }

    async fetchProducts(limit = 50, offset = 0): Promise<Product[]> {
        return new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
                tx.executeSql(
                    "SELECT * FROM products LIMIT ? OFFSET ?",
                    [limit, offset],
                    (_: Transaction, result: ResultSet) => {
                        const products: Product[] = [];
                        for (let i = 0; i < result.rows.length; i++) {
                            products.push(this.deserializeProduct(result.rows.item(i)));
                        }
                        console.log("Products fetched successfully");
                        resolve(products);
                    },
                    (_: Transaction, error: SQLError) => {
                        console.error("Error fetching products:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    async searchProducts(query: string, limit = 50, offset = 0): Promise<Product[]> {
        return new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
                tx.executeSql(
                    "SELECT * FROM products WHERE name LIKE ? OR sku LIKE ? LIMIT ? OFFSET ?",
                    [`%${query}%`, `%${query}%`, limit, offset],
                    (_: Transaction, result: ResultSet) => {
                        const products: Product[] = [];
                        for (let i = 0; i < result.rows.length; i++) {
                            products.push(this.deserializeProduct(result.rows.item(i)));
                        }
                        console.log("Products search completed: ", query, products.length);
                        resolve(products);
                    },
                    (_: Transaction, error: SQLError) => {
                        console.error("Error searching products:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    async clearProducts(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
                tx.executeSql(
                    "DROP TABLE IF EXISTS products",
                    [],
                    () => {
                        console.log("Products cleared successfully");
                        resolve(true);
                    },
                    (_: Transaction, error: SQLError) => {
                        console.error("Error clearing products:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    async getProductsCount(): Promise<number> {
        return new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
                tx.executeSql(
                    "SELECT COUNT(*) as count FROM products",
                    [],
                    (_: Transaction, result: ResultSet) => {
                        const count = result.rows.item(0).count;
                        console.log("Products count:", count);
                        resolve(count);
                    },
                    (_: Transaction, error: SQLError) => {
                        console.error("Error getting products count:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    async getProductById(id: string): Promise<Product | null> {
        return new Promise((resolve, reject) => {
            db.transaction((tx: Transaction) => {
                tx.executeSql(
                    "SELECT * FROM products WHERE id = ?",
                    [id],
                    (_: Transaction, result: ResultSet) => {
                        if (result.rows.length > 0) {
                            const product = this.deserializeProduct(result.rows.item(0));
                            console.log("Product found:", product);
                            resolve(product);
                        } else {
                            console.log("Product not found");
                            resolve(null);
                        }
                    },
                    (_: Transaction, error: SQLError) => {
                        console.error("Error getting product by id:", error);
                        reject(error);
                    }
                );
            });
        });
    }

    async sync(): Promise<Boolean> {
        try {
            await initDatabase();

            
            const BATCH_SIZE = 5000;
            let hasMore = true;
            let currentOffset = 0;
            let totalLoaded = 0;

            while (hasMore) {
                try {
                    const { products } = await ProductsApi.fetchProducts(BATCH_SIZE, currentOffset);
                    
                    if (products.length < BATCH_SIZE) {
                        hasMore = false;
                    }

                    // Save batch of products to SQLite
                    await this.saveProducts(products);
                    
                    totalLoaded += products.length;
                    currentOffset += BATCH_SIZE;

                    console.log(`Synced batch of ${products.length} items. Total so far: ${totalLoaded}`);
                } catch (error) {
                    console.error('Error during sync batch:', error);
                    return false;
                }
            }

            console.log(`Sync completed successfully. Total items synced: ${totalLoaded}`);
            return true;
        } catch (error) {
            console.error('Error during sync:', error);
            return false;
        }
    }
}

export default new ProductsRepository(); 