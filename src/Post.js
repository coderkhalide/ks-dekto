import { Avatar, Button, IconButton } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './Post.css'
import { db, timestamp } from './firebase'
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';


const Post = ({imageURL, username, caption, uid, postId, user, userImageURL, handleOpenLogin}) => {

    const [comments, setComments] = useState([])
    const [likes, setLikes] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unSubscribe;
        if(postId){
            unSubscribe = db
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .onSnapshot(snap => {
                    setComments(snap.docs.map(doc => doc.data()))
                })
        }

        return () => {
            unSubscribe()
        }
    }, [postId])

    useEffect(() => {
        let unSubscribe;
        if(postId){
            unSubscribe = db
                .collection('posts')
                .doc(postId)
                .collection('likes')
                .onSnapshot(snap => {
                    setLikes(snap.docs.map(doc => ({
                        id: doc.id,
                        uid: doc.data().uid,
                        username: doc.data().username,
                    })))
                })
        }

        return () => {
            unSubscribe()
        }
    }, [postId])

    const postComment = (e) => {
        e.preventDefault()

        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp: timestamp
        })
        setComment('')
    }

    const liked = (uid) => {
        let check = likes.filter(like => like.uid === uid)
        return check.length === 0 ? false : true
    }

    const handleLike = () => {
        if(liked(user?.uid)) {
            const liker = likes.filter(like => like.uid === user.uid);
            const likerID = liker[0].id;
            db.collection('posts').doc(postId).collection('likes').doc(likerID).delete()
        }else{
            db.collection('posts').doc(postId).collection('likes').add({
                uid: user.uid,
                username: user.displayName,
                timestamp: timestamp
            })
        }
    }

    const deletePost = () => {
        db.collection('posts').doc(postId).delete()
    }

    return ( 
        <div className="post">
            
            <div className="post__header">
                <div className="post__header_user">
                    <Avatar 
                        className="post__avatar"
                        alt={username && username}
                        src={userImageURL ? userImageURL : 'image.jpg'}
                    />
                    <h3>{username && username}</h3>
                </div>
                {uid ? ( uid === user?.uid ? (
                    <div className="post__delete">
                        <IconButton color="secondary" aria-label="add an alarm" onClick={deletePost}>
                            <DeleteRoundedIcon />
                        </IconButton>
                    </div>
                ) : '') : ''}
                
            </div>
            <img className="post__image" src={imageURL && imageURL} alt="Post Image"/>

            <div className="post__likes">
                <div className="post__like_btn">
                    {user ? (
                        liked(user?.uid) ? (
                            <IconButton color="secondary" aria-label="add an alarm" onClick={handleLike}>
                                <FavoriteIcon />
                            </IconButton>
                        ) : (
                            <IconButton color="secondary" aria-label="add an alarm" onClick={handleLike}>
                                <FavoriteBorderIcon />
                            </IconButton>
                        )
                    ) : (
                        <IconButton color="secondary" aria-label="add an alarm" onClick={handleOpenLogin}>
                            <FavoriteBorderIcon />
                        </IconButton>
                    )}
                    
                </div>
                <div className="post__like_count">
                    <h4><b>{likes && likes.length}</b> Likes</h4>
                </div>
            </div>
            <h4 className="post__text"><b>{username && username} </b>{caption && caption}</h4>
            {comments.length ? (
                <div className="post__comments">
                    {comments.length ? (<h4>Comments :</h4>) : ''}
                    {comments && comments.map(({text, username}) => (
                        <h5 className="post__c_text" key={Math.random() * 10}>
                            <b>{username}: </b>{text}
                        </h5>
                    ))}
                </div>
            ): ''}

            {user ? (
                <form onSubmit={postComment} className="post__postComment">
                    <input 
                        type="text"
                        placeholder="Write comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="post__comment_input"
                    />
                    <Button className="post__comment_btn" type="submit" disabled={!comment}>Post</Button>
                </form>
            ) : (
                <form onSubmit={postComment} className="post__postComment" onClick={handleOpenLogin}>
                    <input 
                        type="text"
                        placeholder="Write comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="post__comment_input"
                        onClick={handleOpenLogin}
                    />
                    <Button className="post__comment_btn" type="submit" disabled={true}>Post</Button>
                </form>
            )}
        </div>
     );
}
 
export default Post;