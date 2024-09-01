import { Box, Stack } from "@mui/material"
import { Link } from "react-router-dom"
import { RoutePath } from "../../lib/common-lib"

const Header = () => {
    return (
      <Box
        sx={{
          bgcolor: '#6835D1',
          padding: 2
        }}
      >
        <Stack direction='row' spacing={1}>
          <img src="https://foxentry.com/assets/img/logo-foxentry.svg" alt="foxentryLogo"/>
          <Link to={`${RoutePath.PRODUCTS}`}>{'Products'}</Link>
          <Link to={`${RoutePath.ORDERS}`}>{'Orders'}</Link>
        </Stack>
      </Box>
    )
  }
  
  export default Header