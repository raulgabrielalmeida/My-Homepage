let shortcuts = JSON.parse(localStorage.getItem("myShortcuts")) || [
  null,
  null,
  null,
  null,
  null,
];
let selectedIndex = null;

const container = document.getElementById("shortcuts-container");
const ctxMenu = document.getElementById("context-menu");
const modal = document.getElementById("modal-overlay");
const inputUrl = document.getElementById("input-url");
const inputIcon = document.getElementById("input-icon");
const btnSave = document.getElementById("btn-save");
const btnCancel = document.getElementById("btn-cancel");

function updateTime() {
  const now = new Date();

  document.getElementById("hours").innerText = String(
    now.getHours()
  ).padStart(2, "0");
  document.getElementById("minutes").innerText = String(
    now.getMinutes()
  ).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");
  const month = now
    .toLocaleString("pt-BR", { month: "long" })
    .toUpperCase();
  const year = now.getFullYear();

  document.getElementById("date").innerText = `${day}, ${month} ${year}`;
}

setInterval(updateTime, 1000);
updateTime();

function renderShortcuts() {
  container.innerHTML = "";

  shortcuts.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "shortcut-item";

    const img = document.createElement("img");

    if (item) {
      img.src =
        item.icon ||
        `https://www.google.com/s2/favicons?domain=${item.url}&sz=128`;

      div.onclick = () => (window.location.href = item.url);
    } else {
      img.src = "src/btnImg.png";
      div.onclick = () => openModal(index);
    }

    img.onerror = () => {
      img.src = "src/imgAdd.png";
    };

    div.appendChild(img);

    div.oncontextmenu = (e) => {
      e.preventDefault();

      if (!shortcuts[index]) return;

      selectedIndex = index;

      ctxMenu.style.display = "block";
      ctxMenu.style.left = `${e.pageX}px`;
      ctxMenu.style.top = `${e.pageY}px`;
    };

    container.appendChild(div);
  });
}

function openModal(index) {
  selectedIndex = index;

  inputUrl.value = shortcuts[index]?.url || "";
  inputIcon.value = shortcuts[index]?.icon || "";

  modal.style.display = "flex";
  inputUrl.focus();

  checkInputs();
}

function closeModal() {
  modal.style.display = "none";

  inputUrl.value = "";
  inputIcon.value = "";
}

function checkInputs() {
  if (inputUrl.value.length > 2) {
    btnSave.classList.add("active");
  } else {
    btnSave.classList.remove("active");
  }
}

inputUrl.addEventListener("input", checkInputs);

btnSave.onclick = () => {
  if (!btnSave.classList.contains("active")) return;

  let url = inputUrl.value.trim();
  const icon = inputIcon.value.trim();

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  shortcuts[selectedIndex] = { url: url, icon: icon };

  save();
  closeModal();
};

btnCancel.onclick = closeModal;

window.onclick = (e) => {
  if (e.target !== ctxMenu) {
    ctxMenu.style.display = "none";
  }

  if (e.target === modal) {
    closeModal();
  }
};

document.getElementById("menu-edit").onclick = () => {
  openModal(selectedIndex);
};

document.getElementById("menu-delete").onclick = () => {
  if (confirm("Tem certeza que deseja remover este atalho?")) {
    shortcuts[selectedIndex] = null;
    save();
  }
};

function save() {
  localStorage.setItem("myShortcuts", JSON.stringify(shortcuts));
  renderShortcuts();
}

renderShortcuts();