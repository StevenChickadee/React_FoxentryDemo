import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, LinearProgress, MenuItem, TextField } from "@mui/material"
import { QueryKey } from "../../lib/common-lib"
import { loadSingleOrder, orderSchema, postSingleOrder } from "../../lib/orders-lib"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { IncomingOrder, IncomingOrderItems, Order, OrderItems } from "../../lib/orders-types"
import { Controller, useForm } from "react-hook-form"
import { AxiosError } from "axios"
import { loadProducts, loadSingleProduct, putSingleProduct } from "../../lib/products-lib"
import { IncomingProduct, Product } from "../../lib/products-types"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

interface OrderDialogProps {
  handleOrderDialogClose: () => void,
}

const OrderDialog = ({handleOrderDialogClose} : OrderDialogProps) => {

  const queryClient = useQueryClient()

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: [QueryKey.PRODUCTS],
    queryFn: () => loadProducts()
  })

  const createOrder = useMutation<void, AxiosError, IncomingOrder>({
    mutationFn: postSingleOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [QueryKey.ORDERS]})
    }
  })

  const { control, handleSubmit, formState: { errors, isValid }, watch } = useForm<IncomingOrder>({
    mode:'onBlur',
    resolver: zodResolver(orderSchema(products ?? [])),
    defaultValues: {
        [ IncomingOrderItems.productId ]: '',
        [ IncomingOrderItems.customerName ]: '',
        [ IncomingOrderItems.amount ]: 0,
    } as IncomingOrder
  } );

  return (
    <Dialog
      open
    >
      <form
        onSubmit={handleSubmit((data) => {
          createOrder.mutate(data)
          handleOrderDialogClose()
        })}
      >
        <DialogTitle>
          {'New order'}
        </DialogTitle>
        <DialogContent>
        {isLoading ?
          <CircularProgress/>
          :
          <Grid2 spacing={1} container>
            <Grid2 size={4}>
              <Controller
                control={ control }
                name={IncomingOrderItems.productId}
                render={ ( { field } ) => (
                    <TextField
                        {...field}
                        label={`${ OrderItems.product_name }`}
                        error={!!errors.productId}
                        helperText={errors.productId?.message}
                        fullWidth
                        select
                    >
                      {products?.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </TextField>
                ) }
              />
            </Grid2>
            <Grid2 size={4}>
              <Controller
                control={ control }
                name={IncomingOrderItems.customerName}
                render={ ( { field } ) => (
                    <TextField
                        {...field}
                        label={`${ IncomingOrderItems.customerName }`}
                        error={!!errors.customerName}
                        helperText={errors.customerName?.message}
                    />
                ) }
              />
            </Grid2>
            <Grid2 size={4}>
              <Controller
                control={ control }
                name={IncomingOrderItems.amount}
                render={ ( { field } ) => (
                    <TextField
                        {...field}
                        label={`${ IncomingOrderItems.amount }`}
                        error={!!errors.amount}
                        helperText={errors.amount?.message}
                        disabled={!watch(IncomingOrderItems.productId)}
                    />
                ) }
              />
            </Grid2>                           
          </Grid2>
        }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOrderDialogClose}>{'CLOSE'}</Button>
          <Button type="submit" disabled={!isValid}>{'CREATE'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
  
export default OrderDialog