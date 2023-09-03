
function openTab(tabName) {
    const toolsButtons = document.getElementsByClassName("toolsButton");
    for (toolsButton of toolsButtons) {
        toolsButton.classList.remove("active");
        toolsButton.classList.remove("shining");

    }

    const aboutText = document.getElementsByClassName("aboutData");
    for (text of aboutText) {
        text.classList.remove("active");
    }

    event.currentTarget.classList.add("active");
    event.currentTarget.classList.add("shining");
    const shownText = document.getElementById(tabName);
    shownText.classList.add("active");
}


function showDescription(description) {
    const projectSlider = document.getElementById("projectSlider");
    for (projectImage of projectSlider.children) {
        projectImage.classList.remove("active");
    }
    event.currentTarget.classList.add("active");
    const projectDescriptions = document.getElementsByClassName("projectDescription");
    for (projectDescription of projectDescriptions) {
        projectDescription.classList.remove("active");
    }
    let descriptionToShow = document.getElementById(description);
    descriptionToShow.classList.add("active");
}


