// const {
//     default: axios
// } = require("axios");
function redirect() {
    if (window.location.href != '/dashboard') {
        document.querySelector('body').removeAttribute('onload');
        window.location.href = '/dashboard';
    } else {
        document.querySelector('body').removeAttribute('onload');
    }
}
/**
 * TEST CODE
 */
function roundPrice(price, place) {
    /**
     * This function rounds the price of the response to 2 decimal places,
     * since USD is rounded to 2 decimal places. 
     */
    return price.toFixed(place);
}

function search(array, key) {
    /**
     * !! IRRELVANT IF NOT USING listings/latest OVER
     * !! quotes/latest
     * 
     * this function loops over the array and 
     * returns the first index with the correct 
     * name value.
     */
    var i;
    for (i = 0; i < array.length; i++) {
        if (array[i].name === key) {
            /**
             * We're searching for the name, because we're going to pass in the 
             * CryptoOption value as a parameter. It is the value that signals 
             * which currency the user wants.
             */
            return array[i];
        }
    }
    return 'No matches found.'
}

function runMapAPI(currencyName) {
    var cryptoOption = document.getElementById("selectCrypto").value;
    var cmcID;
    /**
     * Check if localStorage already has MAP_DATA. If so, access the map 
     * data from local storage and don't make an API call. Else, 
     * make an API call, save it to local storage, and then access the data
     * from local storage. 
     */
    const localStorage = window.localStorage;
    var MAP_DATA = JSON.parse(localStorage.getItem('MAP_DATA'))
    if (MAP_DATA != null) {
        console.log('MAP_DATA exists in Local Storage.');
        try {
            console.log(search(MAP_DATA, cryptoOption).id);
            cmcID = search(MAP_DATA, cryptoOption).id;
            //return CMC ID of currency requested. 
            runAPI(cmcID)
            console.log("%c Cryptocurrency Map Data taken from local storage.",
                'padding:15px; margin:0; width:100%; background-color:#28A745; color:white')
        } catch {
            console.log('%c ERROR: In RunMapAPI() function, search query for cryptoOption in MAP_DATA array failed.', 'padding:25px; margin:0; width:100%; background-color:#DC3545; color:white')
        }
    } else {
        /**
        If the map data can't be found in LocalStorage, fetch it with the API 
        and place it into local storage. After that, recall the function. 
        The expected behaviour is that the code block above runs and executes runAPI(cmcID).
         */
        axios({
            method: 'get',
            url: '/dashboard/map'
        }).then(response => {
            console.log(response);
            localStorage.setItem('MAP_DATA', JSON.stringify(response.data));
            console.log("%c Cryptocurrency Map Data fetched and placed into local storage.",
                'padding:15px; margin:0; width:100%; background-color:#28A745; color:white')
            runMapAPI();
        }).catch(err => console.log(err))
    }
}

function runAPI(id) {
    var cryptoOption = document.getElementById("selectCrypto").value;
    var template = document.getElementById('cryptoTemplate');;
    var templateClone; //don't clone until we get a response, to avoid them piling up in case of errors.
    var cryptoInfoContainer = document.getElementById('cryptoPrices');
    var checkIfElementExists;

    // runMapAPI(cryptoOption);
    axios({
            method: 'get',
            url: '/dashboard/api',
            params: {
                id: id
            }
        })
        .then(res => {
            cryptoInfoObject = res.data[Object.keys(res.data)[0]];
            console.log(`Response:${cryptoInfoObject}`);

            cryptoPrice = roundPrice(cryptoInfoObject.quote.USD.price, 3);
            cryptoName = cryptoInfoObject.name;
            cryptoRateOfChange = cryptoInfoObject.quote.USD.percent_change_24h; //24h rateofchange
            console.log(`Rate of Change (last 24h): ${cryptoRateOfChange}`);

            checkIfElementExists = document.querySelector(`#${cryptoName}Container`);

            if (checkIfElementExists != null) {
                // if the element for housing the crypto name
                //and price exists, don't clone, just update. Else, clone.
                checkIfElementExists.children[1].textContent = `$${cryptoPrice}`
                // console.log(checkIfElementExists.children[1].textContent = cryptoPrice)
            } else {
                templateClone = template.content.cloneNode(true);
                templateClone.children[0].id = `${cryptoName}Container`
                //set name of crypto
                templateClone.children[0].children[0].children[0].textContent = cryptoName
                //set price of crypto
                templateClone.children[0].children[1].textContent = `$${cryptoPrice}`
                if (roundPrice(cryptoRateOfChange, 3) < 0) {
                    templateClone.children[0].children[0].children[1].classList.remove('bg-green-500');
                    templateClone.children[0].children[0].children[1].classList.add('bg-red-500');
                    //set crypto rate of change
                    templateClone.children[0].children[0].children[1].textContent = roundPrice(cryptoRateOfChange, 3);

                } else {
                    templateClone.children[0].children[0].children[1].classList.remove('bg-red-500');
                    templateClone.children[0].children[0].children[1].classList.add('bg-green-500');
                    //set crypto rate of change
                    templateClone.children[0].children[0].children[1].textContent = `+${roundPrice(cryptoRateOfChange, 3)}`;

                }
                //set crypto rate of change icon color as green/red depending on if
                //its increasing or decreasing.

                cryptoInfoContainer.appendChild(templateClone);
            }

            // console.log(res.data);
            console.log(`Cryptocurrency choice: ${cryptoName}`);
            console.log(`Cryptocurrency price (rounded): ${cryptoPrice}`);
            console.log(`Cryptocurrency price: ${cryptoInfoObject.quote.USD.price}`);
            console.log(`Cryptocurrency rate of change: ${cryptoRateOfChange}`);


            /**
             * templateClone.children[0].children[x].textContent
             * returns the text content of the cryptoName/cryptoValue 
             * divs, depending on if x=0/1
             */


            //duplicate the template in the dashboard, and fill in the crypto option
            //and price value.
        })
        .catch(err => console.log(`ERROR: ${err}`))
}