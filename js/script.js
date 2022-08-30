//VARIABLES
const grid = document.querySelector(".grid")
const mostrarResultados = document.querySelector(".resultados")
const idForm = document.getElementById("idForm")
const botonUsers = document.getElementById("botonUsers")
const divUsers = document.getElementById("divUsers")
let indiceActualDefensor = 202
let ancho = 15
let direccion = 1
let idInvasores
let direccionDerecha = true
let invasoresDerrotados = []
let resultados = 0

//CONSTRUCTOR PARA GUARDAR LAS PUNTUACIONES
class Usuario {
    constructor(nombre, puntuacion) {
        this.nombre = nombre
        this.puntuacion = puntuacion
    }
}

const usuarios = []

//ADDEVENTLISTENER PARA INICIAR EL JUEGO UNA VEZ DEN SUBMIT AL FORMULARIO
idForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const datForm = new FormData(e.target)
    const user = new Usuario(datForm.get("nombre"), resultados)
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []
    indiceDelUsuario = usuarios.length
    usuarios.push(user)
    localStorage.setItem('usuarios', JSON.stringify(usuarios))
    idForm.reset()
    mostrarInvasores()
    idInvasores = setInterval(moverInvasores, 500)
})

//CICLO FOR PARA CREAR LOS 240 DIVS DONDE SE VA A DESARROLLAR EL JUEGO
for (let i = 0; i < 240; i++) {
    const cuadrado = document.createElement("div")
    grid.appendChild(cuadrado)
}

//ARRAY DE TODOS LOS DIVS CREADOS PREVIAMENTE
const cuadrados = Array.from(document.querySelectorAll(".grid div"))

//ARRAY CON LOS INDICES EN QUE SE POSICIONARAN LOS INVASORES
const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
]

//FUNCIONES
const mostrarInvasores = () => {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!invasoresDerrotados.includes(i)) {
            cuadrados[alienInvaders[i]].classList.add("invasor")
        }
    }
}

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
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []
        usuarios[indiceDelUsuario].puntuacion = resultados
        localStorage.setItem('usuarios', JSON.stringify(usuarios))
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

particlesJS(
    {
        "particles": {
          "number": {
            "value": 160,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "color": {
            "value": "#ffffff"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            },
            "polygon": {
              "nb_sides": 5
            },
            "image": {
              "src": "img/github.svg",
              "width": 100,
              "height": 100
            }
          },
          "opacity": {
            "value": 1,
            "random": true,
            "anim": {
              "enable": true,
              "speed": 1,
              "opacity_min": 0,
              "sync": false
            }
          },
          "size": {
            "value": 3,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 4,
              "size_min": 0.3,
              "sync": false
            }
          },
          "line_linked": {
            "enable": false,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 1,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
              "enable": false,
              "rotateX": 600,
              "rotateY": 600
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "bubble"
            },
            "onclick": {
              "enable": true,
              "mode": "repulse"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 400,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 250,
              "size": 0,
              "duration": 2,
              "opacity": 0,
              "speed": 3
            },
            "repulse": {
              "distance": 400,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true
      }
)