import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router-dom'
import { getCurrentUser } from "./PostProvider"

export const PostForm = () => {
    const [post, setPost] = useState({})
    const [categories, setCategories] = useState([])
    const [newCat, setNewCat] = useState("")
    const [newTag, setNewTag] = useState("")
    const [tags, setTags] = useState([])
    const [tagArray, setTagArray] = useState([])
    const [user, setUser] = useState([])
    const history = useHistory()

    const getCats = () => {
        const copy = { ...newCat }
        copy.label = ""
        setNewCat(copy)
        fetch('http://127.0.0.1:8088/categories')
            .then(res => res.json())
            .then(cats => setCategories(cats))
    }
    const getTags = () => {
        const copy = { ...newTag }
        copy.label = ""
        setNewTag(copy)
        fetch('http://127.0.0.1:8088/tags')
            .then(res => res.json())
            .then(tags => setTags(tags))
    }

    useEffect(() => {
        getTags()
    }, [])

    useEffect(() => {
        getCats()
    }, []
    )
    useEffect(() => {
        getCurrentUser(parseInt(localStorage.getItem('rare_user_id')))
            .then(res => res.json())
            .then(user => setUser(user))
    }, [])

    const handleControlledInputChange = (event) => {
        const newPost = Object.assign({}, post)
        newPost[event.target.name] = event.target.value
        setPost(newPost)
    }

    const constructNewPost = () => {
        const copyPost = { ...post }
        copyPost.user_id = parseInt(localStorage.getItem("rare_user_id"))
        copyPost.publication_date = Date(Date.now()).toLocaleString('en-us').split('GMT')[0]
        if (user.is_staff === 0) { copyPost.approved = 0 }
        else { copyPost.approved = 1 }
        copyPost.category_id = parseInt(copyPost.category_id)
        //add tag array to post
        addPost(copyPost)
        console.log(copyPost)
    }

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

    const addPost = (post) => {
        return fetch(`http://localhost:8088/posts/${localStorage.getItem("rare_user_id")}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(post)
        }).then(res => res.json())
            .then(res => history.push(`/post/${res.id}`))
    };

    return (
        <form className="postForm">
            <h2 className="postForm__title">New Post</h2>
            <div className="form-group">
                <label htmlFor="category">Category: </label>
                <select type="text" name="category_id" className="form-control"
                    placeholder="Category"
                    defaultValue="Choose a Category"
                    onChange={handleControlledInputChange}>
                    <option>Choose a Category</option>
                    {
                        categories.map(c => <option name="category_id" value={c.id}>{c.label}</option>)
                    }
                </select>
            </div>
            <div className="form-group">
                {tags.map(t => (<>
                    <label name="tag_id" value={t.id}>{t.label}</label>
                        <input type="checkbox" name="tag_id" value={`${t.id}`}
                        onChange={handleTagCheckboxes}></input>
                        </>))}
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
            {post.image_url ? <img src={post.image_url} /> : ""}
            <div className="form-group">
                <label htmlFor="imageURL">Image link</label>
                <input type="text" name="image_url" className="form-control"
                    placeholder="Place URL here"
                    defaultValue=""
                    value={post.image_url}
                    onChange={handleControlledInputChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="content">Post Description:</label>
                <textarea className="textarea" name="content" className="form-control"
                    placeholder="Description"
                    value={post.content}
                    onChange={handleControlledInputChange}
                ></textarea>
            </div>
            <div>
                <button type="submit"
                    onClick={event => {
                        event.preventDefault()
                        constructNewPost()
                    }}>Submit</button>
            </div>
        </form>
    )
}