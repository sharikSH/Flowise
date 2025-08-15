import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// material-ui
import { Box, Button, OutlinedInput, Stack, Typography } from '@mui/material'

// project imports
import ErrorBoundary from '@/ErrorBoundary'
import ViewHeader from '@/layout/MainLayout/ViewHeader'
import { StyledButton } from '@/ui-component/button/StyledButton'
import MainCard from '@/ui-component/cards/MainCard'
import SettingsSection from '@/ui-component/form/settings'
import { BackdropLoader } from '@/ui-component/loading/BackdropLoader'

// API
import userApi from '@/api/user'
import useApi from '@/hooks/useApi'

// Store
import { store } from '@/store'
import { closeSnackbar as closeSnackbarAction, enqueueSnackbar as enqueueSnackbarAction } from '@/store/actions'
import { gridSpacing } from '@/store/constant'
import { useError } from '@/store/context/ErrorContext'
import { userProfileUpdated } from '@/store/reducers/authSlice'

// utils
import useNotifier from '@/utils/useNotifier'
import { validatePassword } from '@/utils/validation'

// Icons
import { IconAlertTriangle, IconX } from '@tabler/icons-react'

const UserProfile = () => {
    useNotifier()
    const { error, setError } = useError()

    const dispatch = useDispatch()
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const currentUser = useSelector((state) => state.auth.user)
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

    const [newPasswordVal, setNewPasswordVal] = useState('')
    const [confirmPasswordVal, setConfirmPasswordVal] = useState('')
    const [usernameVal, setUsernameVal] = useState('')
    const [emailVal, setEmailVal] = useState('')

    const [loading, setLoading] = useState(false)
    const [authErrors, setAuthErrors] = useState([])

    const getUserApi = useApi(userApi.getUserById)

    const validateAndSubmit = async () => {
        const validationErrors = []
        setAuthErrors([])
        if (!isAuthenticated) {
            validationErrors.push('کاربر احراز هویت نشده است')
        }
        if (currentUser.isSSO) {
            validationErrors.push('کاربر SSO است، امکان به‌روزرسانی جزئیات وجود ندارد')
        }
        if (!usernameVal) {
            validationErrors.push('نام نمی‌تواند خالی باشد!')
        }
        if (!emailVal) {
            validationErrors.push('ایمیل نمی‌تواند خالی باشد!')
        }
        if (newPasswordVal || confirmPasswordVal) {
            if (newPasswordVal !== confirmPasswordVal) {
                validationErrors.push('رمز عبور جدید و تأیید رمز عبور مطابقت ندارند')
            }
            const passwordErrors = validatePassword(newPasswordVal)
            if (passwordErrors.length > 0) {
                validationErrors.push(...passwordErrors.map((err) => translatePasswordError(err)))
            }
        }
        if (validationErrors.length > 0) {
            setAuthErrors(validationErrors)
            return
        }
        const body = {
            id: currentUser.id,
            email: emailVal,
            name: usernameVal
        }
        if (newPasswordVal) body.password = newPasswordVal
        setLoading(true)
        try {
            const updateResponse = await userApi.updateUser(body)
            setAuthErrors([])
            setLoading(false)
            if (updateResponse.data) {
                store.dispatch(userProfileUpdated(updateResponse.data))
                enqueueSnackbar({
                    message: 'جزئیات کاربر به‌روزرسانی شد!',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
            }
        } catch (error) {
            setLoading(false)
            setAuthErrors([typeof error.response.data === 'object' ? error.response.data.message : error.response.data])
            enqueueSnackbar({
                message: `به‌روزرسانی جزئیات کاربر ناموفق بود`,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
        }
    }

    // Function to translate password validation errors
    const translatePasswordError = (error) => {
        switch (error) {
            case 'Password must be at least 8 characters long':
                return 'رمز عبور باید حداقل ۸ کاراکتر باشد'
            case 'Password must contain at least one lowercase letter':
                return 'رمز عبور باید حداقل یک حرف کوچک داشته باشد'
            case 'Password must contain at least one uppercase letter':
                return 'رمز عبور باید حداقل یک حرف بزرگ داشته باشد'
            case 'Password must contain at least one digit':
                return 'رمز عبور باید حداقل یک عدد داشته باشد'
            case 'Password must contain at least one special character':
                return 'رمز عبور باید حداقل یک کاراکتر ویژه داشته باشد'
            default:
                return error
        }
    }

    useEffect(() => {
        if (getUserApi.data) {
            const user = getUserApi.data
            setEmailVal(user.email)
            setUsernameVal(user.name)
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getUserApi.data])

    useEffect(() => {
        if (getUserApi.error) {
            setLoading(false)
            setError(getUserApi.error)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getUserApi.error])

    useEffect(() => {
        setLoading(true)
        getUserApi.request(currentUser.id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <MainCard>
                {error ? (
                    <ErrorBoundary error={error} />
                ) : (
                    <Stack flexDirection='column' sx={{ gap: 3 }}>
                        <ViewHeader search={false} title='تنظیمات' />
                        {authErrors && authErrors.length > 0 && (
                            <div
                                style={{
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderRadius: 10,
                                    background: 'rgb(254,252,191)',
                                    padding: 10,
                                    paddingTop: 15,
                                    marginTop: 10,
                                    marginBottom: 10
                                }}
                            >
                                <Box sx={{ p: 2 }}>
                                    <IconAlertTriangle size={25} color='orange' />
                                </Box>
                                <Stack flexDirection='column'>
                                    <span style={{ color: 'rgb(116,66,16)' }}>
                                        <ul>
                                            {authErrors.map((msg, key) => (
                                                <strong key={key}>
                                                    <li>{msg}</li>
                                                </strong>
                                            ))}
                                        </ul>
                                    </span>
                                </Stack>
                            </div>
                        )}
                        <SettingsSection
                            action={
                                <StyledButton variant='contained' style={{ borderRadius: 2, height: 40 }} onClick={validateAndSubmit}>
                                    ذخیره
                                </StyledButton>
                            }
                            title='پروفایل'
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: gridSpacing,
                                    px: 2.5,
                                    py: 2
                                }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Typography>ایمیل</Typography>
                                        <div style={{ flexGrow: 1 }}></div>
                                    </div>
                                    <OutlinedInput
                                        id='email'
                                        type='string'
                                        fullWidth
                                        size='small'
                                        placeholder='شناسه ورود شما'
                                        name='name'
                                        onChange={(e) => setEmailVal(e.target.value)}
                                        value={emailVal}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Typography>
                                            نام کامل<span style={{ color: 'red' }}>&nbsp;*</span>
                                        </Typography>
                                        <div style={{ flexGrow: 1 }}></div>
                                    </div>
                                    <OutlinedInput
                                        id='name'
                                        type='string'
                                        fullWidth
                                        size='small'
                                        placeholder='نام شما'
                                        name='name'
                                        onChange={(e) => setUsernameVal(e.target.value)}
                                        value={usernameVal}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Typography>
                                            رمز عبور جدید<span style={{ color: 'red' }}>&nbsp;*</span>
                                        </Typography>
                                        <div style={{ flexGrow: 1 }}></div>
                                    </div>
                                    <OutlinedInput
                                        id='np'
                                        type='password'
                                        fullWidth
                                        size='small'
                                        name='new_password'
                                        onChange={(e) => setNewPasswordVal(e.target.value)}
                                        value={newPasswordVal}
                                    />
                                    <Typography variant='caption'>
                                        <i>
                                            رمز عبور باید حداقل ۸ کاراکتر باشد و حداقل شامل یک حرف کوچک، یک حرف بزرگ، یک عدد و یک کاراکتر
                                            ویژه باشد.
                                        </i>
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Typography>
                                            تأیید رمز عبور<span style={{ color: 'red' }}>&nbsp;*</span>
                                        </Typography>
                                        <div style={{ flexGrow: 1 }}></div>
                                    </div>
                                    <OutlinedInput
                                        id='npc'
                                        type='password'
                                        fullWidth
                                        size='small'
                                        name='new_cnf_password'
                                        onChange={(e) => setConfirmPasswordVal(e.target.value)}
                                        value={confirmPasswordVal}
                                    />
                                    <Typography variant='caption'>
                                        <i>رمز عبور جدید خود را دوباره وارد کنید. باید با رمز عبور بالا مطابقت داشته باشد.</i>
                                    </Typography>
                                </Box>
                            </Box>
                        </SettingsSection>
                    </Stack>
                )}
            </MainCard>
            {loading && <BackdropLoader open={loading} />}
        </>
    )
}

export default UserProfile
