import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, Input, LinearProgress, TextField } from "@mui/material"
import { QueryKey } from "../../lib/common-lib"
import { loadSingleProduct, postSingleProduct, productSchema, putSingleProduct } from "../../lib/products-lib"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { IncomingProduct, Product, ProductItems } from "../../lib/products-types"
import { Controller, useForm } from "react-hook-form"
import { AxiosError } from "axios"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from "react"


interface ProductDialogProps {
  handleProductDialogClose: () => void,
  productId?: string
}

const ProductDialog = ({handleProductDialogClose, productId} : ProductDialogProps) => {

  const queryClient = useQueryClient()

  const { data: singleProduct, isLoading } = useQuery<Product>({
    queryKey: [QueryKey.SINGLE_PRODUCT, productId],
    queryFn: () => loadSingleProduct(productId),
    enabled: !!productId
  })

  const createProduct = useMutation<void, AxiosError, IncomingProduct>({
    mutationFn: postSingleProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [QueryKey.PRODUCTS]})
    }
  })

  const replaceProduct = useMutation<void, AxiosError, { productId: string, product: IncomingProduct }>({
    mutationFn: putSingleProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [QueryKey.PRODUCTS]})
    }
  })

  const { control, handleSubmit, formState: { errors, isValid, isDirty } } = useForm<IncomingProduct>( {
    mode:'onBlur',
    resolver: zodResolver(productSchema),
    values: {
        [ ProductItems.name ]: singleProduct?.name ?? '',
        [ ProductItems.price ]: singleProduct?.price ?? 0,
        [ ProductItems.availability ]: singleProduct?.availability ?? 0,
    } as IncomingProduct
  } );

  return (
    <Dialog open>
      <form
        onSubmit={handleSubmit((data) => {
          !!productId ?
          replaceProduct.mutate({
            productId: productId,
            product: data
          })
          :
          createProduct.mutate(data)

          handleProductDialogClose()
        })}
      >
        <DialogTitle></DialogTitle>
        <DialogContent>
        {isLoading ?
          <CircularProgress/>
          :
          <Grid2 spacing={1} container>
            <Grid2 size={4}>
              <Controller
                control={ control }
                name={ProductItems.name}
                render={ ( { field } ) => (
                    <TextField
                        {...field}
                        label={`${ ProductItems.name }`}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                ) }
              />
            </Grid2>
            <Grid2 size={4}>
              <Controller
                control={ control }
                name={ProductItems.price}
                render={ ( { field } ) => (
                    <TextField
                        {...field}
                        label={`${ ProductItems.price }`}
                        error={!!errors.price}
                        helperText={errors.price?.message}
                    />
                ) }
              />
            </Grid2>
            <Grid2 size={4}>
              <Controller
                control={ control }
                name={ProductItems.availability}
                render={ ( { field } ) => (
                    <TextField
                        {...field}
                        label={`${ ProductItems.availability }`}
                        error={!!errors.availability}
                        helperText={errors.availability?.message}
                    />
                ) }
              />
            </Grid2>                           
          </Grid2>
        }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProductDialogClose}>{'CLOSE'}</Button>
          <Button type="submit" disabled={!isValid || !isDirty}>{!!productId ? 'CHANGE' : 'CREATE'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
  
export default ProductDialog