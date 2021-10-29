import React from "react";
import { useHistory } from "react-router";
import { EditPost } from "./EditPost";
import { deletePost, getMyPosts } from "./PostProvider";

export const EditDeleteModal = ({ postToModify, updatePosts, confirmDelete, editPost }) => {
    const history = useHistory()
    const path = window.location.pathname.split('/')[1]
    const handleDelete = () => {
        deletePost(postToModify.id)
            .then(response => {
                if ((response.ok && path === "myposts") || (response.ok && path === "posts")) {
                    confirmDelete.current.close()
                    getMyPosts().then(res => res.json())
                        .then(res => updatePosts(res))
                }
                else {
                    history.push("/myposts")
                }
            })
    }

    return (<>
        <dialog className="confirmDeleteModal" ref={confirmDelete}>
            <h2>Confirm delete of your post '{postToModify?.title}'?</h2>
            <div className="confirm-delete">
                <button onClick={handleDelete}>Confirm Delete</button>
                <button onClick={() => confirmDelete.current.close()}>Cancel</button>
            </div>
        </dialog>
        <dialog className="editPostModal" ref={editPost}>
            <h2>Edit post '{postToModify?.title}'</h2>
            <EditPost postToModify={postToModify} editPost={editPost} updatePosts={updatePosts} />
        </dialog>
    </>)
}