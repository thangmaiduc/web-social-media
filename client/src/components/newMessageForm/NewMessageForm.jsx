import React from 'react';
import 'emoji-mart/css/emoji-mart.css';
import data from '@emoji-mart/data';
// import Picker from '@emoji-mart/react';
import { Picker } from 'emoji-mart'
import sendIcon from '../../icons/sendIcon.png';
import attachIcon from '../../icons/attachIcon.png';
import emojiIcon from '../../icons/emojiIcon.png';
import useOutsideClick from '../../hooks/useOutsideClick';
import './newMessageForm.css';
import { Cancel } from '@material-ui/icons';

function NewMessageForm({
  newMessage,
  setNewMessage,
  handleStartTyping,
  selectFile,
  setFile,
  handleStopTyping,
  handleSubmit,
  file
}) {
  const { showEmoji, setShowEmoji, ref } = useOutsideClick(false);
  const handleEmojiShow = () => {
    setShowEmoji((v) => !v);
  };
  const handleEmojiSelect = (e) => {
    setNewMessage((newMessage) => (newMessage += e.native));
  };
  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <>
      <form className='form' onSubmit={handleSubmit}>
        <textarea
          className='textarea'
          type='text'
          value={newMessage}
          onChange={handleNewMessageChange}
          onKeyPress={handleStartTyping}
          onKeyUp={handleStopTyping}
          placeholder='Say something...'
        />
        <label htmlFor='file-input'>
          <div className='uploadButton'>
            <img className='uploadImage' src={attachIcon} alt='uploadImage' />
          </div>
        </label>
        <input
          id='file-input'
          className='input'
          onChange={selectFile}
          type='file'
        />
        <button className='sendButton' type='button' onClick={handleEmojiShow}>
          <img className='uploadImage' src={emojiIcon} alt='uploadImage' />
        </button>
        <button className='sendButton'>
          <img className='uploadImage' src={sendIcon} alt='uploadImage' />
        </button>
      </form>
      <div>
      {file && (
          <div className='shareImgContainer'>
            <img className='shareImgMessage' src={URL.createObjectURL(file)} alt='' />
            <Cancel className='shareCancelImg' onClick={() => setFile(null)} />
          </div>
        )}
        {showEmoji && (
          <div ref={ref}>
            <Picker onSelect={handleEmojiSelect} emojiSize={20} />
          </div>
        )}
      </div>
    </>
  );
}

export default NewMessageForm;
