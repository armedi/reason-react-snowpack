require('@babel/register')({
  presets: ['@babel/preset-env'],
  ignore: [],
});

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { make: App } = require('../src/App.bs');

// for production SSG

const route = process.argv[2];

process.stdout.write(
  ReactDOMServer.renderToString(
    React.createElement(App, { serverUrl: createReasonReactRouterUrl(route) })
  )
);

function createReasonReactRouterUrl(url) {
  let $url = new URL('http://host/' + (url || ''));
  return {
    path: $url.pathname
      .split('/')
      .filter(Boolean)
      .reduceRight((a, v) => ({ hd: v, tl: a }), 0),
    hash: $url.hash.replace(/^#/, ''),
    search: $url.search.replace(/^\?/, ''),
  };
}
