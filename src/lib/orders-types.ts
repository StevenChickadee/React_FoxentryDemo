export enum OrderItems {
  id = 'id',
  product_id = 'product_id',
  product_name = 'product_name',
  customer_name = 'customer_name',
  amount = 'amount',
  price_per_item = 'price_per_item',
  date_created = 'date_created'
}

export interface Order {
    id: string;
    product_id: string;
    product_name: string;
    customer_name: string;
    amount: number; //integer
    price: number;
    date_created: Date; //date-time
  }

  export enum IncomingOrderItems {
    productId = 'productId',
    customerName = 'customerName',
    amount = 'amount',
  }

  export interface IncomingOrder {
    productId: string;
    customerName: string;
    amount: number; //integer
  }

  export interface OrderParams {
    search?: string
  }