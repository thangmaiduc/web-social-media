import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";

export default function Conversation({ conversation, currentUser }) {
  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={
          conversation?.img
            // ? PF + user.profilePicture
            // : PF + "person/noAvatar.png"
        }
        alt=""
      />
      <span className="conversationName">{conversation?.title}</span>
    </div>
  );
}
