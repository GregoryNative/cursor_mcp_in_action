export interface Syncable {
    sync(): Promise<Boolean>;
} 