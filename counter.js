const counter = document.querySelector(".counter")
const count = document.querySelector(".counter .count")

let countState = 0
counter.addEventListener("click", () => {
  countState++
  count.innerText = countState.toString()
})
