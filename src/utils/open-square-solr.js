// TODO: should this be an environment variable?
const DEFAULT_HIGHLIGHT_FRAGMENT_SIZE = 500;

// const ERROR_SIMULATION_SEARCH = "search";

// let errorSimulation;

/**
 * checks for null params and removes them, adds some other params, simplifies
 * @param {object} params - object of the query parameters that configure the solr results
 * @returns Promise of json data from solr query
 */
async function doFetch(params) {
    // Shouldn't ever have null or undefined params, but test and remove just
    // in case, otherwise we end up with param=null or param=undefined.
    Object.keys(params).forEach((key) => {
        if (params[key] === null || params[key] === undefined) {
            delete params[key];
        }
    });
    params = Object.assign(params, {
        // Avoid `q : undefined` if q was deleted above or never present
        // `q` shoudl work for edismax and lucene (standard)
        // q: params.q !== undefined ? encodeURIComponent(params.q) : "",
        defType: "edismax",
        indent: "on",
        // wt: "json", // it's default already
    });

    const queryStringParams = [];
    Object.keys(params).forEach((key) => {
        const paramValue = params[key];

        // Some params like fq can be specified multiple times
        if (Array.isArray(paramValue)) {
            paramValue.forEach((value) => {
                queryStringParams.push(key + "=" + value);
            });
        } else {
            queryStringParams.push(key + "=" + params[key]);
        }
    });

    const queryString = queryStringParams.join("&");

    // query should look like this at the end
    // https://discovery1.dlib.nyu.edu/solr/open-square-metadata/select?q=dad&fl=title,subtitle,description,author,date,identifier,coverHref,thumbHref&hl=true&hl.fl=author,date,description,series_names,subtitle,title&hl.fragsize=500&hl.simple.pre=%3Cmark%3E&hl.simple.post=%3C/mark%3E&hl.snippets=1&qf=author^4%20date^1%20description^2%20series_names^3%20subtitle^4%20title^4&rows=1999&sort=score%20desc,title_sort%20asc&defType=edismax&indent=on&wt=json
    // query that works when sending to viewer api
    // https://stage-sites.dlib.nyu.edu/viewer/api/v1/search?index=open-square-metadata-v1&query=*english*
    // now mixing both urls
    // https://stage-sites.dlib.nyu.edu/viewer/api/v1/search?index=open-square-metadata-v1&q=dad&fl=title,subtitle,description,author,date,identifier,coverHref,thumbHref&hl=true&hl.fl=author,date,description,series_names,subtitle,title&hl.fragsize=500&hl.simple.pre=%3Cmark%3E&hl.simple.post=%3C/mark%3E&hl.snippets=1&qf=author^4%20date^1%20description^2%20series_names^3%20subtitle^4%20title^4&rows=1999&sort=score%20desc,title_sort%20asc&defType=edismax&indent=on&wt=json
    // https://stage-sites.dlib.nyu.edu/viewer/api/v1/search?index=open-square-metadata-v1&q=dad
    const protocol = import.meta.env.VITE_VIEWER_API_PROTOCOL;
    const host = import.meta.env.VITE_VIEWER_API_HOST;
    const core = import.meta.env.VITE_SOLR_CORE_PATH;
    const baseUrl = `${protocol}://${host}${core}&${queryString}`;
    const response = await fetch(baseUrl);

    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        const message = await response.text();
        const error = new Error(message);
        error.response = response;
        throw error;
    }
}

/**
 * checks if testing, creates params for solr query, runs doFetch with params
 * @param {string} query - the user entered query
 * @param {object} queryFields - the object that contains the query fields, their highlighting and their importance
 * queryFields come from the call since thos will be values picked up in state to
 * @returns Promise
 */
export async function solrSearch(query, queryFields) {
    // "#" sometimes gets added to the end of the URL, probably because search results have
    // <a> tags with href="#"
    // if (
    //     errorSimulation &&
    //     errorSimulation.startsWith(ERROR_SIMULATION_SEARCH)
    // ) {
    //     throw Error(ERROR_SIMULATION_SEARCH);
    // }

    // handles empty query by sending search all
    const querella = query ? `${query}` : "*:*";

    const params = {
        // for some reason the API is not responding when sending `q`, so using query
        query: querella,
        // fl: "title,subtitle,description,author,date,identifier,coverHref,thumbHref",
        // opensquare new schema
        // author -> contributor.name
        //
        // fl: "identifier",
        // hl: true,
        // "hl.fl": getHlFlFromQueryFields(queryFields),
        // "hl.fragsize": DEFAULT_HIGHLIGHT_FRAGMENT_SIZE,
        // "hl.simple.pre": "<mark>",
        // "hl.simple.post": "</mark>",
        // "hl.snippets": 1,
        // used for the DisMax query parser
        // qf: getQfFromQueryFields(queryFields),
        rows: 1999, // default is 10
        // sort: "score%20desc,title_sort%20asc",
    };

    return doFetch(params);
}

/**
 * creates a url-usabe string of the required highlight fields, this goes into the query fields object
 * @param {object} queryFields - contains the query fields with their properties (highlighting and weight)
 * @returns string comma-separated
 */
function getHlFlFromQueryFields(queryFields) {
    let hlFlFields = [];

    Object.keys(queryFields).forEach((fieldName) => {
        const highlight = queryFields[fieldName].highlight || false;

        if (highlight) {
            hlFlFields.push(`${fieldName}`);
        }
    });

    return hlFlFields.join(",");
}

/**
 * creates url-usable string of queryfields^weight
 * @param {object} queryFields - contains the queryFields with their properties
 * @returns string
 */
function getQfFromQueryFields(queryFields) {
    let weightedQueryFields = [];

    Object.keys(queryFields).forEach((fieldName) => {
        const weight = queryFields[fieldName].weight || 1;

        weightedQueryFields.push(`${fieldName}^${weight}`);
    });

    // %20 = space (in urls)
    return weightedQueryFields.join("%20");
}
