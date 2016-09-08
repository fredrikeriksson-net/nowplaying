var nowPlaying = new XMLHttpRequest();
nowPlaying.addEventListener("load", nowPlayingFunction);
nowPlaying.open("GET", "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=kaptenfest&limit=5&api_key=179c2785e8e14bdd713ff9d48a394dc3&format=json");
nowPlaying.send();


function nowPlayingFunction() {

	if ((nowPlaying.readyState === 4) && (nowPlaying.status === 200)) {
		var playing = JSON.parse(nowPlaying.responseText);

		// Senaste spelade titel, artist och album med coverart
		var title = document.getElementById("title");
		title.innerHTML = playing.recenttracks.track[0].name;

		var artist = document.getElementById("artist");
		artist.innerHTML = playing.recenttracks.track[0].artist["#text"];
		artist.addEventListener("click", artistMore);

		var album = document.getElementById("album");
		album.innerHTML = playing.recenttracks.track[0].album["#text"];

		var coverArt = document.getElementById("coverArt");
		coverArt.innerHTML = "<img src='" + playing.recenttracks.track[0].image[3]["#text"] + "'>";

		// 5 senaste spelade låtarna
		for (var i = 1; i < 5; i++) {

			var recentTracks = document.getElementById("recentTracks");

			var artistTitleList = document.createElement("li");
			recentTracks.appendChild(artistTitleList);

			var artistTitle = document.createElement("p");
			artistTitleList.appendChild(artistTitle);

			// Artist och titel
			artistTitle.innerHTML = playing.recenttracks.track[i].artist['#text'] + " - " + playing.recenttracks.track[i].name;

			var recentAlbum = document.createElement("p")
			artistTitleList.appendChild(recentAlbum);

			// Album
			recentAlbum.innerHTML = playing.recenttracks.track[i].album["#text"];
		}
	}
}

// Artistinfo - Profile img, Name, Short bio, Tag, Similar Artists
var artistInfo = new XMLHttpRequest();
artistInfo.onreadystatechange = function () {

	if ((artistInfo.readyState === 4) && (artistInfo.status === 200)) {

		var summary = JSON.parse(artistInfo.responseText);

		// Profile img
		var artistImage = document.getElementById("artistImage");
		artistImage.innerHTML = "<img src='" + summary.artist.image[3]["#text"] + "'>";

		// Name
		var artistName = document.getElementById("artistHeader");
		artistName.innerHTML = summary.artist.name;

		// Short bio
		var artistSummary = document.getElementById("summary");
		artistSummary.innerHTML = summary.artist.bio.summary;

		// Tag
		var tag = document.getElementById("tag");
		tag.innerHTML = "<strong>File under:</strong> " + summary.artist.tags.tag[0].name;

		// Similar artists H3
		var similar = document.getElementById("similar");
		similar.innerHTML = "Similar Artists";

		// Similar artists (under top 5 albums)
		for (var y = 0; y < 5; y++) {
			var similarArtists = document.getElementById("similar" + y);
			similarArtists.innerHTML = summary.artist.similar.artist[y].name;
		}

		// Visible -> Artistinfo
		document.getElementById("searchArtist").className = "visible";
		document.getElementById("searchButton").className = "visible";
	}
}

// Top 5 albums - Cover, Top 5
var artistTopAlbums = new XMLHttpRequest();
artistTopAlbums.onreadystatechange = function () {

	if ((artistTopAlbums.readyState === 4) && (artistTopAlbums.status === 200)) {

		var topAlbums = JSON.parse(artistTopAlbums.responseText);

		// Top 5 Albums H3
		var topAlbumsHeader = document.getElementById("topAlbumsHeader");
		topAlbumsHeader.innerHTML = "Top 5 albums";

		// Top 5 Albums - Cover, Top 5
		for (var i = 0; i < 5; i++) {
			var topAlbumsList = document.getElementById("album" + i);
			topAlbumsList.innerHTML = "<img src='" + topAlbums.topalbums.album[i].image[0]["#text"] + "'>" + topAlbums.topalbums.album[i].name;
		}
	}
}


// More Artistinfo
function artistMore() {
  
  document.getElementById("artistInfo").className = "visible";

	if (!searchArtist.value) {

		// Arist name save for open
		var getArtistName = document.getElementById("artist");
		var saveArtist = artist.innerHTML;

		// From Artistname
		artistInfo.open("GET", "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + saveArtist + "&api_key=179c2785e8e14bdd713ff9d48a394dc3&format=json");
		artistTopAlbums.open("GET", "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" + saveArtist + "&api_key=179c2785e8e14bdd713ff9d48a394dc3&format=json");

		artistInfo.send();
		artistTopAlbums.send();
	} 
	
	else {

		// From input
		artistInfo.open("GET", "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + searchArtist.value + "&api_key=179c2785e8e14bdd713ff9d48a394dc3&format=json");
		artistTopAlbums.open("GET", "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" + searchArtist.value + "&api_key=179c2785e8e14bdd713ff9d48a394dc3&format=json");

		artistInfo.send();
		artistTopAlbums.send();

		// Reset after search
		searchArtist.value = "";
	}
}