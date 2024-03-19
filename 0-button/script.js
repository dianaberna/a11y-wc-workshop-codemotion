// versione 1 - HTMLElement

class MyButton extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        const button = document.createElement("button");
        button.innerText = this.getAttribute("text") || "Sono un pulsante";
        /* button.addEventListener("click", () =>  console.log("evento click del pulsante versione 1")) */
        button.addEventListener('click', () => {
            if (typeof this.onClick === 'function') {
              this.onClick();
            }
          });

        const version = this.getAttribute("version");
        button.classList.add(version || "btn-primary");

        const style = document.createElement("style");
        style.textContent = `
            button{
                
                border: 0px;
                padding: 0.5rem 1rem;
                border-radius: 1rem;
                font-family: "Nunito", sans-serif;
                font-size: 15px;
            }
            .btn-primary{
                background-color: deepskyblue;    
            }
        `;
        shadow.appendChild(style);
        shadow.appendChild(button);
    }
}

customElements.define("my-button", MyButton);

// versione 2 - HTMLButtonElement
class MyCustomButton extends HTMLButtonElement {
    constructor() {
        super();

        this.textContent = this.getAttribute("text") || "Sono un pulsante";
        this.style = `
            
                border: 0px;
                padding: 0.5rem 1rem;
                border-radius: 1rem;
                font-family: "Nunito", sans-serif;
                font-size: 15px;
                background-color: pink;
        `;

        this.addEventListener("click", () => {
            console.log("evento click del pulsante versione 2");
        });
    }
}

customElements.define("my-custom-button", MyCustomButton, {
    extends: "button",
});

// versione 3 - HTMLElement con template

class MyButtonWithTemplate extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        const css = `
        button{
            font-family: "Nunito", sans-serif;
            background-color: black;
            color: white;
            border: 0px;
            padding: 0.5rem 1rem;
            border-radius: 1rem;
        }
        button:hover{
            background-color: #424242;
        }
    `;

        const template = document.createElement("template");
        template.innerHTML = `
        <style> ${css} </style>
        <button>
            <slot></slot>    
        </button>
        `;

        this.addEventListener("click", () => {
            console.log("evento click del pulsante versione 3");
        });

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}
customElements.define("my-button-with-template", MyButtonWithTemplate);

export default MyButtonWithTemplate;