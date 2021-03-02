// const {
//     default: axios
// } = require("axios");
function redirect() {
    if (window.location.href != '/dashboard') {
        document.querySelector('body')[0].removeAttribute('onload');
        alert("test")
        window.location.href = '/dashboard';
    } else {
        document.querySelector('body')[0].removeAttribute('onload');
        alert("TEST")
    }
}

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
            // returns first index of the data object,
            // which contains the crypto info we need.

            /**
             * using search function in cryptoPrice is not necessary 
             * since we're not getting an array of currencies from which to
             * search for the currency, instead we are getting the currency itself.
             * therefore search is unnecessary.
             * 
             * We need to use the RunMapAPI function to get the map, 
             * then use the map (from local storage) to find the ID of the 
             * currency before we send the /api request. We will need to 
             * alter the search function to parse the map array with the name
             * of the currency we need, and return the CMC ID. We will then use 
             * that as stated before to make the /api request. 
             * 
             * This is so we get the specific information pertaining to 
             * that specific cryptocurrency and avoid huge packet sizes.
             * 
             * In theory this will technically be more request-expensive and wear down our request 
             * limits for the day, but its better than requesting the "big array of all 
             * currencies" data once, sorting through that for all currencies, then displaying those
             * and repeating every 5 minutes. 
             */
            cryptoPrice = roundPrice(cryptoInfoObject.quote.USD.price, 3);
            cryptoName = cryptoInfoObject.name;
            cryptoRateOfChange = cryptoInfoObject.quote.USD.percent_change_24h; //24h rateofchange
            console.log(`Rate of Change (last 24h): ${cryptoRateOfChange}`);
            /**
             * When you get a response, check the crytoOption. 
             * If any IDs on the dom match `cryptoOption+Container`, don't clone
             * the template node, just update the price of that ID'd node.
             * 
             * If no IDs on the dom match the cryptoOption, it means no nodes of it exist. 
             * Clone the template node and give the clone an ID equal to the cryptoOption. 
             * Fill the name part with the cryptoOption and then fill the price with the price 
             * of the crypto. 
             */

            //clone template and give it an ID equal to  `${cryptoName}Container`

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
        .catch(err => console.log(err))
}