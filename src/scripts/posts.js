const postWrapper = document.getElementById("posts-wrapper")
const fetchBtn = document.getElementById("fetch-posts")

fetchBtn.addEventListener("click", async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts")
  const posts = await res.json()

  posts.forEach((item) => {
    postWrapper.insertAdjacentHTML(
      "beforeend",
      `<div class="post">${item.id} - ${item.title}</div>`
    )
  })
})
