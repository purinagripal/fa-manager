var HomeView = Backbone.View.extend({

    initialize:function () {
        console.log('initialize de homeView');
        this.categoria = 0;
        this.ciudad = 0;
        
        this.collection.on("reset", this.render, this);
        this.collection.on("remove", this.render, this);
        
    },

    render:function () {
        console.log('render de homeView');
                
        this.$el.html(this.template());
           
        // boton categoria
        var categ_txt;
        switch(this.categoria) {
            case '1':
                categ_txt = 'Música';
                break;
            case '4':
                categ_txt = 'Talleres';
                break;
            case '5':
                categ_txt = 'Charlas';
                break;
            default:
                categ_txt = 'Categoría';
        }
        this.$('#dropdownMenuCateg').html(categ_txt+' <span class="caret"></span>');
        
        // boton ciudad
        var ciudad_txt;
        switch(this.ciudad) {
            case '1':
                ciudad_txt = 'Lajares';
                break;
            case '2':
                ciudad_txt = 'Corralejo';
                break;
            default:
                ciudad_txt = 'Ciudad';
        }
        this.$('#dropdownMenuCiudad').html(ciudad_txt+' <span class="caret"></span>');
                
        _.each(this.collection.models, 
               function (evento) {$('.guiaeventos', this.el).append(new EventoListItemView({model: evento}).render().el);}, 
               this);
        return this;
    },

    events: {
        "click .eliminar_ev": "eliminar_evento",
        "click .menu_salir": "salir",
        //"click .row.cuadro": "ver_evento",
        "click .filt_categ": "filtra_categoria",
        "click .filt_zona": "filtra_ciudad"
    },
    
    filtra_categoria: function (event) {
        var id_cat = $(event.currentTarget).attr('data-id'); 
        console.log('id de categoria'+id_cat);
        
        //window.historial = "home";
        console.log("window.historial: "+window.historial);
        
        Backbone.history.navigate('categ/'+id_cat, {trigger: true});
        // borra del historial
        Backbone.history.navigate('', {replace: true});
    },
    
    filtra_ciudad: function (event) {
        var id_ciudad = $(event.currentTarget).attr('data-id'); 
        console.log('id de ciudad: '+id_ciudad);
        
        //window.historial = "home";
        console.log("window.historial: "+window.historial);
        // borra del historial
        Backbone.history.navigate('zona/'+id_ciudad, {trigger: true});
        Backbone.history.navigate('', {replace: true});
    },
    
    ver_evento: function (event) {
        //var id_evento = $(event.currentTarget).attr('data-id'); 
        
        
        //console.log(event);
        Backbone.history.navigate('eventos/1', {trigger: true});
    },
    
    /*eliminar_evento: function (event) {        
        var id_evento = $(event.currentTarget).attr('data-id'); 
        
        if( confirm("Se eliminará el evento") ) {
            var eventoborrar = this.collection.get(id_evento);
            eventoborrar.destroy();
        }       
        
    },*/
    
    eliminar_evento: function (event) {        
        var id_evento = $(event.currentTarget).attr('data-id'); 
        
        var self = this;
        
        if (navigator.notification) { 
            window.confirm = function (message) {
                navigator.notification.confirm(
                    "Se eliminará el evento",    // message
                    function(buttonIndex){
                        self.onConfirmDelete(buttonIndex, id_evento);
                    },       // callback
                    "Pella de Ocio", // title
                    ['Sí', 'No']        // buttonName
                );
                console.log("inside function");
            };
            console.log("navigator.notification");
        } else {
            if( confirm("Se eliminará el evento") ) {
                console.log("window.confirm");
                this.onConfirmDelete(1, id_evento);
            }              
        }
    },
    
    // borra el evento señalado
    onConfirmDelete: function(buttonIndex, id_evento){
        console.log("onConfirmDelete, buttonIndex "+buttonIndex+" y id_evento: "+id_evento);
        if(buttonIndex===1){
            var eventoborrar = this.collection.get(id_evento);
            eventoborrar.destroy();
        }
    },

    salir: function (event) {
        console.log("SALIR");
        navigator.app.exitApp();
    }
});

function onConfirm() {
        alert('You selected button ' + buttonIndex);
    }