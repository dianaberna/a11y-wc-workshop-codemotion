class Dropdown extends HTMLElement {
    constructor() {
        super();
    }

    /*
        custom elements lifecycle methods 
        custructor() -> called when an instance of the element is created or upgraded 
        connectedCallback() -> called every time when the element is inserted into the dom 
        disconnectedCallback() -> called every time the element is removed from the dom 
        attributeChangedCallback(attributeName, oldValue, newValue) -> called when ad attribure is added, removed, updated, or replaced 
    */
    connectedCallback() {
        this.initializeNavigation();
    }

    initializeNavigation() {
        const dropdownButtons = this.querySelectorAll(
            ".main-link, button[aria-expanded][aria-controls]"
        );
        const dropdownButtonAriaControls = [];

        for (const node of dropdownButtons) {
            if (node.tagName.toLowerCase() === "button") {
                dropdownButtonAriaControls.push(
                    document.getElementById(node.getAttribute("aria-controls"))
                );
            }
        }

        dropdownButtons.forEach((node, index) => {
            node.addEventListener("click", () =>
                this.handleClickDropdownButton(
                    dropdownButtons[index],
                    dropdownButtonAriaControls[index]
                )
            );
        });

        this.addEventListener("keydown", (event) =>
            this.handleKeydown(
                event,
                dropdownButtons,
                dropdownButtonAriaControls
            )
        );
        document.addEventListener("click", (event) =>
            this.handleDocumentClick(
                event,
                dropdownButtons,
                dropdownButtonAriaControls
            )
        );
    }

    handleDocumentClick(event, dropdownButtons, dropdownButtonAriaControls) {
        let insideDropdown = false;
        for (const menu of dropdownButtonAriaControls) {
            if (menu.contains(event.target) || this.contains(event.target)) {
                insideDropdown = true;
                break;
            }
        }

        if (!insideDropdown) {
            dropdownButtons.forEach((node) =>
                node.setAttribute("aria-expanded", "false")
            );
            dropdownButtonAriaControls.forEach(
                (menu) => (menu.style.display = "none")
            );
        }
    }

    handleClickDropdownButton(dropdownButton, dropdownButtonAriaControl) {
        if (dropdownButton && dropdownButton.getAttribute("aria-expanded")) {
            const isExpanded =
                dropdownButton.getAttribute("aria-expanded") === "true";
            dropdownButton.setAttribute("aria-expanded", String(!isExpanded));
            if (dropdownButtonAriaControl)
                dropdownButtonAriaControl.style.display = isExpanded
                    ? "none"
                    : "block";
        }
    }

    handleKeydown(event, dropdownButtons, dropdownButtonAriaControls) {
        var targetIndex = null;
        switch (event.key) {
            case "Escape":
                dropdownButtons.forEach(function (node) {
                    if (node.getAttribute("aria-expanded"))
                        node.setAttribute("aria-expanded", "false");
                });
                dropdownButtonAriaControls.forEach(function (menu) {
                    if (menu) menu.style.display = "none";
                });
                break;
        }
        if (targetIndex !== null) dropdownButtons[targetIndex].focus();
    }

    handleFocusOut(event, dropdownButtons, dropdownButtonAriaControls) {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            dropdownButtons.forEach(function (node) {
                if (node.getAttribute("aria-expanded"))
                    node.setAttribute("aria-expanded", "false");
            });
            dropdownButtonAriaControls.forEach(function (menu) {
                if (menu) menu.style.display = "none";
            });
        }
    }
}

customElements.define("my-dropdown", Dropdown);
