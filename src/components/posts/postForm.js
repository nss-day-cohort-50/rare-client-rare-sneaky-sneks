import React, {useState, useEffect} from "react"
import {useHistory} from 'react-router-dom'
import ReactDOM from 'react-dom'

export const PostForm = () => {
    const [post, setPost] = useState({})
    const [categories, setCategories] = useState([])
    const [newCat, setNewCat] = useState("")
    const [posts, setPosts] = useState([])
    const history = useHistory()

    const getCats = () => {
        const copy = { ...newCat }
        copy.label = ""
        setNewCat(copy)
        fetch('http://127.0.0.1:8088/categories')
            .then(res => res.json())
            .then(cats => setCategories(cats))
    }

    const getPosts = () => {
        fetch('http://127.0.0.1:8088/posts')
            .then(res => res.json())
            .then(p => setPosts(p))
    }       
    
    useEffect(() => {
        getCats()
    }, []
    )

    useEffect(() => {
        getPosts()
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
        copyPost.approved = 1
        addPost(copyPost)
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
                        <option>default</option>
                        {
                            categories.map(c => <option name="category_id" value={c.id}>{c.label}</option>)
                        }
                </select>
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
                <textarea class="textarea" name="content" className="form-control" 
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