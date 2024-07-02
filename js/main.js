
document.addEventListener("DOMContentLoaded", function() {
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("footer").outerHTML = data;
        });
});
document.addEventListener("DOMContentLoaded", function() {
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("header").outerHTML = data;
        });
});


     function validarFormularioContacto() {
        let nombre = document.getElementsByName("nombre")[0];
        let apellido = document.getElementsByName("apellido")[0];
        let email = document.getElementsByName("email")[0];
        let telefono = document.getElementsByName("telefono")[0];
        let mensaje = document.getElementsByName("mensaje")[0];
        let motivo = document.getElementsByName("motivo")[0];
        
        let error = false;
        
        if (nombre.value === "" || nombre.value.length < 3 ) {
            alert("El campo nombre no debe estar vacio o con menos de 3 caracteres");
            nombre.focus();
            error = true;
        }
        
        if (apellido.value === "" || apellido.value.length < 3 ) {
            alert("El campo apellido no puede estar vacio o con menos de 3 caracteres");
            apellido.focus();
            error = true;
        }
        
        if (email.value === "") {
            alert("Por favor, completa el campo Correo electrónico.");
            email.focus();
            error = true;
        } else if (!validarEmail(email.value)) {
            alert("Por favor, ingresa un correo electrónico válido.");
            email.focus();
            error = true;
        }
        
        if (telefono.value === "") {
            alert("Por favor, completa el campo Teléfono.");
            telefono.focus();
            error = true;
        } else if (!validarTelefono(telefono.value)) {
            alert("Por favor, ingresa un número de teléfono válido (10 dígitos).");
            telefono.focus();
            error = true;
        }
        
        if (mensaje.value === "") {
            alert("Por favor, completa el campo Mensaje.");
            mensaje.focus();
            error = true;
        }
        
        if (motivo.value === "") {
            alert("Por favor, selecciona un motivo.");
            motivo.focus();
            error = true;
        }
        if (archivo.files.length > 0) {
            let file = archivo.files[0];
            let validExtensions = ["image/jpeg", "image/png", "application/pdf"];
            let maxSize = 2 * 1024 * 1024; // 2 MB en bytes
    
            if (!validExtensions.includes(file.type)) {
                alert("Solo se permiten archivos JPG, PNG o PDF.");
                archivo.focus();
                error = true;
            } else if (file.size > maxSize) {
                alert("El archivo no debe superar los 2 MB.");
                archivo.focus();
                error = true;
            }
        
        }
        if (error) {
            // Evitar el envío del formulario si hay errores
            return false;
        } else {
            enviarFormulario();
        }
            return false;
    }
    
    function validarEmail(email) {
        // Expresión regular para validar un correo electrónico
        var emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailValido.test(email);
    }
    
    function validarTelefono(telefono) {
        // Expresión regular para validar un número de teléfono de 10 dígitos
        var telefonoValido = /^\d{10}$/;
        return telefonoValido.test(telefono);
    }
    

    function enviarFormulario() {
        
        alert("¡Formulario enviado! En breve nos estaremos comunicando con Ud.");

        document.getElementById("contact-form").reset();
        document.getElementById("inicio").scrollIntoView();
    }


    const { createApp } = Vue

    createApp({
        data() {
            return {
                url: "https://andymar75.pythonanywhere.com/planetas",
                datos: [],
                datosOfertas: [],
                error: false
            };
        },
        methods: {
            fetchData(url) {
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        this.datos = data;
                        this.loadSelectedPlanetData();
                    })
                    .catch(error => {
                        console.error('Error fetching data:', error);
                        this.error = true;
                    });
            },
            loadSelectedPlanetData() {
                const urlParams = new URLSearchParams(window.location.search);
                const planetName = urlParams.get('planeta');
                if (planetName) {
                    const planetData = this.datos.find(planeta => planeta.nombre === planetName);
                    if (planetData) {
                        this.datosPrincipales = [planetData];
                        this.datosOfertas = this.datos.filter(planeta => planeta.oferta && planeta.nombre !== planetName);
                    } else {
                        this.error = true;
                    }
                } else {
                    this.error = true;
                }
            },
            creaPlaneta() {
                const nuevoPlaneta = {
                    nombre: prompt('Nombre del planeta:'),
                    descripcion: prompt('Descripción del planeta:'),
                    duracion_dia: prompt('Duración del día:'),
                    cantidad_lunas: prompt('Cantidad de lunas:'),
                    precio_metro_cuad: prompt('Precio por metro cuadrado:'),
                    oferta: confirm('¿Está en oferta?'),
                    imagen: prompt('Imagen del planeta:')
                };
                fetch(this.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nuevoPlaneta)
                })
                    .then(response => response.json())
                    .then(data => {
                        this.datos.push(data);
                    })
                    .catch(error => {
                        console.error('Error creando planeta:', error);
                    });
            },
            leePlaneta(id) {
                fetch(`${this.url}/${id}`)
                    .then(response => response.json())
                    .then(data => {
                        alert(`Planeta: ${data.planeta}\nDescripción: ${data.descripcion}\nDuración del día: ${data.duracion_dia}\nCantidad de lunas: ${data.cantidad_lunas}\nPrecio/m2: ${data.precio_metro_cuad}\nOferta: ${data.oferta ? 'Sí' : 'No'}`);
                    })
                    .catch(error => {
                        console.error('Error leyendo planeta:', error);
                    });
            },
            modificaPlaneta(id) {
                const planeta = this.datos.find(p => p.id === id);
                const actualizadoPlaneta = {
                    nombre: prompt('Nombre del planeta:', planeta.nombre),
                    descripcion: prompt('Descripción del planeta:', planeta.descripcion),
                    duracion_dia: prompt('Duración del día:', planeta.duracion_dia),
                    cantidad_lunas: prompt('Cantidad de lunas:', planeta.cantidad_lunas),
                    precio_metro_cuad: prompt('Precio por metro cuadrado:', planeta.precio_metro_cuad),
                    oferta: confirm('¿Está en oferta?',planeta.oferta),
                    imagen:prompt('Imagen del planeta',planeta.imagen)
                };
                fetch(`${this.url}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(actualizadoPlaneta)
                })
                    .then(response => response.json())
                    .then(data => {
                        const index = this.datos.findIndex(p => p.id === id);
                        this.datos[index] = data;
                    })
                    .catch(error => {
                        console.error('Error modificando planeta:', error);
                    });
            },
            borraPlaneta(id) {
                fetch(`${this.url}/${id}`, {
                    method: 'DELETE'
                })
                    .then(() => {
                        this.datos = this.datos.filter(p => p.id !== id);
                    })
                    .catch(error => {
                        console.error('Error eliminando planeta:', error);
                    });
            }
        },
        created() {
            this.fetchData(this.url);
        }
    }).mount('#app');
    