const doc = {
    container: document.querySelector('.container'),
    location: document.querySelector('.location'),
    summary: document.querySelector('.summary'),
    temperature: document.querySelector('.temperature'),
    units: document.querySelector('.units')
}

navigator.geolocation.getCurrentPosition(position => {
    const cors = 'https://cors-anywhere.herokuapp.com/';
    const weatherURL = `${cors}https://api.darksky.net/forecast/9ecadba6d6242246d51ae370d3a01f9b/${position.coords.latitude},${position.coords.longitude}`;
    const locationURL = `${cors}https://locationiq.org/v1/reverse.php?format=json&key=95cdec4df95ab9&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
    getLocation(locationURL);
    getWeather(weatherURL);
});

function getLocation(endpoint) {
    fetch(endpoint)
        .then(blob => blob.json())
        .then(location => {
            console.dir(location);

            const a = location.address;
            doc.location.textContent = a.town || a.city_district || a.city || a.county || a.state || a.postcode || a.country;
        });
}

function getWeather(endpoint) {
    fetch(endpoint)
        .then(blob => blob.json())
        .then(weather => {
            doc.summary.textContent = `${weather.currently.summary}`;
            doc.temperature.textContent = `${fToC(weather.currently.temperature)}`;
            doc.units.innerHTML = '&deg;C';

            const skycons = new Skycons({
                'color': 'white'
            });
            skycons.add('weatherIcon', weather.currently.icon);
            skycons.play();

            doc.container.style.display = 'block';
        });
}

function cToF(c) {
    return Math.round((c * 9 / 5) + 32);
}

function fToC(f) {
    return Math.round((f - 32) * 5 / 9);
}

function changeUnits() {
    const currentUnits = this.textContent.includes('C') ? 'C' : 'F';
    const currentValue = parseFloat(doc.temperature.textContent);

    if (currentUnits == 'C') {
        doc.temperature.textContent = cToF(currentValue);
        this.innerHTML = '&deg;F';
    } else {
        doc.temperature.textContent = fToC(currentValue);
        this.innerHTML = '&deg;C';
    }
}

doc.units.addEventListener('click', changeUnits);