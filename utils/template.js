const date = new Date();

const hours = String(date.getHours()).padStart(2, "0");
const minutes = String(date.getMinutes()).padStart(2, "0");
const currentDate = `${date.getDate()}/${
  date.getMonth() + 1
}/${date.getFullYear()}`;
const currentTime = `${hours}:${minutes}`;

const mainTemplate = (content) => {
  return `
    <html>
    
    <head>
        <link rel="stylesheet" href="../assets/materialize/css/materialize.min.css" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link rel="stylesheet" href="../styles/main.css" />
    </head>
    
    <body>
        <main>
            <div class="container">
                <h4>Invoice details</h4>
                <span>${currentDate} - ${currentTime}</span>
                <table class="striped" id="main-invoice-content">
                    ${content.innerHTML}
                  </table>
            </div>            
    </body>
    
    </html>
    `;
};

module.exports = mainTemplate;
