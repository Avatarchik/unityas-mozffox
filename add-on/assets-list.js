/**
 * assets-list.js
 * Export the list of purchased assets.
 * Jonas Luz Jr. < contact at jonasluz dot com >
 *
 */

// extension namespace.
let JALJR = (() => {

    let 
        config, main,
        getUserID, generateCSV
    ;

    // configuration of the routine based on Unity Asset Store purchased list page structure
    config = {
        user_info_css_class : '_1qxEutYGw0dtTEX0-UbPxn',
        asset_css_class     : '_1MwyWaFqWeTD7RHnwlMoKc',
        img_css_class       : '_2NSfYMsH-s4Ngs2YTJIoAw',
        date_css_class      : 'iIoTnjX3ep3NHov9GbPAb',
        continue_trigger    : 'Release Notes'
    }; // config

    /**
     * getUserID
     * @description Finds the user id in the page.
     * @returns {string} user id
     * 
     */
    getUserID = () => {

        let data = document.getElementsByClassName(config.user_info_css_class);

        return data.length > 0 ? data[0].innerText : undefined;
    }; // getUserID

    /**
     * generateCSV
     * @description Generates the CSV data by finding the data in the page.
     * @returns {list} CSV lines.
     * 
     */
    generateCSV = () => {

        // purchased assets
        let rows = document.getElementsByClassName(config.asset_css_class);
        console.log("There are ", rows.length, " assets in the list.");

        // the CSV result 
        let csv = [];
        // sanity variables - count the range of itens of data in the rows.    
        let data_max = 0, data_min = 999;
        // loop through the asset list getting each asset data.
        for (let i = 0; i < rows.length; i++) {

            // each asset data as an array of items
            let data = rows[i].getElementsByTagName('A');
            // count the number of items in each row to find the range of elements counts; 
            //this is a sanity check, as we don't expect a very large range and the ideal would be to be a range of only one integer.
            if (data.length > data_max) data_max = data.length;
            if (data.length < data_min) data_min = data.length;

            // get purchased date
            let purchased = rows[i].getElementsByClassName(config.date_css_class)[0].innerText;

            // this asset CSV line (starting with purchased date)
            let csv_line = purchased;
            // loop through the asset items of data and construct its CSV line.
            for (let j = 0, get_out = false, got_url = false; j < data.length && (!get_out); j++) {
                let datum = data[j].innerText;
                if (datum === config.continue_trigger) get_out = true;
                else if (datum !== "") {
                    csv_line += ',' + datum;
                    // get URL
                    if (! got_url) {
                        csv_line += ',' + data[j].href;
                        got_url = true;
                    }
                }
            }
            // exclude the known empty items of data (the image), configured in config.
            csv.push(csv_line);
        }

        // result of the sanity check (range of counts in data elements)
        console.log("There are a range of [", data_min, "-", data_max, "] elements of data in each asset row.");
        // another sanity check - the count of CSV lines must be equal to the lenght of asset rows.
        console.log(
            "The CSV content has ", csv.length, "lines... ", ( 
                csv.length === rows.length 
                ? "That's right!" 
                : "Something seems wrong, as the number of CSV lines is different from the number of assets found in the page."
        ));
        // the generated CSV
        console.info(csv);

        return csv;
    }; // generateCSV

    /**
     * Main function.
     */
    main = () => {
        const user = getUserID();
        const csv = generateCSV();
    } // main

    return {
        main        : main,
        getUserID   : getUserID,
        generateCSV : generateCSV
    };
})();

JALJR.main();