import { Modal } from '../modal/Modal'
import React, { useState } from 'react'
// import './PostModal.css';

export const PostModal = ({
  postObj,
  setPostObj,
  setIsShow,
  editPost,
  editText,
  setEditText
}) => {
  // const [editText,setEditText] = useState(postObj.description)
  return (
    <Modal>
      <form class="form">
        <input placeholder="edit here..." type="text" className="editInput" value={editText} onChange={(e) => setEditText(e.target.value)} />
        <button className="editModal" onClick={(e)=>{e.preventDefault(); editPost(postObj.id, editText)}}> Edit Post
        </button>
        <span className="close" onClick={() => setIsShow(false)}>&times;</span>
      </form>
    </Modal>
  )
}
