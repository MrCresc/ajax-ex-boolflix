// Rendo disponibili le funzionalità al solo caricamento completo del documento
$(document).ready(function() {
  // Al click sul logo in alto a sinistra eseguo il reload della pagina
  $('#logo').click(function() {
    location.reload();
  });
  // Applico le funzioni al click del tasto cerca
  $('#searchButton').click(function () {
    var valQuery = $('#searchInput').val()
    // Applico una condizione che esegue le funzioni solo se il campo non è vuoto
    if (valQuery != '') {
      ajaxCall(valQuery)
      $('#mainWrapper').removeClass('hidden')
      $('#error').addClass('hidden')
    // Altrimenti eseguo il messaggio d'errore
    } else {
      $('#mainWrapper').addClass('hidden')
      $('.object').remove()
      $('#error').removeClass('hidden')
    }
  })

  // Aggiungo funzionalità al click del tasto invio sulla tastiera
  $('#searchInput').keypress(
    function (event) {
      if (event.which === 13) {
        var valQuery = $('#searchInput').val()
        // Applico una condizione che esegue le funzioni solo se il campo non è vuoto
        if (valQuery != '') {
          ajaxCall(valQuery)
          $('#mainWrapper').removeClass('hidden')
          $('#error').addClass('hidden')
        // Altrimenti eseguo il messaggio d'errore
        } else {
          $('#mainWrapper').addClass('hidden')
          $('.object').remove()
          $('#error').removeClass('hidden')
        }
      }
    }
  )

  // Al mouse enter della copertina mostro le informazioni nascoste
  $(document).on('mouseenter','.object',function () {
    $(this).find('.popup_info').fadeIn(100).removeClass('hidden').css("display", "flex")
  })

  // Al mouse leave della copertina nascondo le informazioni
  $(document).on('mouseleave','.object',function () {
    $(this).find('.popup_info').fadeOut(100)
  })

  // Al click di un titolo mostro il collegamento alla pagina di TMDB
  $(document).on('click','.object',function () {
    var type = $(this).attr('typeObject')
    var id = $(this).attr('idObject')
    window.open('https://www.themoviedb.org/' + type + '/' + id + '/' + '?language=it-IT');
  })

  function ajaxCall(valQuery) {
    $.ajax(
      {
        url: 'https://api.themoviedb.org/3/search/movie',
        method: 'GET',
        data: {
          api_key: '963cb474d673e5002daba73431170dc1',
          query: valQuery,
          language: 'it-IT'
        },
        success: function(dataMovies) {
          moviesContainer = $('.moviesContainer').html('')
          if (dataMovies.total_results > 0) {
            printObject(dataMovies.results,moviesContainer,'movie')
          } else {
            var messaggio = 'Non ci sono film corrispondenti'
            $('.moviesContainer').append(messaggio)
          }
          $('#searchInput').val('')
          $('#moviesCounter').html('').append('Movies (' + dataMovies.total_results + ')')
        },
        error: function () {
          alert('Attenzione si è verificato un errore')
        }
      },
      $.ajax(
        {
          url: 'https://api.themoviedb.org/3/search/tv',
          method: 'GET',
          data: {
            api_key: '963cb474d673e5002daba73431170dc1',
            query: valQuery,
            language: 'it-IT'
          },
          success: function(dataTvs) {
            tvsContainer = $('.tvsContainer').html('')
            if (dataTvs.total_results > 0) {
              printObject(dataTvs.results,tvsContainer,'tv')
            } else {
              var messaggio = 'Non ci sono serie Tv corrispondenti'
              $('.tvsContainer').append(messaggio)
            }
            $('#searchInput').val('')
            $('#tvsCounter').html('').append('Serie TV (' + dataTvs.total_results + ')')
          },
          error: function () {
            alert('Attenzione si è verificato un errore')
          }
        }
      )
    );
  }

  function printObject(array,container,type) {
     {
      var source = $('#entry-template').html()
      var template = Handlebars.compile(source);
      for (var i = 0; i < array.length; i++) {
        var singleObject = array[i]
        if (type === 'movie') {
         var title = singleObject.title
         var originalTitle = singleObject.original_title
        } else {
         var title = singleObject.name
         var originalTitle = singleObject.original_name
        }
        var context = {
          poster: posterPath(singleObject.poster_path),
          title: title,
          original_title: originalTitle,
          original_language: (singleObject.original_language).toUpperCase(),
          vote_average: star(singleObject.vote_average),
          langFlag: langFlag(singleObject.original_language),
          overview: singleObject.overview,
          type: type,
          id: singleObject.id
        }
        var html = template(context);
        container.append(html)

        getCast(type,singleObject.id)
      }
    }
  }

  // Funzione che esegue chiamata AJAX per reperire dati "credits"
  function getCast(type,id){
    $.ajax(
      {
        url: 'https://api.themoviedb.org/3/'+ type + '/' + id,
        method: 'GET',
        data: {
          api_key: '963cb474d673e5002daba73431170dc1',
          language: 'it-IT',
          append_to_response: 'credits'
        },
        success: function(dataObject) {
          printInfo(dataObject,id)
        },
        error: function () {
          alert('Attenzione si è verificato un errore')
        }
      }
    )
  }

  // Funzione che stampa i risultati prelevando quelli che servono dalla precedente chiamata AJAX
  function printInfo(data,id){
  var object = $('.object[idObject="'+ id +'"]');
  // Creo lista generi singolo film
  var genres = data.genres;
  var arrayGenres = [];
  // Se ci sono uno o più generi li mostro in fila
  if (genres.length > 0) {
    for (var i = 0; i < genres.length; i++) {
      arrayGenres += '&bull; ' + genres[i].name + '  ';
    }
  // In caso non siano disponibili generi, mostro la scritta "not available"
  } else {
    arrayGenres += 'Not Available'
  }


  // Creo lista primi 5 attori
  var castActors = data.credits.cast;
  var arrayActors = [];
  // Se sono tra 1 e 4 attori ne stampo la stessa quantità
  if (castActors.length > 0 && castActors.length < 5) {
    for (var i = 0; i < castActors.length; i++) {
      arrayActors += '- ' + castActors[i].name + '<br>';
    }
  // Se sono più di 5 attori ne stampo solo 5
  } else if (castActors.length >= 5) {
    for (var i = 0; i < 5; i++) {
      arrayActors += '- ' + castActors[i].name + '<br>';
    }
  // Se la lista attori è uguale a 0 mostro la dicitura "not available"
  } else {
    arrayActors += 'Not Available'
  }

  // Imposto Handlebars
  var source = $('#genres-actors-template').html()
  var template = Handlebars.compile(source);

  // Imposto il context
  var context = {
    genres: arrayGenres,
    actors: arrayActors
  };
  var html = template(context);
  // Appendo il risultato creando altri due list item nella ul pre esistente
  $(object).find('ul').append(html);
}

  // Funzione che crea le stelle di recensione
  function star(vote) {
    var voteApprox = Math.ceil((vote/2))
    var starVote = ''
    for (var i = 1; i <= 5; i++) {
      if (i <= voteApprox) {
        starVote += '<i class="fas fa-star"></i>'
      } else {
        starVote += '<i class="far fa-star"></i>'
      }
    }
    return starVote
  }

  // Funzione che imposta il path delle copertine a seconda se siano disponibili o meno
  function posterPath(path) {
    var finalPath = 'img/noPoster.jpg'
    if (path != null) {
      var finalPath = 'https://image.tmdb.org/t/p/'+'w500'+path
    }
    return finalPath
  }

  // Funzione che crea le bandiere a seconda della lingua
  function langFlag(language) {
    var langArray = ['en','us','it','fr','de','es','pt','ja','ru','ro',
    'zh','ko','tr','id','cs','hi','sv','he','nl']
    var langFlagPath = 'img/noFlag.png'
    if (langArray.includes(language)) {
      langFlagPath = 'img/'+language+'.png'
    }
    return langFlagPath
  }
});
