import React from "react";
import { PropTypes } from "prop-types";
import { getThumbnailUrl } from "../utils/utils";
import "./ResultItem.css";

// individual result item
// no need for state, iterated by parent component
// TODO: use es6 destructuring for default props
export function ResultItem({
    contributors,
    date,
    description,
    identifier,
    subtitle,
    title,
    // TODO: add description restriction at the component level
    // Ellipsis character -- on Macos use key combination `Option + ;`
    // ellipsis: PropTypes.String,
    maxDescriptionLength = 500,
}) {
    return (
        <div
            id={identifier}
            key={identifier}
            name={title}
            className="book-summary-hold"
        >
            {/* TODO: can we reduce containeritis and use article as the container */}
            <article className="book-summary container">
                <div className="thumb" role="presentation">
                    <a
                        href={`/books/${identifier}/`}
                        tabIndex="-1"
                        aria-hidden="true"
                    >
                        <img
                            src={getThumbnailUrl(identifier)}
                            alt=""
                            className="img-fluid"
                        />
                    </a>
                </div>
                <div className="meta">
                    <div className="book-title-group">
                        {/* a tag not a react router item since we want to navigate to this page */}
                        <a href={`/books/${identifier}/`}>
                            <div
                                className="book-title"
                                // TODO: find a better solution that doesn't rely on dangerouslySetInnerHTML
                                dangerouslySetInnerHTML={{ __html: title }}
                            ></div>

                            {/* <div className="book-subtitle">{subtitle}</div> */}
                            <div
                                className="book-subtitle"
                                dangerouslySetInnerHTML={{ __html: subtitle }}
                            ></div>
                        </a>
                    </div>
                    <div className="author-group">
                        <span
                            className="rolename"
                            dangerouslySetInnerHTML={{ __html: contributors }}
                        ></span>
                    </div>
                    <div className="pubdate">
                        <span>Published: </span>
                        <span>{date.substring(0, 4)}</span>
                    </div>
                    <div
                        className="description meta"
                        dangerouslySetInnerHTML={{ __html: description }}
                    ></div>
                </div>
            </article>
        </div>
    );
}

ResultItem.propTypes = {
    contributors: PropTypes.string,
    date: PropTypes.string,
    identifier: PropTypes.string,
    description: PropTypes.string,
    maxDescriptionLength: PropTypes.number,
    subtitle: PropTypes.string,
    title: PropTypes.string,
};
