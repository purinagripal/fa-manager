var NuevoEventoView = Backbone.View.extend({

    initialize: function () {
    },

    render: function () {
        var primerModelo = this.collection.at(0);
        this.$el.html(this.template(primerModelo.toJSON()));
        console.log("auth user = "+window.auth_id_user);
        return this;
    },
    
       
    events: {
        "click .link_create": "crea_model",
        "submit #addEventoForm": "enviar_formulario",
    
        "click .local_link": "ver_local",
        "click .link_locales": "ver_locales",
        "click .link_eventos": "volver_inicio",
        "click .boton_inicio": "volver_inicio",
        "click .boton_atras": "volver_atras",
        "click .menu_salir": "salir"
    },
    
    
    // FUNCIONES CRUD - RESTful
    /*crea_model: function (event) {
        console.log('create');
        
        var evento = new Evento({id_categoria: 1, id_user: 1, date: '03/14/2016', time: '10:00', id_ciudad: 1, image: 'imagen.jpg', direccion: 'c/ montaña blanca', title_es: 'titulo español'});
        this.collection.add(evento);
        
        // save genera POST /appeventos
        evento.save(null, {
            success: function (model, response) {
                console.log(model);
                console.log(response);
                console.log("succes save");
                //console.log(JSON.stringify(evento.attributes)); // imprime {"id":1, "nombre": "Alfonso", "apellidos": "Marin Marin"}
            },
            error: function(model, response) {
                console.log("error save");
                console.log(model);
                console.log(response);
                //console.log(JSON.stringify(evento.attributes)); // imprime {"id":1, "nombre": "Alfonso", "apellidos": "Marin Marin"}
            },
            wait: true
        });
    },*/
    
    enviar_formulario: function (event) {
        console.log("enviar formulario");
        
        // array con los datos del formulario
        var datosForm = $("#addEventoForm").serializeObject();
        console.log( datosForm );
        
        
        var datosAnadir = {id_user: window.auth_id_user};
        //var datosAnadir = {id_user: 1, image:'imagen.jpg'};
        
        // añade a datosForm las propiedades de datosAñadir
        _.extend(datosForm, datosAnadir);
        console.log( datosForm );
        
        // creamos evento con datos del formulario
        var evento = new Evento(datosForm);
        this.collection.add(evento);
        
        // muestra imagen cargando...
        $("#carga").html('<p>Cargando...<img src="assets/ajax-loader.gif" /></p>');
        
        // guardamos el evento (sync con el servidor)
        // save genera POST /appeventos
        evento.save(null, {
            success:function(model, response){
                console.log(model);
                console.log(response);
                console.log("succes save");
                
                /*setTimeout(function() {
                    // resetea el historial
                    window.historial = [""];
                    Backbone.history.navigate( "", {trigger: true} );
                }, 5000);*/
                
                // resetea el historial
                window.historial = [""];
                Backbone.history.navigate( "", {trigger: true} );
            },
            error: function(model, response) {
                console.log("error save");
                console.log(model);
                console.log(response);
                //console.log(JSON.stringify(evento.attributes)); // imprime {"id":1, "nombre": "Alfonso", "apellidos": "Marin Marin"}
            },
            wait: true
        }); 
        
        // para que el formulario no recargue la página
        return false;
    },
    
    volver_inicio: function (event) {
        // resetea el historial
        window.historial = [""];
        console.log("window.historial: "+window.historial);
        Backbone.history.navigate( "", {trigger: true} );
    },
    
    volver_atras: function (event) {
        console.log("volver");
        
        // saca elemento del historial y vuelve al anterior
        window.historial.pop();
        console.log("window.historial: "+window.historial);
        Backbone.history.navigate(window.historial[window.historial.length-1], {trigger: true});
        
        //console.log(Backbone.history.location);
        //Backbone.history.history.back();
        // es lo mismo que:
        //window.history.back();
    },

    salir: function (event) {
        console.log("SALIR");
        navigator.app.exitApp();
    }

});