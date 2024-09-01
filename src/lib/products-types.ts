export enum ProductItems {
    id = 'id',
    name = 'name',
    price = 'price',
    availability = 'availability',
    date_created = 'date_created',
    date_updated = 'date_updated'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  availability: number; //integer
  date_created: Date; //date-time
  date_updated?: Date; //date-time
}

export interface IncomingProduct {
  name: string;
  price: number;
  availability: number; //integer
}

export interface ProductParams {
  search?: string
}