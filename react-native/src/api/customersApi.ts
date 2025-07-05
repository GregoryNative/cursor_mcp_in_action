import { CustomerDTO } from '../domain/dto/CustomerDTO';
import { Customer } from '../domain/entities/Customer';
import { CustomerMapper } from '../domain/mappers/CustomerMapper';
import { BASE_URL } from '../constants';

export class CustomersApi {
    static async fetchCustomers(limit: number, offset: number): Promise<{ customers: Customer[] }> {
        const response = await fetch(`${BASE_URL}/customers?limit=${limit}&offset=${offset}`);

        if (!response.ok) {
            throw new Error('Failed to fetch customers');
        }

        const customersDTO: CustomerDTO[] = await response.json();
        return {
            customers: CustomerMapper.toEntities(customersDTO),
        };
    }
} 