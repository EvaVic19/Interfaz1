// Cargamos las notas almacenadas en localStorage o iniciamos un arreglo vacío
let notas = JSON.parse(localStorage.getItem("notas")) || [];
// Cargamos la cantidad de notas por página desde localStorage o usamos 5 por defecto
let notasPorPagina = parseInt(localStorage.getItem("notasPorPagina")) || 5;
// Página actual para la paginación, cargada de localStorage o iniciada en 1
let paginaActual = parseInt(localStorage.getItem("paginaActual")) || 1;
// Referencia al cuerpo de la tabla donde se mostrarán las notas
const tablaNotas = document.getElementById("tablaNotas");

// Guarda las notas actuales en localStorage
function guardarNotas() {
  localStorage.setItem("notas", JSON.stringify(notas));
}
// Función para agregar una nueva nota
function agregarNota() {
    // Obtener valores de los campos del formulario
  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const categoria = document.getElementById("categoria").value.trim();

    // Validar que todos los campos estén completos
  if (!titulo || !descripcion || !categoria) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, complete todos los campos.',
      confirmButtonColor: '#3085d6'
    });
    return;
  }
  // Obtener la fecha actual
  const fecha = new Date().toLocaleDateString();

    // Agregar la nueva nota al array de notas
  notas.push({ titulo, descripcion, categoria, fecha });
  guardarNotas();

    // Mostrar alerta de éxito
  Swal.fire({
    icon: 'success',
    title: 'Nota agregada',
    showConfirmButton: false,
    timer: 1500
  });

    // Limpiar los campos del formulario
  document.getElementById("titulo").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("categoria").value = "";

    // Mostrar las notas con la paginación actualizada
  mostrarNotasPaginadas();
}

// Editar una nota específica según su índice
function editarNota(index) {
  const nota = notas[index];// Obtener la nota actual

   // Mostrar modal de edición con SweetAlert2
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
        // Obtener nuevos valores
      const nuevoTitulo = document.getElementById("tituloEdit").value.trim();
      const nuevaDesc = document.getElementById("descEdit").value.trim();
      const nuevaCat = document.getElementById("catEdit").value;

         // Validar que estén completos
      if (!nuevoTitulo || !nuevaDesc || !nuevaCat) {
        Swal.showValidationMessage("Todos los campos son obligatorios");
        return false;
      }

            // Actualizar la nota
      notas[index] = {
        ...notas[index],
        titulo: nuevoTitulo,
        descripcion: nuevaDesc,
        categoria: nuevaCat
      };

      guardarNotas();// Guardar cambios
      mostrarNotasPaginadas(); // Actualizar la vista
      Swal.fire("Nota actualizada", "", "success");// Confirmación
    }
  });
}

// Eliminar una nota según su índice
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
      notas.splice(index, 1); // Eliminar nota
      guardarNotas();// Actualizar localStorage
      mostrarNotasPaginadas();// Actualizar vista
      Swal.fire({
        icon: 'success',
        title: 'Nota eliminada',
        showConfirmButton: false,
        timer: 1000
      });
    }
  });
}

// Mostrar solo las notas correspondientes a la página actual
function mostrarNotasPaginadas() {
  tablaNotas.innerHTML = "";// Limpiar tabla

  // Calcular rango de notas
  const inicio = (paginaActual - 1) * notasPorPagina;
  const fin = inicio + notasPorPagina;
  const notasPagina = notas.slice(inicio, fin);
  const fecha = new Date().toLocaleDateString();

   // Crear fila por cada nota
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

    // Guardar la página actual
  localStorage.setItem("paginaActual", paginaActual);

   // Generar los botones de paginación
  generarPaginacion();
}

// Crear los botones de paginación: Anterior y Siguiente
function generarPaginacion() {
  const paginacion = document.getElementById("paginacionNotas");
  paginacion.innerHTML = ""; // Limpiar

  const totalPaginas = Math.ceil(notas.length / notasPorPagina);

    // Botón Anterior
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

   // Botón Siguiente
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

    // Añadir botones al contenedor
  paginacion.appendChild(anterior);
  paginacion.appendChild(siguiente);
}

  // Cambiar cuántas notas  se muestran por página
function cambiarNotasPorPagina() {
  const select = document.getElementById("cantidadNotas");
  notasPorPagina = parseInt(select.value);
  paginaActual = 1;
  localStorage.setItem("notasPorPagina", notasPorPagina);
  localStorage.setItem("paginaActual", paginaActual);
  mostrarNotasPaginadas();
}

// Eliminar todas las notas con confirmación
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
// Ejecutar cuando la página cargue: mostrar notas y seleccionar cantidad por página
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("cantidadNotas").value = notasPorPagina;
  mostrarNotasPaginadas();
});