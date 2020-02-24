$('.ui.accordion').accordion();

$('.ui.checkbox').checkbox();

$('.ui.modal').modal({
    closable: false
});

$('#proposalBtn').on('click', function(data) {
    $('.ui.modal').modal('show');
});

// form validation

$('.ui.form').form({

    fields: {
        
    }
});