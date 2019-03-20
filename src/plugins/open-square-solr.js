const DEFAULT_SOLR_CORE_PATH = '/solr/open-square-metadata/';
const DEFAULT_SOLR_HOST      = 'discovery1.dlib.nyu.edu';
const DEFAULT_SOLR_PORT      = 80;
const DEFAULT_SOLR_PROTOCOL  = 'http';

const ERROR_SIMULATION_SEARCH       = 'search';

let errorSimulation;
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
        qt      : 'dismax',
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

async function solrSearch( query, queryFields, selectedSubjectsFacetItems ) {
    // "#" sometimes gets added to the end of the URL, probably because search results have
    // <a> tags with href="#"
    if ( errorSimulation && errorSimulation.startsWith( ERROR_SIMULATION_SEARCH ) ) {
        throw Error( ERROR_SIMULATION_SEARCH );
    }

    const params = {
        q                : query,
        'facet.field'    : 'subject',
        'facet.limit'    : '-1',
        'facet.mincount' : '1',
        'facet.sort'     : 'count',
        facet            : 'on',
        fl               : 'title,subtitle,description,author,subject,identifier,coverHref,thumbHref',
        hl               : true,
        'hl.fl'          : 'description,subject,title',
        qf               : queryFields.join( '%20' ),
        rows             : 1999,
        sort             : 'score%20desc,title_sort%20asc',
    };

    if ( selectedSubjectsFacetItems && selectedSubjectsFacetItems.length > 0 ) {
        params.fq = selectedSubjectsFacetItems.map( ( selectedSubjectsFacetItem ) => {
            return encodeURIComponent(
                'subject:"'  +
                selectedSubjectsFacetItem.replace( /"/g, '\\"' ) +
                '"'
            );
        } );
    }

    try {
        return doFetch( params );
    } catch( e ) {
        throw e;
    }
}

export default {
    install( Vue, options ) {
        // Plugin options
        solrCorePath = options.solrCorePath || DEFAULT_SOLR_CORE_PATH;
        solrHost     = options.solrHost     || DEFAULT_SOLR_HOST;
        solrPort     = options.solrPort     || DEFAULT_SOLR_PORT;
        solrProtocol = options.solrProtocol || DEFAULT_SOLR_PROTOCOL;

        errorSimulation = options.errorSimulation;

        Vue.prototype.$solrSearch = solrSearch;
    },
};
