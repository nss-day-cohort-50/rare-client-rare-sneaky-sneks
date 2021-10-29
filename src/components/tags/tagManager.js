import React, { useEffect, useState } from "react";
import "./tagManager.css"
import { deleteTag, getTags, postTag, updateTag } from "./tagProvider";

export const TagManager = () => {
    const [tags, setTags] = useState([])
    const [newTag, setNewTag] = useState({})
    const [editMode, setEditMode] = useState(false)
    const [triggerRender, setTrigger] = useState(0)

    useEffect(() => {
        getTags()
            .then(res => res.json())
            .then(t => setTags(t))
    }, [triggerRender]
    )

    const setTag = (event) => {
        let copy = { ...newTag }
        copy.label = event.target.value
        setNewTag(copy)
    }
    const updateTrigger = () => {
        let copy = triggerRender
        copy++
        setTrigger(copy)
    }

    const editTag = (tag) => {
        setEditMode(true)
        const copy = { ...newTag }
        copy.label = tag.label
        copy.id = tag.id
        setNewTag(copy)
    }

    return (<>
        <h2>Tag Manager</h2>
        <article className="tag-manager">
            <section>
                <ul>
                    {tags?.map(tag => {
                        return <li key={tag.id}>
                            <div className="tag-list-item">
                                {tag.label}
                                <div>
                                    <button className="edit-delete"
                                        onClick={() => { editTag(tag) }}><span role="img" aria-label="emoji">🔧</span></button>
                                    <button className="edit-delete"
                                        onClick={() => {
                                            deleteTag(tag.id)
                                                .then(updateTrigger())
                                        }
                                        }><span role="img" aria-label="emoji">❌</span></button>
                                </div>
                            </div>
                        </li>
                    })}
                </ul>
            </section>
            <section>
                <div className="new-tag-form">
                    <fieldset>
                        <h3>Create a new tag</h3>
                        <input type="text" placeholder="Add tag"
                            value={newTag.label}
                            onChange={setTag} />
                        {editMode ?
                            <><button className="submit-tag"
                                onClick={() => updateTag(newTag)
                                    .then(updateTrigger())}>Update</button></>
                            : <><button className="submit-tag"
                                onClick={() => {
                                    postTag(newTag)
                                        .then(updateTrigger())
                                }}>Create</button></>}
                        {editMode ?
                            <><button className="submit-tag"
                                onClick={() => setEditMode(false)}>Cancel</button></>
                            : ""
                        }
                    </fieldset>
                </div>
            </section>
        </article>
    </>)
}