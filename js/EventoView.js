var EventoView = Backbone.View.extend({

    initialize: function () {
        this.eventos = new EventoCollection();

    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },
    
       
    events: {
        "click .link_readcoll": "read_collection",
        "click .link_readmodel": "read_model",
        "click .link_update": "update_model",
        "click .link_delete": "delete_model",
        "click .link_create": "crea_model",
    
        "click .local_link": "ver_local",
        "click .link_locales": "ver_locales",
        "click .link_eventos": "volver_inicio",
        "click .boton_inicio": "volver_inicio",
        "click .boton_atras": "volver_atras",
        "click .menu_salir": "salir"
    },
    
    
    // FUNCIONES CRUD - RESTful
    
    read_model: function (event) {
        var evento = new Evento({id_evento:9});
        this.eventos.add(evento);
        evento.fetch({                     // se genera GET /usuarios/1
            success:function(){
                alert(JSON.stringify(evento.attributes)); // imprime {"id":1, "nombre": "Alfonso", "apellidos": "Marin Marin"}
            }
        });
    },
    
    read_collection: function (event) {
        this.eventos.fetch();
        console.log("read collection");
        console.log(this.eventos);        
    },
    
    crea_model: function (event) {
        console.log('create');
        
        var evento = new Evento({id_categoria: 1, id_user: 1, date: '10/18/2015', time: '10:00', id_ciudad: 1, image:'imagen.jpg', direccion:'c/ montaña blanca'});
        this.eventos.add(evento);
        evento.save({                     // se genera GET /usuarios/1
            success:function(){
                alert(JSON.stringify(evento.attributes)); // imprime {"id":1, "nombre": "Alfonso", "apellidos": "Marin Marin"}
            }
        });
    },
    
    update_model: function (event) {
        var evento = new Evento({id_evento:10, id_categoria:3});
        this.eventos.add(evento);
        evento.save({                     // se genera GET /usuarios/1
            success:function(){
                alert(JSON.stringify(evento.attributes)); // imprime {"id":1, "nombre": "Alfonso", "apellidos": "Marin Marin"}
            }
        });
    },
    
    delete_model: function (event) {
        var eventoborrar = new Evento({id_evento:12}); // Creamos una instancia inicializando el ID del objeto que queremos recuperar
        this.eventos.add(eventoborrar); // Añadimos la instancia a la colección para que Backbone sepa la url base de la colección
        eventoborrar.destroy(); 
    },
    
    
    
    ver_local: function (event) {
        var id_local = $(event.currentTarget).attr('data-id'); 
        
        // añade entrada al historial
        window.historial.push('local/'+id_local);
        console.log("window.historial: "+window.historial);
        
        Backbone.history.navigate('local/'+id_local, {trigger: true});
    },
    
    ver_locales: function (event) {        
        // resetea el historial
        window.historial = ['locales'];
        console.log("window.historial: "+window.historial);
        
        //console.log(event);
        Backbone.history.navigate('locales', {trigger: true});
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