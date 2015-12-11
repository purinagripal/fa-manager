var NuevoEventoView = Backbone.View.extend({

    initialize: function () {
    },

    render: function () {
        var primerModelo = this.collection.at(0);
        this.$el.html(this.template(primerModelo.toJSON()));
        
        console.log("auth user = " + window.auth_id_user);
        console.log("coleccion en nuevo evento: ");
        console.log(JSON.stringify(this.collection.models));
        //$('#cargando').hide();
        
        /*// reseteamos el formulario (en firefox quedan datos de una vez para otra)
        $("#addEventoForm").reset();
        console.log('resetea formulario');*/
        
        return this;
    },
    
       
    events: {
        "click .link_create": "crea_model",
        //"submit #imageForm": "subir_imagen",
        "change #imageInput": "subir_imagen",
        "submit #addEventoForm": "enviar_formulario",
        
        "click .link_locales": "ver_locales",
        "click .link_eventos": "volver_inicio",
        "click .boton_inicio": "volver_inicio",
        "click .boton_atras": "volver_atras",
        "click .menu_salir": "salir"
    },
    
    
    subir_imagen: function (event) {
        
        console.log("subir imagen");
        
        // muestra imagen subiendo...
        $('#subiendo').show();
        
        /////////////////
        var file = $("#imageForm :file")[0].files[0];
        console.log("file");
        console.log(file);
        
        var dataUrl = "";
        
        // Create an image
        var img = document.createElement("img");
        // Create a file reader
        var reader = new FileReader();
                
        // Set the image once loaded into file reader
        reader.onload = function(e)
        {
            // asociamos a la imagen el resultado de leer "file"
            img.src = e.target.result;
            
            // esperamos que la imagen esté lista
            img.onload = function () {
                
                console.log("e.target.result");
                console.log(e.target.result);
                console.log("file type")
                console.log(file['type']);

                var canvas = document.createElement("canvas");
                //var ctx = canvas.getContext("2d");
                //ctx.drawImage(img, 0, 0);

                // Set Width and Height
                var MAX_WIDTH = 400;
                var width = img.width;
                var height = img.height;

                console.log(width);
                console.log(height);

                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }

                console.log(width);
                console.log(height);

                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                dataUrl = canvas.toDataURL(file['type']);
                //dataUrl = canvas.toDataURL("image/jpeg");
                console.log("dataURl");
                console.log(dataUrl);
                document.getElementById('evento-img').src = dataUrl; 

                // datos para enviar
                var data = new FormData();
                data.append('fileDataUrl', dataUrl);
                data.append('fileName', file['name']);
                data.append('fileType', file['type']);
                data.append('id_user', window.auth_id_user);

                console.log('data formulario');
                console.log(data);

                

                $.ajax({
                    url: 'http://test.mepwebs.com/app_upload',
                    //url: 'http://localhost/fuerteagenda_cms/app_upload',
                    data: data,
                    cache: false,
                    contentType: false,
                    processData: false,
                    type: 'POST',
                    success: function(data){
                        console.log('upload ok');
                        // data.file solo funciona en servidor (devuelve objeto)
                        console.log(data);
                        console.log(data.file);
    
                        $('#subiendo').hide();
    
                        // cambiamos la imagen q se ve
                        //$('#evento-img').attr('src', 'http://localhost/fuerteagenda_cms/uploads/medias/'+data.file);
                        //$('#evento-img').attr('src', 'http://test.mepwebs.com/uploads/medias/'+data.file);
    
                        // cambiamos el input image para q se guarde en bbdd con el evento
                        $("#image").val(data.file);
                    },
                    error: function(data){
                        $('#subiendo').hide();
                        alert('Error en la subida');
                    }
                });
                
            }
            

    
        }
        // Load files into file reader
        reader.readAsDataURL(file);
      
        /////////////////
        
        // file del formulario
//        var fileform = $("#imageForm :file")[0].files[0];
//        console.log('imagen del formulario');
//        console.log(fileform);
        
        
        
        // para que el formulario no recargue la página
        return false;
    },
    
    enviar_formulario: function (event) {
        console.log("enviar formulario");
        
        // array con los datos del formulario
        var datosForm = $("#addEventoForm").serializeObject();
        
        console.log('datos del formulario');
        console.log(datosForm);
                
        
        var datosAnadir = {id_user: window.auth_id_user};
        //var datosAnadir = {id_user: 1, image:'imagen.jpg'};
        
        // añade a datosForm las propiedades de datosAñadir
        _.extend(datosForm, datosAnadir);
        //console.log(datosForm);
        
        // creamos evento con datos del formulario
        var evento = new Evento(datosForm);
        
        // validamos el evento
        if (evento.isValid()) {
            // añadimos a coleccion y guardamos el evento
            this.collection.add(evento);
            var coleccionEventos = this.collection;

            // muestra imagen cargando...
            // cambia el contenido html
            //$("#carga").html('<p>Cargando...<img src="assets/ajax-loader.gif" /></p>');

            // muestra imagen cargando...
            $('#form_addevento').hide();
            $('#cargando').show();
            
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

                    // lo ordeno una vez tengo respuesta del servidor
                    coleccionEventos.sort();
                    
                    // resetea el historial
                    window.historial = [""];
                    Backbone.history.navigate( "", {trigger: true} );
                },
                error: function(model, response) {
                    console.log("error save");
                    console.log(model);
                    console.log(response);

                    // eliminamos el evento de la colección ya que no se ha guardado en server
                    coleccionEventos.remove(evento);
                },
                wait: true
            });
          
        } else {
            // avisamos de que faltan datos
            alert(evento.validationError);
        }
        
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