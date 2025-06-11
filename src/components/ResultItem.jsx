import React from "react";
import { PropTypes } from "prop-types";
import {
    getThumbnailUrl,
    sortContributorsIntoRoleBuckets,
} from "../utils/utils";
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
    maxDescriptionLength = 500,
}) {
    return (
        <div
            // container? or is article the container?
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
                    {sortContributorsIntoRoleBuckets(contributors).map(
                        (contributorSentenceByType, index) => (
                            <div className="author-group" key={index}>
                                <span className="rolename">
                                    {contributorSentenceByType}
                                </span>
                            </div>
                        )
                    )}
                    <div className="pubdate">
                        <span>Published: </span>
                        <span>{date.substring(0, 4)}</span>
                    </div>
                    {/* <div className="description meta">{description}</div> */}
                    <div
                        className="description meta"
                        dangerouslySetInnerHTML={{ __html: description }}
                    ></div>
                </div>
            </article>
        </div>
    );
}

// TODO: proptypes deprecated in react 19, use typescript
// https://react.dev/blog/2024/04/25/react-19-upgrade-guide#removed-proptypes-and-defaultprops
ResultItem.propTypes = {
    // contributors is a stringified json object that needs parsing
    // contributors: PropTypes.array,
    // skipping viewer api and going direct to solr
    contributors: PropTypes.string,
    date: PropTypes.string,
    identifier: PropTypes.string,
    description: PropTypes.string,
    maxDescriptionLength: PropTypes.number,
    subtitle: PropTypes.string,
    title: PropTypes.string,
};
