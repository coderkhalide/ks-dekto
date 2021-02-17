import { Avatar, Button } from "@material-ui/core"
import { useEffect, useRef, useState } from "react"
import './Message.css'
import { db, timestamp } from './firebase'

function Messages({user, setchatOpen, chatOpen}) {

    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    useEffect(() => {
        db.collection('messages').orderBy('timestamp', 'desc').onSnapshot((snap) => {
            setMessages(snap.docs.map(doc => ({
                text: doc.data().text,
                username: doc.data().username,
                userImageURL: doc.data().userImageURL,
                id: doc.id
          })))
        })
    }, [])

    const messagesEndRef = useRef (null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault()
        db.collection('messages').add({
            timestamp,
            username: user.displayName,
            userImageURL: user.photoURL,
            text: message
        })
        setMessage('')
    }

    return (
        <div className="message">
            <div className="live_chat_top">
                <h3>Live chat</h3>
                {chatOpen && (<Button classname="closeBtn" onClick={() => setchatOpen(false)}>Close 😐</Button>)}
            </div>
            {user ? (
                <div className="message__wrapper">
                    <div className="message__header">
                    <Avatar 
                        alt={user?.displayName}
                        src={user?.photoURL ? user?.photoURL : 'image.jpg'} 
                    />
                    <h4>{user?.displayName}</h4>
                    </div>
                    <div className="message__body">
                        <div ref={messagesEndRef} />
                        {messages && messages.map(({text, username, id, userImageURL}) => (
                            ( (username === user.displayName) ? (
                                <div className="msg sender" key={id}>
                                    <Avatar 
                                        className="message__avatar"
                                        alt={username} 
                                        src={userImageURL ? userImageURL : 'image.jpg'} 
                                    />
                                    <div className="msg__text">{text}</div>
                                </div>
                            ) : (
                                <div className="msg reciver" key={id}>
                                    <Avatar 
                                        className="message__avatar"
                                        alt={username} 
                                        src={userImageURL ? userImageURL : 'image.jpg'} 
                                    />
                                    <div className="msg__text"><b>{username}</b> {text}</div>
                                </div>
                            ))
                        ))}
                        
                    </div>
                    <div className="message__form">
                        <form onSubmit={(e) => sendMessage(e)}>
                            <input className="message__input" placeholder="Write message..." value={message} onChange={e => setMessage(e.target.value)}/>
                            <Button className="post__comment_btn" type="submit" disabled={!message}>🚀</Button>
                        </form>
                    </div>
                </div>
            ) : (<em>Login to join livechat.</em>)}
        </div>
    )
}

export default Messages