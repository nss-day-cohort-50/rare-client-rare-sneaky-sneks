import React, { useState, useEffect } from "react"
import { getCats } from "../categories/CategoryProvider"
import { getAllTags, getCurrentUser, getMyPosts, getPost, getPosts, getPostTags, updatePost } from "./PostProvider"
import { useParams } from "react-router"

export const EditPost = ({ postToModify, editPost, updatePosts }) => {
    const [post, setPost] = useState({})
    const [categories, setCategories] = useState([])
    const [currentUser, setUser] = useState([])
    const [allTags, setAllTags] = useState([])
    const [postTags, setPostTags] = useState([])

    const { postId } = useParams()

    useEffect(() => {
        getPostTags(postId)
            .then(res => res.json())
            .then(postTags => setPostTags(postTags))
        getAllTags()
            .then(res => res.json())
            .then(allTags => setAllTags(allTags))
    }, [])

    useEffect(() => {
        getCats()
            .then(res => res.json())
            .then(cats => setCategories(cats))
        getCurrentUser(localStorage.getItem('rare_user_id'))
            .then(res => res.json())
            .then(user => setUser(user))
    }, []
    )
    useEffect(() => {
        getPost(postToModify?.id)
            .then(res => res.json())
            .then(post => setPost(post))
    }, [postToModify]
    )

    const handleTagCheckboxes = (event) => {
        let newPost = {}
        let chosenTag = parseInt(event.target.value)
        newPost = Object.assign({}, post)
        if (newPost.tagIds) {
            if (newPost.tagIds.includes(chosenTag)) {
                const index = newPost.tagIds.indexOf(chosenTag)
                newPost.tagIds.pop([index])
            }
            else {
                newPost.tagIds.push(chosenTag)
            }
        } else {
            newPost.tagIds = []
            newPost.tagIds.push(chosenTag)
        }
        setPost(newPost)
    }

    const handleControlledInputChange = (event) => {
        const newPost = Object.assign({}, post)
        newPost[event.target.name] = event.target.value
        setPost(newPost)
    }

    const constructUpdated = () => {
        const copyPost = { ...post }
        copyPost.category_id = parseInt(copyPost.category_id)
        const path = window.location.pathname.split('/')[1]
        updatePost(copyPost)
            .then(response => {
                editPost.current.close()
                if (response?.ok && path === "myposts") {
                    getMyPosts()
                        .then(res => res.json())
                        .then(res => updatePosts(res))
                } else if (response?.ok && path === "posts") {
                    getPosts(currentUser)
                        .then(res => res.json())
                        .then(res => updatePosts(res))
                } else {
                    getPost(post.id)
                        .then(res => res.json())
                        .then(res => updatePosts(res))
                }
            })
    }

    return (
        <form className="postForm">
            <div className="form-group">
                <label htmlFor="category">Category: </label>
                <select type="text" name="category_id" className="form-control"
                    placeholder="Category"
                    defaultValue={post?.category_id}
                    onChange={handleControlledInputChange}>
                    <option value={null} disabled>Select Category</option>
                    {
                        categories.map(c =>
                            <option name="category_id" selected={post.category_id === c.id ? true : false} value={c.id}>
                                {c.label}
                            </option>)
                    }
                </select>
            </div>
            <div className="form-group">
                <h4>Tags</h4>
                {allTags.map(at => {
                    return <>
                        <label>{at.label}</label>
                        <input type="checkbox" value={`${at.id}`}
                            checked={
                                postTags.some(pt => at.id === pt.tag_id) ? true : false}
                            onChange={handleTagCheckboxes}></input>
                    </>
                })}

            </div>
            <div className="form-group">
                <label htmlFor="title">Post Title:</label>
                <input type="text" name="title" className="form-control"
                    placeholder="Title"
                    defaultValue=""
                    value={post.title}
                    onChange={handleControlledInputChange}
                />
            </div>
            <div className="form-group">
                <img src={post.image_url} alt="post" /><br />
                <label htmlFor="image_url">Image link</label>
                <input type="text" name="image_url" className="form-control"
                    placeholder="Place URL here"
                    defaultValue=""
                    value={post.image_url}
                    onChange={handleControlledInputChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="content">Post Description:</label>
                <textarea name="content" className="form-control"
                    placeholder="Description"
                    value={post.content}
                    onChange={handleControlledInputChange}
                ></textarea>
            </div>
            <div className="confirm-delete-modal">
                <button type="submit"
                    onClick={event => {
                        event.preventDefault()
                        constructUpdated()
                    }}>Submit</button>
                <button onClick={(e) => { e.preventDefault(); editPost.current.close() }}>Cancel</button>
            </div>
        </form>
    )
}