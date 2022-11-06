

$('#pills-completed').on('click', function(e){
    e.preventDefault();
    $('#sch-title').hide();
    $('#com-title').show();
    $('#result').show();
  });
$('#pills-scheduled').on('click', function(e){
    e.preventDefault();
    $('#sch-title').show();
    $('#com-title').hide();
    $('#result').hide();
  });