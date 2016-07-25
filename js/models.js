var Evento = Backbone.Model.extend({
    idAttribute: 'id_evento',
    
    validate: function (attrs, options) {
        if (attrs.date == '') {
          return "Introduzca una fecha";
        }
        if (!validarFechaAMD(attrs.date) && !validarFechaDMA(attrs.date)) {
            // si falla para los dos formatos posibles
            return "Introduzca la fecha en formato dd-mm-aaaa";
        }
        if (attrs.time == '') {
          return "Introduzca la hora";
        }
        if (attrs.title_es == '') {
          return "Introduzca el título del evento";
        }
    }
});

var EventoCollection = Backbone.Collection.extend({

    model: Evento,

    // para q funcione en navegador poner en localhost
    //url: "http://localhost/fuerteagenda_cms/appeventos",
    
    // desde el movil sí debe funcionar en servidor
    url: "http://pelladeocio.com/appeventos",
    
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

var Eventor = Backbone.Model.extend({
    idAttribute: 'id_user',
    
    //urlRoot: "http://localhost/fuerteagenda_cms/appusers", 
    urlRoot: "http://pelladeocio.com/appusers", 
    
    validate: function (attrs, options) {
        if (attrs.contrasena_1 != attrs.contrasena_2) {
          return "La repetión de la contraseña no coincide con la contraseña";
        }
    }
    
});


function validarFechaAMD(fecha) {
    // esta debería validarse true siempre que se use html5
    console.log('validando fecha aaaa-mm-dd');
    //Funcion validarFecha 
    //valida fecha en formato aaaa-mm-dd
    var fechaArr = fecha.split('-');
    var aho = fechaArr[0];
    var mes = fechaArr[1];
    var dia = fechaArr[2];

    var plantilla = new Date(aho, mes - 1, dia);//mes empieza de cero Enero = 0

    if (plantilla.getFullYear() == aho && plantilla.getMonth() == mes-1 && plantilla.getDate() == dia){
        return true;
    }else{
        return false;
    }
}

function validarFechaDMA(fecha) {
    console.log('validando fecha dd-mm-aaaa');
    //Funcion validarFecha 
    //valida fecha en formato dd-mm-aaaa
    var fechaArr = fecha.split('-');
    var dia = fechaArr[0];
    var mes = fechaArr[1];
    var aho = fechaArr[2];

    var plantilla = new Date(aho, mes - 1, dia);//mes empieza de cero Enero = 0

    if (plantilla.getFullYear() == aho && plantilla.getMonth() == mes-1 && plantilla.getDate() == dia){
        return true;
    }else{
        return false;
    }
}