import { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase'
import { Avatar, Button, Input, Modal } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import firebase from "firebase"
import Messages from './Messages';


function App() {

  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false);
  const [openL, setOpenL] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [imageUploadModal, setimageUploadModal] = useState(false)
  const [chatOpen, setchatOpen] = useState(false)

  useEffect(() =>{
    const nusub = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        console.log(authUser)
        setUser(authUser)
        setOpen(false);
      }else{
        setUser(null)
      }
    })

    return () => {
      nusub()
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snap) => {
      setPosts(snap.docs.map(doc => ({
        post: doc.data(),
        id: doc.id
      })))
    })
  }, [])

  const handleOpen = () => {
    setOpen(true);
  };

  const closeLogin = () => {
    setOpenL(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenLogin = () => {
    setOpenL(true);
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      setOpen(false)
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => {
      alert(error)
    })
  };

  const handleLogin = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setOpenL(false)
      })
      .catch((error) => {
        alert(error)
      })
  };

  const handleLogout = (e) => {
    auth.signOut().then(() => {
      setUser(null)
    })
  };

  const googleSignup = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
    .then((result) => {
  
      setUser(result.user)
      setOpen(false)
      setOpenL(false)

    }).catch((error) => {
      alert(error.message);
    })
  }

  const body = (
    <div className="app__modal">
      <center>
        <img className="app_headerImage" src="https://firebasestorage.googleapis.com/v0/b/todo-app-daf71.appspot.com/o/Logo.png?alt=media&token=52fa9e4c-2f88-4758-842c-738f211ebbe4" alt=""/>
      </center>
      <form onSubmit={handleSignUp}>
        <div className="app__modal_form">
          <Input 
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="app__modal_input"
          />
          <Input 
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="app__modal_input"
          />
          <Input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="app__modal_input"
          />
          <Button className="google" onClick={googleSignup}>
              <svg aria-hidden="true" class="native svg-icon iconGoogle" width="18" height="18" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"></path><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" fill="#34A853"></path><path d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" fill="#FBBC05"></path><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z" fill="#EA4335"></path></svg>&nbsp;&nbsp;Sign up using Google
          </Button>
          <Button
            className="app__sign_up_btn"
            type="submit"
          >Sign up</Button>
        </div>
      </form>
    </div>
  );
  const bodyL = (
    <div className="app__modal">
      <center>
        <img className="app_headerImage" src="https://firebasestorage.googleapis.com/v0/b/todo-app-daf71.appspot.com/o/Logo.png?alt=media&token=52fa9e4c-2f88-4758-842c-738f211ebbe4" alt=""/>
      </center>
      <form onSubmit={handleLogin}>
        <div className="app__modal_form">
          <Input 
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="app__modal_input"
          />
          <Input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="app__modal_input"
          />
          <Button className="google" onClick={googleSignup}>
              <svg aria-hidden="true" class="native svg-icon iconGoogle" width="18" height="18" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"></path><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" fill="#34A853"></path><path d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" fill="#FBBC05"></path><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z" fill="#EA4335"></path></svg>&nbsp;&nbsp;Login using Google
          </Button>
          <Button
            className="app__sign_up_btn"
            type="submit"
          >Log in</Button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="App">
      <Modal
        open={open}
        onClose={handleClose}
      >
        {body}
      </Modal>
      <Modal
        open={openL}
        onClose={closeLogin}
      >
        {bodyL}
      </Modal>
     
      <div className="app__header">
        <div className="app__header_wrapper">
          <img className="app_headerImage" src="https://firebasestorage.googleapis.com/v0/b/todo-app-daf71.appspot.com/o/Logo.png?alt=media&token=52fa9e4c-2f88-4758-842c-738f211ebbe4" alt=""/>
          {/* <img className="app_headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""/> */}
        
        {user ? (
          <div className="app__avarter">
            <Button onClick={() => setimageUploadModal(true)}>Upload Post</Button>
            <Button onClick={handleLogout}>Log out</Button>
            <Avatar 
                className="post__avatar"
                alt={user?.displayName}
                src={user.photoURL ? user.photoURL : 'image.jpg'}
            />
          </div>
        ) : (
          <div className="app__login_container">
            <Button onClick={handleOpenLogin}>Login</Button>
            <Button onClick={handleOpen}>Sign up</Button>
          </div>
        )}
        </div>
      </div>

      <div className="app__wrapper">
        <div className="app_posts">
          {posts && posts.map(({post, id}) => (
            <Post 
              imageURL={post.imageURL}
              username={post.username}
              caption={post.caption}
              userImageURL={post.userImageURL}
              key={id}
              postId={id}
              user={user}
              uid={post.uid}
              handleOpenLogin={handleOpenLogin}
            />
          ))}
        </div>

        <div className={`app__sidebar ${chatOpen ? ('app__mobile_chat') : ''}`}>
          <Messages 
            user={user}
            setchatOpen={setchatOpen}
            chatOpen={chatOpen}
          />
          {!chatOpen && (
            <div className="app__chat_icon">
              <Button onClick={() => setchatOpen(true)}>
                <img src="https://firebasestorage.googleapis.com/v0/b/todo-app-daf71.appspot.com/o/icons8-chat-100.png?alt=media&token=3e4b0de5-f0ba-4f8a-855e-cd952280b494" alt=""/>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {user?.displayName && 
        (
          imageUploadModal && (<ImageUpload setimageUploadModal={setimageUploadModal} username={user.displayName} userImageURL={user.photoURL} uid={user.uid}/>)
        )
      }

    </div>
  );
}

export default App;