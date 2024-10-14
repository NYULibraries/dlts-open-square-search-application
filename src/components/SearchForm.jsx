import React from "react";
import { useState } from "react";
import { Spinner } from "./Spinner";
import { ResultsPane } from "./ResultsPane";
import { solrQueryFactory } from "../utils/utils";
import "./SearchForm.css";

// TODO: delete this example object and test with local solr instance
const flatContributors = JSON.stringify([
    // TODO: check if this should be "bio":"something" instead of "contributors.bio":"something"
    {
        "contributors.bio":
            "Non usque tandem abutere Catilina Patiencia nostra",
        "contributors.name": "Richard Alba",
        "contributors.nameSort": "Alba, Richard",
        "contributors.order": 1,
        "contributors.role": "author",
    },
    {
        "contributors.bio":
            "Non usque tandem abutere Catilina Patiencia nostra",
        "contributors.name": "Mary C. Waters",
        "contributors.nameSort": "Waters, Mary C.",
        "contributors.order": 2,
        "contributors.role": "author",
    },
]);
const flatReviews = JSON.stringify([
    {
        "reviews.review": "",
        "reviews.reviewer": "",
    },
]);

const example = {
    // using flattened JSON objects as a way to secretly hold nested documents
    contributors: flatContributors,
    // "coverHref": "epub_content/9780814705384/ops/images/9780814705384.jpg",
    // "coverage": "New York",
    collection_code: "oa-books",
    publicationPlace: "New York",
    // "date": "2011",
    dateBook: "2011",
    dateOpenAccess: "2011",
    description:
        "One fifth of the population of the United States belongs to the immigrant or second generations.  While the US is generally thought of as the immigrant society par excellence, it now has a number of rivals in Europe. The Next Generation brings together studies from top immigration scholars to explore how the integration of immigrants affects the generations that come after. The original essays explore the early beginnings of the second generation in the United States and Western Europe, exploring the overall patterns of success of the second generation.While there are many striking similarities in the situations of the children of labor immigrants coming from outside the highly developed worlds of Europe and North America, wherever one looks, subtle features of national and local contexts interact with characteristics of the immigrant groups themselves to create variations in second-generation trajectories.  The contributors show that these issues are of the utmost importance for the future, for they will determine the degree to which contemporary immigration will produce either durable ethno-racial cleavages or mainstream integration.Contributors: Dalia Abdel-Hady, Frank D. Bean, Susan K. Brown, Maurice Crul, Nancy A. Denton, Rosita Fibbi, Nancy Foner, Anthony F. Heath, Donald J. Hernandez, Tariqul Islam, Frank Kalter, Philip Kasinitz, Mark A. Leach, Mathias Lerch, Suzanne E. Macartney, Karen G Marotz, Noriko Matsumoto, Tariq Modood, Joel Perlmann, Karen Phalet, Jeffrey G. Reitz, Rub&#233;n G. Rumbaut, Roxanne Silberman, Philippe Wanner, Aviva Zeltzer-Zubida, andYe Zhang.",
    // "description_html": "<p>One fifth of the population of the United States belongs to the immigrant or second generations.  While the US is generally thought of as the immigrant society par excellence, it now has a number of rivals in Europe. The Next Generation brings together studies from top immigration scholars to explore how the integration of immigrants affects the generations that come after. The original essays explore the early beginnings of the second generation in the United States and Western Europe, exploring the overall patterns of success of the second generation.<br>While there are many striking similarities in the situations of the children of labor immigrants coming from outside the highly developed worlds of Europe and North America, wherever one looks, subtle features of national and local contexts interact with characteristics of the immigrant groups themselves to create variations in second-generation trajectories.  The contributors show that these issues are of the utmost importance for the future, for they will determine the degree to which contemporary immigration will produce either durable ethno-racial cleavages or mainstream integration.<br>Contributors: Dalia Abdel-Hady, Frank D. Bean, Susan K. Brown, Maurice Crul, Nancy A. Denton, Rosita Fibbi, Nancy Foner, Anthony F. Heath, Donald J. Hernandez, Tariqul Islam, Frank Kalter, Philip Kasinitz, Mark A. Leach, Mathias Lerch, Suzanne E. Macartney, Karen G Marotz, Noriko Matsumoto, Tariq Modood, Joel Perlmann, Karen Phalet, Jeffrey G. Reitz, Rub&#233;n G. Rumbaut, Roxanne Silberman, Philippe Wanner, Aviva Zeltzer-Zubida, andYe Zhang.</p>",
    descriptionHtml:
        "<p>One fifth of the population of the United States belongs to the immigrant or second generations.  While the US is generally thought of as the immigrant society par excellence, it now has a number of rivals in Europe. The Next Generation brings together studies from top immigration scholars to explore how the integration of immigrants affects the generations that come after. The original essays explore the early beginnings of the second generation in the United States and Western Europe, exploring the overall patterns of success of the second generation.<br>While there are many striking similarities in the situations of the children of labor immigrants coming from outside the highly developed worlds of Europe and North America, wherever one looks, subtle features of national and local contexts interact with characteristics of the immigrant groups themselves to create variations in second-generation trajectories.  The contributors show that these issues are of the utmost importance for the future, for they will determine the degree to which contemporary immigration will produce either durable ethno-racial cleavages or mainstream integration.<br>Contributors: Dalia Abdel-Hady, Frank D. Bean, Susan K. Brown, Maurice Crul, Nancy A. Denton, Rosita Fibbi, Nancy Foner, Anthony F. Heath, Donald J. Hernandez, Tariqul Islam, Frank Kalter, Philip Kasinitz, Mark A. Leach, Mathias Lerch, Suzanne E. Macartney, Karen G Marotz, Noriko Matsumoto, Tariq Modood, Joel Perlmann, Karen Phalet, Jeffrey G. Reitz, Rub&#233;n G. Rumbaut, Roxanne Silberman, Philippe Wanner, Aviva Zeltzer-Zubida, andYe Zhang.</p>",
    // "format": "382 pages",
    pages: "382 pages",
    // "identifier": "9780814705384",
    openSquareId: "9780814705384",
    hasVideo: false,
    hasHiResImages: false,
    // missing required field: handle
    handle: "9780814705384",
    id: "9780814707432",
    isDownloadable: true,
    isbnHardcover: "9780814707432",
    isbnEbook: "9780814705384",
    isbnPaperback: "9780814707425",
    isbnLibrary: "9780814707432",
    language: "eng",
    license:
        "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License",
    // "license_abbreviation": "CC BY-NC-SA",
    licenseAbbreviation: "CC BY-NC-SA",
    // "license_icon": "https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png",
    licenseIcon: "https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png",
    // "license_link": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    licenseLink: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    // "nyu_press_website_buy_the_book_url": "https://nyupress.org/9780814707432",
    pressUrl: "https://nyupress.org/9780814707432",
    // "packageUrl": "epub_content/9780814705384",
    // "permanent_url": "https://doi.org/10.18574/nyu/9780814707425.001.0001",
    publisher: "NYU Press",
    // "rights": "All rights reserved",
    // "rootUrl": "epub_content/9780814705384",
    // does not correspond to the press' usual series field, more for internal use
    reivews: flatReviews,
    series: ["The Next Generation", "Next Gen"],
    seriesOpenAccess: [],
    // "subject": "Anthropology / History / Sociology",
    subjects: ["Anthropology", "History", "Sociology"],
    subtitle: "Immigrant Youth in a Comparative Perspective",
    // "thumbHref": "epub_content/9780814705384/ops/images/9780814705384-th.jpg",
    title: "The Next Generation",
    // "title_sort": "Next Generation",
    titleSort: "Next Generation",
    type: "Text",
    yearBook: "2011",
    yearOpenAccess: "2011",
};

export function SearchForm() {
    const [error, setError] = useState(false);
    const [searching, setSearching] = useState(false);
    const [publications, setPublications] = useState([
        example,
        example,
        example,
    ]);
    console.log(publications);

    // creates async call to solr with correct settings and urls
    const handleSubmit = async (event) => {
        // TODO: add query handler function to build the query needed for solr
        // TODO: handle query params with useSearchParams from react router
        // https://reactrouter.com/en/main/hooks/use-search-params
        // https://reactrouter.com/en/main/hooks/use-params
        const query = solrQueryFactory("something");
        event.preventDefault();
        setSearching(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_SOLR_PROTOCOL}://${
                    import.meta.env.VITE_SOLR_HOST
                }`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(query),
                }
            );

            // Handling server response
            if (!response.ok) {
                setSearching(false);
                throw new Error("Call to Solr failed");
            }
            setPublications(response);
        } catch (e) {
            console.log(e);
            setSearching(false);
            setError(e);
        }
    };

    return (
        <section style={{ border: "1px solid red" }}>
            <form id="osq-search" onSubmit={handleSubmit}>
                <div display="flex" className="container">
                    <input
                        aria-label="Search for books"
                        placeholder="Search for books"
                        type="text"
                        id="search-input"
                        name="search"
                    />
                    <button type="submit" aria-label="submit" value="submit">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                        >
                            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                        </svg>
                    </button>
                </div>
            </form>
            {searching ? (
                <Spinner />
            ) : (
                <ResultsPane
                    publications={publications}
                    error={error}
                    // highlights={}
                    // maxDescriptionLength={publications.maxDescriptionLength}
                    numBooks={publications.length}
                    // numBooks={}
                />
            )}
        </section>
    );
}
