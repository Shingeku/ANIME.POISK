const base_url = "https://api.jikan.moe/v3";

function searchAnime(event){

    event.preventDefault();
    const form = new FormData(this);
    const query = form.get("search");



    fetch(`${base_url}/search/anime?q=${query}&page=1`)
    .then(res=>res.json())
    .then(updateDom)
    .catch(err=>console.warn(err.message));

}

window.onload = function () {
    window.setTimeout(function () {
        document.body.classList.add('loaded');
        document.body.classList.remove('loaded_hiding');
    }, 1000);
}


function updateDom(data){
    const spinner = document.getElementById("spinner");
    const searchResults = document.getElementById('search-results');
    const animeByCategories = data.results
        .reduce((acc, anime)=>{
            const {type} = anime;
            if(acc[type] === undefined) acc[type] = [];
            acc[type].push(anime);
            return acc;
        }, {});

        searchResults.innerHTML = Object.keys(animeByCategories).map(key=>{
            spinner.style.display = "inline";
            const animesHTML = animeByCategories[key]
            .map(anime=>{
                return `
                    <div class="card">
                        <div class="card-image">
                            <img src="${anime.image_url}">
                        </div>
                        <div class="card-content">
                            <span class="card-title">${anime.title}</span>
                            <p>${anime.synopsis}</p>
                        </div>
                        <div class="card-action">
                            <a href="${anime.url}">Узнать больше</a>
                        </div>
                    </div>
                `
            }).join("");

            spinner.style.display = "none";
            return `
                <section>
                    <h3>${key.toUpperCase()}</h3>
                    <div class="shingeki-row">${animesHTML}</div>
                </section>
            `
        }).join("");

}

function pageLoaded(){
    const form = document.getElementById('search_form');
    form.addEventListener("submit", searchAnime);
}


window.addEventListener("load", pageLoaded);