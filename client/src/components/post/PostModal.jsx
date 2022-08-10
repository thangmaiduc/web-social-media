import { Modal } from '../modal/Modal'
import React from 'react'
// import './PostModal.css';

export const PostModal = ({
  postObj,
  setPostObj,
  setIsShow,
  editPost
}) => {
  return (
    <Modal>
      <form class="form">
        <input placeholder="edit here..." type="text" className="editInput" value={postObj.text || ''} onChange={(e) => setPostObj(c => { return { ...c, text: e.target.value } })} />
        <button className="editModal" onClick={editPost}> Edit Post
        </button>
        <span className="close" onClick={() => setIsShow(false)}>&times;</span>
      </form>
    </Modal>
  )
}
