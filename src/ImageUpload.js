import { Button, Input, LinearProgress } from "@material-ui/core"
import { db, storage, timestamp } from './firebase'
import { useState } from "react"
import './ImageUpload.css'

function ImageUpload({username, setimageUploadModal, userImageURL, uid}) {

    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState(null)

    const types = ['image/png', 'image/jpeg']

    const handeChange = (e) => {
        let selected = e.target.files[0]

        if(selected){
            if(types.includes(selected.type)){
                setImage(selected)
                setError(null)
            }else{
                setImage(null)
                setError('Please select an image file (png or jpeg)!')
            }
        }else{
            setError('Please select an image file (png or jpeg)!')
        }
    }

    const handleUpload = () => {
        if(image){
            const uploadTask = storage.ref(`images/${image.name}`).put(image)
            uploadTask.on(
                // Progress function
                'state_changed',
                (snap) => {
                    const progress = Math.round(
                        (snap.bytesTransferred / snap.totalBytes) * 100
                    )
                    console.log(progress)
                    setProgress(progress)
                }, 
                (error) => {
                    // Error function
                    console.log(error)
                },
                () => {
                    // Complete function
                    storage
                        .ref('images')
                        .child(image.name)
                        .getDownloadURL()
                        .then(url => {
                            // post the image to the database
                            db.collection('posts').add({
                                username: username,
                                uid: uid,
                                timestamp,
                                likes: 0,
                                userImageURL,
                                caption,
                                imageURL: url
                            })

                            setProgress(0)
                            setCaption('')
                            setImage(null)
                            setimageUploadModal(false)
                        })
                }
            )
        }else{
            setError('Please select an image!')
        }
    }

    return (
        <div className="ImageUpload__wrapper">
            <div className="ImageUpload">
                <img className="app_headerImage" src="https://firebasestorage.googleapis.com/v0/b/todo-app-daf71.appspot.com/o/Logo.png?alt=media&token=52fa9e4c-2f88-4758-842c-738f211ebbe4" alt=""/>
                <Input className="caption" type="text" placeholder="Enter a caption..." onChange={e => setCaption(e.target.value)} value={caption}/>

                <label>
                    <input type="file" onChange={handeChange} />
                    <span>+</span>
                </label>

                <div className="all_wrapper">
                    <div className="output">
                        { error && (<div className="error">{ error }</div>) }
                        {image && (<div>{ image.name }</div>)}
                        {(progress > 0) && (<LinearProgress variant="determinate" value={progress} />)}
                    </div>
                    <Button onClick={handleUpload}>Post</Button>
                </div>
            </div>
            <div className="backdrop" onClick={() => setimageUploadModal(false)}></div>
        </div>
    )
}

export default ImageUpload
