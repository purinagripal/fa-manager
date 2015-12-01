var Evento = Backbone.Model.extend({
    idAttribute: 'id_evento'
});

var EventoCollection = Backbone.Collection.extend({

    model: Evento,

    // para q funcione en navegador poner en localhost
    url: "http://localhost/fuerteagenda_cms/appeventos",
    
    // desde el movil sí debe funcionar en servidor
    //url: "http://test.mepwebs.com/appeventos",
    
    comparator: 'date',
    
    obtenerLocales: function(){
        
        var locales = [];
        
        console.log("::: antes del each ::: ");
        // recorro la lista de eventos (this)
        _.each( this.models, 
                function(element) {
                    // some recorre la lista de locales (this) para ver si el Eventor está incluido
                    var esta_incluido = _.some(this, function(local) {return local.id_user === element.attributes.Eventor.id_user;});
                    if(!esta_incluido){
                        // el Eventor no esta incluido, lo añade a la lista de locales
                        locales.push(element.attributes.Eventor);
                    }  
                    //console.log("::: locales ::: ")
                    //console.log(this);
                }, 
                // this = locales
                locales);

        var localesList = new Backbone.Collection(locales);
        
        return localesList;
    
    }

});
