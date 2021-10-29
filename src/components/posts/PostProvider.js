export const deletePost = (id) => {
    return fetch(`http://127.0.0.1:8088/posts/${id}`,
        { method: "DELETE" })
}

export const getPost = (id) => {
    return fetch(`http://localhost:8088/post/${id}`)
}

export const getMyPosts = () => {
    return fetch(`http://localhost:8088/myposts/${localStorage.getItem('rare_user_id')}`)
}

export const updatePost = (updated) => {
    return fetch(`http://localhost:8088/posts/${updated.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updated)
    })
}

export const getCurrentUser = (id) => {
    return fetch(`http://localhost:8088/user/${id}`)
}

export const getUsers = () => {
    return fetch('http://localhost:8088/users')
}

export const getPosts = (currentUser) => {
    // debugger
    if (currentUser.is_staff === 1) {
        return fetch(`http://localhost:8088/allposts`)
    } else {
        return fetch(`http://localhost:8088/posts`)
    }
}

export const postComment = (postComment) => {
    return fetch(`http://localhost:8088/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postComment)
    })
};

export const getTags = () => {
    return fetch('http://127.0.0.1:8088/postTags')
}

export const getPostTags = (postId) => {
    return fetch(`http://127.0.0.1:8088/tagsbypost/${postId}`)
}

export const getAllTags = () => {
    return fetch('http://127.0.0.1:8088/tags')
}