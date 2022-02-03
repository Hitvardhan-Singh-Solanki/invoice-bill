const { ipcRenderer } = require('electron');

const tableValues = {
  material: '',
  hsn: '',
  qty: 0,
  price: 0,
  total: 0
};

const tableData = [];

window.addEventListener('DOMContentLoaded', () => {
  const searchPartWin = document.querySelector('#search-part-main-btn');
  const addFileWin = document.querySelector('#add-file-main-btn');
  const formDOM = document.querySelector('form');
  const generateBillBtn = document.querySelector('#generate-bill-btn');

  searchPartWin.addEventListener('click', searchPartWinHandler);
  addFileWin.addEventListener('click', addFileWinHandler);
  generateBillBtn.addEventListener('click', generateBillWinHandler);
  formDOM.addEventListener('submit', (e) => submitEventHandler(e, formDOM));

  ipcRenderer.on('selected-parts-array', selectedPartsHandler);
});

function searchPartWinHandler() {
  ipcRenderer.send('open-search-window');
}

function addFileWinHandler() {
  ipcRenderer.send('open-add-file-window');
}

function selectedPartsHandler(e, selectedParts) {
  const mat = document.querySelector('#material');
  const mat_desc = document.querySelector('#material_desc');
  const hsn = document.querySelector('#hsn_code');
  const mrp = document.querySelector('#price');
  const qty = document.querySelector('#quantity');

  const matLbl = document.querySelector('#material-label');
  const mat_descLbl = document.querySelector('#material-desc-label');
  const hsnLbl = document.querySelector('#hsn-code-label');
  const mrpLbl = document.querySelector('#price-label');
  const qtyLbl = document.querySelector('#quantity-label');

  selectedParts.forEach((element) => {
    mat.value = element.Material;
    mat.disabled = true;
    mat_desc.value = element['Material Description'];
    mat_desc.disabled = true;
    hsn.value = element['HSN Code'];
    hsn.disabled = true;
    mrp.value = element.MRP;
    mrp.disabled = true;
    qty.value = 1;
    matLbl.classList.add('active');
    mat_descLbl.classList.add('active');
    hsnLbl.classList.add('active');
    mrpLbl.classList.add('active');
    qtyLbl.classList.add('active');
  });
}

function submitEventHandler(e, formDOM) {
  e.preventDefault();
  const formElements = formDOM.elements;

  let [m, md, hsn, qty, p] = Object.entries(formElements);
  tableValues.material = m[1].value + '-' + md[1].value;
  tableValues.hsn = hsn[1].value;
  tableValues.qty = qty[1].value;
  tableValues.price = p[1].value;

  // calculate the total price
  tableValues.total = tableValues.qty * tableValues.price;
  tableData.push(tableValues);
  resetForm(formDOM);
  createTRandPushToTable();
}

function createTRandPushToTable() {
  let table = document.querySelector('#billing-totals > tbody');

  // creating table row
  let entries = Object.entries(tableValues);
  let tr = document.createElement('tr');
  entries.forEach(([k, v]) => {
    const td = document.createElement('td');
    const text = document.createTextNode(v);
    td.appendChild(text);
    tr.appendChild(td);
  });
  table.appendChild(tr);
}

function resetForm(form) {
  var inputs = form.getElementsByTagName('input');
  for (var i = 0; i < inputs.length; i++) {
    switch (inputs[i].type) {
      // case 'hidden':
      case 'text':
        inputs[i].value = '';
        inputs[i].disabled = false;
        break;
      case 'radio':
      case 'checkbox':
        inputs[i].checked = false;
      case 'number':
        inputs[i].value = 0;
        inputs[i].disabled = false;
    }
  }
}

function generateBillWinHandler() {
  ipcRenderer.send('generate-bill-window', tableData);
  // tableData = [];
}
