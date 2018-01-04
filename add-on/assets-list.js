/**
 * assets-list.js
 * Export the list of purchased assets.
 * Jonas Luz Jr. < contact at jonasluz dot com >
 *
 */

// extension namespace.
let U3Das_FFox = (() => {

    let 
        config, main,
        addButton, getUserID, generateCSV
    ;

    // configuration of the routine based on Unity Asset Store purchased list page structure
    config = {
        user_info_css_class     : '_1qxEutYGw0dtTEX0-UbPxn',
        asset_css_class         : '_1MwyWaFqWeTD7RHnwlMoKc',
        img_css_class           : '_2NSfYMsH-s4Ngs2YTJIoAw',
        date_css_class          : 'iIoTnjX3ep3NHov9GbPAb',
        buttons_div_css_class   : '_1zbKdUvj5aiTaYPugA2oG9',
        button_css_class        : '_3UE3JHvXlpWV2IcGxqdlNT pDJt-g2kSogfau8sJrU7N auto _3wJlwPyz75q9ihlChgrt8u F35wsRpzrixrswzmS7EJ2',
        button_form_action      : 'http://put_backend_url_here',
        continue_trigger        : 'Release Notes'
    }; // config

    /**
     * addButton
     * @description Adds the CSV generation button to the page.
     * @param   {list}  csv_data    generated CSV data to send.
     * @returns {boolean} true if button added; false otherwise.
     *
     */
    addButton = (user, csv_data) => {

        // if the form already exists, delete it.
        let form = document.getElementById('U3Das_FFox_Form');
        if (form) {
            form.remove();
        }

        // get the parent element (the buttons bars at the bottom of the page)
        let parent = document.getElementsByClassName(config.buttons_div_css_class)[0];
        if (! parent) {
            console.warn ('Could not find the div parent to the buttons.');
            return false;
        }

        // create the form that sends the CSV data to the back-end to be encoded and downloaded.
        form = document.createElement('FORM');
        form.setAttribute('id','U3Das_FFox_Form');
        form.setAttribute('name','U3Das_FFox_Form');
        form.setAttribute('action', config.button_form_action);
        form.setAttribute('enctype', 'multipart/form-data');
        form.setAttribute('method', 'post');
        form.setAttribute('target', '_blank');

        // create the hidden field where to store the CSV data.
        let user_name  = document.createElement('INPUT');
        user_name.setAttribute('type', 'hidden');
        user_name.setAttribute('name', 'U3Das_FFox_User');
        user_name.setAttribute('value', user);
        form.appendChild(user_name);
        
        // create the hidden field where to store the CSV data.
        let data_field  = document.createElement('INPUT');
        data_field.setAttribute('type', 'hidden');
        data_field.setAttribute('name', 'U3Das_FFox_CSV');
        data_field.setAttribute('value', csv_data);
        form.appendChild(data_field);

        // create the button that sends the CSV data to the back-end...
        let button  = document.createElement('INPUT');
        button.setAttribute('name', 'U3Das_FFox_Btn');
        button.setAttribute('type', 'submit');
        button.setAttribute('value', 'Download CSV');
        button.setAttribute('class', config.button_css_class);
        form.appendChild(button);

        // add the form to the parent.
        parent.appendChild(form);

        return true;
    }; // addButton

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
            for (let j = 0, get_out = false; j < data.length && (!get_out); j++) {
                let datum = data[j].innerText.replace('"', "'");
                if (datum.includes(',')) {
                    datum = '"' + datum + '"';
                }
                if (datum === config.continue_trigger) {
                    get_out = true;
                } else if (datum !== "") {
                    csv_line += ',' + datum;
                    let url = data[j].href;
                    csv_line += url ? ',' + url : ',';
                }
            }
            // add the generated line to the result list.
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
        addButton(user, csv.join("\n"));
    } // main

    return {
        main        : main,
        addButton   : addButton,
        getUserID   : getUserID,
        generateCSV : generateCSV
    };
})();

U3Das_FFox.main();