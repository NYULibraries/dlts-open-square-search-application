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
      this.ellipsis + this.highlights[identifier].description[0] + this.ellipsis
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
 * takes a flat contributors list and returns it
 * ordered and in an easy way to render as a single line
 * @param contribs - flattened array of contributors in individual objects
 */
export function unflattenContributors(contribs) {
  const rehydratedContribs = JSON.parse(contribs);
  let catcher = rehydratedContribs.map(
    // note this is because of quirky naming conventions in the expected return of a flattened array from solr
    (contributor) => contributor["contributors.name"]
  );
  return catcher.join(", ");
}
