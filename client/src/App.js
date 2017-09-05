import React, { Component } from 'react';
import './App.css';
import URLSearchParams from 'url-search-params';
import {Page, Card} from '@shopify/polaris';
import {EmbeddedApp} from '@shopify/polaris/embedded';

const shop = new URLSearchParams(window.location.search).get('shop');
const shopOrigin = (shop) ? `https://${shop}` : undefined;
const apiKey = new URLSearchParams(window.location.search).get('apiKey');

class App extends Component {
  render() {
    return (
      <EmbeddedApp
        apiKey={apiKey}
        shopOrigin={shopOrigin}
        forceRedirect
      >
        <Page title="Shopify React App Example.">
          <Card sectioned>
            <p>
              Go to <strong>http://localhost:3000/login?shop=&lt;your-shop&gt;.myshopify.com&apiKey=&lt;your-app-api-key&gt;</strong> to see how your embedded app work with Polaris
            </p>
            <br/>
            <p>
              Welcome to your Shopify React App.
            </p>
          </Card>
        </Page>
      </EmbeddedApp>
    );
  }
}

export default App;


