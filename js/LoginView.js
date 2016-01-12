var LoginView = Backbone.View.extend({

    initialize:function () {
        console.log('initialize de loginView');
        
        // si hay datos de usuario salta el formulario de login
        if(window.localStorage.getItem('usuario')){
            console.log("usuario: "+window.localStorage.getItem('usuario'));
            console.log("clave: "+window.localStorage.getItem('passwd'));
            
            // envia datos al servidor para ver si el usuario esta vigente
            var datosActualizados = new FormData();
            datosActualizados.append('usuario', window.localStorage.getItem('usuario'));
            datosActualizados.append('contrasena', window.localStorage.getItem('passwd'));
            console.log("datosActualizados");
            console.log(datosActualizados);

            this.autenticar_svr(datosActualizados);
            
        } else {
            console.log("no localstorage");
        }
    },

    render:function () {
        console.log('render de loginView');
                
        this.$el.html(this.template());
        return this;
    },

    events: {
        "submit #login-form": "datos_formulario"
    },
    
    datos_formulario: function (event) {
        console.log("datos formulario");
        var datosFormulario = $("#login-form").serializeObject();
        console.log(datosFormulario);
        
        // datos para enviar
        var datosComprobar = new FormData();
        datosComprobar.append('usuario', datosFormulario['usuario']);
        datosComprobar.append('contrasena', md5('pella'+datosFormulario['clave']));
        console.log("datosComprobar");
        console.log(datosComprobar);
        
        this.autenticar_svr(datosComprobar);
        
        return false;
    },
    
    autenticar_svr: function (datosAcceso) {
        // limpiamos el localStorage
        window.localStorage.clear();
        
        $.ajax({
            url: 'http://test.mepwebs.com/app_authuser',
            //url: 'http://localhost/fuerteagenda_cms/app_authuser',
            data: datosAcceso,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST',
            success: function(data){
                console.log('success');
                console.log(data);
                console.log(data.valid);
                // si encuentra un usuario id_user=NUM, el usuario puede estar vigente o no (al corriente del pago)
                // si está vigente valid=1 , si no está vigente valid=0
                // si no encuentra usuario devuelve valid=0 y id_user=0
                console.log("historial: "+window.historial);
                // data.valid solo funciona desde servidor (devuelve objeto)
                if(data.valid != 0) {
                    // usuario válido
                    console.log("usuario válido");
                    // guardamos en localStorage
                    window.localStorage.setItem('id_user', data.id_user);
                    window.localStorage.setItem('valid', data.valid);
                    window.localStorage.setItem('usuario', data.email);
                    window.localStorage.setItem('passwd', data.passwd);
                    // redireccionamos a inicio
                    Backbone.history.navigate('inicio', {trigger: true});
                } else {
                    window.localStorage.setItem('id_user', 0);
                    // usuario no vigente o incorrecto
                    if(data.id_user!=0){
                        alert("El usuario está caducado, póngase en contacto con nosotros para renovar su usuario en info@pelladeocio.com");
                    } else {
                        alert("Usuario o contraseña incorrecta");
                    }
                }
                
                
                
            },
            error: function(data){
                console.log("error");
                console.log(data);
            }
        });
        
    }
   
});