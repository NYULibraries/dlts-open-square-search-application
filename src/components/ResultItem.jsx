import React from "react";
import { string } from "prop-types";
import { getThumbnailUrl, unflattenContributors } from "../utils/utils";
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
                            <div className="book-title">{title}</div>
                            <div className="book-subtitle">{subtitle}</div>
                        </a>
                    </div>
                    {/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach */}
                    {unflattenContributors(contributors).forEach(
                        (contributorInRoleSentece, roleName) => {
                            <div className="author-group">
                                <span className="rolename">{{ roleName }}</span>
                                contributorsInRoleSentence
                            </div>;
                        }
                    )}
                    <div className="pubdate">
                        <span>Published: </span>
                        <span>{date}</span>
                    </div>
                    {/* TODO: check how highlighting will be passed down into descirption */}
                    <div className="description meta">{description}</div>
                </div>
            </article>
        </div>
    );
}

ResultItem.propTypes = {
    // contributors is a stringified json object that needs parsing
    contributors: string,
    date: string,
    identifier: string,
    description: string,
    maxDescriptionLength: Number,
    subtitle: string,
    title: string,
};
