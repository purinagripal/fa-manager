// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {
    
    //Backbone.emulateHTTP = true;

    HomeView.prototype.template = Handlebars.compile($("#home-tpl").html());
    EventoListItemView.prototype.template = Handlebars.compile($("#eventos-list-tpl").html());
    EventoView.prototype.template = Handlebars.compile($("#evento-tpl").html());
    
    LocalesView.prototype.template = Handlebars.compile($("#locales-tpl").html());
    LocalView.prototype.template = Handlebars.compile($("#local-tpl").html());
    LocalDetailsView.prototype.template = Handlebars.compile($("#local-details-tpl").html());

    /* ---------------------------------- Local Variables ---------------------------------- */
    var slider = new PageSlider($('body'));
    
    window.historial = [""];

    var homeView;
    var localesView;
    var localDetailsView;

    var AppRouter = Backbone.Router.extend({

        routes: {
            "":                     "home",
            "categ/:id_cat":        "categoria",
            "zona/:id_ciudad":      "ciudad",
            "eventos/:id":          "eventoDetails"
        },

        home: function () {
            // Since the home view never changes, we instantiate it and render it only once
            if (!homeView) {
                this.eventosList = new EventoCollection();
                
                // para acceder a this dentro del done()
                 var guardaThis = this;
                
                /*this.eventosList.fetch({reset: true, 
                          success: function() {
                            console.log( 'fetch terminado, esconde splashscreen' );
                              console.log( JSON.stringify(guardaThis.eventosList) );
                            // ocultar pantalla presentacion 
                            setTimeout(function() {
                                navigator.splashscreen.hide();
                            }, 1500);
                          }
                });*/
                
               
                
                this.eventosList.fetch().done( function() {
                        console.log("antes del fetch");
                        // filtra los eventos del user (para ponerlos en el model)
                        guardaThis.eventosUser = new EventoCollection( guardaThis.eventosList.where({id_user: "1"}) );
                        

                        console.log( 'fetch done, esconde splashscreen' );
                        // ocultar pantalla presentacion 
                        setTimeout(function() {
                            navigator.splashscreen.hide();
                        }, 1500);
                    
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
            
            homeView.model = this.eventosCateg;
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
            
            homeView.model = this.eventosCiudad;
            homeView.render();
        },

        eventoDetails: function (id) {
            //var employee = new Evento({id: id});
            // coge el evento de la coleccion del HOME
            this.evento = this.eventosUser.get(id);

            $("html,body").scrollTop(0);
            slider.slidePage(new EventoView({model: this.evento}).render().$el);
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
            
             window.confirm = function (message) {
                navigator.notification.confirm(
                    message,    // message
                    null,       // callback
                    "Pella de Ocio", // title
                    ['Sí', 'No']        // buttonName
                );
            };
        }
        
        // Now safe to use device APIs
        document.addEventListener("backbutton", onBackKeyDown, false);
        
        
        /*setTimeout(function() {
            navigator.splashscreen.hide();
        }, 5000);*/
    };
    
    function onBackKeyDown() {
        // vuelve al home
        // reinicia historial
        window.historial = [""];
        
        Backbone.history.navigate('', {trigger: true});
    };
    

    /* ---------------------------------- Local Functions ---------------------------------- */

}());