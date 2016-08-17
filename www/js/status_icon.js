"use strict"

var StatusIcon = {};
StatusIcon.prototype = Object.create(HTMLElement.prototype);

StatusIcon.prototype.setStatus = function(status)
{
    switch (status)
    {
        case 0:
            this.classList.remove  ("ion-checkmark-circled");
            this.classList.add  ("ion-alert-circled");
            this.style.color = "#fb0";
            break;
        case 1:
            this.classList.remove  ("ion-alert-circled");
            this.classList.add  ("ion-checkmark-circled");
            this.style.color = "#0c0";
            break;
    }
}

StatusIcon.prototype.createdCallback = function()
{
    this.classList.add("status-icon");
    this.classList.add("icon");
    this.setStatus(0);
}

StatusIcon = document.registerElement('status-icon', { prototype: StatusIcon.prototype });
