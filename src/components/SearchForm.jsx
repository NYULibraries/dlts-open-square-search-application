import React from 'react';
import { useState } from 'react';
import { Spinner } from './Spinner';
import { ResultsPane } from './ResultsPane';
import { solrSearch } from '../utils/open-square-solr';

export function SearchForm() {
  const [error, setError] = useState(false);
  const [highlighting, setHighlighting] = useState();
  // used to determine if the user has done any searches at all yet
  const [searched, setSearched] = useState(false);
  // use to determine if the user is in the middle of a search
  // used to disable the button when searching
  const [searching, setSearching] = useState(false);
  // there is no initial load of data, search bar shown empty
  const [publications, setPublications] = useState([]);

  /**
   * method that makes the fetch call to Solr
   * @param {event} event - browser event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const query = event.target.search.value;
    setSearched(true);
    setSearching(true);
    setPublications([]);
    setHighlighting();

    // we pick up query fields from the front-end because they are intended to be weighted and modified
    // by the user via the UI, and then passed back into the query for the search call.
    // for now, no query field manipulation yet
    // use internal google doc for new keys in the newer solr schema
    const QUERY_FIELDS = {
      // author -> contributors -> contributorsAsASentence
      contributorsAsASentence: {
        highlight: true,
        weight: 4,
      },
      // date -> dateOpenAccess -> dateBook
      dateBook: {
        highlight: true,
        weight: 1,
      },
      description: {
        highlight: true,
        weight: 2,
      },
      // series_names -> series
      series: {
        highlight: true,
        weight: 3,
      },
      subtitle: {
        highlight: true,
        weight: 4,
      },
      title: {
        highlight: true,
        weight: 4,
      },
    };

    try {
      const data = await solrSearch(query, QUERY_FIELDS);
      if (data.response.numFound > 0) {
        setSearching(false);
        setPublications(data.response.docs);
        setHighlighting(data.highlighting);
      } else {
        setSearching(false);
        // no results hanlded in ResultsPane
      }
    } catch (error) {
      setSearching(false);
      setError(true);
    }
  };

  return (
    <>
      <section className="hero is-primary osq-searchbox-hero">
        <div className="hero-body">
          <div className="osq-search-layout">
            <form className="osq-searchform" onSubmit={handleSubmit}>
              <div className="osq-searchbox osq-search">
                <input
                  aria-label="Search for books"
                  placeholder="Search for books"
                  type="text"
                  id="osq-searchinput"
                  name="search"
                />
                <button
                  type="submit"
                  aria-label="submit"
                  value="submit"
                  disabled={searching}
                >
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

            <aside className="beta-callout ">
              <b>NYU faculty, staff, and students:</b>
              <br />
              Discover Books by Meaning. Explore Beyond Keywords. <br />
              Try the{' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://nlp-metadata-library-project-web-g-karms-nlp-dev.apps.cloud.rt.nyu.edu/"
              >
                Beta Semantic Search Interface
                <span className="sr-only">
                  (external site; opens in a new tab)
                </span>
              </a>{' '}
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                fill="#57068c"
                width="15"
                height="15"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M25.152 16.576v5.696q0 2.144-1.504 3.648t-3.648 1.504h-14.848q-2.144 0-3.648-1.504t-1.504-3.648v-14.848q0-2.112 1.504-3.616t3.648-1.536h12.576q0.224 0 0.384 0.16t0.16 0.416v1.152q0 0.256-0.16 0.416t-0.384 0.16h-12.576q-1.184 0-2.016 0.832t-0.864 2.016v14.848q0 1.184 0.864 2.016t2.016 0.864h14.848q1.184 0 2.016-0.864t0.832-2.016v-5.696q0-0.256 0.16-0.416t0.416-0.16h1.152q0.256 0 0.416 0.16t0.16 0.416zM32 1.152v9.12q0 0.48-0.352 0.8t-0.8 0.352-0.8-0.352l-3.136-3.136-11.648 11.648q-0.16 0.192-0.416 0.192t-0.384-0.192l-2.048-2.048q-0.192-0.16-0.192-0.384t0.192-0.416l11.648-11.648-3.136-3.136q-0.352-0.352-0.352-0.8t0.352-0.8 0.8-0.352h9.12q0.48 0 0.8 0.352t0.352 0.8z"></path>
              </svg>{' '}
              (On campus or VPN required), part of NYU Libraries' research
              project to explore a new way of discovering books beyond
              traditional keyword searches.
            </aside>
            <div className="osq-search-results">
              {searching && <Spinner />}
              {!searching && publications && (
                <ResultsPane
                  publications={publications}
                  error={error}
                  highlighting={highlighting}
                  // maxDescriptionLength={publications.maxDescriptionLength}
                  numBooks={publications.length}
                  searched={searched}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
