const { ipcRenderer } = require("electron");
const mainTemplate = require("../utils/template");
window.addEventListener("DOMContentLoaded", () => {
  const printInvoiceBtn = document.getElementById("print-invoice-btn");
  const invoiceTableBody = document.getElementById("invoice-table-body");
  printInvoiceBtn.addEventListener("click", (e) => {
    e.preventDefault();
    printInvoiceHelper();
  });
  ipcRenderer.on(
    "invoice-data",
    (_, { invoiceData, discount = 0, runningTotal }) => {
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
      calculateHelper("Discount", invoiceData, invoiceTableBody, discount);

      calculateHelper(
        "Grand Total",
        invoiceData,
        invoiceTableBody,
        runningTotal
      );
    }
  );
});

function calculateHelper(
  identifier,
  invoiceData,
  invoiceTableBody,
  grandTotal
) {
  if (invoiceData.length === 0) return;
  const tr = document.createElement("tr");
  const td = document.createElement("td");
  const td2 = document.createElement("td");
  const td3 = document.createElement("td");
  const td4 = document.createElement("td");
  const td5 = document.createElement("td");
  const text = document.createTextNode(identifier);
  const mainTotal = document.createTextNode(grandTotal);
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
  const element = mainTemplate(document.getElementById("main-invoice-content"));
  const opts = {
    margin: 1,
    filename: "sample_invoice.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };
  html2pdf().set(opts).from(element).save();
}
