import React from "react"
import { Route } from "react-router-dom"
import { PostForm } from "./posts/postForm.js"
import { CategoryManager } from "./categories/CategoryManager.js"
import { Post } from './posts/post.js'
import { Posts } from './posts/PostsList'
import { TagManager } from './tags/tagManager'
import { AllPosts } from "./posts/AllPosts.js"
import { EditPost } from "./posts/EditPost.js"

export const ApplicationViews = () => {
    return <>
        <main style={{
            margin: "2rem 2rem",
            lineHeight: "1.75rem"
        }}>
            <Route path="/myposts">
                <Posts />
            </Route>
            <Route path="/posts">
                <AllPosts />
            </Route>
            <Route path="/create_post">
                <PostForm />
            </Route>
            <Route exact path="/post/:postId">
                <Post />
            </Route>
            <Route path="/categories">
                <CategoryManager />
            </Route>
            <Route path="/edit_post/:postId">
                <EditPost />
            </Route>
            <Route path="/tags">
                <TagManager />
            </Route>
        </main>
    </>
}
