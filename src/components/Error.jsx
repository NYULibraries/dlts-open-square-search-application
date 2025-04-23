import React from "react";
import { PropTypes } from "prop-types";

export function Error({ message }) {
    return <div>Some error {message}</div>;
}

Error.propTypes = {
    message: PropTypes.string,
};
