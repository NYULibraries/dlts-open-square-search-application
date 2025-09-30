/**
 * function that truncates text to fit for the ResultItem component
 * used in the getDescription function
 * @param {String} text - to be truncated
 * @param {Number} maxLength - how long the truncatin will be
 * @returns String
 */
export function truncate(text, maxLength) {
    if (!text) {
        return text;
    }

    if (text.length <= maxLength) {
        return text;
    }

    return text.substr(0, text.lastIndexOf(" ", maxLength)) + this.ellipsis;
}

/**
 * function that retrieves a summary of description that Solr returns
 * in the form of highlights. Checks if Solr provided highlights and returns them.
 * @param {string} result - the whole data of each publication
 * @param {number} maxDescriptionLength - how long we want the truncated description to be
 * @returns {string}
 */
export function getDescription(result, maxDescriptionLength = 500) {
    const identifier = result.identifier;
    // how can get scope access to highlights in this function as a util
    if (
        result.highlights[identifier] &&
        result.highlights[identifier].description
    ) {
        // We only want the first snippet
        // TODO: is this necessary? or can I just accomodate in the component, this is not a value that will change
        // Ellipsis character -- on Macos use key combination `Option + ;`
        // ellipsis={"…"}
        return (
            this.ellipsis +
            this.highlights[identifier].description[0] +
            this.ellipsis
        );
    } else {
        // TODO: can we include truncate here and not use it as a separate function?
        return truncate(result.description, maxDescriptionLength);
    }
}

/**
 * builds the URL for thumbnails in the ResultItem
 * @param {string} isbn - id of the book
 * @returns {string} url with isbn interpolated
 */
export function getThumbnailUrl(isbn) {
    // TODO: verify if we want this value to be an environment variable
    return `https://nyu-opensquare-us.imgix.net/covers/${isbn}.jpg?auto=format&w=145`;
}

/**
 * used in ResultItem component
 * looks into the returned highlights and sees if there's a highlighted value to display
 * if there is none, it displays the normally returned value by solr
 * when rendering the results from solr we will sometimes receive highlights
 * this function helps choose the highlights over the original field values when present.
 * @param {*} highlights - the whole highlight object returned by solr
 * @param {*} identifier - the id used by the book in solr
 * @param {*} field - which field to find highlights for
 * @returns string
 * TODO: move this to utils
 */
export function getFieldValueOrHighlightedFieldValue(
    highlights,
    result,
    field
) {
    console.log("getfieldhighlights");
    const identifier = result.id;
    // debugger;
    if (highlights[identifier] && highlights[identifier][field]) {
        console.log("highlight found for field:", field);
        // We only want the first snippet
        return highlights[identifier][field][0];
    } else {
        console.log("no highlight found");
        const fieldValue = result[field];
        if (Array.isArray(fieldValue)) {
            return fieldValue[0];
        } else {
            return fieldValue;
        }
    }
}

/**
 * creates the query used in the solr call for search
 * @param {string} query - query entered by the user
 */
export function solrQueryFactory(query) {
    // TODO: look into the `main.js` file for the dlts-opensquare-search-application
    const tempURL = `${import.meta.env.VITE_API_TO_SOLR_PROTOCOL}://${
        import.meta.env.VITE_API_TO_SOLR_HOST
    }`;

    return tempURL + `&query=*${query}*`;
}
