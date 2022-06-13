const { ipcRenderer } = require("electron");
const tableData = [];
let runningTotal = 0;

window.addEventListener("DOMContentLoaded", () => {
  const searchPartWin = document.querySelector("#search-part-main-btn");
  const addFileWin = document.querySelector("#add-file-main-btn");
  const formDOM = document.querySelector("#parts-form");
  const generateBillBtn = document.querySelector("#generate-bill-btn");
  const discountForm = document.querySelector("#discount-form");

  searchPartWin.addEventListener("click", searchPartWinHandler);
  addFileWin.addEventListener("click", addFileWinHandler);
  generateBillBtn.addEventListener("click", generateBillWinHandler);
  discountForm.addEventListener("submit", (e) =>
    discountFormHandler(e, discountForm)
  );
  formDOM.addEventListener("submit", (e) => submitEventHandler(e, formDOM));

  ipcRenderer.on("selected-parts-array", selectedPartsHandler);
});

function searchPartWinHandler() {
  ipcRenderer.send("open-search-window");
}

function addFileWinHandler() {
  ipcRenderer.send("open-add-file-window");
}

function selectedPartsHandler(e, selectedParts) {
  const mat = document.querySelector("#material");
  const mat_desc = document.querySelector("#material_desc");
  const hsn = document.querySelector("#hsn_code");
  const mrp = document.querySelector("#price");
  const qty = document.querySelector("#quantity");

  const matLbl = document.querySelector("#material-label");
  const mat_descLbl = document.querySelector("#material-desc-label");
  const hsnLbl = document.querySelector("#hsn-code-label");
  const mrpLbl = document.querySelector("#price-label");
  const qtyLbl = document.querySelector("#quantity-label");

  selectedParts.forEach((element) => {
    mat.value = element.Material;
    mat.disabled = true;
    mat_desc.value = element["Material Description"];
    mat_desc.disabled = true;
    hsn.value = element["HSN Code"];
    hsn.disabled = true;
    mrp.value = element.MRP;
    mrp.disabled = false;
    qty.value = 1;
    matLbl.classList.add("active");
    mat_descLbl.classList.add("active");
    hsnLbl.classList.add("active");
    mrpLbl.classList.add("active");
    qtyLbl.classList.add("active");
  });
}

function submitEventHandler(e, formDOM) {
  e.preventDefault();
  const formElements = formDOM.elements;
  const tableValues = {};
  let [m, md, hsn, qty, p] = Object.entries(formElements);
  tableValues.material = m[1].value + "-" + md[1].value;
  tableValues.hsn = hsn[1].value;
  tableValues.qty = qty[1].value;
  tableValues.price = p[1].value;
  tableValues.total = tableValues.qty * tableValues.price;
  tableData.push(tableValues);
  resetForm(formDOM);
  addToGrandTotal(tableValues.total);
  createTRandPushToTable(tableValues);
}

function discountFormHandler(e, dom) {
  e.preventDefault();
  let [[_1, { value: r_val }], [_2, { value: p_val }]] = Object.entries(
    dom.elements
  );

  r_val = parseInt(r_val, 10);
  p_val = parseInt(p_val, 10);

  if (r_val > 0 && r_val < runningTotal) {
    runningTotal -= r_val;
    updateGrandTotal(runningTotal);
  } else if (p_val > 0 && p_val < 100) {
    runningTotal = runningTotal - runningTotal * (p_val / 100);
    updateGrandTotal(runningTotal);
  }
}

function updateGrandTotal(val) {
  const grandTotalDOM = document.querySelector(
    "#grand-total-container > #grand-total"
  );

  grandTotalDOM.innerHTML = `&#8377; ${val.toFixed(2)}`;
}

function addToGrandTotal(val) {
  runningTotal += val;
  updateGrandTotal(runningTotal);
}

function createTRandPushToTable(tableValues) {
  const billdetailsContainer = document.querySelector(
    "#bill-details-container"
  );
  const generateBillBtn = document.querySelector("#generate-bill-btn");
  let table = document.querySelector("#billing-totals > tbody");
  let entries = Object.entries(tableValues);
  let tr = document.createElement("tr");
  const delIcon = createDeleteIcon(tableValues.hsn);
  const td = document.createElement("td");
  entries.forEach(([k, v]) => {
    const td = document.createElement("td");
    const text = document.createTextNode(v);
    td.appendChild(text);
    tr.appendChild(td);
  });
  td.appendChild(delIcon);
  tr.appendChild(td);
  table.appendChild(tr);
  billdetailsContainer.classList.remove("hidden");
  generateBillBtn.classList.remove("disabled");
}

function resetForm(form) {
  var inputs = form.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    switch (inputs[i].type) {
      case "text":
        inputs[i].value = "";
        inputs[i].disabled = false;
        break;
      case "radio":
      case "checkbox":
        inputs[i].checked = false;
      case "number":
        inputs[i].value = "";
        inputs[i].disabled = false;
    }
  }
}

function generateBillWinHandler() {
  ipcRenderer.send("generate-bill-window", tableData);
}

function createDeleteIcon(productID) {
  const delIcon = document.createElement("i");
  delIcon.classList.add("material-icons");
  delIcon.classList.add("pointer");
  delIcon.innerHTML = "delete";
  delIcon.id = `delete-icon-${productID}`;
  delIcon.onclick = (e) => deleteIconHandler(e, productID);
  return delIcon;
}

function deleteIconHandler(e, productID) {
  const billdetailsContainer = document.querySelector(
    "#bill-details-container"
  );
  const generateBillBtn = document.querySelector("#generate-bill-btn");
  const table = document.querySelector("#billing-totals > tbody");
  const tr = e.target.parentNode.parentNode;
  table.removeChild(tr);
  if (tableData.length === 1) tableData.pop();
  else {
    tableData.forEach((element, index) => {
      if (element.hsn === productID) {
        tableData.splice(index, 1);
      }
    });
  }
  if (tableData.length === 0) {
    billdetailsContainer.classList.add("hidden");
    generateBillBtn.classList.add("disabled");
  }
}
