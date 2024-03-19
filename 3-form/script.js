class AccessibleForm extends HTMLElement {
    constructor() {
        super();

        this.hasSubmitted = false;

        this.innerHTML = `
            <style>
                form, input, button{
                    font-family: "Nunito", sans-serif;
                }
                form{
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start
                }
                .isInvalid{
                    color: #d52424;
                }
                .successBanner{
                    border-left: 4px solid #10b042;
                    padding: 0.5rem;
                    background-color: #e8fdee;
                    margin: 1rem 0;
                }
                .errorBanner{
                    border-left: 3px solid #d52424;
                    padding: 0.5rem;
                    background-color: #fbe9e9;
                    margin: 1rem 0;
                }
                input{
                    margin-bottom: 0.5rem;
                }
                input:focus{
                    outline: 2px solid orange;
                }
            </style>
            <form id="accessibleForm" autocomplete="off">
                <label for="name">Name</label>
                <input type="text" id="name" name="name"autocomplete="name">
                <span id="name-error" role="alert" class="isInvalid"></span>

                <label for="lastname">Lastname (required)</label>
                <input type="text" id="lastname" name="lastname" aria-required="true" autocomplete="family-name">
                <span id="lastname-error" role="alert" class="isInvalid"></span>

                <label for="email">Email (required)</label>
                <input type="email" id="email" name="email" aria-required="true" autocomplete="email">
                <span id="email-error" role="alert" class="isInvalid"></span>
                
                <span id="bannerCheckSubmit" role="alert" ></span>
                <button type="submit">Submit</button>
            </form>
        `;

        // role=alert -> aria-live="assertive" aria-atomic="true"

        this.querySelector("#accessibleForm").addEventListener(
            "submit",
            this.submitForm.bind(this)
        );

        this.querySelectorAll("input").forEach((input) => {
            input.addEventListener("focusin", () => (input.touched = true));
            input.addEventListener("keyup", (() => {
               
                if (this.hasSubmitted) {
                    this.validate(input)
                }
            }).bind(this));
            input.addEventListener("blur", ((e)=>{
                if(!input.touched) return;
                this.validate(e.target)
            }).bind(this))
        });
    }

    submitForm(e) {
        e.preventDefault();
        this.hasSubmitted = true
        const inputs = this.querySelectorAll("input");
        const bannerCheckSubmit = document.getElementById("bannerCheckSubmit");
        bannerCheckSubmit.innerHTML = "";
        

        let count = 0;
        for (const input of inputs) {
            if (!this.validate(input)) count++;
        }

        if (count > 0){
            bannerCheckSubmit.classList.add("errorBanner")
            bannerCheckSubmit.textContent = `Failed to submit because ${count} field${
                count === 1 ? " is" : "s are"
            } invalid.`;
        }else{
            bannerCheckSubmit.classList.remove("errorBanner")
            bannerCheckSubmit.classList.add("successBanner")
            bannerCheckSubmit.textContent = "Submitted with success."
        }
   
    }

    containsNumbers(str) {
        return /\d/.test(str);
    }

    isValidEmail(str) {
        return /\S+@\S+\.\S+/.test(str);
    }

    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    validate(input) {
        let isValid = true;
        const errorPar = document.getElementById(`${input.name}-error`);
        errorPar.innerHTML = "";

        if (input.ariaRequired || input.value) {
            switch (input.type) {
                case "text": {
                    if (input.value === "") {
                        isValid = false;
                        this.addInlineError(
                            input,
                            errorPar,
                            `${this.capitalizeFirstLetter(input.name)} required`
                        );
                    } else if (this.containsNumbers(input.value)) {
                        isValid = false;
                        this.addInlineError(
                            input,
                            errorPar,
                            `${this.capitalizeFirstLetter(input.name)} cannot contains numbers`
                        );
                    }
                    break;
                }
                case "email": {
                    if (input.value === "") {
                        isValid = false;
                        this.addInlineError(
                            input,
                            errorPar,
                            `${this.capitalizeFirstLetter(input.name)} required`
                        );
                    } else if (!this.isValidEmail(input.value)) {
                        isValid = false;
                        console.log(this.isValidEmail(input.value), input.value)
                        this.addInlineError(
                            input,
                            errorPar,
                            `${this.capitalizeFirstLetter(input.name)} is not a valid email`
                        );
                    }
                    break;
                }
            }
        }
        return isValid;
    }

    addInlineError(parent, element, message) {
        parent.setAttribute("aria-invalid", "true");
        element.textContent = message;
    }
}

customElements.define("accessible-form", AccessibleForm);
