

//aplico cond ternario
let darkMode = localStorage.getItem("darkMode") ? localStorage.getItem('darkMode') : ""
let flexSwitchCheckDefault = document.getElementById("flexSwitchCheckDefault")
//aplico cond ternario
flexSwitchCheckDefault.addEventListener("change",
    () => flexSwitchCheckDefault.checked ? setDark() : setLight()
)


let searchbar = document.getElementById("searchbar")

searchbar.addEventListener("keyup", () => search_prod())
