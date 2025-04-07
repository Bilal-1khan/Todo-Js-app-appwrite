import './style.css'
import { Client, ID, Databases } from 'appwrite'
// import 'dotenv/config'

const client = new Client()
const DatabaseID = import.meta.env.VITE_DATABASE_ID
const collectionID = import.meta.env.VITE_COLLECTION_ID
const ulBox = document.querySelector(".ul_box")
const form = document.getElementById("form")

client
.setEndpoint(import.meta.env.VITE_PROJECT_END_POINT)
.setProject(import.meta.env.VITE_PROJECT_ID)

const database = new Databases(client)

form.addEventListener("submit",addTasks)

async function getData() {
    const response = await database.listDocuments(DatabaseID,collectionID)
    console.log(response.documents)

    for (let i = 0; i < response.documents.length; i++) {
        renderElements(response.documents[i])
    }
}

getData()

async function renderElements(tasks) {
    console.log(tasks.content);
    const tasksWrapper = 
                `<li class="list" id="task-${tasks.$id}">
                    <span class="completed-${tasks.completed}" id="complete">${tasks.content}</span>
                    <strong class="delete" id='delete-${tasks.$id}'><i class="fa-solid fa-xmark"></i></strong>
                </li>`
    ulBox.insertAdjacentHTML("afterbegin",tasksWrapper)

    const deleteBtn = document.getElementById(`delete-${tasks.$id}`)
    const wrapper = document.getElementById(`task-${tasks.$id}`)
    const taskId =  tasks.$id
    deleteBtn.addEventListener("click",()=>{
        database.deleteDocument(
        DatabaseID,
        collectionID,
        taskId
    )
    wrapper.remove()
})

    wrapper.childNodes[1].addEventListener("click",async(event)=>{
        tasks.completed = !tasks.completed
        event.target.className = `completed-${tasks.completed}`

        database.updateDocument(
            DatabaseID,
            collectionID,
            taskId,
            {"completed": tasks.completed}
        )
    })
}

async function addTasks(event) {
    event.preventDefault()

    const taskContent = event.target.body.value
    if (taskContent == '') {
        alert("form cannot be empty")
        return
    }

  const response = await database.createDocument(
        DatabaseID,
        collectionID,
        ID.unique(),
        {"content":taskContent}
    )
    renderElements(response)
    form.reset()
}