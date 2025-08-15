import { createPortal } from 'react-dom'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogContent, DialogTitle, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material'

const AboutDialog = ({ show, onCancel }) => {
    const portalElement = document.getElementById('portal')

    const [data, setData] = useState({})

    useEffect(() => {
        if (show) {
            const finalData = {
                currentVersion: '1.0.4',
                name: '1.0.4',
                html_url: 'https://github.com/FlowiseAI/Flowise/releases/tag/v1.0.4',
                published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
            }
            setData(finalData)
        }
    }, [show])

    const component = show ? (
        <Dialog
            onClose={onCancel}
            open={show}
            fullWidth
            maxWidth='sm'
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                نسخه Cogniq
            </DialogTitle>
            <DialogContent>
                {data && (
                    <TableContainer component={Paper}>
                        <Table aria-label='جدول ساده'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>نسخه کنونی</TableCell>
                                    <TableCell>آخرین نسخه</TableCell>
                                    <TableCell>منتشر شده در</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell component='th' scope='row'>
                                        {data.currentVersion}
                                    </TableCell>
                                    <TableCell component='th' scope='row'>
                                        <a target='_blank' rel='noreferrer' href='https://github.com/sharikian'>
                                            {data.name}
                                        </a>
                                    </TableCell>
                                    <TableCell>۱ روز پیش</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

AboutDialog.propTypes = {
    show: PropTypes.bool,
    onCancel: PropTypes.func
}

export default AboutDialog
