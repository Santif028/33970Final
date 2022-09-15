//Manipulacion de DOM
const grid = document.querySelector(".grid")
const mostrarResultados = document.querySelector(".resultados")
const idForm = document.getElementById("idForm")
const botonUsers = document.getElementById("botonUsers")
const divPrincipal = document.getElementById("principal")
const divPuntuaciones = document.getElementById("divPuntuaciones")
const gridJuego = document.getElementById("gridJuego")

//Variables
let indiceActualDefensor = 202
let ancho = 15
let direccion = 1
let idInvasores
let direccionDerecha = true
let invasoresDerrotados = []
let resultados = 0
let velocidadInvasores = 600

//Constructor
class Usuario {
  constructor(nombre, puntuacion) {
    this.nombre = nombre
    this.puntuacion = puntuacion
  }
}

const usuarios = []

//Guardo mi usuario en el local Storage, aplico los estilos CSS una vez den al boton Submit y doy comienzo al juego
idForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const datForm = new FormData(e.target)
  const user = new Usuario(datForm.get("nombre"), resultados)
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []
  indiceDelUsuario = usuarios.length
  usuarios.push(user)
  localStorage.setItem('usuarios', JSON.stringify(usuarios))
  idForm.reset()
  idForm.style.display = "none"
  divPrincipal.style.display = "grid"
  gridJuego.style.display = "contents"
  mostrarInvasores()
  idInvasores = setInterval(moverInvasores, velocidadInvasores)
})

for (let i = 0; i < 225; i++) {
  const cuadrado = document.createElement("div")
  grid.appendChild(cuadrado)
}

const cuadrados = Array.from(document.querySelectorAll(".grid div"))

let alienInvaders = [
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

//Funcion para mover al defensor, en base al resto de la division entre indiceActualDefensor y el ancho aumento o disminuyo el indice de mi defensor dando lugar al movimiento del mismo.
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

//Funcion para que los Invasores se muevan, tambien haciendo uso del resto de la division pongo los limites para que los invasores choquen y empiecen a ir en reversa
const moverInvasores = () => {
  const bordeIzquierdo = (alienInvaders[0] % ancho) === 0
  const bordeDerecho = (alienInvaders[alienInvaders.length - 1] % ancho) === ancho - 1
  eliminarInvasores()

  //El invasor choca con el borde derecho entonces hago que cambie su dirección y baje directamente hacia abajo
  if (bordeDerecho && direccionDerecha) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += ancho + 1
      direccion = -1
      direccionDerecha = false
    }
  }

  // Caso contrario, el invasor choca con el borde izquierdo entonces repito el proceso de arriba 
  if (bordeIzquierdo && !direccionDerecha) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += ancho - 1
      direccion = 1
      direccionDerecha = true
    }
  }

  //Los invasores aumentan o disminuyen su indice en base al borde con el que chocaron
  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direccion
  }
  mostrarInvasores()

  //A partir de acá genero mis condiciones de derrota, donde guardo la ultima puntuacion recibida en el localstorage
  
  //Esta condicion se cumple cuando un invasor choca con el defensor
  if (cuadrados[indiceActualDefensor].classList.contains("invasor", "defensor")) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []
    usuarios[indiceDelUsuario].puntuacion = resultados
    localStorage.setItem('usuarios', JSON.stringify(usuarios))
    mostrarResultados.innerHTML = `GAME OVER YOUR RESULTS WERE: ${resultados}`
    clearInterval(idInvasores)
  }

  //Esta condicion en su primer version funcionaba, pero luego de agregar varios cambios me dejo de funcionar, se supone que seria game over si un invasor se escapa por el borde abajo del campo de juego, asi que la dejo por si puede dejarme alguna solución, gracias!
  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] > (cuadrados.length)) {
    usuarios = JSON.parse(localStorage.getItem("usuarios")) 
    usuarios[indiceDelUsuario].puntuacion = resultados
    localStorage.setItem('usuarios', JSON.stringify(usuarios))
    mostrarResultados.innerHTML = `GAME OVER YOUR RESULTS WERE: ${resultados}`
    clearInterval(idInvasores)
    }
  }

  //Y esta es mi condicion que genera una nueva oleada ni bien se derrote a la anterior
  if (invasoresDerrotados.length === alienInvaders.length) {
    invasoresDerrotados = []
    alienInvaders = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
      30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ]
    moverInvasores()
  }
}

//Funcion para disparar donde hago uso del classlist para poder hacer desaparecer a los invasores en base al indice actual del laser, tambien dejo un timeout para dejar la explosion cuando un invasor desaparece 
const disparar = (e) => {
  let idLaser
  let indiceActualLaser = indiceActualDefensor
  function moverLaser() {
    if (!cuadrados[indiceActualLaser]) return
    cuadrados[indiceActualLaser].classList.remove("laser")
    indiceActualLaser -= ancho
    if (!cuadrados[indiceActualLaser]) return
    cuadrados[indiceActualLaser].classList.add("laser")
    if (cuadrados[indiceActualLaser].classList.contains("invasor")) {
      cuadrados[indiceActualLaser].classList.remove("laser")
      cuadrados[indiceActualLaser].classList.remove("invasor")
      cuadrados[indiceActualLaser].classList.add("explosion")

      setTimeout(() => cuadrados[indiceActualLaser].classList.remove("explosion"), 500)
      clearInterval(idLaser)

      //Acá creo la variable del invasdor derrotado basado en los invasores los cuales el laser toca, y despues empujandolos al array de invasores derrotados creado previamente, tambien hago que cada invasor derrotado aumente en uno los resultados
      const invasorDerrotado = alienInvaders.indexOf(indiceActualLaser)
      invasoresDerrotados.push(invasorDerrotado)
      resultados++
      mostrarResultados.innerHTML = resultados
    }
  }
  switch (e.key) {
    case "ArrowUp":
      idLaser = setInterval(moverLaser, 150)
  }
}

document.addEventListener("keydown", disparar)

//Muestro en pantalla los datos recuperados del local storage con las puntuaciones y el nombre del jugador
const mostrarPuntuaciones = () => {
  const usuarios = JSON.parse(localStorage.getItem("usuarios"))
  divPuntuaciones.innerHTML = ""
  usuarios.forEach(usuarios => {
    divPuntuaciones.innerHTML += `
      <ul class="list-group">
      <li class="list-group-item">${usuarios.nombre}</li>
      <li class="list-group-item">${usuarios.puntuacion}</li>
    </ul>
      `
  });
}

mostrarPuntuaciones()

//Configuración de particlesJS
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