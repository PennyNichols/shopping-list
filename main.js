
const form = document.querySelector('.add-item');
const alert = document.querySelector('.alert');
const newItem = document.getElementById('new-list-item');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.list-container');
const list = document.querySelector('.list');
const clearBtn = document.querySelector('.clear-btn');

let editElement;
let editFlag = false;
let editID = '';

// add item
const addItem = (e) => {
  e.preventDefault();
  const title = newItem.value;
  const id = new Date().getTime().toString();

  if (title !== '' && !editFlag) {
    const element = document.createElement('div');
    let pKey = document.createAttribute('data-id');
    pKey.value = id;
    element.setAttributeNode(pKey);
    element.classList.add('item');
    element.innerHTML = `<p class="title">${title}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
    // add event listeners to both buttons;
    const deleteBtn = element.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', deleteItem);
    const editBtn = element.querySelector('.edit-btn');
    editBtn.addEventListener('click', editItem);

    // append child
    list.appendChild(element);
    // display alert
    displayAlert('item added to the list', 'success');
    // show container
    container.classList.add('show-container');
    // set local storage
    addToLocalStorage(id, title);
    // set back to default
    setBackToDefault();
  } else if (title !== '' && editFlag) {
    editElement.innerHTML = title;
    displayAlert('item changed', 'success');

    // edit  local storage
    editLocalStorage(editID, title);
    setBackToDefault();
  } else {
    displayAlert('please enter an item', 'danger');
  }
};
// display alert
const displayAlert = (text, action) => {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(function () {
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);
  }, 1000);
};

// clear items
const clearItems = () => {
  const items = document.querySelectorAll('.item');
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove('show-container');
  displayAlert('empty list', 'danger');
  setBackToDefault();
  localStorage.removeItem('list');
};

// delete item

const deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove('show-container');
  }
  displayAlert('item removed', 'danger');

  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
};
// edit item
const editItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // set form value
  newItem.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  //
  submitBtn.textContent = 'edit';
};
// set backt to defaults
const setBackToDefault = () => {
  newItem.value = '';
  editFlag = false;
  editID = '';
  submitBtn.textContent = 'submit';
};

// ****** local storage **********

// add to local storage
const addToLocalStorage = (id, title) => {
  const newItem = { id, title };
  let items = getLocalStorage();
  items.push(newItem);
  localStorage.setItem('list', JSON.stringify(items));
};

const getLocalStorage = () => {
  return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];
};

const removeFromLocalStorage = (id) => {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem('list', JSON.stringify(items));
};

const editLocalStorage = (id, title) => {
  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = title;
    }
    return item;
  });
  localStorage.setItem('list', JSON.stringify(items));
};

// SETUP LOCALSTORAGE.REMOVEITEM('LIST');

// ****** setup items **********

const setupItems = () => {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.title);
    });
    container.classList.add('show-container');
  }
};

const createListItem = (id, title) => {
  const element = document.createElement('div');
  let pKey = document.createAttribute('data-id');
  pKey.value = id;
  element.setAttributeNode(pKey);
  element.classList.add('item');
  element.innerHTML = `<p class="title">${title}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
  // add event listeners to both buttons;
  const deleteBtn = element.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', deleteItem);
  const editBtn = element.querySelector('.edit-btn');
  editBtn.addEventListener('click', editItem);

  // append child
  list.appendChild(element);
};

// ****** event listeners **********

// submit form
form.addEventListener('submit', addItem);
// clear list
clearBtn.addEventListener('click', clearItems);
// display items onload
window.addEventListener('DOMContentLoaded', setupItems);