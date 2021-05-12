import { http } from "./http";
import { ui } from "./ui";
//Get posts on DOM load
document.addEventListener("DOMContentLoader", getPosts);

//Listen for Submit post
document.querySelector(".post-submit").addEventListener("click", submitPost);

//Listen to delete post
document.querySelector("#posts").addEventListener("click", deletePost);

//Listen for edit
document.querySelector("#posts").addEventListener("click", enableEdit);

//Listener for cancel
document.querySelector(".card-form").addEventListener("click", cancelEdit);

//Get post
function getPosts() {
  http
    .get("http://localhost:3000/posts")
    .then((data) => ui.showPosts(data))
    .catch((data) => console.log(err));
}

function submitPost() {
  const title = document.querySelector("#title").value;
  const body = document.querySelector("#body").value;
  const id = document.querySelector("#id").value;

  const data = {
    title: title, //same as title
    body,
  };

  //Validate input
  if (title === "" || body === "") {
    ui.showAlert("Please fill in the fields", "alert alert-danger");
  } else {
    //Check for ID
    if (id) {
      //Create Post
      http
        .post("http://localhost:3000/posts", data)
        .then((data) => {
          ui.showAlert("Post added", "alert alert-success");
          ui.clearFields();
          getPosts();
        })
        .catch((err) => console.log(err));
    } else {
      //update post
      http
        .put(`http://localhost:3000/posts/${id}`, data)
        .then((data) => {
          ui.showAlert("Post update", "alert alert-success");
          ui.changeFormState("add");
          getPosts();
        })
        .catch((err) => console.log(err));
    }
  }
}

//Delete Post
function deletePost(e) {
  e.preventDefault();
  if (e.target.parentElement.classList.contains("delete")) {
    const id = e.target.parentElement.dataset.id;
    if (confirm("Are you sure ?")) {
      http
        .delete(`http://localhost:3000/posts/${id}`)
        .then((data) => {
          ui.showAlert("Post Removed", "alert alert-success");
          getPosts();
        })
        .catch((err) => console.log(err));
    }
  }
}

//Enable edit State
function enableEdit(e) {
  if (e.target.parentElement.classList.contains("edit")) {
    const id = e.target.parentElement.dataset.id;
    const title =
      e.target.parentElement.previousElementSibling.previousElementSibling
        .textContent;
    const body = e.target.parentElement.previousElementSibling.textContent;

    const data = {
      id,
      title,
      body,
    };

    //Fill form with current post
    ui.fillForm(data);
  }

  e.preventDefault();
}

//Cancel edit state
function cancelEdit(e) {
  if (e.target.classList.contains("post-cancel")) {
    ui.changeFormState("add");
  }
  e.preventDefault();
}

// const getData = async (url) => {
//   const response = await fetch(url);
//   const result = await response.json();
//   console.log(result);
// };

// getData("https://jsonplaceholder.typicode.com/posts");

//What ever we write here in app.js, on doing npm run build
// it will convert this ES6 app.js to ES5 app.bundle.js file and we will include that file in our index.html file and use it
//That is the advantage of using webpack and bable and npm (all this environment )
