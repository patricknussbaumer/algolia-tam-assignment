/*import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';

// Instant Search Widgets
import { hits, searchBox, configure } from 'instantsearch.js/es/widgets';

// Autocomplete Template
import autocompleteProductTemplate from '../templates/autocomplete-product';

/**
 * @class Autocomplete
 * @description Instant Search class to display content in the page's autocomplete
 */
/*
class Autocomplete {
  /**
   * @constructor
   */
/*
  constructor() {
    this._registerClient();
    this._registerWidgets();
    this._startSearch();
  }

  /**
   * @private
   * Handles creating the search client and creating an instance of instant search
   * @return {void}
   */
/*
  _registerClient() {
    this._searchClient = algoliasearch(
      'FNSGMRR5FU',
      'ba5314fb4d8213183d5a71f1246b1749'
    );

    this._searchInstance = instantsearch({
      indexName: 'Product',
      searchClient: this._searchClient,
    });
  }

  /**
   * @private
   * Adds widgets to the Algolia instant search instance
   * @return {void}
   */
/*
  _registerWidgets() {
    this._searchInstance.addWidgets([
      configure({
        hitsPerPage: 3,
      }),
      searchBox({
        container: '#searchbox',
      }),
      hits({
        container: '#autocomplete-hits',
        templates: { item: autocompleteProductTemplate },
      }),
    ]);
  }

  /**
   * @private
   * Starts instant search after widgets are registered
   * @return {void}
   */
/*
  _startSearch() {
    this._searchInstance.start();
  }
}

export default Autocomplete;
*/

// Import Algolia & Autocomplete Packages
import {
  autocomplete,
  getAlgoliaResults,
  getAlgoliaFacets,
} from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import algoliasearch from 'algoliasearch';
import { h, Fragment } from 'preact';

// Import the Autocomplete Classic Theme
import '@algolia/autocomplete-theme-classic';

// Instantiate the Algolia search client
const appId = 'FNSGMRR5FU';
const apiKey = 'ba5314fb4d8213183d5a71f1246b1749';
const searchClient = algoliasearch(appId, apiKey);

// Create the Query Suggestions plugin
const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'Product_query_suggestions_facets',
  getSearchParams({ state }) {
    return { hitsPerPage: state.query ? 3 : 10 };
  },
});

autocomplete({
  container: '#autocomplete', //Define where your search box goes in the DOM
  placeholder: 'Search for products', //Define placeholder text
  openOnFocus: true, //If true, dropdown appears as soon as users focuses the input to display trending searches
  // debug: true, //If true, keeps the panel open when inspecting elements in your browser DevTools
  plugins: [querySuggestionsPlugin], //Add the Query Suggestions plugin
  getSources({ query, state }) {
    if (!query) {
      return [];
    }

    return [
      {
        sourceId: 'products',
        getItems() {
          return getAlgoliaResults({
            searchClient,
            queries: [
              {
                indexName: 'Product',
                query,
                params: {
                  hitsPerPage: 3,
                  attributesToSnippet: ['name:10'],
                  snippetEllipsisText: '…',
                },
              },
            ],
          });
        },
        templates: {
          header() {
            return (
              <Fragment>
                <span className="aa-SourceHeaderTitle">Products</span>
                <div className="aa-SourceHeaderLine" />
              </Fragment>
            );
          },
          item({ item, components }) {
            return <ProductItem hit={item} components={components} />;
          },
          noResults() {
            return 'No products for this query.';
          },
        },
      },
    ];
  },
});

// Add template for Product items
function ProductItem({ hit, components }) {
  return (
    <a href={hit.url} className="aa-ItemLink">
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
          <img src={hit.image} alt={hit.name} width="40" height="40" />
        </div>
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <components.Snippet hit={hit} attribute="name" />
          </div>
          <div className="aa-ItemContentDescription">
            From <strong>{hit.brand}</strong> in{' '}
            <strong>{hit.categories[0]}</strong>
          </div>
          {hit.rating > 0 && (
            <div className="aa-ItemContentDescription">
              <div style={{ display: 'flex', gap: 1, color: '#ffc107' }}>
                {Array.from({ length: 5 }, (_value, index) => {
                  const isFilled = hit.rating >= index + 1;

                  return (
                    <svg
                      key={index}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={isFilled ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  );
                })}
              </div>
            </div>
          )}
          <div className="aa-ItemContentDescription" style={{ color: '#000' }}>
            <strong>${hit.price.toLocaleString()}</strong>
          </div>
        </div>
      </div>
      <div className="aa-ItemActions">
        <button
          className="aa-ItemActionButton aa-DesktopOnly aa-ActiveOnly"
          type="button"
          title="Select"
          style={{ pointerEvents: 'none' }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M18.984 6.984h2.016v6h-15.188l3.609 3.609-1.406 1.406-6-6 6-6 1.406 1.406-3.609 3.609h13.172v-4.031z" />
          </svg>
        </button>
        <button
          className="aa-ItemActionButton"
          type="button"
          title="Add to cart"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M19 5h-14l1.5-2h11zM21.794 5.392l-2.994-3.992c-0.196-0.261-0.494-0.399-0.8-0.4h-12c-0.326 0-0.616 0.156-0.8 0.4l-2.994 3.992c-0.043 0.056-0.081 0.117-0.111 0.182-0.065 0.137-0.096 0.283-0.095 0.426v14c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h14c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-14c0-0.219-0.071-0.422-0.189-0.585-0.004-0.005-0.007-0.010-0.011-0.015zM4 7h16v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-14c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707zM15 10c0 0.829-0.335 1.577-0.879 2.121s-1.292 0.879-2.121 0.879-1.577-0.335-2.121-0.879-0.879-1.292-0.879-2.121c0-0.552-0.448-1-1-1s-1 0.448-1 1c0 1.38 0.561 2.632 1.464 3.536s2.156 1.464 3.536 1.464 2.632-0.561 3.536-1.464 1.464-2.156 1.464-3.536c0-0.552-0.448-1-1-1s-1 0.448-1 1z" />
          </svg>
        </button>
      </div>
    </a>
  );
}
