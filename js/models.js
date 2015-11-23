var Evento = Backbone.Model.extend({
    idAttribute: 'id_evento'
});

var EventoCollection = Backbone.Collection.extend({

    model: Evento,

    // para q funcione en navegador poner en localhost
    url: "http://localhost/fuerteagenda_cms/appeventos",
    
    // desde el movil sí debe funcionar en servidor
    //url: "http://test.mepwebs.com/appeventos",
    
    obtenerLocales: function(){
        
        var locales = [];
        
        console.log("::: antes del each ::: ");
        // recorro la lista de eventos (this)
        _.each( this.models, 
                function(element) {
                    //console.log("evento dentro de each");
                    //console.log(element.attributes.Eventor);
            
                    var esta_incluido = _.some(this, function(local) {return local.id_user === element.attributes.Eventor.id_user;});
                    if(!esta_incluido){
                        //console.log("::: incluye 1 local ::: id_user: "+element.attributes.Eventor.id_user);
                        locales.push(element.attributes.Eventor);
                    }  
                    //console.log("::: locales ::: ")
                    //console.log(this);
                }, 
                locales);
        
        //console.log("::: despues del each ::: ");
        //console.log(":::locales al terminar::: ");
        //console.log(locales);

        var localesList = new Backbone.Collection(locales);
        
        return localesList;
    
    }

});
