import axios, { AxiosError } from 'axios'
import { backend } from './common-lib'
import { IncomingOrder, IncomingOrderItems, Order, OrderParams } from './orders-types'
import { z } from 'zod';
import { Product } from './products-types';

export const loadOrders = async (params?: OrderParams): Promise<Order[]> => {
    const response = await axios.get<Order[]>(`${backend.LOCALHOST}/orders`, { params });
    return response.data; 
};

export const loadSingleOrder = async (orderId: string | undefined): Promise<Order> => {
    const response = await axios.get<Order>(`${backend.LOCALHOST}/orders/${orderId}`);
    return response.data; 
};

//create
export const postSingleOrder = async (order: IncomingOrder): Promise<void> => {
    return await axios.post(`${backend.LOCALHOST}/orders`, order);
};

export const orderSchema = (products: Product[]) => z.object({
    [IncomingOrderItems.productId]: z.string({
      required_error: "Product is required"
    }).min(1, {
      message: "Product cannot be empty",
    }),
    [IncomingOrderItems.customerName]: z.string({
      required_error: "Customer name is required",
      invalid_type_error: "Customer name must be a string",
    }).min(1, {
      message: "Customer name cannot be empty",
    }),
    [IncomingOrderItems.amount]: z.coerce.number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    }).int({
      message: "Amount must be an integer",
    }).positive({
      message: "Amount must be a positive integer",
    })
  })
  .required()
  .refine((data) => {
    const product = products?.find((product) => product.id === data.productId)
    return product && data.amount <= product.availability 
  },{
    message: `Amount cannot be higher than the available quantity`,
    path: [IncomingOrderItems.amount]
  });