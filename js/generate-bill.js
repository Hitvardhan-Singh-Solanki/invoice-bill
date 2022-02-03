const { ipcRenderer } = require('electron');
window.addEventListener('DOMContentLoaded', () => {
  const printInvoiceBtn = document.getElementById('print-invoice-btn');
  printInvoiceBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.print();
  });
  ipcRenderer.on('generate-bill-table', (e, data) => {
    console.log(e, data);
  });
});
