const { ipcRenderer } = require('electron');
const { debounce } = require('lodash');

function createTableHead(item) {
  let headings = Object.keys(item);
  headings.push('Select');

  var tr = document.createElement('tr');

  headings.forEach((heading) => {
    let td = document.createElement('td');
    let text = document.createTextNode(heading);
    td.appendChild(text);
    tr.appendChild(td);
  });

  return tr;
}

function createTableRow(item) {
  let entries = Object.entries(item);
  let tr = document.createElement('tr');
  entries.forEach(([k, v]) => {
    const td = document.createElement('td');
    const text = document.createTextNode(v);
    td.appendChild(text);
    tr.appendChild(td);
  });

  const td = document.createElement('td');
  td.innerHTML = `<label>
                    <input id="${item.Material}" type="radio" name="group1" class="checkbox-selection"/>
                    <span></span>
                </label>`;

  tr.appendChild(td);

  return tr;
}

window.addEventListener('DOMContentLoaded', () => {
  const searchPartInput = document.querySelector('#search-part');
  const doneBtn = document.querySelector('#done-selected');
  let mainResult;
  searchPartInput.addEventListener('keyup', (e) => {
    // lets debounce this
    const fn = debounce(function () {
      const searchString = e.target.value;
      // go and find the parts first 3 that matches the search string
      ipcRenderer.send('search-string-query', searchString);
    }, 1000);

    fn();
  });

  ipcRenderer.on('search-string-query', (event, results) => {
    results = JSON.parse(results);
    mainResult = results;
    let tdDOM = document.querySelector('#search-results');
    tdDOM.innerHTML = '';
    let th = createTableHead(results[0]);
    tdDOM.appendChild(th);
    results.forEach(function (item) {
      let tr = createTableRow(item);
      tdDOM.appendChild(tr);
    });
    tdDOM.classList.remove('display-none');
    doneBtn.classList.remove('disabled');
  });

  doneBtn.addEventListener('click', () => {
    let selectedMaterial = [];
    const chkboxes = document.querySelectorAll('input[type=radio]');
    for (let [_, value] of Object.entries(chkboxes)) {
      if (value.checked) selectedMaterial.push(value.id);
    }
    const selRes = mainResult.filter((ele) => {
      for (let i = 0; i < selectedMaterial.length; i++) {
        if (selectedMaterial[i] === ele.Material) return true;
      }
      return false;
    });
    ipcRenderer.send('selected-parts-array', selRes);
  });

  // code above
});
