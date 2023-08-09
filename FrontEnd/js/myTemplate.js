class template extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Oswald:wght@600&family=Quicksand:wght@500&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="../css/heading.css">
            <link rel="stylesheet" href="../css/box.css">
            <link rel="stylesheet" href="../css/general.css">
            <link rel="stylesheet" href="../css/button.css">
            <link rel="stylesheet" href="../css/header.css">
            <link rel="stylesheet" href="../css/about.css">
        `;
    }
}

customElements.define('my-template', template);


class template2 extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
            <header>
                <button onclick="redirectHom()">home</button>
                <div>
                    <img src="../images/hearts.png"> 
                </div>
                <button onclick="redirectAbout()">About</button>
                <div>
                    <img src="../images/hearts.png"> 
                </div>
            </header>
        `;
    }
}

customElements.define('my-template2', template2);

function redirectHom(){
    location.replace('home.html')
}

function redirectAbout(){
    location.replace('about.html')
}
