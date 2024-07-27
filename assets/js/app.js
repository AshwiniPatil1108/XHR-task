const cl = console.log;

const postContainer = document.getElementById("postContainer");
const postForm = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const contentControl = document.getElementById("content");
const userId = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const loader = document.getElementById("loader");


const BASE_URL =`https://jsonplaceholder.typicode.com/`

const POST_URL = `${BASE_URL}/posts`



let postsArr =[];

const teplating =(arr) =>{
    let result ='';
    arr.forEach(post =>{
        result+=`
            <div class="col-md-4 mb-3">
                <div class="card  postCard h-100" id ="${post.id}">
                    <div class="card-header">
                        <h3 class="m-0">${post.title}</h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">
                            ${post.body}
                        </p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick ="onEdit(this)" class="btn btn-outline-warning btn-sm">Edit</button>
                        <button onclick ="onDelete(this)" class="btn btn-outline-danger btn-sm">Remove</button>
                    </div>
                </div>
            </div>
        `
    });
    postContainer.innerHTML =result;
}

const fetchPosts =()=>{
    
    loader.classList.remove("d-none")
    
let xhr = new XMLHttpRequest()



xhr.open("GET", POST_URL, true);



xhr.onload = function(){
    cl(xhr.status);
    if(xhr.status >= 200 && xhr.status < 300){
        
        postsArr = JSON.parse(xhr.response);
        cl(postsArr)
        teplating(postsArr)
        
    }

    loader.classList.add("d-none")
}

xhr.send()
}

fetchPosts();

const onEdit =(ele)=>{
  
    let editId = ele.closest(".card").id  
    localStorage.setItem("editId", editId);

    let EDIT_URL = `${BASE_URL}/posts/${editId}`

  
    loader.classList.remove("d-none")
    let xhr = new XMLHttpRequest();

    xhr.open("GET", EDIT_URL)
    xhr.onload = function(){
        cl(xhr.status);
        setTimeout(()=>{
            if(xhr.status >= 200 && xhr.status < 300){
                cl(xhr.response);
                let post = JSON.parse(xhr.response);
                titleControl.value = post.title;
                contentControl.value = post.body;
                userId.value = post.userId;
                updateBtn.classList.remove('d-none');
                submitBtn.classList.add('d-none')
            }

            loader.classList.add("d-none")
        },500);
    }
    xhr.send()
}

const onDelete =(ele)=>{
     Swal.fire({
        title:"REMOVE POST??",
        showCancelButton :true,
        confirmButtonText :"remove",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!",
        icon:"warning",
    }).then((result) =>{
        if(result.isConfirmed){
        let removeId = ele.closest('.card').id;
   
        let REMOVE_URL = `${BASE_URL}/posts/${removeId}`
       
    
    
        loader.classList.remove("d-none")
        let xhr = new XMLHttpRequest();
        xhr.open("DELETE", REMOVE_URL);
    
        xhr.onload = function(){
            cl(xhr.status);
            if(xhr.status >= 200 && xhr.status < 300){
               ele.closest(`.col-md-4`).remove()
            }
            loader.classList.add("d-none")
           
        }
        xhr.send()
       Swal.fire({
        title:"Post Removed Successfully",
        timer:2500,
        icon:"success"
       })
    }
    })
  
   
}

const onPostUpdate =()=>{


    let updateObj ={
        title:titleControl.value,
        body:contentControl.value.trim(),
        userId: userId.value, 
    }
    cl(updateObj)
     let updateId = localStorage.getItem("editId");


    let UPDATE_URL = `${BASE_URL}/posts/${updateId}`
  
    loader.classList.remove("d-none")

    let xhr = new XMLHttpRequest();

    xhr.open("PATCH", UPDATE_URL);

    xhr.onload = function(){
        cl(xhr.status);
        if(xhr.status >= 200 && xhr.status < 300){
            cl(xhr.response);
            let card = [...document.getElementById(updateId).children];
            cl(card);
            card[0].innerHTML = `<h3 class ="m-0">${updateObj.title}</h3>`
            card[1].innerHTML = `<p class ="m-0">${updateObj.body}</p>`
            postForm.reset()
            updateBtn.classList.add("d-none");
            submitBtn.classList.remove("d-none");
        }
        loader.classList.add("d-none")
    }

    xhr.send(JSON.stringify(updateObj));
}

const onPostSubmit =(eve) =>{
    eve.preventDefault();

    let newPost ={
        title:titleControl.value,
        body:contentControl.value.trim(),
        userId: userId.value
    }
    cl(newPost);
    postForm.reset();
  
    loader.classList.remove("d-none")


    let xhr = new XMLHttpRequest();
    xhr.open("POST", POST_URL);

    xhr.onload = function(){
       if(xhr.status >= 200 && xhr.status < 300){
             cl(xhr.response);
             newPost.id = JSON.parse(xhr.response).id;
         
 
            let div = document.createElement("div");
            div.className ="col-md-4 mb-3";
            div.innerHTML =`
                    <div class="card  postCard h-100" id ="${newPost.id}">
                        <div class="card-header">
                            <h3 class="m-0 ">${newPost.title}</h3>
                        </div>
                        <div class="card-body">
                            <p class="m-0">
                                ${newPost.body}
                            </p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button onclick ="onEdit(this)" class="btn btn-outline-warning btn-sm">Edit</button>
                            <button onclick ="onDelete(this)" class="btn btn-outline-danger btn-sm">Remove</button>
                        </div>
                    </div>
         
            ` 
            postContainer.prepend(div)
        }
      
        loader.classList.add("d-none")
    }
    
    xhr.send(JSON.stringify(newPost));

}






postForm.addEventListener("submit", onPostSubmit)
updateBtn.addEventListener("click", onPostUpdate)