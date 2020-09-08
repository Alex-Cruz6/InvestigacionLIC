const indexedDB = window.indexedDB
const form = document.getElementById("form")
const tasks = document.getElementById("tareas")
if(indexedDB){
    let db
    const request = indexedDB.open('ListaTareas',1)
    request.onsuccess = () =>{
        db=request.result
        console.log('abierto', db)
        mostrar()
    }
    request.onupgradeneeded = () =>{
        db=request.result
        console.log('creado', db)
        const objectStore = db.createObjectStore('tareas', { 
            keyPath: 'titulo'
        })
    }
    request.onerror = (error)=>{
        console.log('error', error)
    }

    const getdata = (key) =>{
        const transaction = db.transaction(['tareas'],'readwrite')
        const objectStore = transaction.objectStore('tareas')
        const request = objectStore.get(key)

        request.onsuccess = () =>{
            form.tarea.value = request.result.titulo
            form.propiedad.value = request.result.importancia
            form.button.dataset.action = 'update'
            form.button.textContent= 'Actualizar'
        }
    }

    const mostrar = (data) =>{
        const transaction = db.transaction(['tareas'],'readonly')
        const objectStore = transaction.objectStore('tareas')
        const request = objectStore.openCursor()
        const fragment = document.createDocumentFragment()
        request.onsuccess = (e) =>{         
            const cursor = e.target.result
            if(cursor){
                const nombre = document.createElement('p')
                nombre.textContent = cursor.value.titulo
                fragment.appendChild(nombre)
                const priori = document.createElement('p')
                priori.textContent = cursor.value.importancia
                fragment.appendChild(priori)
                const actua = document.createElement('button')
                actua.dataset.type='update'
                actua.dataset.key=cursor.key
                actua.textContent='Actualizar'
                fragment.appendChild(actua)
                const elimi = document.createElement('button')
                elimi.dataset.type='delete'
                elimi.dataset.key=cursor.key
                elimi.textContent='Eliminar'
                fragment.appendChild(elimi)
                cursor.continue()
            }else{
                tasks.textContent = ''
                tasks.appendChild(fragment)
            }
        }
    }

    const agregar = (data) =>{
        const transaction = db.transaction(['tareas'],'readwrite')
        const objectStore = transaction.objectStore('tareas')
        const request = objectStore.add(data)
        mostrar()
    }

    const Actualizar = (data) =>{
        const transaction = db.transaction(['tareas'],'readwrite')
        const objectStore = transaction.objectStore('tareas')
        const request = objectStore.put(data)
        request.onsuccess = () =>{
            form.button.dataset.accion='add'
            form.button.textContent= 'Añadir tarea'
            mostrar()
        }
    }

    const eliminar = (key) =>{
        const transaction = db.transaction(['tareas'],'readwrite')
        const objectStore = transaction.objectStore('tareas')
        const request = objectStore.delete(key)
        request.onsuccess = () =>{
            mostrar()
        }
    }


    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const data = {
            titulo:e.target.tarea.value,
            importancia:e.target.propiedad.value
        }
        
        if(e.target.button.dataset.action == 'add'){
            agregar(data)
        }else if(e.target.button.dataset.action == 'update'){
            Actualizar(data)
        }
        form.reset()
    })
    
    tasks.addEventListener('click', (e)=>{
        if(e.target.dataset.type=='update'){
            getdata(e.target.dataset.key)
        }else if(e.target.dataset.type=='delete'){
            eliminar(e.target.dataset.key)
        }
    })
}