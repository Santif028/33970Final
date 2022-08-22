const grid = document.querySelector(".grid")
const mostrarResultados = document.querySelector(".resultados")
let indiceActualDefensor = 202
let ancho = 15
let direccion = 1
let idInvasores
let direccionDerecha = true
let invasoresDerrotados = []
let resultados = 0

for (let i = 0; i < 240; i++) {
    const cuadrado = document.createElement("div")
    grid.appendChild(cuadrado)
}

const cuadrados = Array.from(document.querySelectorAll(".grid div"))

const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

const mostrarInvasores = () => {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!invasoresDerrotados.includes(i)) {
            cuadrados[alienInvaders[i]].classList.add("invasor")
        }
    }
}

mostrarInvasores()

const eliminarInvasores = () => {
    for (let i = 0; i < alienInvaders.length; i++) {
        cuadrados[alienInvaders[i]].classList.remove("invasor")
    }
}

cuadrados[indiceActualDefensor].classList.add("defensor")

const moverDefensor = (e) => {
    cuadrados[indiceActualDefensor].classList.remove("defensor")
    switch (e.key) {
        case "ArrowLeft":
            if ((indiceActualDefensor % ancho) !== 0) indiceActualDefensor -= 1
            break
        case "ArrowRight":
            if ((indiceActualDefensor % ancho) < ancho - 1) indiceActualDefensor += 1
            break
    }
    cuadrados[indiceActualDefensor].classList.add("defensor")
}

document.addEventListener("keydown", moverDefensor)

const moverInvasores = () => {
    const bordeIzquierdo = (alienInvaders[0] % ancho) === 0
    const bordeDerecho = (alienInvaders[alienInvaders.length - 1] % ancho) === ancho - 1
    eliminarInvasores()

    if (bordeDerecho && direccionDerecha) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += ancho + 1
            direccion = -1
            direccionDerecha = false
        }
    }
    if (bordeIzquierdo && !direccionDerecha) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += ancho - 1
            direccion = 1
            direccionDerecha = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direccion
    }
    mostrarInvasores()

    if (cuadrados[indiceActualDefensor].classList.contains("invasor", "defensor")) {
        mostrarResultados.innerHTML = "GAME OVER"
        clearInterval(idInvasores)
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        if (alienInvaders[i] > (cuadrados.length)) {
            mostrarResultados.innerHTML = "GAME OVER"
            clearInterval(idInvasores)
        }
    }

    if (invasoresDerrotados.length === alienInvaders.length) {
        mostrarResultados.innerHTML = `YOU WIN YOUR RESULTS WERE: ${resultados}`
        clearInterval(idInvasores)
    }
}

idInvasores = setInterval(moverInvasores, 500)

const disparar = (e) => {
    let idLaser
    let indiceActualLaser = indiceActualDefensor
    function moverLaser() {
        if (!cuadrados[indiceActualLaser]) return
        cuadrados[indiceActualLaser].classList.remove("laser")
        indiceActualLaser -= ancho
        if (!cuadrados[indiceActualLaser]) return;
        cuadrados[indiceActualLaser].classList.add("laser")
        if (cuadrados[indiceActualLaser].classList.contains("invasor")) {
            cuadrados[indiceActualLaser].classList.remove("laser")
            cuadrados[indiceActualLaser].classList.remove("invasor")
            cuadrados[indiceActualLaser].classList.add("explosion")

            setTimeout(() => cuadrados[indiceActualLaser].classList.remove("explosion"), 500)
            clearInterval(idLaser)

            const invasorDerrotado = alienInvaders.indexOf(indiceActualLaser)
            invasoresDerrotados.push(invasorDerrotado)
            resultados++
            mostrarResultados.innerHTML = resultados
        }
    }
    switch (e.key) {
        case "ArrowUp":
            idLaser = setInterval(moverLaser, 100)
    }
}

document.addEventListener("keydown", disparar)