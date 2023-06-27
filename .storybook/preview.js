import '@gemeente-denhaag/design-tokens-components/dist/theme/index.css';
import '@utrecht/design-tokens/dist/index.css';
import 'design-token-editor/lib/css/dte.css';
import 'design-token-editor/lib/css/root.css';
import 'flatpickr';
import 'flatpickr/dist/l10n/nl.js';
import {initialize, mswDecorator, mswLoader} from 'msw-storybook-addon';
import {Formio, Templates} from 'react-formio';
import 'scss/dte-theme.scss';
// load these AFTER the community styles, which is closer in simulating the CSS loading
// order of our own components
import 'styles.scss';

// ensure NL locale is included
import OpenFormsModule from 'formio/module';
import OFLibrary from 'formio/templates';

import {reactIntl} from './reactIntl.js';

initialize({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: './mockServiceWorker.js',
  },
});

// Use our custom Form.io components
Formio.use(OpenFormsModule);
// use our own template library
Templates.current = OFLibrary;

export default {
  decorators: [mswDecorator],
  globals: {
    locale: reactIntl.defaultLocale,
    locales: {
      nl: 'Nederlands',
      en: 'English',
    },
  },
  parameters: {
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    reactIntl,
    themes: {
      default: 'Open Forms',
      target: 'root',
      list: [
        {name: 'Open Forms', class: 'openforms-theme', color: '#01689B'},
        {name: 'Gemeente Den Haag', class: 'denhaag-theme', color: 'hsl(138 58% 33%)'},
        {name: 'Gemeente Utrecht', class: 'utrecht-theme', color: '#cc0000'},
      ],
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Introduction',
          'Developers',
          'Pure React components',
          'Composites',
          'Form.io components',
          ['Docs', 'Vanilla', ['Docs'], 'Custom', ['Docs']],
          'Private API',
        ],
      },
    },
  },
  loaders: [mswLoader],
};
