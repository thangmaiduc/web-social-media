import { Modal } from '../../components/modal/Modal'
import React, { useState } from 'react'
import { TextField } from '@material-ui/core';
import { Stack } from '@mui/material';
import userApi from '../../api/userApi';
import { notify } from '../../utility/toast';
// import './PostModal.css';

export const ChangePasswordModal = ({
  setIsShow,
}) => {
  
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const handleChangePassword=async(e)=>{
    e.preventDefault();
    try {
      const res  = await userApi.changePassword({
        oldPassword: oldPass,
        password: newPass
      }) 
      notify(res.message)
      setIsShow(false)
    } catch (error) {
      
    }
  }
  // const [editText,setEditText] = useState(postObj.description)
  return (
    <Modal>
      <form class="form-profile">
        <Stack spacing={2}>
         
         
          <TextField
            id="outlined-password-input"
            label="Mật khẩu cũ"
            type="password"
            placeholder='Mật khẩu cũ'
            value={oldPass} onChange={(e) => setOldPass(e.target.value)}
          />
          <TextField
            id="outlined-password-input"
            label="Mật khẩu mới"
            type="password"
            placeholder='Mật khẩu mới'
            value={newPass} onChange={(e) => setNewPass(e.target.value)}
          />
          <button className="editModal" onClick={handleChangePassword}> Lưu thông tin
          </button>
        </Stack>

        <span className="close" onClick={() => setIsShow(false)}>&times;</span>
      </form>
    </Modal>
  )
}
