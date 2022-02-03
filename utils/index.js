function beautifyJSON(rows) {
  const resArray = [];
  const keyArray = rows[0];
  for (let i = 1; i < rows.length; i++) {
    const currEle = rows[i];
    const map = {};
    if (currEle.length === 1) continue;
    for (let j = 0; j < keyArray.length; j++)
      map[keyArray[j]] = rows[i][j].trim();
    resArray.push(map);
  }
  return resArray;
}

function searchHelper(searchString, arr) {
  const result = arr.filter(
    function (ele) {
      let foundEle = false;
      for (let [key, value] of Object.entries(ele)) {
        if (value.includes(searchString)) foundEle = true;
      }

      if (this.count < 5 && foundEle) {
        this.count++;
        return ele;
      }
    },
    { count: 0 }
  );
  return result;
}

module.exports = {
  beautifyJSON,
  searchHelper
};
