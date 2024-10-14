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
 * @param {String} result the whole data of each publication
 * @returns String
 */
export function getDescription(result) {
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
 * isbn: String
 * TODO: verify if we want this value to be an environment variable
 * builds the URL for thumbnails in the ResultItem
 */
export function getThumbnailUrl(isbn) {
    return `https://nyu-opensquare-us.imgix.net/covers/${isbn}.jpg?auto=format&w=145`;
}

/**
 * highlights
 * result
 * field
 * returns highlighted fields given
 */
export function getFieldValueOrHighlightedFieldValue(
    highlights,
    result,
    field
) {
    const identifier = result.identifier;

    if (highlights[identifier] && highlights[identifier][field]) {
        // TODO: look into this section, this might return more data about how we highlight results in the search bar
        // We only want the first snippet
        return highlights[identifier][field][0];
    } else {
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
 * TODO: add proper args
 * @param {*} args
 */
export function solrQueryFactory(args) {
    // TODO: look into the `main.js` file for the dlts-opensquare-search-application
    return "some string for query";
}

/**
 * function that takes a flat contributors list and returns it
 * ordered and in an easy way to render as a Map for react
 * matching Hugo logic for naming here:
 * https://github.com/NYULibraries/dlts-open-square/commit/601e7987c2440e182c747c294fe8a924341fe923#diff-13693fcffa921ef48b3fadcc2c6983d0820d73e7e989a48d97584e7e4904ccbcR4
 * @param {String} contribs - flattened JSON array of contributors in individual objects
 * @returns {Map<string,string>} Contributors in the form a Map. Key = role, Value = Legible people in said role
 */
export function unflattenContributors(contribs) {
    // 1. transform contributors from flat string to JSON object
    let rehydratedContribs = JSON.parse(contribs);

    // 1. sort the contributors by their `.order` key
    // O(n)
    rehydratedContribs.sort((a, b) => {
        // neg for a before b, positive for b before a, zero or nan a = b
        return a.order - b.order; // ascending order
    });

    // 2. extract unique roles from that ordered list,
    // store contributors into array (bucket) for that role
    const uniqueContributorRoles = new Map();
    // O(n)
    rehydratedContribs.forEach((contributor) => {
        // if the role exists add the name to the bucket for that role
        if (uniqueContributorRoles.has(contributor.role)) {
            let newContributorList = uniqueContributorRoles.get(
                contributor.role
            );
            newContributorList.push(contributor);
            uniqueContributorRoles.set(contributor.role, newContributorList);
        } else {
            // if the role does not exist in the map, add it and the contributor
            uniqueContributorRoles.set(contributor.role, [contributor]);
        }
    });

    // 3. loop over contributor roles to build the author string into catcher variable
    // O(n)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach
    uniqueContributorRoles.forEach((contributorArray, role) => {
        // 3.0 declare catcher
        let finalStringByRole = "";

        // 3.1 sort contributors (within their bucket) according to their `.order` property
        // O(n)*O(n) = O(n^2)  careful
        contributorArray.sort((a, b) => {
            // neg for a before b, positive for b before a, zero or nan a = b
            return a.order - b.order; // ascending order
        });

        // 3.2 handle "author" role exception by using a better word at render
        // other role types are used as-is
        if (role == "author") {
            // finalString += "By ";
            finalStringByRole += "By ";
        } else {
            // finalString += role + " ";
            finalStringByRole += role + " ";
        }

        // 3.3 use the right connector words according to
        let connector = contributorArray.length > 2 ? ", and " : " and ";

        // 3.4 iterate over this group's bucket and create the final contributorString with connectors
        contributorArray.forEach((contrib, index) => {
            // if we are on the second to last element add the connector
            finalStringByRole += contrib.name;
            if (index == contributorArray.length - 2) {
                // finalString += connector;
                finalStringByRole += connector;
                // insert comma between elements except for last one
            } else if (index != contributorArray.length - 1) {
                // finalString += ", ";
                finalStringByRole += ", ";
            }
        });
        // 3.5 set final contributorRoleString into the map and replace the old contributor array
        uniqueContributorRoles.set(role, finalStringByRole);
    });
    return uniqueContributorRoles;
}
