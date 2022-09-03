import { Modal } from '../../components/modal/Modal'
import React, { useState } from 'react'
import { Button, TextField } from '@material-ui/core';
import { Stack } from '@mui/material';
import { Cancel } from '@material-ui/icons';
import commonApi from '../../api/commonApi';
// import './PostModal.css';

export const EditImage = ({
    user,
    file,
    setFile,
    handleUploadProfilePicture,
    setIsShow,
    setUrlFile
}) => {
    const handleFileUpload = async (e) => {
        try {
            const uploadData = new FormData();
            setFile(e.target.files[0]);
            uploadData.append('file', e.target.files[0], 'file');
            let res = await commonApi.cloudinaryUpload(uploadData);
            setUrlFile(res.secure_url);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Modal>
            <form class="form-profile">
                {!file && < Button size='small' color='success' variant="contained"
                >
                    <label htmlFor='file1'  >
                        Upload
                    </label>
                </Button>}
                <Stack spacing={2}>

                    <input
                        style={{ display: 'none' }}
                        type='file'
                        id='file1'
                        accept='.png,.jpeg,.jpg'
                        onChange={(e) => handleFileUpload(e)}

                    />
                    {file && (
                        <div className='shareImgContainer'>
                            <img className='profileImg' src={URL.createObjectURL(file)} alt='' />
                            <Cancel className='shareCancelImg' onClick={() => setFile(null)} />
                        </div>
                    )}
                    {file && (<button className="editModal" onClick={(e) => {
                        e.preventDefault(); handleUploadProfilePicture(

                        )
                    }}> Lưu thông tin
                    </button>)}
                </Stack>

                <span className="close" onClick={() => setIsShow(false)}>&times;</span>
            </form>
        </Modal>
    )
}
