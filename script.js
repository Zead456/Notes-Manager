// Check for saved cards and parse them.
let savedNotes = [];
savedNotes = JSON.parse(localStorage.getItem("savedNotes"));
const emptyArea = document.getElementsByClassName("empty-area")[0];
if (!checkEmpty()) {
  savedNotes.forEach(e => {
    renderNote(e);
  });
}

// Keep track of removed notes and allow restoration in order.
let removedNotes = [];
const restoreBtn = document.getElementsByClassName("fa-rotate-left")[0];
restoreBtn.classList.add("hidden");
restoreBtn.addEventListener("click", () => {
  renderNote(removedNotes.at(-1));
  savedNotes.push(removedNotes.at(-1));
  localStorage.setItem("savedNotes", JSON.stringify(savedNotes));
  removedNotes.pop();
  checkEmpty();

  if (removedNotes.length <= 0)
    restoreBtn.classList.add("hidden");
});

// Add fuctionality to the add button.
const addBtn = document.getElementsByClassName("fa-plus")[0];
const addArea = document.getElementsByClassName("add-area")[0];
addBtn.addEventListener("click", () => {
  if (addArea.classList.contains("shown")) {
    addBtn.classList.remove("rotated");
    addArea.classList.remove("shown");
    window.focus();
  } else {
    addBtn.classList.add("rotated");
    addArea.classList.add("shown");
    titleInput.focus();
  }
});

// Make the create button clickable only when text is provided.
const createBtn = document.getElementsByClassName("create-btn")[0];
const titleInput = document.getElementsByTagName("input")[0];
const bodyInput = document.getElementsByTagName("textarea")[0];

document.addEventListener("keyup", () => {
  if (titleInput.value !== "" && bodyInput.value !== "") {
    createBtn.classList.add("clickable");
  } else {
    createBtn.classList.remove("clickable");
  }
});

// Add functionality to the create button.
createBtn.addEventListener("click", () => {
  if (createBtn.classList.contains("clickable") && !savedNotes.some(note => note.title === titleInput.value)) {
    const newNote = {
      "title": titleInput.value,
      "body": bodyInput.value
    }
    savedNotes.push(newNote);
    localStorage.setItem("savedNotes", JSON.stringify(savedNotes));

    renderNote(newNote);

    titleInput.value = "";
    bodyInput.value = "";
    createBtn.classList.remove("clickable");
    addBtn.classList.remove("rotated");
    addArea.classList.remove("shown");
  }
});

// Create a note with a title and a body, and add a functioning remove button to it,
// then display it with animations.
function renderNote(e) {
  // Create a note.
  const note = document.createElement("div");
  note.classList.add("note");
  const title = document.createElement("h2");
  title.textContent = e.title;
  const body = document.createElement("p");
  body.textContent = e.body;
  note.appendChild(title);
  note.appendChild(body);

  // Create a functioning remove button.
  const removeBtn = document.createElement("i");
  removeBtn.classList.add("fa-solid");
  removeBtn.classList.add("fa-x");
  removeBtn.addEventListener('click', () => {
    note.classList.add('removed');
    savedNotes = savedNotes.filter(note => note.title !== e.title);
    localStorage.setItem("savedNotes", JSON.stringify(savedNotes));
    removedNotes.push(e);
    restoreBtn.classList.remove("hidden");
    checkEmpty();
    setTimeout(() => {
      note.parentElement.removeChild(note);
    }, 300)
  });
  note.appendChild(removeBtn);

  // Display the note.
  note.classList.add("removed");
  setTimeout(() => {
    note.classList.remove("removed");
  }, 100);
  document.getElementsByClassName("notes-area")[0].prepend(note);
  checkEmpty();
}

// Check to see if there are no cards.
function checkEmpty() {
  if (savedNotes.length > 0) {
    emptyArea.classList.add("hidden");
    return false;
  } else {
    emptyArea.classList.remove("hidden");
    return true;
  }
}

// QoL improvements.
window.addEventListener("keydown", (e) => {
  if (e.code === "Enter" && !addArea.classList.contains("shown")) {
    addBtn.classList.add("rotated");
    addArea.classList.add("shown");
    titleInput.focus();
  } else if (e.code === "Escape") {
    addBtn.classList.remove("rotated");
    addArea.classList.remove("shown");
    titleInput.value = "";
    bodyInput.value = "";
    window.focus();
  }
});

titleInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter" && /[a-zA-Z0-9]/.test(titleInput.value))
    bodyInput.focus();
});

bodyInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter" && /[a-zA-Z0-9]/.test(bodyInput.value))
    createBtn.click();
});

bodyInput.addEventListener("keydown", (e) => {
  if (e.code === "Enter")
    e.preventDefault();
});
