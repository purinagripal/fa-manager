var LocalesView = Backbone.View.extend({

    initialize:function () {
        console.log('initialize de localesView');
        this.ciudad = 0;
        this.render();
    },

    render:function () {
        console.log('render de localesView');
                
        this.$el.html(this.template(this.model.toJSON()));
        
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
                
        return this;
    },

    events: {
        "click .menu_salir": "salir",
        "click .link_eventos": "volver_inicio",
        "click .boton_inicio": "volver_inicio",
        "click .row.cuadro": "ver_local",
    },
    
    ver_local: function (event) {
        var id_local = $(event.currentTarget).attr('data-id'); 
        console.log("ver local "+id_local);
        
        // añade entrada al historial
        window.historial.push('local/'+id_local);
        console.log("window.historial: "+window.historial);
        
        //console.log(event);
        Backbone.history.navigate('local/'+id_local, {trigger: true});
    },
    
    volver_inicio: function (event) {
        // resetea el historial
        window.historial = [""];
        console.log("window.historial: "+window.historial);
        Backbone.history.navigate( "", {trigger: true} );
    },

    salir: function (event) {
        console.log("SALIR");
        navigator.app.exitApp();
    }

});