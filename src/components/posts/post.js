import React, { useState, useEffect, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { deletePost, getCurrentUser, getPost, getUsers, postComment } from "./PostProvider"
import { useHistory } from "react-router"
import "./Post.css"
import { EditDeleteModal } from "./EditDeleteModal"

export const Post = () => {
    const { postId } = useParams()
    const [post, setPost] = useState({})
    const [toDelete, setDelete] = useState(false)
    const history = useHistory()
    const [users, updateUsers] = useState([])
    const [user, setUser] = useState([])
    const [isToggled, setToggle] = useState(false)
    const [comment, setComment] = useState({})
    const [commentText, setCommentText] = useState("")

    useEffect(() => {
        getPost(postId)
            .then(res => res.json())
            .then(res => setPost(res))
        getUsers()
            .then(res => res.json())
            .then(res => updateUsers(res))
        getCurrentUser(parseInt(localStorage.getItem('rare_user_id')))
            .then(res => res.json())
            .then(user => setUser(user))
    }, [isToggled])

    const toggleComment = () => {
        setToggle(!isToggled)
        console.log(post.comments)
    }

    const constructComment = () => {
        comment.post_id = parseInt(postId)
        comment.author_id = parseInt(localStorage.getItem("rare_user_id"))
        comment.content = commentText
        postComment(comment)
        setToggle(!isToggled)
    }

    const confirmDelete = useRef()
    const editPost = useRef()

    return (
        <>
            <EditDeleteModal postToModify={post} updatePosts={setPost} confirmDelete={confirmDelete} editPost={editPost} />

            <section className="singlePost">
                <div className="singlePostHeader">
                    <h2>{post.title}
                        {post.approved === 0 ? <i>(Pending Approval)</i> : ""}</h2>
                    <br />Publication Date: {post.publication_date}
                </div>
                <div className="postImage">
                    <img src={post.image_url} />
                </div>
                <div>
                    {post.content}
                </div>
                <div>
                    <h4>Comments</h4>
                    <ul>
                        {post?.comments?.map(
                            comment => { //Iterating through comments
                                for (const user of users) { //Scanning users for matching ids to comment author id
                                    if (comment?.author_id == user?.id) {
                                        return <li>{user.first_name} {user.last_name} said: "{comment?.content}" at {comment?.created_on}</li>
                                    }
                                }
                            }
                        )}
                    </ul>
                </div>
                <div className="addComment">
                    {isToggled === true
                        ? <><textarea placeholder="Type your comment here..." onChange={(e) => setCommentText(e.target.value)}></textarea>
                            <div className="commentButtonsDiv">
                                <button onClick={() => constructComment()} className="commentButton">Submit</button>
                                <button onClick={() => toggleComment()} className="commentButton">Cancel</button>
                            </div>
                        </>
                        : <button onClick={() => toggleComment()} className="commentButton">Add Comment</button>}
                </div>
                <div className="postFooter">
                    Author: {post.user?.first_name} {post.user?.last_name}

                    {user.is_staff || post.user_id === user.id ?
                        <div>
                            {toDelete ?
                                <><p>Are you sure you wish to delete this post?</p>
                                    <button onClick={() => {
                                        deletePost(post.id)
                                            .then(history.push("/posts"))
                                    }}>Confirm Delete</button>
                                    <button onClick={() => { setDelete(false) }}>Cancel</button></>
                                :
                                <><button className="deleteButtonPost" onClick={() => {
                                    editPost.current.showModal();
                                    setPost(post)
                                }}>⚙️</button>
                                    <button className="deleteButtonPost" onClick={() => {
                                        confirmDelete.current.showModal()
                                    }
                                    }>🗑️</button></>}
                        </div>
                        : ''}
                </div>
            </section>
        </>
    )
}