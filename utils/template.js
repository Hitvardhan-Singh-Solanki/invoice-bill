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
                <span>${new Date().getDate()}/${
    new Date().getMonth() + 1
  }/${new Date().getFullYear()}</span>
                <table class="striped" id="main-invoice-content">
                    ${content.innerHTML}
                  </table>
            </div>            
    </body>
    
    </html>
    `;
};

module.exports = mainTemplate;
