const { ipcRenderer } = require("electron");
window.addEventListener("DOMContentLoaded", () => {
  const printInvoiceBtn = document.getElementById("print-invoice-btn");
  printInvoiceBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.print();
  });
  ipcRenderer.on("invoice-data", (event, invoiceData) => {
    console.log(invoiceData);
  });
});
