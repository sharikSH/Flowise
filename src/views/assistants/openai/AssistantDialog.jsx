import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from '@/store/actions'
import { v4 as uuidv4 } from 'uuid'

import {
    Chip,
    Card,
    CardContent,
    Box,
    Typography,
    Button,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    OutlinedInput
} from '@mui/material'

import { TooltipWithParser } from '@/ui-component/tooltip/TooltipWithParser'
import { Dropdown } from '@/ui-component/dropdown/Dropdown'
import { MultiDropdown } from '@/ui-component/dropdown/MultiDropdown'
import CredentialInputHandler from '@/views/canvas/CredentialInputHandler'
import { File } from '@/ui-component/file/File'
import { BackdropLoader } from '@/ui-component/loading/BackdropLoader'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import AssistantVectorStoreDialog from './AssistantVectorStoreDialog'
import { StyledPermissionButton } from '@/ui-component/button/RBACButtons'

// Icons
import { IconX, IconPlus } from '@tabler/icons-react'

// API
import assistantsApi from '@/api/assistants'

// Hooks
import useApi from '@/hooks/useApi'

// utils
import useNotifier from '@/utils/useNotifier'
import { HIDE_CANVAS_DIALOG, SHOW_CANVAS_DIALOG } from '@/store/actions'
import { maxScroll } from '@/store/constant'

const assistantAvailableModels = [
    {
        label: 'gpt-4.1',
        name: 'gpt-4.1'
    },
    {
        label: 'gpt-4.1-mini',
        name: 'gpt-4.1-mini'
    },
    {
        label: 'gpt-4.1-nano',
        name: 'gpt-4.1-nano'
    },
    {
        label: 'gpt-4.5-preview',
        name: 'gpt-4.5-preview'
    },
    {
        label: 'gpt-4o-mini',
        name: 'gpt-4o-mini'
    },
    {
        label: 'gpt-4o',
        name: 'gpt-4o'
    },
    {
        label: 'gpt-4-turbo',
        name: 'gpt-4-turbo'
    },
    {
        label: 'gpt-4-turbo-preview',
        name: 'gpt-4-turbo-preview'
    },
    {
        label: 'gpt-4-1106-preview',
        name: 'gpt-4-1106-preview'
    },
    {
        label: 'gpt-4-0613',
        name: 'gpt-4-0613'
    },
    {
        label: 'gpt-4',
        name: 'gpt-4'
    },
    {
        label: 'gpt-3.5-turbo',
        name: 'gpt-3.5-turbo'
    },
    {
        label: 'gpt-3.5-turbo-0125',
        name: 'gpt-3.5-turbo-0125'
    },
    {
        label: 'gpt-3.5-turbo-1106',
        name: 'gpt-3.5-turbo-1106'
    },
    {
        label: 'gpt-3.5-turbo-0613',
        name: 'gpt-3.5-turbo-0613'
    },
    {
        label: 'gpt-3.5-turbo-16k',
        name: 'gpt-3.5-turbo-16k'
    },
    {
        label: 'gpt-3.5-turbo-16k-0613',
        name: 'gpt-3.5-turbo-16k-0613'
    }
]

const AssistantDialog = ({ show, dialogProps, onCancel, onConfirm, setError }) => {
    const portalElement = document.getElementById('portal')
    useNotifier()
    const dispatch = useDispatch()
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))
    const customization = useSelector((state) => state.customization)
    const dialogRef = useRef()

    const getSpecificAssistantApi = useApi(assistantsApi.getSpecificAssistant)
    const getAssistantObjApi = useApi(assistantsApi.getAssistantObj)

    const [assistantId, setAssistantId] = useState('')
    const [openAIAssistantId, setOpenAIAssistantId] = useState('')
    const [assistantName, setAssistantName] = useState('')
    const [assistantDesc, setAssistantDesc] = useState('')
    const [assistantIcon, setAssistantIcon] = useState(`https://api.dicebear.com/7.x/bottts/svg?seed=${uuidv4()}`)
    const [assistantModel, setAssistantModel] = useState('')
    const [assistantCredential, setAssistantCredential] = useState('')
    const [assistantInstructions, setAssistantInstructions] = useState('')
    const [assistantTools, setAssistantTools] = useState(['code_interpreter', 'file_search'])
    const [toolResources, setToolResources] = useState({})
    const [temperature, setTemperature] = useState(1)
    const [topP, setTopP] = useState(1)
    const [uploadCodeInterpreterFiles, setUploadCodeInterpreterFiles] = useState('')
    const [uploadVectorStoreFiles, setUploadVectorStoreFiles] = useState('')
    const [loading, setLoading] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteDialogProps, setDeleteDialogProps] = useState({})
    const [assistantVectorStoreDialogOpen, setAssistantVectorStoreDialogOpen] = useState(false)
    const [assistantVectorStoreDialogProps, setAssistantVectorStoreDialogProps] = useState({})

    useEffect(() => {
        if (show) dispatch({ type: SHOW_CANVAS_DIALOG })
        else dispatch({ type: HIDE_CANVAS_DIALOG })
        return () => dispatch({ type: HIDE_CANVAS_DIALOG })
    }, [show, dispatch])

    useEffect(() => {
        if (getSpecificAssistantApi.data) {
            setAssistantId(getSpecificAssistantApi.data.id)
            setAssistantIcon(getSpecificAssistantApi.data.iconSrc)
            setAssistantCredential(getSpecificAssistantApi.data.credential)

            const assistantDetails = JSON.parse(getSpecificAssistantApi.data.details)
            setOpenAIAssistantId(assistantDetails.id)
            setAssistantName(assistantDetails.name)
            setAssistantDesc(assistantDetails.description)
            setAssistantModel(assistantDetails.model)
            setAssistantInstructions(assistantDetails.instructions)
            setTemperature(assistantDetails.temperature)
            setTopP(assistantDetails.top_p)
            setAssistantTools(assistantDetails.tools ?? [])
            setToolResources(assistantDetails.tool_resources ?? {})
        }
    }, [getSpecificAssistantApi.data])

    useEffect(() => {
        if (getAssistantObjApi.data) {
            syncData(getAssistantObjApi.data)
        }
    }, [getAssistantObjApi.data])

    useEffect(() => {
        if (getAssistantObjApi.error) {
            let errMsg = 'خطای سرور داخلی'
            let error = getAssistantObjApi.error
            if (error?.response?.data) {
                errMsg = typeof error.response.data === 'object' ? error.response.data.message : error.response.data
            }
            enqueueSnackbar({
                message: `خطا در دریافت دستیار: ${errMsg}`,
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
    }, [getAssistantObjApi.error])

    useEffect(() => {
        if (getSpecificAssistantApi.error) {
            const error = getSpecificAssistantApi.error
            let errMsg = ''
            if (error?.response?.data) {
                errMsg = typeof error.response.data === 'object' ? error.response.data.message : error.response.data
            }
            enqueueSnackbar({
                message: `خطا در دریافت دستیار: ${errMsg}`,
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
    }, [getSpecificAssistantApi.error])

    useEffect(() => {
        if (dialogProps.type === 'EDIT' && dialogProps.data) {
            setAssistantId(dialogProps.data.id)
            setAssistantIcon(dialogProps.data.iconSrc)
            setAssistantCredential(dialogProps.data.credential)

            const assistantDetails = JSON.parse(dialogProps.data.details)
            setOpenAIAssistantId(assistantDetails.id)
            setAssistantName(assistantDetails.name)
            setAssistantDesc(assistantDetails.description)
            setAssistantModel(assistantDetails.model)
            setAssistantInstructions(assistantDetails.instructions)
            setTemperature(assistantDetails.temperature)
            setTopP(assistantDetails.top_p)
            setAssistantTools(assistantDetails.tools ?? [])
            setToolResources(assistantDetails.tool_resources ?? {})
        } else if (dialogProps.type === 'EDIT' && dialogProps.assistantId) {
            getSpecificAssistantApi.request(dialogProps.assistantId)
        } else if (dialogProps.type === 'ADD' && dialogProps.selectedOpenAIAssistantId && dialogProps.credential) {
            setAssistantId('')
            setAssistantIcon(`https://api.dicebear.com/7.x/bottts/svg?seed=${uuidv4()}`)
            setAssistantCredential(dialogProps.credential)

            getAssistantObjApi.request(dialogProps.selectedOpenAIAssistantId, dialogProps.credential)
        } else if (dialogProps.type === 'ADD' && !dialogProps.selectedOpenAIAssistantId) {
            setAssistantId('')
            setAssistantIcon(`https://api.dicebear.com/7.x/bottts/svg?seed=${uuidv4()}`)
            setAssistantCredential('')

            setOpenAIAssistantId('')
            setAssistantName('')
            setAssistantDesc('')
            setAssistantModel('')
            setAssistantInstructions('')
            setTemperature(1)
            setTopP(1)
            setAssistantTools(['code_interpreter', 'file_search'])
            setUploadCodeInterpreterFiles('')
            setUploadVectorStoreFiles('')
            setToolResources({})
        }

        return () => {
            setAssistantId('')
            setAssistantIcon(`https://api.dicebear.com/7.x/bottts/svg?seed=${uuidv4()}`)
            setAssistantCredential('')

            setOpenAIAssistantId('')
            setAssistantName('')
            setAssistantDesc('')
            setAssistantModel('')
            setAssistantInstructions('')
            setTemperature(1)
            setTopP(1)
            setAssistantTools(['code_interpreter', 'file_search'])
            setUploadCodeInterpreterFiles('')
            setUploadVectorStoreFiles('')
            setToolResources({})
            setLoading(false)
        }
    }, [dialogProps])

    const syncData = (data) => {
        setOpenAIAssistantId(data.id)
        setAssistantName(data.name)
        setAssistantDesc(data.description)
        setAssistantModel(data.model)
        setAssistantInstructions(data.instructions)
        setTemperature(data.temperature)
        setTopP(data.top_p)
        setToolResources(data.tool_resources ?? {})

        let tools = []
        if (data.tools && data.tools.length) {
            for (const tool of data.tools) {
                tools.push(tool.type)
            }
        }
        setAssistantTools(tools)
    }

    const onEditAssistantVectorStoreClick = (vectorStoreObject) => {
        const dialogProp = {
            title: `ویرایش ${vectorStoreObject.name ? vectorStoreObject.name : vectorStoreObject.id}`,
            type: 'EDIT',
            cancelButtonName: 'لغو',
            confirmButtonName: 'ذخیره',
            data: vectorStoreObject,
            credential: assistantCredential
        }
        setAssistantVectorStoreDialogProps(dialogProp)
        setAssistantVectorStoreDialogOpen(true)
    }

    const onAddAssistantVectorStoreClick = () => {
        const dialogProp = {
            title: `افزودن مخزن بردار`,
            type: 'ADD',
            cancelButtonName: 'لغو',
            confirmButtonName: 'افزودن',
            credential: assistantCredential
        }
        setAssistantVectorStoreDialogProps(dialogProp)
        setAssistantVectorStoreDialogOpen(true)
    }

    const addNewAssistant = async () => {
        setLoading(true)
        try {
            const assistantDetails = {
                id: openAIAssistantId,
                name: assistantName,
                description: assistantDesc,
                model: assistantModel,
                instructions: assistantInstructions,
                temperature: temperature ? parseFloat(temperature) : null,
                top_p: topP ? parseFloat(topP) : null,
                tools: assistantTools,
                tool_resources: toolResources
            }
            const obj = {
                details: JSON.stringify(assistantDetails),
                iconSrc: assistantIcon,
                credential: assistantCredential,
                type: 'OPENAI'
            }

            const createResp = await assistantsApi.createNewAssistant(obj)
            if (createResp.data) {
                enqueueSnackbar({
                    message: 'دستیار جدید اضافه شد',
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
                onConfirm(createResp.data.id)
            }
            setLoading(false)
        } catch (error) {
            enqueueSnackbar({
                message: `خطا در افزودن دستیار جدید: ${
                    typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                }`,
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
            setLoading(false)
        }
    }

    const saveAssistant = async () => {
        setLoading(true)
        try {
            const assistantDetails = {
                name: assistantName,
                description: assistantDesc,
                model: assistantModel,
                instructions: assistantInstructions,
                temperature: temperature ? parseFloat(temperature) : null,
                top_p: topP ? parseFloat(topP) : null,
                tools: assistantTools,
                tool_resources: toolResources
            }
            const obj = {
                details: JSON.stringify(assistantDetails),
                iconSrc: assistantIcon,
                credential: assistantCredential
            }
            const saveResp = await assistantsApi.updateAssistant(assistantId, obj)
            if (saveResp.data) {
                enqueueSnackbar({
                    message: 'دستیار ذخیره شد',
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
                onConfirm(saveResp.data.id)
            }
            setLoading(false)
        } catch (error) {
            enqueueSnackbar({
                message: `خطا در ذخیره دستیار: ${
                    typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                }`,
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
            setLoading(false)
        }
    }

    const onSyncClick = async () => {
        setLoading(true)
        try {
            const getResp = await assistantsApi.getAssistantObj(openAIAssistantId, assistantCredential)
            if (getResp.data) {
                syncData(getResp.data)
                enqueueSnackbar({
                    message: 'دستیار با موفقیت همگام‌سازی شد!',
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
            setLoading(false)
        } catch (error) {
            enqueueSnackbar({
                message: `خطا در همگام‌سازی دستیار: ${
                    typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                }`,
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
            setLoading(false)
        }
    }

    const uploadFormDataToVectorStore = async (formData) => {
        setLoading(true)
        try {
            const vectorStoreId = toolResources.file_search?.vector_store_ids?.length ? toolResources.file_search.vector_store_ids[0] : ''
            const uploadResp = await assistantsApi.uploadFilesToAssistantVectorStore(vectorStoreId, assistantCredential, formData)
            if (uploadResp.data) {
                enqueueSnackbar({
                    message: 'فایل با موفقیت بارگذاری شد!',
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

                const uploadedFiles = uploadResp.data
                const existingFiles = toolResources?.file_search.files ?? []

                setToolResources({
                    ...toolResources,
                    file_search: {
                        ...toolResources?.file_search,
                        files: [...existingFiles, ...uploadedFiles]
                    }
                })
            }
            setLoading(false)
        } catch (error) {
            enqueueSnackbar({
                message: `خطا در بارگذاری فایل: ${
                    typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                }`,
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
            setLoading(false)
        }
    }

    const uploadFormDataToCodeInterpreter = async (formData) => {
        setLoading(true)
        try {
            const uploadResp = await assistantsApi.uploadFilesToAssistant(assistantCredential, formData)
            if (uploadResp.data) {
                enqueueSnackbar({
                    message: 'فایل با موفقیت بارگذاری شد!',
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

                const uploadedFiles = uploadResp.data
                const existingFiles = toolResources?.code_interpreter?.files ?? []
                const existingFileIds = toolResources?.code_interpreter?.file_ids ?? []

                setToolResources({
                    ...toolResources,
                    code_interpreter: {
                        ...toolResources?.code_interpreter,
                        files: [...existingFiles, ...uploadedFiles],
                        file_ids: [...existingFileIds, ...uploadedFiles.map((file) => file.id)]
                    }
                })
            }
            setLoading(false)
        } catch (error) {
            enqueueSnackbar({
                message: `خطا در بارگذاری فایل: ${
                    typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                }`,
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
            setLoading(false)
        }
    }

    const detachVectorStore = () => {
        setToolResources({
            ...toolResources,
            file_search: {
                files: [],
                vector_store_object: null,
                vector_store_ids: []
            }
        })
    }

    const onDeleteClick = () => {
        setDeleteDialogProps({
            title: `حذف دستیار`,
            description: `روش حذف را برای ${assistantName} انتخاب کنید`,
            cancelButtonName: 'لغو'
        })
        setDeleteDialogOpen(true)
    }

    const deleteAssistant = async (isDeleteBoth) => {
        setDeleteDialogOpen(false)
        try {
            const delResp = await assistantsApi.deleteAssistant(assistantId, isDeleteBoth)
            if (delResp.data) {
                enqueueSnackbar({
                    message: 'دستیار حذف شد',
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
                onConfirm()
            }
        } catch (error) {
            enqueueSnackbar({
                message: `خطا در حذف دستیار: ${
                    typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                }`,
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
            onCancel()
        }
    }

    const onFileDeleteClick = async (fileId, toolType) => {
        if (toolType === 'code_interpreter') {
            setToolResources({
                ...toolResources,
                code_interpreter: {
                    ...toolResources.code_interpreter,
                    files: toolResources.code_interpreter.files.filter((file) => file.id !== fileId),
                    file_ids: toolResources.code_interpreter.file_ids.filter((file_id) => file_id !== fileId)
                }
            })
        } else if (toolType === 'file_search') {
            setToolResources({
                ...toolResources,
                file_search: {
                    ...toolResources.file_search,
                    files: toolResources.file_search.files.filter((file) => file.id !== fileId)
                }
            })
            try {
                const vectorStoreId = toolResources.file_search?.vector_store_ids?.length
                    ? toolResources.file_search.vector_store_ids[0]
                    : ''
                await assistantsApi.deleteFilesFromAssistantVectorStore(vectorStoreId, assistantCredential, { file_ids: [fileId] })
            } catch (error) {
                console.error(error)
            }
        }
    }

    const component = show ? (
        <Dialog
            fullWidth
            maxWidth='md'
            open={show}
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1rem', p: 3, pb: 0 }} id='alert-dialog-title'>
                {dialogProps.title}
            </DialogTitle>
            <DialogContent
                ref={dialogRef}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '75vh', position: 'relative', px: 3, pb: 3 }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <Box>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography variant='overline'>
                                اعتبارنامه OpenAI
                                <span style={{ color: 'red' }}>&nbsp;*</span>
                            </Typography>
                        </Stack>
                        <CredentialInputHandler
                            key={assistantCredential}
                            data={assistantCredential ? { credential: assistantCredential } : {}}
                            inputParam={{
                                label: 'اتصال اعتبارنامه',
                                name: 'credential',
                                type: 'credential',
                                credentialNames: ['openAIApi']
                            }}
                            onSelect={(newValue) => setAssistantCredential(newValue)}
                        />
                    </Box>
                    <Box>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography variant='overline'>
                                مدل دستیار
                                <span style={{ color: 'red' }}>&nbsp;*</span>
                            </Typography>
                        </Stack>
                        <Dropdown
                            key={assistantModel}
                            name={assistantModel}
                            options={assistantAvailableModels}
                            onSelect={(newValue) => setAssistantModel(newValue)}
                            value={assistantModel ?? 'یک گزینه انتخاب کنید'}
                        />
                    </Box>
                    <Box>
                        <Stack sx={{ position: 'relative', alignItems: 'center' }} direction='row'>
                            <Typography variant='overline'>نام دستیار</Typography>
                            <TooltipWithParser title={'نام دستیار. حداکثر طول 256 کاراکتر است.'} />
                        </Stack>
                        <OutlinedInput
                            id='assistantName'
                            type='string'
                            size='small'
                            fullWidth
                            placeholder='دستیار جدید من'
                            value={assistantName}
                            name='assistantName'
                            onChange={(e) => setAssistantName(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <Stack sx={{ position: 'relative', alignItems: 'center' }} direction='row'>
                            <Typography variant='overline'>توضیحات دستیار</Typography>
                            <TooltipWithParser title={'توضیحات دستیار. حداکثر طول 512 کاراکتر است.'} />
                        </Stack>
                        <OutlinedInput
                            id='assistantDesc'
                            type='string'
                            size='small'
                            fullWidth
                            placeholder='توضیحات درباره کارکرد دستیار'
                            multiline={true}
                            rows={3}
                            value={assistantDesc}
                            name='assistantDesc'
                            onChange={(e) => setAssistantDesc(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <Stack sx={{ position: 'relative' }} direction='row'>
                            <Typography variant='overline'>آیکون دستیار</Typography>
                        </Stack>
                        <div
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                backgroundColor: 'white'
                            }}
                        >
                            <img
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    padding: 5,
                                    borderRadius: '50%',
                                    objectFit: 'contain'
                                }}
                                alt={assistantName}
                                src={assistantIcon}
                            />
                        </div>
                        <OutlinedInput
                            id='assistantIcon'
                            type='string'
                            size='small'
                            fullWidth
                            placeholder={`https://api.dicebear.com/7.x/bottts/svg?seed=${uuidv4()}`}
                            value={assistantIcon}
                            name='assistantIcon'
                            onChange={(e) => setAssistantIcon(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <Stack sx={{ position: 'relative', alignItems: 'center' }} direction='row'>
                            <Typography variant='overline'>دستورالعمل‌های دستیار</Typography>
                            <TooltipWithParser title={'دستورالعمل‌های سیستمی که دستیار استفاده می‌کند. حداکثر طول 32768 کاراکتر است.'} />
                        </Stack>
                        <OutlinedInput
                            id='assistantInstructions'
                            type='string'
                            size='small'
                            fullWidth
                            placeholder='شما یک معلم خصوصی ریاضی هستید. وقتی سؤالی پرسیده می‌شود، کد پایتون بنویسید و اجرا کنید تا به سؤال پاسخ دهید.'
                            multiline={true}
                            rows={3}
                            value={assistantInstructions}
                            name='assistantInstructions'
                            onChange={(e) => setAssistantInstructions(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <Stack sx={{ position: 'relative', alignItems: 'center' }} direction='row'>
                            <Typography variant='overline'>دمای دستیار</Typography>
                            <TooltipWithParser
                                title={
                                    'کنترل تصادفی بودن: کاهش دما منجر به تکمیل‌های کمتر تصادفی می‌شود. با نزدیک شدن دما به صفر، مدل قطعی و تکراری می‌شود.'
                                }
                            />
                        </Stack>
                        <OutlinedInput
                            id='assistantTemp'
                            type='number'
                            size='small'
                            fullWidth
                            value={temperature}
                            name='assistantTemp'
                            onChange={(e) => setTemperature(e.target.value)}
                        />
                    </Box>
                    <Box>
                        <Stack sx={{ position: 'relative', alignItems: 'center' }} direction='row'>
                            <Typography variant='overline'>بالاترین P دستیار</Typography>
                            <TooltipWithParser
                                title={
                                    'تنوع را از طریق نمونه‌برداری هسته‌ای کنترل می‌کند: 0.5 به این معناست که نیمی از گزینه‌های وزن‌دار احتمال در نظر گرفته می‌شوند.'
                                }
                            />
                        </Stack>
                        <OutlinedInput
                            id='assistantTopP'
                            type='number'
                            fullWidth
                            size='small'
                            value={topP}
                            name='assistantTopP'
                            min='0'
                            max='1'
                            onChange={(e) => setTopP(e.target.value)}
                        />
                    </Box>
                    {assistantCredential && (
                        <>
                            <Box>
                                <Stack sx={{ position: 'relative', alignItems: 'center' }} direction='row'>
                                    <Typography variant='overline'>ابزارهای دستیار</Typography>
                                    <TooltipWithParser title='لیستی از ابزارهای فعال شده برای دستیار. حداکثر 128 ابزار برای هر دستیار مجاز است.' />
                                </Stack>
                                <MultiDropdown
                                    key={JSON.stringify(assistantTools)}
                                    name={JSON.stringify(assistantTools)}
                                    options={[
                                        {
                                            label: 'مفسر کد',
                                            name: 'code_interpreter'
                                        },
                                        {
                                            label: 'جستجوی فایل',
                                            name: 'file_search'
                                        }
                                    ]}
                                    onSelect={(newValue) => {
                                        newValue ? setAssistantTools(JSON.parse(newValue)) : setAssistantTools([])
                                        setTimeout(() => {
                                            dialogRef?.current?.scrollTo({ top: maxScroll })
                                        }, 100)
                                    }}
                                    value={assistantTools ?? 'یک گزینه انتخاب کنید'}
                                />
                            </Box>
                            <Box>
                                {assistantTools?.length > 0 && assistantTools.includes('code_interpreter') && (
                                    <Card sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: `${customization.borderRadius}px` }}>
                                        <CardContent>
                                            <Stack sx={{ position: 'relative', alignItems: 'center' }} direction='row'>
                                                <Typography variant='overline'>فایل‌های مفسر کد</Typography>
                                                <TooltipWithParser title='مفسر کد به دستیار امکان نوشتن و اجرای کد را می‌دهد. این ابزار می‌تواند فایل‌هایی با داده‌ها و قالب‌های متنوع را پردازش کرده و فایل‌هایی مانند نمودارها تولید کند.' />
                                            </Stack>
                                            {toolResources?.code_interpreter?.files?.length > 0 && (
                                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    {toolResources?.code_interpreter?.files?.map((file, index) => (
                                                        <div
                                                            key={index}
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                width: 'max-content',
                                                                height: 'max-content',
                                                                borderRadius: 15,
                                                                background: 'rgb(254,252,191)',
                                                                paddingLeft: 15,
                                                                paddingRight: 15,
                                                                paddingTop: 5,
                                                                paddingBottom: 5,
                                                                marginRight: 10,
                                                                marginBottom: 10
                                                            }}
                                                        >
                                                            <span style={{ color: 'rgb(116,66,16)', marginRight: 10 }}>
                                                                {file.filename}
                                                            </span>
                                                            <IconButton
                                                                sx={{ height: 15, width: 15, p: 0 }}
                                                                onClick={() => onFileDeleteClick(file.id, 'code_interpreter')}
                                                            >
                                                                <IconX />
                                                            </IconButton>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <File
                                                key={uploadCodeInterpreterFiles}
                                                fileType='*'
                                                formDataUpload={true}
                                                value={uploadCodeInterpreterFiles ?? 'یک فایل برای بارگذاری انتخاب کنید'}
                                                onChange={(newValue) => setUploadCodeInterpreterFiles(newValue)}
                                                onFormDataChange={(formData) => uploadFormDataToCodeInterpreter(formData)}
                                            />
                                        </CardContent>
                                    </Card>
                                )}
                                {assistantTools?.length > 0 && assistantTools.includes('file_search') && (
                                    <Card sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: `${customization.borderRadius}px` }}>
                                        <CardContent>
                                            <Stack sx={{ position: 'relative', alignItems: 'center' }} direction='row'>
                                                <Typography variant='overline'>فایل‌های جستجوی فایل</Typography>
                                                <TooltipWithParser title='جستجوی فایل به دستیار امکان دسترسی به دانش از فایل‌های بارگذاری شده توسط شما یا کاربرانتان را می‌دهد. پس از بارگذاری فایل، دستیار به‌طور خودکار تصمیم می‌گیرد که چه زمانی محتوا را بر اساس درخواست‌های کاربر بازیابی کند.' />
                                            </Stack>
                                            {toolResources?.file_search?.vector_store_object && (
                                                <Chip
                                                    label={
                                                        toolResources?.file_search?.vector_store_object?.name
                                                            ? toolResources?.file_search?.vector_store_object?.name
                                                            : toolResources?.file_search?.vector_store_object?.id
                                                    }
                                                    component='a'
                                                    sx={{ mb: 2, mt: 1 }}
                                                    variant='outlined'
                                                    clickable
                                                    color='primary'
                                                    onDelete={detachVectorStore}
                                                    onClick={() =>
                                                        onEditAssistantVectorStoreClick(toolResources?.file_search?.vector_store_object)
                                                    }
                                                />
                                            )}
                                            {toolResources?.file_search?.files?.length > 0 && (
                                                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                                                    {toolResources?.file_search?.files?.map((file, index) => (
                                                        <div
                                                            key={index}
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                                width: 'max-content',
                                                                height: 'max-content',
                                                                borderRadius: 15,
                                                                background: 'rgb(254,252,191)',
                                                                paddingLeft: 15,
                                                                paddingRight: 15,
                                                                paddingTop: 5,
                                                                paddingBottom: 5,
                                                                marginRight: 10,
                                                                marginBottom: 10
                                                            }}
                                                        >
                                                            <span style={{ color: 'rgb(116,66,16)', marginRight: 10 }}>
                                                                {file.filename}
                                                            </span>
                                                            <IconButton
                                                                sx={{ height: 15, width: 15, p: 0 }}
                                                                onClick={() => onFileDeleteClick(file.id, 'file_search')}
                                                            >
                                                                <IconX />
                                                            </IconButton>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {!toolResources.file_search || !toolResources.file_search?.vector_store_ids?.length ? (
                                                <Button
                                                    variant='outlined'
                                                    component='label'
                                                    fullWidth
                                                    startIcon={<IconPlus />}
                                                    sx={{ marginRight: '1rem' }}
                                                    onClick={() => onAddAssistantVectorStoreClick()}
                                                >
                                                    افزودن مخزن بردار
                                                </Button>
                                            ) : (
                                                <File
                                                    key={uploadVectorStoreFiles}
                                                    fileType='*'
                                                    formDataUpload={true}
                                                    value={uploadVectorStoreFiles ?? 'یک فایل برای بارگذاری انتخاب کنید'}
                                                    onChange={(newValue) => setUploadVectorStoreFiles(newValue)}
                                                    onFormDataChange={(formData) => uploadFormDataToVectorStore(formData)}
                                                />
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </Box>
                        </>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
                {dialogProps.type === 'EDIT' && (
                    <StyledPermissionButton
                        permissionId={'assistants:create,assistants:update'}
                        color='secondary'
                        variant='contained'
                        onClick={() => onSyncClick()}
                    >
                        همگام‌سازی
                    </StyledPermissionButton>
                )}
                {dialogProps.type === 'EDIT' && (
                    <StyledPermissionButton
                        permissionId={'assistants:delete'}
                        color='error'
                        variant='contained'
                        onClick={() => onDeleteClick()}
                    >
                        حذف
                    </StyledPermissionButton>
                )}
                <StyledPermissionButton
                    permissionId={'assistants:create,assistants:update'}
                    disabled={!(assistantModel && assistantCredential)}
                    variant='contained'
                    onClick={() => (dialogProps.type === 'ADD' ? addNewAssistant() : saveAssistant())}
                >
                    {dialogProps.confirmButtonName}
                </StyledPermissionButton>
            </DialogActions>
            <DeleteConfirmDialog
                show={deleteDialogOpen}
                dialogProps={deleteDialogProps}
                onCancel={() => setDeleteDialogOpen(false)}
                onDelete={() => deleteAssistant()}
                onDeleteBoth={() => deleteAssistant(true)}
            />
            <AssistantVectorStoreDialog
                show={assistantVectorStoreDialogOpen}
                dialogProps={assistantVectorStoreDialogProps}
                onCancel={() => setAssistantVectorStoreDialogOpen(false)}
                onDelete={(vectorStoreId) => {
                    setToolResources({
                        ...toolResources,
                        file_search: {
                            vector_store_object: null,
                            files: [],
                            vector_store_ids: toolResources.file_search.vector_store_ids.filter((id) => vectorStoreId !== id)
                        }
                    })
                    setAssistantVectorStoreDialogOpen(false)
                }}
                onConfirm={(vectorStoreObj, files) => {
                    setToolResources({
                        ...toolResources,
                        file_search: {
                            ...toolResources.file_search,
                            vector_store_object: vectorStoreObj,
                            files: files ? files : toolResources.file_search?.files,
                            vector_store_ids: [vectorStoreObj.id]
                        }
                    })
                    setAssistantVectorStoreDialogOpen(false)
                }}
                setError={setError}
            />
            {loading && <BackdropLoader open={loading} />}
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

AssistantDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func
}

export default AssistantDialog
