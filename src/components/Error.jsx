import React from "react";
import { PropTypes } from "prop-types";

export function Error({ message }) {
    return (
        <div>
            {/* server call hangs */}
            {/* server is off */}
            {/* server responds with 404 or 500 */}
            Apologies: technical difficulties. Please try again later {message}
            Error contacting DLTS Viewer API: {message}
            {/* no connection */}
            Sorry, a server error has occurred. Please try your search again
            later.
        </div>
    );
}

Error.propTypes = {
    message: PropTypes.string,
};
