import { Modal } from '../modal/Modal'
import React from 'react'
import './commentModal.css';

export const CommentModal = ({
  comment,
  setComment,
  setIsShow,
  editComment
}) => {
  return (
    <Modal>
      <form class="form">
        <input placeholder="edit here..." type="text" className="editInput" value={comment.text || ''} onChange={(e) => setComment(c => { return { ...c, text: e.target.value } })} />
        <button className="editModal" onClick={editComment}> Edit Comment
        </button>
        <span className="close" onClick={() => setIsShow(false)}>&times;</span>
      </form>
    </Modal>
  )
}
