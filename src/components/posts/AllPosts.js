import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { AllPostsAdmin } from "./AllPostsAdmin"
import { getCurrentUser, getPosts } from "./PostProvider"

export const AllPosts = () => {
    const [posts, updatePosts] = useState([])
    const [currentUser, setUser] = useState({})

    useEffect(() => {
        getCurrentUser(parseInt(localStorage.getItem('rare_user_id')))
            .then(res => res.json())
            .then(user => setUser(user))
    }, []
    )

    useEffect(() => {
        getPosts(currentUser)
            .then(res => res.json())
            .then(res => updatePosts(res))
    }, [currentUser])

    return (
        <>
            <h2>All Posts</h2>
            {currentUser.is_staff ? <AllPostsAdmin posts={posts} currentUser={currentUser} updatePosts={updatePosts}/> :
                <ul>
                    {posts?.map(post => {
                        return <>
                            <li>
                                <div>
                                    <ul>
                                        <li><Link to={{ pathname: `/post/${post.id}`, state: { author: `${post.user.first_name}` } }}>{post.title}</Link></li>
                                        <li>By {post.user.first_name} {post.user.last_name}</li>
                                        <li>Category: {post.category.label}</li>
                                        {post.user_id === parseInt(localStorage.getItem('rare_user_id'))
                                            ?
                                            <li><Link to={`/edit_post/${post.id}`}>Edit</Link></li> : ""
                                        }
                                    </ul>
                                </div>
                            </li>
                        </>
                    })}
                </ul>
            }
        </>
    )
}

