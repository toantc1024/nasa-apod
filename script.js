const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const apiKey = "dby5fP69A9bbIljEEH48T6QjwcM8SCkbOGeTRj4i";
const count = 10;
// const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;
// const apiUrl = `./template.json`;

let resultsArray = [];
let favorites = {};
let page = 'results';

const createDOMNodes = (page) => {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    currentArray.forEach((result) => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === "results") {
            saveText.textContent = "Add to Favorites";
            saveText.addEventListener('click', () => {
                saveFavorite(result);
            });
        } else {
            saveText.textContent = "Remove Favorite";
            saveText.addEventListener('click', () => {
                removeFavorite(result);
            })
        }
        // Card Text
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;
        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright Info
        const copyRightResult = result.copyright === undefined ? "" : result.copyright;
        const copyRight = document.createElement('span');
        copyRight.textContent =` ${copyRightResult}`;
        // Combine everything together
        footer.append(date, copyRight);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}

const showContent = (page) => {
    loader.classList.add('hidden');
    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else {
        favoritesNav.classList.remove('hidden');
        resultsNav.classList.add('hidden');
    }
    window.scrollTo({top: 0, behavior: 'instant'})
}

const updateDOM = (page) => {
    // Resewt DOM, Show Loader
    imagesContainer.textContent = '';
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    createDOMNodes(page);
    showContent(page);
}

// Get 10 Images from NASA API
const getNasaPictures = async () => {
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM('results');
    } catch (error) {
        // Catch Error Here
    }
}

getNasaPictures();
// Event listeners


// Add result to Favorites
const saveFavorite = (item) => {
    if(favorites[item.url] === undefined) {
        favorites[item.url] = item;
        // Appear save confirmed for two seconds
        saveConfirmed.hidden = false;
        setTimeout(() => {
            saveConfirmed.hidden = true;
        }, 2000);
        // Set Favorites in localStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    }
}

// Remove item from Favorites
const removeFavorite = (item) => {
    if(favorites[item.url]) {
        delete favorites[item.url];
        // Set Favorites in localStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}
