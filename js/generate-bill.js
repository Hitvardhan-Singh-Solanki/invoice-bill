const { ipcRenderer } = require("electron");
window.addEventListener("DOMContentLoaded", () => {
  const printInvoiceBtn = document.getElementById("print-invoice-btn");
  const invoiceTableBody = document.getElementById("invoice-table-body");
  printInvoiceBtn.addEventListener("click", (e) => {
    e.preventDefault();
    printInvoiceHelper();
  });
  ipcRenderer.on("invoice-data", (_, invoiceData) => {
    invoiceData.forEach((item) => {
      const tr = document.createElement("tr");
      Object.entries(item).forEach(([k, v]) => {
        const td = document.createElement("td");
        const text = document.createTextNode(v);
        td.appendChild(text);
        tr.appendChild(td);
      });
      invoiceTableBody.appendChild(tr);
    });
    calculateTotal(invoiceData, invoiceTableBody);
  });
});

function calculateTotal(invoiceData, invoiceTableBody) {
  if (invoiceData.length === 0) return;
  const total = invoiceData.reduce((acc, item) => {
    return acc + item.total;
  }, 0);
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  const td2 = document.createElement("td");
  const td3 = document.createElement("td");
  const td4 = document.createElement("td");
  const td5 = document.createElement("td");
  const text = document.createTextNode("Grand Total");
  const mainTotal = document.createTextNode(total);
  td.appendChild(text);
  td5.appendChild(mainTotal);
  tr.appendChild(td);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  tr.appendChild(td5);
  invoiceTableBody.appendChild(tr);
}

function printInvoiceHelper() {
  var doc = new jsPDF();
}
