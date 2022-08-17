import { Modal } from '../../components/modal/Modal'
import React, { useState } from 'react'
import { TextField } from '@material-ui/core';
import { Stack } from '@mui/material';
// import './PostModal.css';

export const ProfileModal = ({
  user,
  setIsShow,
  setCurUser,
  editUser
}) => {
  const [fullName, setFullName] = useState(user.fullName)
  const [description, setDescription] = useState(user.description)
  const [city, setCity] = useState(user.city)
  const [country, setCountry] = useState(user.country)
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  // const [editText,setEditText] = useState(postObj.description)
  return (
    <Modal>
      <form class="form-profile">
        <Stack spacing={2}>
          <TextField id="outlined-read-only-input" label="Email" variant="standard" value={user.email} InputProps={{
            readOnly: true,
          }} />
          <TextField id="outlined-read-only-input" label="Username" variant="standard" value={user.username} InputProps={{
            readOnly: true,
          }} />
          <TextField id="outlined-basic" label="Họ tên" variant="standard" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <TextField id="outlined-basic" label="Giới thiệu bản thân" variant="standard" value={description} onChange={(e) => setDescription(e.target.value)} />
          <TextField id="outlined-basic" label="Tỉnh, Thành Phố" variant="standard" value={city} onChange={(e) => setCity(e.target.value)} />
          <TextField id="outlined-basic" label="Quốc gia" variant="standard" value={country} onChange={(e) => setCountry(e.target.value)} />
          {/* <TextField
            id="outlined-password-input"
            label="Mật khẩu cũ"
            type="password"
            autoComplete="current-password"
            value={oldPass} onChange={(e) => setOldPass(e.target.value)}
          />
          <TextField
            id="outlined-password-input"
            label="Mật khẩu mới"
            type="password"
            autoComplete="current-password"
            value={newPass} onChange={(e) => setNewPass(e.target.value)}
          /> */}
          <button className="editModal" onClick={(e) => { e.preventDefault(); editUser(
            fullName, description, city,country,
          )  }}> Lưu thông tin
          </button>
        </Stack>

        <span className="close" onClick={() => setIsShow(false)}>&times;</span>
      </form>
    </Modal>
  )
}
