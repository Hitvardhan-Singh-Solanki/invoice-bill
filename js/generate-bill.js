const { ipcRenderer } = require("electron");
window.addEventListener("DOMContentLoaded", () => {
  const printInvoiceBtn = document.getElementById("print-invoice-btn");
  const invoiceTableBody = document.getElementById("invoice-table-body");
  printInvoiceBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.print();
  });
  ipcRenderer.on("invoice-data", (event, invoiceData) => {
    console.log(invoiceData);
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
  });
});
