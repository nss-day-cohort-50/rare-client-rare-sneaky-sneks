import React, { useState } from "react"
import { Link } from "react-router-dom"
import { deletePost, getPosts, updatePost } from "./PostProvider"
import "./AllPostsAdmin.css"

export const AllPostsAdmin = ({ posts, currentUser, updatePosts }) => {

    const [toDelete, setDelete] = useState(false)
    const [postToDelete, setPost] = useState()

    const handleApproval = (post) => {
        let copy = post
        if (copy.approved === 1) {
            copy.approved = 0
        } else {
            copy.approved = 1
        }
        updatePost(copy)
            .then(response => {
                if (response.ok) {
                    getPosts(currentUser)
                        .then(res => res.json())
                        .then(res => updatePosts(res))
                }
            })
    }

    const handleDelete = () => {
        deletePost(postToDelete.id)
            .then(getPosts(currentUser).then(res => res.json())
                .then(res => updatePosts(res)))
            .then(setDelete(false))
    }

    return (
        <>
            {toDelete === false ?
                <>
                    <h2>Admin</h2>
                    <table className="adminPostsTable">
                        <thead>
                            <tr>
                                <td>⚙️🗑️</td>
                                <td>Title</td>
                                <td>Author</td>
                                <td>Date</td>
                                <td>Category</td>
                                <td>Tags</td>
                                <td>Approved</td>
                            </tr>
                        </thead>
                        {posts?.map(post => {
                            return <><tr>
                                <td className="icons">
                                    <Link to={`/edit_post/${post.id}`}>⚙️</Link>
                                    <button className="deleteButton"
                                        onClick={() => {
                                            setDelete(true);
                                            setPost(post)
                                        }}>
                                        🗑️
                                    </button>
                                </td>
                                <td>
                                    <Link to={{ pathname: `/post/${post.id}`, state: { author: `${post.user.first_name}` } }}>{post.title}</Link>
                                </td>
                                <td>
                                    {post.user.first_name} {post.user.last_name}
                                </td>
                                <td>
                                    {post.publication_date}
                                </td>
                                <td>
                                    {post.category.label}
                                </td>
                                <td>
                                    {post.tags}
                                </td>
                                <td>
                                    <label htmlFor="approved">{post.approved ? 'Approved' : 'Unapproved'}</label>
                                    <input type="checkbox" name="approved" checked={post.approved}
                                        onChange={() => handleApproval(post)} />
                                </td>
                            </tr>
                            </>
                        })}
                    </table>
                </>
                :
                <>
                    <h2>Confirm delete of '{postToDelete.title}' by {postToDelete.user.first_name} {postToDelete.user.last_name}?</h2>
                    <div className="confirm-delete">
                        <button onClick={handleDelete}>Confirm Delete</button>
                        <button onClick={() => setDelete(false)}>Cancel</button>
                    </div>
                </>
            }
        </>
    )
}

