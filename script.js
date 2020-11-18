"use strict";

$(function(){
	
$('input[type="text"]').focus();

//This changes the placeholder value showing users
var inputPlaceholder = ["Bob Marley", "Michael Jackson", "Taylor Swift", "Conor Maynard", "Rolling Stones", "Drake", "Jay Z", "Ed Sheeran", "Maroon 5", "Travis Scott", "Bruno Mars", "Alicia Keys", "Celine Dion", "Adele", "Camila Cabello"];

setInterval(function() {
    $("input[type='text']").attr("placeholder", inputPlaceholder[inputPlaceholder.push(inputPlaceholder.shift())-1]);
}, 3000);

var $searchField = $('#query');
var $submitBtn = $('#submit');
let authToken = ''
$submitBtn.val("Get songs");

//Search for albums and tracks
const spotifySearch = (authToken, searchedTerm) => {
  fetch(`https://api.spotify.com/v1/search?q=${searchedTerm}&type=album,track`,
  {
  headers: {
    'Authorization': 'Bearer ' + authToken
  }
  })

    .then(response => response.json())
    .then((responseJson) => { 
    $( "ul" ).empty()
    console.log('Response JSON', responseJson)

    renderAlbums(responseJson.albums.items)
    
    
    })
    .catch(function(error) {
        console.log(error);
    })
}

let client_id = '8f10fa8af1aa40c6b52073811460bf33'
let client_secret = '27a7c01912444b409a7f9a6d1f700868'
let ah = btoa(client_id + ":" + client_secret)

//To get the initial access token & when it renews to a different one
const getAuthToken = (searchedTerm) => {
fetch(`https://accounts.spotify.com/api/token`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${ah}`
        },
        body: $.param({
          grant_type: "client_credentials"
        }),
      }
    )

  .then((response) => response.json())
  .then(function(response) { 
    authToken = response.access_token;
    spotifySearch(response.access_token, searchedTerm);  
  })
}

$('#search-term').submit((e) => {
    e.preventDefault();
    let searchedTerm = $('#query').val()
    getAuthToken(searchedTerm)
})

//To get Albums 
const getAlbums = (albumIds) => {
  fetch(
    `https://api.spotify.com/v1/albums?ids=${albumIds.join(',')}&type=album`,
  {
    headers: {
    'Authorization': 'Bearer ' + authToken
    },
    method : "GET"
  }
  )
    
   .then((response) => response.json())
   .then((response) => {     
    renderAlbums(response.albums);   
    })
}

//To display results
function renderAlbums(albums){
  console.log(albums);
  $("div#album").removeClass("hide");
  //$( "ul" ).empty();
  albums.forEach(album => {
  $("div#album > ul").append(`
      <li>
        <h2>${album.name}</h2>
        <a href="${album.external_urls.spotify}" target="_blank">
          <img src="${album.images[0].url}">
        </a>
      </li>
    `);
  })
}

})
