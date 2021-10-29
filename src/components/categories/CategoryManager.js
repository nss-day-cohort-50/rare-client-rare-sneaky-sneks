import React, { useEffect, useState } from "react";
import "./CategoryManager.css"
import { deleteCategory, getCats, postCategory, updateCategory } from "./CategoryProvider";

export const CategoryManager = () => {
    const [categories, setCategories] = useState([])
    const [newCat, setNewCat] = useState({})
    const [editMode, setEditMode] = useState(false)
    const [triggerRender, setTrigger] = useState(0)

    useEffect(() => {
        getCats()
            .then(res => res.json())
            .then(cats => setCategories(cats))
    }, [triggerRender]
    )

    const setCategory = (event) => {
        let copy = { ...newCat }
        copy.label = event.target.value
        setNewCat(copy)
    }
    const updateTrigger = () => {
        let copy = triggerRender
        copy++
        setTrigger(copy)
    }

    const editCategory = (cat) => {
        setEditMode(true)
        const copy = { ...newCat }
        copy.label = cat.label
        copy.id = cat.id
        setNewCat(copy)
    }

    return (<>
        <h2>Category Manager</h2>
        <article className="cat-manager">
            <section>
                <ul>
                    {categories?.map(cat => {
                        return <li key={cat.id}>
                            <div className="cat-list-item">
                                {cat.label}
                                <div>
                                    <button className="edit-delete"
                                        onClick={() => { editCategory(cat) }}><span role="img" aria-label="emoji">🔧</span></button>
                                    <button className="edit-delete"
                                        onClick={() => {
                                            deleteCategory(cat.id)
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
                <div className="new-category-form">
                    <fieldset>
                        <h3>Create a new category</h3>
                        <input type="text" placeholder="Add category"
                            value={newCat.label}
                            onChange={setCategory} />
                        {editMode ?
                            <><button className="submit-cat"
                                onClick={() => updateCategory(newCat)
                                    .then(updateTrigger())}>Update</button></>
                            : <><button className="submit-cat"
                                onClick={() => {
                                    postCategory(newCat)
                                        .then(updateTrigger())
                                }}>Create</button></>}
                        {editMode ?
                            <><button className="submit-cat"
                                onClick={() => setEditMode(false)}>Cancel</button></>
                            : ""
                        }
                    </fieldset>
                </div>
            </section>
        </article>
    </>)
}