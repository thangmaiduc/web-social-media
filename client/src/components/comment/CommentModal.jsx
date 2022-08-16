import { Modal } from '../modal/Modal'
import React, { useState } from 'react'
import './commentModal.css';

export const CommentModal = ({
  comment,
  setIsShow,
  editComment
}) => {
  const [editText, setEditText] = useState(comment.text)
  return (
    <Modal>
      <form className="form">
        <input placeholder="edit here..." type="text" className="editInput"
         value={editText} onChange={(e) =>setEditText(e.target.value)} />
        
        <button className="editModal" onClick={ (e) => { e.preventDefault();editComment(comment.id,editText )}}> Edit Comment
        </button>
        <span className="close" onClick={() => setIsShow(false)}>&times;</span>
      </form>
    </Modal>
  )
}
