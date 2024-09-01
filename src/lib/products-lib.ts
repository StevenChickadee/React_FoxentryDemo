import axios from "axios"
import { IncomingProduct, Product, ProductItems, ProductParams } from "./products-types"
import { backend } from "./common-lib"
import { z } from "zod"

export const loadProducts = async (params?: ProductParams): Promise<Product[]> => {
    const response = await axios.get<Product[]>(`${backend.LOCALHOST}/products`, { params })
    return response.data
}

export const loadSingleProduct = async (productId: string | undefined): Promise<Product> => {
    const response = await axios.get<Product>(`${backend.LOCALHOST}/products/${productId}`);
    return response.data; 
};

//create
export const postSingleProduct = async (product: IncomingProduct): Promise<void> => {
    return await axios.post(`${backend.LOCALHOST}/products`, product);
};

//replace
export const putSingleProduct = async ({ productId, product }: { productId: string; product: IncomingProduct }): Promise<void> => {
    return await axios.put(`${backend.LOCALHOST}/products/${productId}`, product);
};

export const deleteSingleProduct = async (productId: string): Promise<void> => { 
    return await axios.delete(`${backend.LOCALHOST}/products/${productId}`);
};

export const productSchema = z.object({
    [ProductItems.name]: z.string({
      required_error: "Product name is required",
      invalid_type_error: "Product name must be a string",
    }).min(1, {
      message: "Product name cannot be empty",
    }),
    [ProductItems.price]: z.coerce.number({
      required_error: "Product price is required",
      invalid_type_error: "Product price must be a number",
    }).positive({
      message: "Product price must be a positive number",
    }),
    [ProductItems.availability]: z.coerce.number({
      required_error: "Product availability is required",
      invalid_type_error: "Product availability must be a number",
    }).int({
      message: "Product availability must be an integer",
    }).positive({
      message: "Product availability must be a positive integer",
    }),
  }).required();