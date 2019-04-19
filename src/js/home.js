//Ejemplo Promesas usando Fetch
fetch('https://randomuser.me/api')
  .then(function (response) {
    return response.json()  
  })
  .then(function(user){
    console.log('user: ', user)
  })
  .catch(function(){
    console.log('something was wrong, sorry')
  });

//Funciones asincronas usando Async await
//Sugar sintax: IIFE => immediately invoked function expression
 (async function load(){

  async function getData(url){
    const response = await fetch(url);
    const data = await response.json();
    return data; 
  }
    const actionList = await getData('https://yts.am/api/v2/list_movies.json?genre=action');
    const dramaList = await getData('https://yts.am/api/v2/list_movies.json?genre=drama');
    const animationList = await getData('https://yts.am/api/v2/list_movies.json?genre=animation');
   console.log('Action:', actionList, 'Drama: ', dramaList, 'Animation: ', animationList)
   console.log(actionList.data.movies)

  //  const movies = actionList.data.movies
   

  const $actionContainer = document.querySelector('#action');
  const $dramaContainer = document.getElementById('drama');
  const $animationContainer = document.getElementById('animation');


  const $featuringContainer = document.getElementById('featuring');
  const $form = document.getElementById('form');
  const $home = document.getElementById('home');


  // const $home = $('.home .list #item');
  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal');

  const $modalTitle = $modal.querySelector('h1');
  const $modalImage = $modal.querySelector('img');
  const $modalDescription = $modal.querySelector('p');
  const $modalTrailerBtn = $modal.querySelector('#watch-trailer');

  function videoItemTemplate(movie) {
    return (
      `<div class="primaryPlaylistItem" data-id="${movie.id}">
        <div class="primaryPlaylistItem-image">
          <img class="primary-image" src="${movie.medium_cover_image}" data-title="${movie.title}" data-description="${movie.description_full}" data-img="${movie.medium_cover_image}" data-trailer="${movie.yt_trailer_code}">
        </div>
        <h4 class="primaryPlaylistItem-title">
          ${movie.title}
        </h4>
      </div>`
    )
  }

  //Escucha los clicks en todo el documento y busca el match con la clase
  document.addEventListener("click", function(event){
    if (event.target.classList.contains("primary-image")){
        console.log(event.target.dataset)
        const elementData = event.target.dataset
       showModal(elementData)
    }
  }, false);

  function renderMoveList(list, $container){
    if($container.children.length > 0 ){
      $container.children[0].remove();      
    }       
    const movies = list.data.movies    
    for (let movie of movies){     //Usando ciclo for of de ES6 
      $container.innerHTML += videoItemTemplate(movie);       
    }
  }

  renderMoveList(actionList, $actionContainer);
  renderMoveList(dramaList, $dramaContainer);
  renderMoveList(animationList, $animationContainer);

  function setAtrributes($element, atrributes){
    for(const attribute in atrributes){
      $element.setAttribute(attribute, atrributes[attribute])      
    }
  }

  const featuringTemplate = (pelicula) => {
    return(
      ` <div class="featuring">
          <div class="featuring-image">
            <img src="${pelicula.medium_cover_image}" width="70" height="100" alt="">
          </div>
          <div class="featuring-content">
            <p class="featuring-title">Pelicula encontrada</p>
            <p class="featuring-album">${pelicula.title}</p>
          </div>
        </div>`
    )
  }
  $form.addEventListener('submit', async (event) =>{
    event.preventDefault();
    $home.classList.add('search-active')
    const $loader = document.createElement('img');
    setAtrributes($loader, {
      src: 'src/images/loader.gif',
      height: 50,
      width: 50,
    })
    $featuringContainer.append($loader);

    const data = new FormData($form); // Obtener datos del formulario
    const pelicula = await getData(`https://yts.am/api/v2/list_movies.json?limit=1&query_term=${data.get('name')}`)    
    const HTMLString = featuringTemplate(pelicula.data.movies[0]); 
    $featuringContainer.innerHTML = HTMLString;
    
  })

   const showModal = (elemnt) =>{   
    const { title, img, description, trailer } = elemnt
    $overlay.classList.add('active');
    $modal.style.animation = 'modalIn .8s forwards';
    $modalTitle.textContent = title;
    $modalImage.setAttribute('src', img) 
    $modalDescription.textContent = description;  
    // $modalTrailerBtn.setAttribute("href", "https://www.w3schools.com");   
    $modalTrailerBtn.setAttribute('href', `https://www.youtube.com/embed/${trailer}?rel=0&wmode=transparent&border=0&autoplay=1&iv_load_policy=3`)    

  }

  $hideModal.addEventListener('click', hideModal)

  function hideModal(){
    $overlay.classList.remove('active');
    $modal.style.animation = 'modalOut .3s forwards';
  }


 
  
 })()

  