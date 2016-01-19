// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {
    
    //Backbone.emulateHTTP = true;

    LoginView.prototype.template = Handlebars.compile($("#login-tpl").html());
    
    HomeView.prototype.template = Handlebars.compile($("#home-tpl").html());
    EventoListItemView.prototype.template = Handlebars.compile($("#eventos-list-tpl").html());
    
    NuevoEventoView.prototype.template = Handlebars.compile($("#nuevo-evento-tpl").html());
    EditEventoView.prototype.template = Handlebars.compile($("#edit-evento-tpl").html());
    
    EditPerfilView.prototype.template = Handlebars.compile($("#edit-perfil-tpl").html());

    /* ---------------------------------- Local Variables ---------------------------------- */
    var slider = new PageSlider($('body'));
    
    window.historial = ["inicio"];
    //window.auth_id_user = "2";

    var homeView;
    var localesView;
    var localDetailsView;

    var AppRouter = Backbone.Router.extend({

        routes: {
            "":                     "login",
            "inicio":               "home",
            "categ/:id_cat":        "categoria",
            "zona/:id_ciudad":      "ciudad",
            "eventoadd":            "evento_add",
            "eventoedit/:id_evento":"evento_edit",
            "perfiledit":           "perfil_edit"
        },
        
        login: function () {
            // vinculamos la coleccion this.eventosUser a la vista
            slider.slidePage(new LoginView().render().$el);
        },

        home: function () {
            // Since the home view never changes, we instantiate it and render it only once
            if (!homeView) {
                this.eventosList = new EventoCollection();
                this.userModel = new Eventor({id_user: window.localStorage.getItem('id_user')});
                this.userModel.fetch();
                console.log("userModel");
                console.log(this.userModel);
                
                
                // para acceder a this dentro del done()
                 var guardaThis = this;
                
                this.eventosList.fetch().done( function() {
                        console.log("antes del fetch");
                        // filtra los eventos del user (para ponerlos en el model)
                        //guardaThis.eventosUser = new EventoCollection( guardaThis.eventosList.where({id_user: "1"}) );
                        guardaThis.eventosUser = new EventoCollection( guardaThis.eventosList.where({id_user: window.localStorage.getItem('id_user')}) );
                        

                       
                    
                        console.log("collection en app");
                        console.log( guardaThis.eventosUser );
                        //console.log( JSON.stringify(guardaThis.eventosUser) );
                    
                        homeView = new HomeView({collection: guardaThis.eventosUser});
                        homeView.render();
                        slider.slidePage(homeView.$el);
                  });
                
                
                
            } else {
                console.log('reusing home view');
                homeView.delegateEvents(); // delegate events when the view is recycled
                slider.slidePage(homeView.$el);
            }
            
        },
        
        categoria: function (id_cat) {
            
            homeView.categoria = id_cat;
            
            console.log('categ: '+homeView.categoria);
            console.log('ciudad: '+homeView.ciudad);
            
            
            if (homeView.categoria == 0) {
                if( homeView.ciudad != 0 ) {
                    // filtra solo x por ciudad
                    this.eventosCateg = new EventoCollection(this.eventosUser.where({id_ciudad: homeView.ciudad}));
                } else {
                    // coge todas las categorías, vuelve a mostrar la lista inicial
                    this.eventosCateg = this.eventosUser;
                }
            } else {
                if( homeView.ciudad != 0 ) {
                    // filtra x categoria y x ciudad
                    this.eventosCateg = new EventoCollection(this.eventosUser.where({id_categoria: homeView.categoria, id_ciudad: homeView.ciudad}));
                } else {
                    // filtra solo x categoria
                    this.eventosCateg = new EventoCollection(this.eventosUser.where({id_categoria: homeView.categoria}));
                }
            }
            
            console.log("imprime listacategoria");
            console.log(this.eventosCateg);
            //console.log(JSON.stringify(this.eventosCateg));
            
            homeView.collection = this.eventosCateg;
            homeView.render();
        },
        
        ciudad: function (id_ciudad) {
            
            homeView.ciudad = id_ciudad;
            
            console.log('categ: '+homeView.categoria);
            console.log('ciudad: '+homeView.ciudad);
            
            if (homeView.categoria == 0) {
                if( homeView.ciudad != 0 ) {
                    // filtra solo x por ciudad
                    this.eventosCiudad = new EventoCollection(this.eventosUser.where({id_ciudad: homeView.ciudad}));
                } else {
                    // coge todas las categorías, vuelve a mostrar la lista inicial
                    this.eventosCiudad = this.eventosUser;
                }
            } else {
                if( homeView.ciudad != 0 ) {
                    // filtra x categoria y x ciudad
                    this.eventosCiudad = new EventoCollection(this.eventosUser.where({id_categoria: homeView.categoria, id_ciudad: homeView.ciudad}));
                } else {
                    // filtra solo x categoria
                    this.eventosCiudad = new EventoCollection(this.eventosUser.where({id_categoria: homeView.categoria}));
                }
            }
            
            console.log("imprime listaciudad");
            console.log(this.eventosCiudad);
            //console.log(JSON.stringify(this.eventosCateg));
            
            homeView.collection = this.eventosCiudad;
            homeView.render();
        },
        
        evento_add: function () {
            // reiniciamos scroll
            $("html,body").scrollTop(0);
            
            console.log('user model al llamar eventoadd');
            console.log(this.userModel);
            
            // vinculamos la coleccion this.eventosUser a la vista
            //slider.slidePage(new NuevoEventoView(options, user_model).render().$el);
            slider.slidePage(new NuevoEventoView({collection: this.eventosUser}, this.userModel).render().$el);
            
            // para que el mapa se vea más de una vez
            google.maps.event.trigger(window.map, 'resize');
            window.map.setCenter(window.mapOptions.center);
        },
        
        evento_edit: function (id_evento) {
            // reiniciamos scroll
            $("html,body").scrollTop(0);
            
            // coge el evento de la coleccion del HOME
            this.eventoEdit = this.eventosUser.get(id_evento);
            
            // vinculamos la coleccion this.eventosUser a la vista
            slider.slidePage(new EditEventoView({collection: this.eventosUser, model: this.eventoEdit}).render().$el);
            
            // para que el mapa se vea más de una vez
            google.maps.event.trigger(window.map, 'resize');
            window.map.setCenter(window.mapOptions.center);
        },
        
        perfil_edit: function () {
            // reiniciamos scroll
            $("html,body").scrollTop(0);
            
            // pasamos el modelo Eventor a la vista
            slider.slidePage(new EditPerfilView({model: this.userModel}).render().$el);
            
            // para que el mapa se vea más de una vez
            google.maps.event.trigger(window.map, 'resize');
            //window.map.setCenter(window.mapOptions.center);
            window.map.setOptions(window.mapOptions);
        }
        
        
    });

    
    console.log("window.historial: "+window.historial);
    var router = new AppRouter();
    
    Backbone.history.start();

    /* --------------------------------- Event Registration -------------------------------- */

    $(document).ready( function() { console.log("document ready"); });
    
    document.addEventListener("deviceready", onDeviceReady, false);
    
    // PhoneGap esta listo y ahora ya se pueden hacer llamadas a PhoneGap
    function onDeviceReady() {
        console.log('onDeviceReady se ejecutó');
        console.log(navigator);
        
        // eliminar delay 300ms
        FastClick.attach(document.body);
        
        if (navigator.notification) { // Override default HTML alert with native dialog
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "Pella de Ocio", // title
                    'OK'        // buttonName
                );
            };
            
        }
        
        // Now safe to use device APIs
        document.addEventListener("backbutton", onBackKeyDown, false);
        
        // ocultar pantalla presentacion 
        setTimeout(function() {
            navigator.splashscreen.hide();
            console.log( 'esconde splashscreen' );
        }, 2000);
        
    };
    
    function onBackKeyDown() {
        console.log("length del historial: "+window.historial.length);
        // si está en home, sale de la app
        if(window.historial.length == 1) {
            console.log("sale de la app");
            navigator.app.exitApp();
        } else {
            console.log("boton atras - no sale de la app");
            console.log(window.historial);
        }
        
        // vuelve al home
        // reinicia historial
        window.historial = ["inicio"];
        Backbone.history.navigate('inicio', {trigger: true});
    };
    

    /* ---------------------------------- Local Functions ---------------------------------- */

}());