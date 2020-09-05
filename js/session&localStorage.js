// DOM
// cajas
const loginBox = document.getElementById("login");
const createBox = document.getElementById("createLog");
const sesionBox = document.getElementById("sesion");
// inputs
const usuarioL = document.getElementById("usuarioL");
const contraL = document.getElementById("contraL");
const nombreL = document.getElementById("nombreL");
const usuarioC = document.getElementById("usuarioC");
const contraC = document.getElementById("contraC");
const nombreC = document.getElementById("nombreC");
// botones
const btnLogin = document.getElementById("btnLogin");
const btnCreate = document.getElementById("btnCreate");
const btnLogout = document.getElementById("btnLogout");
const lnkCreate = document.getElementById("lnkCreate");
// Variables
let sesion;
let usuarios = [];

//Desarrollo principal
const app = () =>
{
  if (obtenerUsuarios())
  {
    if (sesionIniciada())
    {
      mostrarSesion("inicio");
    }
  } else
  {
    mostrarCreate();
  }
};

// Eventos
btnLogin.addEventListener("click", () =>
{
  if (usuarioL.value && contraL.value)
  {
    obtenerUsuarios();
    let sinUsuario = true;
    for (let i = 0; i < usuarios.length; i -= -1)
    {
      if (usuarios[i].usuario === usuarioL.value)
      {
        sinUsuario = false;
        if (usuarios[i].contra === contraL.value)
        {
          sesion = usuarios[i];
          sessionStorage.setItem("sesion", JSON.stringify(sesion));
          mostrarSesion("inicio");
          break;
        } else
        {
          alert("La contraseña ingresada no coincide con nuestros registros");
          contraL.focus();
          break;
        }
      }
    }
    if (sinUsuario)
    {
      alert("El usuario no coincide con nuestros registros");
      usuarioL.focus();
    }
  }else{
    alert("Debes ingresar todos los datos")
  }
});

btnCreate.addEventListener("click", () =>
{
  if (usuarioC.value && nombreC.value && contraC.value)
  {
    obtenerUsuarios();
    let sinUsuario = false;
    for (let i = 0; i < usuarios.length; i -= -1)
    {
      if (usuarios[i].usuario === usuarioC.value)
      {
        sinUsuario = true;
        alert("El usuario ingresado ya existe en nuestro registro!");
        usuarioC.focus();
        break;
      }
    }
    if (!sinUsuario)
    {
      usuarios.push({
        nombre: nombreC.value,
        usuario: usuarioC.value,
        contra: contraC.value,
      });
      sesion = {
        nombre: nombreC.value,
        usuario: usuarioC.value,
        contra: contraC.value,
      };
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      sessionStorage.setItem("sesion", JSON.stringify(sesion));
      mostrarSesion("crear");
    }
  }else{
    alert("Debes ingresar todos los datos")
  }
});

btnLogout.addEventListener("click", () =>
{
  sessionStorage.clear();
  mostrarLogin();
});

lnkCreate.addEventListener("click", () =>
{
  mostrarCreate();
});

// Funciones
const sesionIniciada = () =>
{
  if (sessionStorage.getItem("sesion"))
  {
    sesion = JSON.parse(sessionStorage.getItem("sesion"));
    return true;
  } else
  {
    return false;
  }
};

const obtenerUsuarios = () =>
{
  if (localStorage.getItem("usuarios"))
  {
    usuarios = JSON.parse(localStorage.getItem("usuarios"));
    return true;
  } else
  {
    usuarios = [];
    return false;
  }
};

const mostrarSesion = (tipo) =>
{
  switch (tipo)
  {
    case "inicio":
      loginBox.classList.toggle("Box");
      loginBox.classList.toggle("NoBox");
      break;
    case "crear":
      createBox.classList.toggle("NoBox");
      createBox.classList.toggle("Box");
      break;
  }
  sesionBox.classList.toggle("NoBox");
  sesionBox.classList.toggle("Box");
  sesionIniciada();
  nombreL.innerText = sesion.nombre;
};

mostrarLogin = () =>
{
  sesionBox.classList.toggle("NoBox");
  sesionBox.classList.toggle("Box");
  loginBox.classList.toggle("Box");
  loginBox.classList.toggle("NoBox");
  limpiarInputs();
};

mostrarCreate = () =>
{
  loginBox.classList.toggle("Box");
  loginBox.classList.toggle("NoBox");
  createBox.classList.toggle("NoBox");
  createBox.classList.toggle("Box");
  limpiarInputs();
};

const limpiarInputs = () =>
{
  usuarioC.value = null;
  nombreC.value = null;
  contraC.value = null;
  usuarioL.value = null;
  nombreL.value = null;
  contraL.value = null;
};

app();
