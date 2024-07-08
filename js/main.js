document.addEventListener("DOMContentLoaded", function() {
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("footer").outerHTML = data;
        });

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
    let archivo = document.getElementsByName("archivo")[0];
    
    let error = false;
    
    if (nombre.value === "" || nombre.value.length < 3) {
        alert("El campo nombre no debe estar vacío o con menos de 3 caracteres");
        nombre.focus();
        error = true;
    }
    
    if (apellido.value === "" || apellido.value.length < 3) {
        alert("El campo apellido no puede estar vacío o con menos de 3 caracteres");
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
        return false;
    } else {
        enviarFormulario();
    }
    return false;
}

function validarEmail(email) {
    var emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailValido.test(email);
}

function validarTelefono(telefono) {
    var telefonoValido = /^\d{10}$/;
    return telefonoValido.test(telefono);
}

function enviarFormulario() {
    alert("¡Formulario enviado! En breve nos estaremos comunicando con Ud.");
    document.getElementById("contact-form").reset();
    document.getElementById("inicio").scrollIntoView();
}

const { createApp } = Vue;

createApp({
    data() {
        return {
            urlPlanetas: "https://andymar75.pythonanywhere.com/planetas",
            urlUsuarios: "https://andymar75.pythonanywhere.com/usuarios",
            datos: [],
            datosOfertas: [],
            error: false,
            registerForm: {
                username: '',
                email: '',
                password: '',
                confirm_password: ''
            },
            loginForm: {
                username: '',
                password: ''
            },
            registerError: '',
            loginError: '',
            planeta: {
                nombre: '',
                descripcion: '',
                duracion_dia: '',
                cantidad_lunas: '',
                precio_metro_cuad: '',
                oferta: false,
                imagen: ''
            }
        };
    },
    methods: {
        fetchDataPlanetas() {
            fetch(this.urlPlanetas)
                .then(response => response.json())
                .then(data => {
                    console.log("Datos de planetas:", data);
                    this.datos = data;
                    this.loadSelectedPlanetData();
                })
                .catch(error => {
                    console.error('Error al obtener datos de planetas:', error);
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
            window.location.href = '/nuevoPlaneta.html';
        },
        createPlaneta() {

            if (!this.planeta.nombre ||
                !this.planeta.descripcion ||
                !this.planeta.duracion_dia ||
                !this.planeta.cantidad_lunas ||
                !this.planeta.precio_metro_cuad) {
                alert('Por favor, completa todos los campos obligatorios.');
                return;
                }

            fetch(this.urlPlanetas, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.planeta)
            })
                .then(response => response.json())
                .then(data => {
                    alert('Planeta creado exitosamente');
                    window.location.href = '/crud.html';
                })
                .catch(error => {
                    console.error('Error creando planeta:', error);
                });
        },
        leePlaneta(id) {
            fetch(`${this.urlPlanetas}/${id}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Detalles del planeta:", data);
                })
                .catch(error => {
                    console.error('Error al obtener detalles del planeta:', error);
                });
        },
        modificaPlaneta(id) {
            window.location.href = `/editarPlaneta.html?id=${id}`;
        },
        borraPlaneta(id) {
            if (confirm('¿Estás seguro de que deseas borrar este planeta?')) {
                fetch(`${this.urlPlanetas}/${id}`, {
                    method: 'DELETE'
                })
                    .then(() => {
                        this.datos = this.datos.filter(planeta => planeta.id !== id);
                        alert('Planeta borrado exitosamente');
                    })
                    .catch(error => {
                        console.error('Error borrando planeta:', error);
                    });
            }
        },
        fetchPlaneta() {
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            fetch(`${this.urlPlanetas}/${id}`)
                .then(response => response.json())
                .then(data => {
                    this.planeta = data;
                })
                .catch(error => {
                    console.error('Error al obtener datos del planeta:', error);
                });
        },
        onFileChange(event) {
            const file = event.target.files[0];
            this.planeta.imagen = URL.createObjectURL(file);
        },
        submitForm() {
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            fetch(`${this.urlPlanetas}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.planeta)
            })
                .then(response => response.json())
                .then(data => {
                    alert('Planeta actualizado exitosamente');
                    window.location.href = '/crud.html';
                })
                .catch(error => {
                    console.error('Error actualizando planeta:', error);
                });
        },
        register() {
            if (this.registerForm.password !== this.registerForm.confirm_password) {
                this.registerError = 'Las contraseñas no coinciden.';
                return;
            }
            fetch(this.urlUsuarios, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usu_nombre: this.registerForm.username,
                    email: this.registerForm.email,
                    clave: this.registerForm.password,
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Usuario registrado:', data);
                    alert('Registro exitoso. Por favor, inicie sesión.');
                    this.registerForm = { username: '', email: '', password: '', confirm_password: '' };
                    this.registerError = '';
                })
                .catch(error => {
                    console.error('Error registrando usuario:', error);
                    this.registerError = 'Error registrando usuario.';
                });
        },
        login() {
            fetch(`${this.urlUsuarios}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usu_nombre: this.loginForm.username,
                    clave: this.loginForm.password
                })
            })
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        throw new Error('Error de autenticación');
                    }
                })
                .then(data => {
                    console.log('Usuario autenticado:', data);
                    if (data.is_admin) {
                        window.location.href = 'crud.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                })
                .catch(error => {
                    console.error('Error iniciando sesión:', error);
                    this.loginError = 'Error de autenticación: usuario o contraseña incorrectos.';
                });
        }
    },
    mounted() {
        this.fetchDataPlanetas();
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('id')) {
            this.fetchPlaneta();
        }
    }
}).mount('#app');