let notas = JSON.parse(localStorage.getItem("notas")) || [];
let notasPorPagina = parseInt(localStorage.getItem("notasPorPagina")) || 5;
let paginaActual = parseInt(localStorage.getItem("paginaActual")) || 1;

const tablaNotas = document.getElementById("tablaNotas");

function guardarNotas() {
  localStorage.setItem("notas", JSON.stringify(notas));
}

function agregarNota() {
  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const categoria = document.getElementById("categoria").value.trim();

  if (!titulo || !descripcion || !categoria) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, complete todos los campos.',
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  const fecha = new Date().toLocaleDateString();
  notas.push({ titulo, descripcion, categoria, fecha });
  guardarNotas();

  Swal.fire({
    icon: 'success',
    title: 'Nota agregada',
    showConfirmButton: false,
    timer: 1500
  });

  document.getElementById("titulo").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("categoria").value = "";

  mostrarNotasPaginadas();
}

function editarNota(index) {
  const nota = notas[index];

  Swal.fire({
    title: 'Editar Nota',
    html: `
      <input id="tituloEdit" class="swal2-input" value="${nota.titulo}">
      <textarea id="descEdit" class="swal2-textarea">${nota.descripcion}</textarea>
      <select id="catEdit" class="swal2-select">
        <option value="Trabajo" ${nota.categoria === "Trabajo" ? "selected" : ""}>Trabajo</option>
        <option value="Personal" ${nota.categoria === "Personal" ? "selected" : ""}>Personal</option>
        <option value="Estudio" ${nota.categoria === "Estudio" ? "selected" : ""}>Estudio</option>
      </select>
    `,
    focusConfirm: false,
    preConfirm: () => {
      const nuevoTitulo = document.getElementById("tituloEdit").value.trim();
      const nuevaDesc = document.getElementById("descEdit").value.trim();
      const nuevaCat = document.getElementById("catEdit").value;

      if (!nuevoTitulo || !nuevaDesc || !nuevaCat) {
        Swal.showValidationMessage("Todos los campos son obligatorios");
        return false;
      }

      notas[index] = {
        ...notas[index],
        titulo: nuevoTitulo,
        descripcion: nuevaDesc,
        categoria: nuevaCat
      };

      guardarNotas();
      mostrarNotasPaginadas();
      Swal.fire("Nota actualizada", "", "success");
    }
  });
}

function eliminarNota(index) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta nota se eliminará permanentemente.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      notas.splice(index, 1);
      guardarNotas();
      mostrarNotasPaginadas();
      Swal.fire({
        icon: 'success',
        title: 'Nota eliminada',
        showConfirmButton: false,
        timer: 1000
      });
    }
  });
}

function mostrarNotasPaginadas() {
  tablaNotas.innerHTML = "";

  const inicio = (paginaActual - 1) * notasPorPagina;
  const fin = inicio + notasPorPagina;
  const notasPagina = notas.slice(inicio, fin);
  const fecha = new Date().toLocaleDateString();

  notasPagina.forEach((nota, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${nota.titulo}</td>
      <td>${nota.descripcion}</td>
      <td>${nota.categoria}</td>
      <td>${nota.fecha}</td>
      <td>
        <button class="btn btn-success btn-sm me-1" onclick="editarNota(${inicio + index})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarNota(${inicio + index})">Eliminar</button>
      </td>
    `;
    tablaNotas.appendChild(fila);
  });

  localStorage.setItem("paginaActual", paginaActual);
  generarPaginacion();
}

function generarPaginacion() {
  const paginacion = document.getElementById("paginacionNotas");
  paginacion.innerHTML = "";

  const totalPaginas = Math.ceil(notas.length / notasPorPagina);

  const anterior = document.createElement("button");
  anterior.textContent = "Anterior";
  anterior.className = "btn btn-sm border-secondary me-2 text-primary";
  anterior.disabled = paginaActual === 1;
  anterior.addEventListener("mouseenter", () => {
    if (!anterior.disabled) anterior.classList.add("btn-primary", "text-white");
  });
  anterior.addEventListener("mouseleave", () => {
    if (!anterior.disabled) anterior.classList.remove("btn-primary", "text-white");
  });
  anterior.addEventListener("click", () => {
    if (paginaActual > 1) {
      paginaActual--;
      localStorage.setItem("paginaActual", paginaActual);
      mostrarNotasPaginadas();
    }
  });

  const siguiente = document.createElement("button");
  siguiente.textContent = "Siguiente";
  siguiente.className = "btn btn-sm border- secondary text-primary";
  siguiente.disabled = paginaActual === totalPaginas || totalPaginas === 0;
  siguiente.addEventListener("mouseenter", () => {
    if (!siguiente.disabled) siguiente.classList.add("btn-primary", "text-secondary");
  });
  siguiente.addEventListener("mouseleave", () => {
    if (!siguiente.disabled) siguiente.classList.remove("btn-primary", "text-secondary");
  });
  siguiente.addEventListener("click", () => {
    if (paginaActual < totalPaginas) {
      paginaActual++;
      localStorage.setItem("paginaActual", paginaActual);
      mostrarNotasPaginadas();
    }
  });

  paginacion.appendChild(anterior);
  paginacion.appendChild(siguiente);
}

function cambiarNotasPorPagina() {
  const select = document.getElementById("cantidadNotas");
  notasPorPagina = parseInt(select.value);
  paginaActual = 1;
  localStorage.setItem("notasPorPagina", notasPorPagina);
  localStorage.setItem("paginaActual", paginaActual);
  mostrarNotasPaginadas();
}

function eliminarTodasLasNotas() {
  Swal.fire({
    title: '¿Deseas eliminar todas las notas?',
    text: "Esta acción eliminará todas las notas de forma permanente.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar todo',
    cancelButtonText: 'No',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  }).then((result) => {
    if (result.isConfirmed) {
      // Borra todo el contenido de la tabla
      tablaNotas.innerHTML = '';

      // Borra las notas guardadas en localStorage
      localStorage.removeItem('notas');


      Swal.fire({
        icon: 'success',
        title: 'Todas las notas han sido eliminadas',
        showConfirmButton: false,
        timer: 1500
      });
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("cantidadNotas").value = notasPorPagina;
  mostrarNotasPaginadas();
});