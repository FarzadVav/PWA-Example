const installButton = document.querySelector("#install")

let installPrompt = null

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault()
  installPrompt = event
  installButton.removeAttribute("hidden")
})

installButton.addEventListener("click", async () => {
  if (!installPrompt) {
    return
  }

  const result = await installPrompt.prompt()
  disableInAppInstallPrompt()

  console.log(`Install prompt was: ${result.outcome}`)
})

function disableInAppInstallPrompt() {
  installPrompt = null
  installButton.setAttribute("hidden", "")
}
