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
        `;
    }
}

customElements.define('my-template', template);
