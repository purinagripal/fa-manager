var EventoListItemView = Backbone.View.extend({

    render:function () {
        /*console.log('evento-model');
        console.log(JSON.stringify(this.model));*/
        $(this.el).html(this.template(this.model.toJSON()));
        return this; // enable chained calls
    }
    
    /*events: {
        "click .cuadro": "ver_evento"
    },
    
    ver_evento: function (event) {
        var id_evento = $(event.currentTarget).attr('data-id'); 
        console.log("ver evento "+id_evento);
        //console.log(event);
        Backbone.history.navigate('eventos/'+id_evento, {trigger: true});
    }*/

    
});