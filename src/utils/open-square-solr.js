const DEFAULT_HIGHLIGHT_FRAGMENT_SIZE = 500;

const DEFAULT_SOLR_CORE_PATH = '/solr/open-square-metadata/';
const DEFAULT_SOLR_HOST      = 'discovery1.dlib.nyu.edu';
const DEFAULT_SOLR_PORT      = 80;
const DEFAULT_SOLR_PROTOCOL  = 'http';

const ERROR_SIMULATION_SEARCH = 'search';

let errorSimulation;
let highlightFragmentSize;
let solrCorePath;
let solrHost;
let solrPort;
let solrProtocol;

async function doFetch( params ) {
    // Shouldn't ever have null or undefined params, but test and remove just
    // in case, otherwise we end up with param=null or param=undefined.
    Object.keys( params ).forEach( key => {
        if ( params[ key ] === null || params[ key ] === undefined ) {
            delete params[ key ];
        }
    } );

    params = Object.assign( params, {
        // Avoid `q : undefined` if q was deleted above or never present
        q       : params.q !== undefined ? encodeURIComponent( params.q ) : '',
        defType : 'edismax',
        indent  : 'on',
        wt      : 'json',
    } );

    const queryStringParams = [];
    Object.keys( params ).forEach( ( key ) => {
        const paramValue = params[ key ];

        // Some params like fq can be specified multiple times
        if ( Array.isArray( paramValue ) ) {
            paramValue.forEach( ( value ) => {
                queryStringParams.push( key + '=' + value );
            } );
        } else {
            queryStringParams.push( key + '=' + params[ key ] );
        }
    } );

    const queryString = queryStringParams.join( '&' );

    const requestUrl = `${ solrProtocol }://${ solrHost }:${ solrPort }${ solrCorePath }select?${ queryString }`;
    const response = await fetch( requestUrl );

    if ( response.ok ) {
        const data = await response.json();

        return data;
    } else {
        const message  = await response.text();
        const error    = new Error( message );
        error.response = response;

        throw error;
    }
}

async function solrSearch( query, queryFields ) {
    // "#" sometimes gets added to the end of the URL, probably because search results have
    // <a> tags with href="#"
    if ( errorSimulation && errorSimulation.startsWith( ERROR_SIMULATION_SEARCH ) ) {
        throw Error( ERROR_SIMULATION_SEARCH );
    }

    const params = {
        q                : query,
        fl               : 'title,subtitle,description,author,date,identifier,coverHref,thumbHref',
        hl               : true,
        'hl.fl'          : getHlFlFromQueryFields( queryFields ),
        'hl.fragsize'    : highlightFragmentSize,
        'hl.simple.pre'  : '<mark>',
        'hl.simple.post' : '</mark>',
        'hl.snippets'    : 1,
        qf               : getQfFromQueryFields( queryFields ),
        rows             : 1999,
        sort             : 'score%20desc,title_sort%20asc',
    };

    try {
        return doFetch( params );
    } catch( e ) {
        throw e;
    }
}

function getHlFlFromQueryFields( queryFields ) {
    let hlFlFields = [];

    Object.keys( queryFields ).forEach( fieldName => {
        const highlight = queryFields[ fieldName ].highlight || false;

        if ( highlight ) {
            hlFlFields.push( `${ fieldName }` );
        }
    } );

    return hlFlFields.join( ',' );
}

function getQfFromQueryFields( queryFields ) {
    let weightedQueryFields = [];

    Object.keys( queryFields ).forEach( fieldName => {
        const weight = queryFields[ fieldName ].weight || 1;

        weightedQueryFields.push( `${ fieldName }^${ weight }` );
    } );

    return weightedQueryFields.join( '%20' );
}

export default {
    install( Vue, options ) {
        // Plugin options
        solrCorePath = options.solrCorePath || DEFAULT_SOLR_CORE_PATH;
        solrHost     = options.solrHost     || DEFAULT_SOLR_HOST;
        solrPort     = options.solrPort     || DEFAULT_SOLR_PORT;
        solrProtocol = options.solrProtocol || DEFAULT_SOLR_PROTOCOL;

        highlightFragmentSize = options.highlightFragmentSize || DEFAULT_HIGHLIGHT_FRAGMENT_SIZE;

        errorSimulation = options.errorSimulation;

        Vue.prototype.$solrHighlightFragmentSize = highlightFragmentSize;
        Vue.prototype.$solrSearch = solrSearch;
    },
};
