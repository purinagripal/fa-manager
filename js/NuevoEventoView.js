var NuevoEventoView = Backbone.View.extend({

    initialize: function () {
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },
    
       
    events: {
        "click .link_create": "crea_model",
    
        "click .local_link": "ver_local",
        "click .link_locales": "ver_locales",
        "click .link_eventos": "volver_inicio",
        "click .boton_inicio": "volver_inicio",
        "click .boton_atras": "volver_atras",
        "click .menu_salir": "salir"
    },
    
    
    // FUNCIONES CRUD - RESTful
    crea_model: function (event) {
        console.log('create');
        
        var evento = new Evento({id_categoria: 1, id_user: 1, date: '03/14/2016', time: '10:00', id_ciudad: 1, image:'imagen.jpg', direccion:'c/ montaña blanca', title_es: 'titulo español'});
        this.collection.add(evento);
        evento.save(null, {
            success:function(model, response){
                console.log(model);
                console.log(response);
                console.log("succes save");
                //console.log(JSON.stringify(evento.attributes)); // imprime {"id":1, "nombre": "Alfonso", "apellidos": "Marin Marin"}
            },
            error:function(model, response){
                console.log("error save");
                console.log(model);
                console.log(response);
                //console.log(JSON.stringify(evento.attributes)); // imprime {"id":1, "nombre": "Alfonso", "apellidos": "Marin Marin"}
            },
            wait: true
        }); // se genera POST /appeventos
        //this.collection.fetch({reset:true});
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
        Backbone.history.navigate( window.historial[window.historial.length-1], {trigger: true} );
        
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