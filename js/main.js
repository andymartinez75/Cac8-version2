    
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
        
        if (!error) {
            // Aquí puedes enviar el formulario
            alert("¡Formulario enviado! En breve nos estaremos comunicando con Ud.");
            // Mostrar mensaje de formulario enviado en pantalla
            mostrarMensajeEnviado();
            // Limpiar el formulario después de enviarlo
            document.getElementById("contact-form").reset();
            
        }
        
        return !error;
    }
    
    function validarEmail(email) {
        // Expresión regular para validar un correo electrónico
        var emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailValido.test(email);
    }
    
    function validarTelefono(telefono) {
        // Expresión regular para validar un número de teléfono de 10 dígitos
        var telefonoValido = /^\d{11}$/;
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
            url: "./js/planet.json",
            datos: [],
            datosOfertas:[],
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
                    this.loadSelectedPlanetData(); // Llama a loadSelectedPlanetData después de cargar los datos
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
                const planetData = this.datos.find(planeta => planeta.planeta === planetName);
                if (planetData) {
                    this.datosPrincipales = [planetData];
                    this.datosOfertas = this.datos.filter(planeta=>planeta.oferta && planeta.planeta!==planetName);
                } else {
                    this.error = true;
                }
            } else {
                this.error = true;
            }
        }
    },
    created() {
        this.fetchData(this.url); // Llama a fetchData al inicio para cargar los datos
    }
}).mount('#app');

