import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Box, Drawer, useMediaQuery } from '@mui/material'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'
import { BrowserView, MobileView } from 'react-device-detect'

// project imports
import MenuList from './MenuList'
import LogoSection from '../LogoSection'
import CloudMenuList from '@/layout/MainLayout/Sidebar/CloudMenuList'

// store
import { drawerWidth, headerHeight } from '@/store/constant'

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
    const theme = useTheme()
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'))
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

    const anchor = theme.direction === 'rtl' ? 'right' : 'left'
    const closedDrawerWidth = 80

    const drawer = (
        <>
            <Box
                sx={{
                    display: { xs: 'block', md: 'none' },
                    height: '80px'
                }}
            >
                <Box sx={{ display: 'flex', p: 2, mx: 'auto' }}>
                    <LogoSection />
                </Box>
            </Box>
            <BrowserView>
                <PerfectScrollbar
                    component='div'
                    style={{
                        height: !matchUpMd ? 'calc(100vh - 56px)' : `calc(100vh - ${headerHeight}px)`,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <MenuList drawerOpen={drawerOpen} />
                    <CloudMenuList drawerOpen={drawerOpen} />
                </PerfectScrollbar>
            </BrowserView>
            <MobileView>
                <Box sx={{ px: 2 }}>
                    <MenuList drawerOpen={drawerOpen} />
                    <CloudMenuList drawerOpen={drawerOpen} />
                </Box>
            </MobileView>
        </>
    )

    const container = window !== undefined ? () => window.document.body : undefined

    return (
        <Box
            component='nav'
            sx={{
                flexShrink: { md: 0 },
                width: matchUpMd ? (drawerOpen ? drawerWidth : closedDrawerWidth) : 'auto'
            }}
            aria-label='mailbox folders'
        >
            {isAuthenticated && (
                <Drawer
                    container={container}
                    variant='permanent'
                    anchor={anchor}
                    open={drawerOpen}
                    onClose={drawerToggle}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: drawerOpen ? drawerWidth : closedDrawerWidth,
                            background: theme.palette.background.default,
                            color: theme.palette.text.primary,
                            [theme.breakpoints.up('md')]: {
                                top: `${headerHeight}px`
                            },
                            borderRight: theme.direction === 'rtl' && drawerOpen ? 'none' : drawerOpen ? '1px solid' : 'none',
                            borderLeft: theme.direction === 'rtl' && drawerOpen ? '1px solid' : 'none',
                            borderColor: drawerOpen ? theme.palette.grey[900] + 2 : 'transparent',
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen
                            }),
                            overflowX: 'hidden'
                        }
                    }}
                    ModalProps={{ keepMounted: true }}
                    color='inherit'
                >
                    {drawer}
                </Drawer>
            )}
        </Box>
    )
}

Sidebar.propTypes = {
    drawerOpen: PropTypes.bool,
    drawerToggle: PropTypes.func,
    window: PropTypes.object
}

export default Sidebar
