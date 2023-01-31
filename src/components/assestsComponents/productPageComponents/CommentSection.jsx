import React from 'react'
import { useRef } from 'react';
import { useState } from 'react'
import { useEffect } from 'react'
import axios from '../../../api/axios'
import userImg from '../../../assets/defualt.png';
import useAuth from '../../../hooks/useAuth';
import useAuthStatus from '../../../hooks/useAuthStatus';
import Loading from '../Loading';
import moment from 'moment'
import useElemntOnScreen from '../../../hooks/useElemntOnScreen';

const options = {
    root : null,
    rootMargin:'0px',
    threshold: 0.3
}

function CommentSection({productId}) {
    const [comments , setComments] = useState([]);

    useEffect(() => {
        if(productId){
            axios.get(`/comment/${productId}`).then(res => {
                // console.log(res)
                setComments(res.data.comments);
            }).catch(err => {
                console.log(err)
            })
        }
    },[productId])

    const commentRef = useRef(null);
    const commentVis = useElemntOnScreen(options,commentRef);

    useEffect(() => {
        if(commentVis){
            commentRef.current.classList.add('show');
        }else{
            commentRef.current.classList.remove('show');
        }
    },[commentVis]);


  return (
    <section className="comments hidden" ref={commentRef}>
        <h2 className='comment-h2'>Comments</h2>
        {comments.length > 0 && 
            comments.map(e => {
                return (
                    <Card e={e} productId={productId} key={e.id} setComments={setComments}/>
                )
            })
        }
        <AddNewComment productId={productId} setComments={setComments}/>
    </section>
  )
}

export default CommentSection

function Card({e , productId , setComments}){
    const {auth} = useAuth();
    const [editStatus , setEditStatus] = useState(false);
    const [editedComment , setEditedComment] = useState('');
    const [loading , setLoading] = useState(false);

    const axiosPrivate = axios.create({
        headers : {
            'Authorization' : `Bearer ${auth?.accessToken}`
        },
        withCredentials: true
    });

    const editSubmitHandler = async (i) => {
        i.preventDefault();

        if(editedComment && editedComment !== e.comment){
            setLoading(true);
            try{
                const response = await axiosPrivate.put('/comment' , {
                    comment : editedComment,
                    commentId : e.id,
                    productId : productId
                })
                setComments(response.data.comments);
                setEditStatus(false);
                setLoading(false);
            }catch(err) {
                console.log(err)
                setEditStatus(false);
                setLoading(false);
            }
        }else{
            setEditStatus(false)
        }
    }

    
    

    return (
        <div className="card">
            <CardHeader e={e} />
            {editStatus ? (
                <form className='update-form' onSubmit={editSubmitHandler}>
                    <textarea type="text" value={editedComment} onChange={(e) => setEditedComment(e.target.value)}/>
                    <div className="buttons">
                        {loading ? <Loading/> : (
                            <button className='see-product'>
                                send
                            </button>
                        )}
                    </div>
                </form>
                ):
                (
                    <p>{e.comment}</p>
                )
            }
            <EditAndDelete 
            e={e} 
            productId={productId} 
            editStatus={editStatus}
            setEditStatus={setEditStatus}
            setEditedComment={setEditedComment}
            setComments={setComments}
            />
        </div>
    )
}



function EditAndDelete ({e , productId , editStatus , setEditStatus , setEditedComment , setComments}) {
    const {auth} = useAuth();
    const [deleteStatus , setDeleteStatus] = useState(false);
    const [loading , setLoading] = useState(false)

    const axiosPrivate = axios.create({
        headers : {
            'Authorization' : `Bearer ${auth?.accessToken}`
        },
        withCredentials: true
    });
    
    const showPopUp = () => {
        setDeleteStatus(prev => !prev);
    }
    const popUpRef = useRef();
    
    const removePopUp = () => {
        popUpRef.current.classList.add('remove-pop-up');
        setTimeout(() => {
            setDeleteStatus(false);
        }, 700);
    }

    const deleteHandler = async () => {
        setLoading(true);
        try{
            const response = await axiosPrivate.delete(`/comment/${productId}/${e.id}`);
            setDeleteStatus(false);
            setComments(response.data.comments)
            setLoading(false)
        }catch (err){
            console.log(err)
            setDeleteStatus(false);
            setLoading(false)
        }
    }
    const editHandler = () => {
        setEditStatus(prev => !prev);
        setEditedComment(e.comment);
    }

    return (
        <div className='user-controls'>
        {auth?.username ===  e.createdBy.createdBy ? (
            <>
            <div className="edit-delete">
                <div className="delete" onClick={showPopUp}>
                    <span className="material-symbols-outlined">
                        delete
                    </span>
                    Delete
                </div>
                <div className="edit" onClick={editHandler}>
                <span className="material-symbols-outlined">
                    edit
                </span>
                    Edit
                </div>   
            </div>
            <Likes e={e} productId={productId} setComments={setComments}/>
            </>
            ):
            <Likes e={e} productId={productId} setComments={setComments}/>
        }
        {deleteStatus && 
        <div className="pop-up" ref={popUpRef}>
            <h2>DELETE COMMENT</h2>
            <p>Are You Sure You Want To Delete This Comment? This Will Remove The Comment And Can't Be Undone.</p>
            <div className="controls">
                <button className='see-product cancel' onClick={removePopUp}>
                    No, CANCEL
                </button>
                {loading ? <Loading/> : (
                    <button className='see-product delete' onClick={deleteHandler}>Yes, Delete</button>
                )}
            </div>
        </div>
        }
        </div>
    )
}

function Likes({e , productId , setComments}){
    const {auth} = useAuth();
    const [liked , setLiked] = useState(false);
    const {authStatus , setAuthStatus} = useAuthStatus();

    const axiosPrivate = axios.create({
        headers : {
            'Authorization' : `Bearer ${auth?.accessToken}`
        },
        withCredentials: true
    });

    const likeHandler = () => {
        if(auth.accessToken){
            axiosPrivate.post(`/comment/${e.id}/${productId}`).then(res => {
                // console.log(res)
                setComments(res.data.comments)
            }).catch(err => {
                console.log(err);
            })
        }else{
            setAuthStatus('login')
        }

    }

    useEffect(() => {
        if(auth.accessToken){
            if(e.likes.includes(auth.username)){
                setLiked(true);
            }else{
                setLiked(false);
            }
        }else{
            setLiked(false)
        }
    },[e , auth]);

    return (
    <div className="likes">
        <h3>{e.likes.length}</h3>
        {liked ? (
            <span className="material-symbols-outlined disabled">
                favorite
            </span>
        ):( 
            <span className="material-symbols-outlined not-disabled" onClick={likeHandler}>
                favorite
            </span>          
        )
        }

    </div>
    )
}




function CardHeader({e}){
    const newDate = new Date();
    const date = new Date(e.date);    
    const result = moment(newDate).diff(moment(date));
    const time = moment.duration(result).humanize();

    return (
        <div className="card-header">
            <div className="user-info">
                <img src={e.createdBy.image ? e.createdBy.  image : userImg} alt="user-img" />
                <h2>@{e.createdBy.createdBy}</h2>
            </div>
            <h3>{time} ago</h3>
        </div>
    )
}

function AddNewComment({productId , setComments}){
    const {auth} = useAuth();
    const {authStatus , setAuthStatus} = useAuthStatus();
    const [comment , setComment] = useState();
    const [loading , setLoading] = useState(false);


    const submitHandler = async (e) => {
        e.preventDefault();
        if(comment){
            setLoading(true);
            if(auth.accessToken){
                const axiosPrivate = axios.create({
                    headers : {
                        'Authorization' : `Bearer ${auth?.accessToken}`
                    },
                    withCredentials: true
                });
                
                try{
                    const response = await axiosPrivate.post('/comment' , {
                        productId ,
                        comment
                    })
                    setComment('')
                    setLoading(false)
                    setComments(response.data.comments)
                    // console.log(response)
                }catch (err){
                    console.log(err)
                }
            }else{
                setAuthStatus('login')
                setLoading(false)
            }
        }

    }
    return (
        <div className="card new-comment">
            <img src={auth?.image ? auth?.image : userImg} alt="user-img" />
            <form onSubmit={submitHandler}>
                <textarea 
                    name="comment" 
                    id="comment" 
                    placeholder='Add A Comment'
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                    />
                {loading ? <Loading/> : 
                    <button className='see-product'>SEND</button>
                }
            </form>
        </div>
    )
}