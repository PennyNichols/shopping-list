const form = document.querySelector(".form");
const alert = document.querySelector(".alert");
const listInput = document.getElementById("list-input");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".list-container");
const list = document.querySelector(".list");
const clearBtn = document.querySelector(".clear-btn");

let editElement;
let editFlag = false;
let editID = "";

const addItem = (e) => {
	e.preventDefault();
	const value = listInput.value;
	const id = new Date().getTime().toString();

	if (value !== "" && !editFlag) {
		const element = document.createElement("article");
		let attr = document.createAttribute("data-id");
		attr.value = id;
		element.setAttributeNode(attr);
		element.classList.add("list-item");
		element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
		const deleteBtn = element.querySelector(".delete-btn");
		deleteBtn.addEventListener("click", deleteItem);
		const editBtn = element.querySelector(".edit-btn");
		editBtn.addEventListener("click", editItem);

		list.appendChild(element);
		displayAlert("item added", "success");
		container.classList.add("show-container");
		addToLocalStorage(id, value);
		setBackToDefault();
	} else if (value !== "" && editFlag) {
		editElement.innerHTML = value;
		displayAlert("item altered", "success");

		editLocalStorage(editID, value);
		setBackToDefault();
	} else {
		displayAlert("please input item", "danger");
	}
};
const displayAlert = (text, action) => {
	alert.textContent = text;
	alert.classList.add(`alert-${action}`);
	// remove alert
	setTimeout(function () {
		alert.textContent = "";
		alert.classList.remove(`alert-${action}`);
	}, 1000);
};

const clearItems = () => {
	const items = document.querySelectorAll(".list-item");
	if (items.length > 0) {
		items.forEach(function (item) {
			list.removeChild(item);
		});
	}
	container.classList.remove("show-container");
	displayAlert("list cleared", "danger");
	setBackToDefault();
	localStorage.removeItem("list");
};


const deleteItem = (e) => {
	const element = e.currentTarget.parentElement.parentElement;
	const id = element.dataset.id;

	list.removeChild(element);

	if (list.children.length === 0) {
		container.classList.remove("show-container");
	}
	displayAlert("item removed", "danger");

	setBackToDefault();
	removeFromLocalStorage(id);
};
const editItem = (e) => {
	const element = e.currentTarget.parentElement.parentElement;
	editElement = e.currentTarget.parentElement.previousElementSibling;
	listInput.value = editElement.innerHTML;
	editFlag = true;
	editID = element.dataset.id;
	submitBtn.textContent = "edit";
};
const setBackToDefault = () => {
	listInput.value = "";
	editFlag = false;
	editID = "";
	submitBtn.textContent = "submit";
};

const addToLocalStorage = (id, value) => {
	const listInput = { id, value };
	let items = getLocalStorage();
	items.push(listInput);
	localStorage.setItem("list", JSON.stringify(items));
};

const getLocalStorage = () => {
	return localStorage.getItem("list")
		? JSON.parse(localStorage.getItem("list"))
		: [];
};

const removeFromLocalStorage = (id) => {
	let items = getLocalStorage();

	items = items.filter(function (item) {
		if (item.id !== id) {
			return item;
		}
	});

	localStorage.setItem("list", JSON.stringify(items));
};

const editLocalStorage = (id, value) => {
	let items = getLocalStorage();

	items = items.map(function (item) {
		if (item.id === id) {
			item.value = value;
		}
		return item;
	});
	localStorage.setItem("list", JSON.stringify(items));
};

const setupItems = () => {
	let items = getLocalStorage();

	if (items.length > 0) {
		items.forEach(function (item) {
			createListItem(item.id, item.value);
		});
		container.classList.add("show-container");
	}
};

const createListItem = (id, value) => {
	const element = document.createElement("article");
	let attr = document.createAttribute("data-id");
	attr.value = id;
	element.setAttributeNode(attr);
	element.classList.add("list-item");
	element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
	const deleteBtn = element.querySelector(".delete-btn");
	deleteBtn.addEventListener("click", deleteItem);
	const editBtn = element.querySelector(".edit-btn");
	editBtn.addEventListener("click", editItem);

	list.appendChild(element);
};


form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);
