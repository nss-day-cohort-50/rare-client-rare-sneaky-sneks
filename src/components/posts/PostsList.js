import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { EditDeleteModal } from "./EditDeleteModal"
import { EditPost } from "./EditPost"
import "./Post.css"
import { deletePost, getMyPosts } from "./PostProvider"

export const Posts = () => {
    const [posts, updatePosts] = useState([])
    const [postToModify, setPost] = useState()

    useEffect(() => {
        getMyPosts()
            .then(res => res.json())
            .then(res => updatePosts(res))
    }, [])

    const confirmDelete = useRef()
    const editPost = useRef()

    return (
        <>
        <EditDeleteModal postToModify={postToModify} updatePosts={updatePosts} confirmDelete={confirmDelete} editPost={editPost}/>

            <h2>My Posts</h2>
            <article className="postList">
                {posts?.map(post => {
                    return <>
                        <section className="post">
                            <div className="postHeader">
                                <h3><Link to={`/post/${post.id}`}>{post.title}</Link>
                                    {post.approved === 0 ? <i>(Pending Approval)</i> : ""}</h3>Publication Date: {post.publication_date}
                            </div>
                            <div className="postImage">
                                <img src={post.image_url} />
                            </div>
                            <div className="postFooter">
                                Author: {post.user.first_name} {post.user.last_name}
                                { }
                                <div><button className="deleteButtonPost" onClick={() => {
                                    editPost.current.showModal();
                                    setPost(post)
                                }}>⚙️</button>
                                    <button className="deleteButtonPost" onClick={() => {
                                        setPost(post);
                                        confirmDelete.current.showModal()
                                    }
                                    }>🗑️</button>
                                </div>
                            </div>
                        </section>
                    </>
                })}
            </article>
        </>
    )
}

