const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const readFileBtn = document.querySelector("#read-file-btn");
  const useFileBtn = document.querySelector("#use-file-btn");
  const progressBar = document.querySelector("#progress-bar");

  readFileBtn.addEventListener("click", () => {
    ipcRenderer.invoke("read-file").then((filePath) => {
      const filePathDOM = document.getElementById("file-path");
      filePathDOM.innerHTML = filePath
        ? `Current Selected file: <span class="bold" id="file-path-main">${filePath}</span>`
        : "";

      if (filePath) {
        const useFileBtn = document.querySelector("#use-file-btn");
        useFileBtn.classList.remove("disabled");
      } else {
        useFileBtn.classList.add("disabled");
      }
    });
  });

  useFileBtn.addEventListener("click", () => {
    progressBar.classList.remove("display-none");
    // check if we have a path or not
    const filePathDOM = document.getElementById("file-path-main");
    if (filePathDOM.innerText === "") {
      alert("no file added!");
      return;
    }

    // send a message main thread to read a file and convert it to json and save it to local disk
    ipcRenderer.send("asynchronous-message", filePathDOM.innerText);
  });

  ipcRenderer.on("asynchronous-reply", (event, arg) => {
    const filePathDOM = document.getElementById("file-info");
    filePathDOM.innerHTML = "Please wait while we parse the PDF...";
    readFileBtn.classList.add("disabled");
    useFileBtn.classList.add("disabled");
  });

  // write code above
});
