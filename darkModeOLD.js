
{


    let darkMode

    if (null == localStorage.getItem("darkMode")) {
        localStorage.setItem("darkMode", "light")
    }
    else {
        darkMode = localStorage.getItem('darkMode')
    }

    if (darkMode == 'dark') {
        document.body.classList.add("darkMode")


    }
    /*for (const iterator of document.body.children) {
        console.log(iterator)
        iterator.classList.add("navbar-dark")
        iterator.classList.add("bg-dark")
        iterator.classList.add("darkMode")
    
    }*/
    let btnDark = document.getElementById("btnDark")
    let btnLight = document.getElementById("btnLight")

    btnDark.addEventListener("click", () => {
        /*document.body.style.backgroundColor = "#000000"
        document.body.style.Color = "#ffffff"
    */
        document.body.classList.add("bg-dark")
        document.body.classList.add("darkMode")
        localStorage.setItem('darkMode', 'dark')
    })

    btnLight.addEventListener("click", () => {
        /* document.body.style.backgroundColor = "#ffffff"
        document.body.style.Color = "#000000" */
        document.body.classList.remove("bg-dark")
        localStorage.setItem('darkMode', 'light')
    })


}