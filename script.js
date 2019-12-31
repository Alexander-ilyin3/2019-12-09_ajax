let request = fetch('https://itunes.apple.com/search?entity=musicVideo&term=eminem')

// console.log(request)

let listOfResponces = []
let usefulList = []
let arrayOfProps = [
    'artistName', 
    'trackName', 
    'artistViewUrl',
    'trackViewUrl', 
    'artworkUrl100', //Картинка
    'trackPrice',
    'previewUrl',
]

request
.then( responce => responce.ok ? responce.json() : Promise.reject())
.then( responce => {
    
    listOfResponces = responce.results
    // console.log('The list - ', listOfResponces)

})
.then( () => {

    listOfResponces.forEach(track => {

        let usefulElement = new CarouselElement(track)

        usefulList.push(usefulElement)
    });
 
                                                            // console.log(usefulList)

    usefulList[0].makeLayout()

})
.then( () => {

                                                            console.log(listOfResponces)

    for (let i = 0; i < 15; i++) {

            carouselArea.insertAdjacentHTML(
                'beforeend',
                `${usefulList[i].makeLayout( usefulList[i], i )}`,
            )

        carouselIndicators.insertAdjacentHTML(
            'beforeend',
            `
                <li data-target="#myCarousel"
                    ${!i ? 'class="active"': ''}
                    data-slide-to="${i}"
                >
                </li>
            `,
        )
    }
    currentVideo = document.querySelector('.active video');
})
.catch( err => console.error(err) )

function CarouselElement(object) {

    for( key in arrayOfProps ) {
        this[arrayOfProps[key]] = object[arrayOfProps[key]]
    }

    this.makeLayout = function (item, i) {
        
        let activeStr = ''
        if (i === 0) activeStr = 'active'

        let layout =  `
        <div class="item ${activeStr}">
            <div class="background"> </div>   
                <div class="carousel-caption">
                    <video src="${this.previewUrl}"> </video>
                    <h3> <a href="${this.artistViewUrl}" target="blank"> ${this.artistName}</a> </h3>
                    <p> <a href="${this.trackViewUrl}" target="blank"> ${this.trackName}</a> </p>
                    <p> Price - ${'$' + this.trackPrice || 'Free'} <a href="${this.trackViewUrl}" target="blank">(Buy)</a></p>
                </div>
        </div>
        `
            return layout
    }
}

let carouselArea = document.querySelector('#myCarousel .carousel-inner')
let carouselIndicators = document.querySelector('.carousel-indicators')

$('#myCarousel').carousel({
    interval: false,
    // pause: 'hover',
  });

let currentVideo;
let isNowPlay = false;
const toggleButton = document.querySelector('#toggle-button');
toggleButton.innerHTML = '|>'
toggleButton.addEventListener('click', togglePlay);

$('#myCarousel').on('slid.bs.carousel', function (e) {
    currentVideo = document.querySelector('.active video');
    play();
});
$('#myCarousel').on('slide.bs.carousel', function (e) {
    currentVideo = document.querySelector('.active video');
    pause();
});


function play() {
    currentVideo.play();
    isNowPlay = true;
    toggleButton.innerHTML = '||';
}
function pause() {
    currentVideo.pause();
    isNowPlay = false;
    toggleButton.innerHTML = '|>';
}
function togglePlay() {
    isNowPlay ? pause() : play();
}

document.addEventListener('mouseover', (event) => {
    if (event.target === currentVideo || event.target === toggleButton) toggleButton.classList = 'active-btn'
    else toggleButton.classList = ''
})