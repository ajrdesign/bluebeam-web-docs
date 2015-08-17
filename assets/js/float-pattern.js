$(document).ready(function() {

  $('input').each(function() {

    $(this).on('focus', function() {
      $(this).parent('.float-pattern').addClass('active');
    });

    $(this).on('blur', function() {
      if ($(this).val().length == 0) {
        $(this).parent('.float-pattern').removeClass('active');
      }
    });

    if ($(this).val() != '') $(this).parent('.float-pattern').addClass('active');

  });

});