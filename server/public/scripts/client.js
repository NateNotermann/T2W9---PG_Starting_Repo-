$(document).ready(onReady);

function onReady() {
    getSongs();
    $('#add').on('click', postSong);
    $('#songsTableBody').on('click', '.btn-delete', deleteSong);
    $('#songsTableBody').on('click', '.btn-rank', voteOnSong);
}

// get artist data from the server
function getSongs() {
    $("#songsTableBody").empty();
    $.ajax({
        type: 'GET',
        url: '/songs'
    }).then(function (response) {
        console.log("GET /songs response", response);
        // append data to the DOM
        for (let i = 0; i < response.length; i++) {
            console.log('response is:', response[i]);
            $('#songsTableBody').append(`
                <tr>
                    <td>${response[i].artist}</td>
                    <td>${response[i].track}</td>
                    <td>${response[i].rank}</td>
                    <td>${response[i].published}</td>
                    <td>
                    <button
                    data-id = ${response[i].id}
                    data-direction="up"
                    class="btn-rank"
                    >👍</button>
                    <button
                    data-id=${response[i].id}
                    data-direction="down"
                    class="btn-rank"
                    >💩<button>
                      <button 
                        data-id=${response[i].id}
                        class="btn-delete"
                      >Delete</button>
                    </td>
                </tr>
            `);
        }
    });
}

function postSong() {
    let payloadObject = {
        artist: $('#artist').val(),
        track: $('#track').val(),
        rank: $('#rank').val(),
        published: $('#published').val()
    }
    $.ajax({
        type: 'POST',
        url: '/songs',
        data: payloadObject
    }).then( function (response) {
        $('#artist').val(''),
        $('#track').val(''),
        $('#rank').val(''),
        $('#published').val('')
        getSongs();
    });
}

function deleteSong() {
    let songId = $(this).data('id');
    $.ajax({
        method: 'DELETE',
        url: `/songs/${songId}`
    })
    .then(function(response) {
        console.log('It is gone!');
        getSongs();
    })
    .catch(function(error) {
        alert('Error deleting:', error);
    });
}

function voteOnSong () { 
    let songId = $(this).data('id');
    let voteDirection = $(this).data('direction');

    $.ajax({
        method: 'PUT',
        url: `/songs/rank/${songId}`,
        data: { direction: voteDirection }
    })
    .then(function(){
        getSongs();
    })
    .catch(function(error){
        alert('ERRRRRRRORRRRRR on vote:', error);
    })
}

// thingIn = true;
// function checkThingIn (thingIn)
// if ( thingIn === 'false' ){
//     console.log( 'string of false');
//     // if you want a string, run code here to do the next thing
// } else if ( thingIn === false ) {
//     console.log( 'boolean of false' );
//       // if you want a false boolean, run code here to do the next thing
// } else if ( thingIn === true ) {
//     console.log( 'boolean of true' );
// } else if ( thingIn === 'true' ){
//     console.log( 'string of true');
// }
// test commit