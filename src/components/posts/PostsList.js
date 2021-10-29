import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./Post.css"

export const Posts = () => {
    const [posts, updatePosts] = useState([])
    useEffect(() => {
        getPosts()
            .then(res => res.json())
            .then(res => updatePosts(res))
    }, [])

    const getPosts = () => {
        return fetch(`http://localhost:8088/myposts/${localStorage.getItem('rare_user_id')}`)
    }

    return (
        <>
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
                                {}
                                <div><Link to={`/edit_post/${post.id}`} className="gear">⚙️</Link>
                                    <button className="deleteButtonPost">🗑️</button>
                                </div>
                            </div>
                        </section>
                    </>
                })}
            </article>
        </>
    )
}

