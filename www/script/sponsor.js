
window.onunload = function(){};

$('.ui.accordion').accordion();

$('.ui.checkbox').checkbox();



// form validation

$('.ui.form').form({

    fields: {
        title                   :   'empty',
        organization            :   'empty',
        primary_contact         :   'empty',
        contact_email           :   'empty',
        contact_phone           :   'empty',
        background_info         :   'empty',
        project_description     :   'empty',
        project_scope           :   'empty',
        project_challenges      :   'empty',
        constraints_assumptions :   'empty',
        sponsor_deliverables    :   'empty',
        sponsor_avail_checked   :   'checked',
        project_agreements_checked :'checked',
        assignment_of_rights    :   'checked'
    }
});
