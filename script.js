/*usage of Promise function to load RestCountries*/
function getRestCountriesData(){

    return new Promise((resolve, reject)=>{
        let xhr = new XMLHttpRequest();
        xhr.open('GET','https://restcountries.eu/rest/v2/all',true);
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status==200)
            {
                resolve(xhr.responseText);
            }
            else if(xhr.readyState == 4 && xhr.status!=200)
            {
                reject('Internal Service Error');
            }
        }
        xhr.send();
    });

}

/*usage of Promise function to load WeatherData*/
function getWeatherData(latlang){

    return new Promise((resolve, reject)=>{
        let xhr = new XMLHttpRequest();
        let url = 'http://api.openweathermap.org/data/2.5/weather?lat='+latlang[0]+'&lon='+latlang[1]+'&units=metric&appid=0da05f35eafdccd9f0abb31590bc0e42';
        xhr.open('GET',url,true);
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status==200)
            {
                resolve(xhr.responseText);
            }
            else if(xhr.readyState == 4 && xhr.status!=200)
            {
                reject('Internal Service Error');
            }
        }
        xhr.send();
    });

}

/*For each onclick button event weather data is loaded.  And then Modal is populated with info. */
function populateModalData(Data){
    let modalBody = document.querySelector('#modal-body');
    modalBody.innerText='';

    let cardData = document.createElement('div');cardData.setAttribute('class','card-data mb-1');
    let p = document.createElement('p');p.setAttribute('class','d-inline-block mb-0');
    p.innerText = 'Weather: ';
    let span = document.createElement('span');span.setAttribute('class','font-weight-bold');
    span.innerText = Data.weather[0].main;
    cardData.append(p,' ',span);
    modalBody.append(cardData);

    cardData = document.createElement('div');cardData.setAttribute('class','card-data mb-1');
    p = document.createElement('p');p.setAttribute('class','d-inline-block mb-0');
    p.innerText = 'Description: ';
    span = document.createElement('span');span.setAttribute('class','font-weight-bold');
    span.innerText = Data.weather[0].description;
    cardData.append(p,' ',span);
    modalBody.append(cardData);

    cardData = document.createElement('div');cardData.setAttribute('class','card-data mb-1');
    p = document.createElement('p');p.setAttribute('class','d-inline-block mb-0');
    p.innerText = 'Temperature: ';
    span = document.createElement('span');span.setAttribute('class','font-weight-bold');
    span.innerText = Data.main.temp+'°Celsius';
    cardData.append(p,' ',span);
    modalBody.append(cardData);

    cardData = document.createElement('div');cardData.setAttribute('class','card-data mb-1');
    p = document.createElement('p');p.setAttribute('class','d-inline-block mb-0');
    p.innerText = 'Feels like: ';
    span = document.createElement('span');span.setAttribute('class','font-weight-bold');
    span.innerText = Data.main.feels_like+'°Celsius';
    cardData.append(p,' ',span);
    modalBody.append(cardData);
}

/*Async function that loads restcountries data and buils html website */
async function foo(){
    try{
        let response = await getRestCountriesData();
        buildHTML(JSON.parse(response));
    }
    catch(error){
        console.log(error);
    }
}
foo();


/*building html page*/
function buildHTML(arrObject)
{
    let container = document.querySelector('#wrapper');

    /*for each rest country, card is designed and the data is loaded*/
    arrObject.forEach(element => {
        let content = document.createElement('div');content.setAttribute('class','content col-sm-6 col-lg-4 d-flex  align-items-stretch');
        let card = document.createElement('div');card.setAttribute('class','card m-1');

        let countryField = document.createElement('div');countryField.setAttribute('class','card-header bg-dark text-white text-center');
        countryField.innerText = element.name;

        let countryImg = document.createElement('img');countryImg.setAttribute('class','card-img-top img-fluid');
        countryImg.setAttribute('src',element.flag);

        let cardBody = document.createElement('div');cardBody.setAttribute('class','card-body text-center text-white bg-secondary');
        let cardData = document.createElement('div');cardData.setAttribute('class','card-data mb-1');
        let p = document.createElement('p');p.setAttribute('class','d-inline-block mb-0');
        p.innerText = 'Capital: ';
        let span = document.createElement('span');span.setAttribute('class','badge-lg px-1 rounded badge-success font-weight-bold');
        span.innerText = element.capital;
        cardData.append(p,' ',span);
        cardBody.append(cardData);

        cardData = document.createElement('div');cardData.setAttribute('class','card-data mb-1');
        p = document.createElement('p');p.setAttribute('class','d-inline-block mb-0');
        p.innerText = 'Country Codes: ';
        span = document.createElement('span');span.setAttribute('class','font-weight-bold');
        span.innerText = element.alpha2Code+','+element.alpha3Code;
        cardData.append(p,' ',span);
        cardBody.append(cardData);

        cardData = document.createElement('div');cardData.setAttribute('class','card-data mb-1');
        p = document.createElement('p');p.setAttribute('class','d-inline-block mb-0');
        p.innerText = 'Region: ';
        span = document.createElement('span');span.setAttribute('class','font-weight-bold');
        span.innerText = element.region;
        cardData.append(p,' ',span);
        cardBody.append(cardData);

        cardData = document.createElement('div');cardData.setAttribute('class','card-data mb-1');
        p = document.createElement('p');p.setAttribute('class','d-inline-block mb-0');
        p.innerText = 'LatLong:';
        span = document.createElement('span');span.setAttribute('class','font-weight-bold');
        span.innerText = element.latlng.join(',');
        cardData.append(p,' ',span);
        cardBody.append(cardData);

        let button0 = document.createElement('button');button0.setAttribute('class','btn bg-transparent border-white text-white rounded mt-1');
        button0.setAttribute('data-toggle','modal');
        button0.setAttribute('data-target','#myModal');
        button0.innerText = 'Click for Weather';
        /*for each button click, event lister is added and weather data is loaded.  Async await is implemented here*/
        button0.addEventListener('click',async function(){
            try{
                let result = await getWeatherData(element.latlng);
                populateModalData(JSON.parse(result));
            }
            catch(err){
                console.log(err);
            }
        });
        cardBody.append(button0);

        card.append(countryField,countryImg,cardBody);
        content.append(card);
        container.append(content);
    });

    /*modal outline design*/
    let modal = document.createElement('div');modal.setAttribute('class','modal');modal.setAttribute('id','myModal');
    let modalDialog = document.createElement('div');modalDialog.setAttribute('class','modal-dialog');
    let modalContent = document.createElement('div');modalContent.setAttribute('class','modal-content');
    let modalHeader = document.createElement('div');modalHeader.setAttribute('class','modal-header');
    let h5 = document.createElement('h5');h5.setAttribute('class','modal-title');
    h5.innerText = 'Weather';
    let button = document.createElement('button');button.setAttribute('class','close');
    button.setAttribute('data-dismiss','modal');
    button.innerHTML='&times;';
    let modalBody=document.createElement('div');modalBody.setAttribute('class','modal-body');
    modalBody.setAttribute('id','modal-body');
    modalHeader.append(h5,button);
    modalContent.append(modalHeader,modalBody);
    modalDialog.append(modalContent);
    modal.append(modalDialog);
    container.append(modal);
}