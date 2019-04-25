import emotionReset from 'emotion-reset';
import { injectGlobal } from 'emotion';
import { webpageLike } from './styles';
import { palette } from '@guardian/pasteup/palette';
import { sans } from '@guardian/pasteup/typography';

const injectGlobalStyles = () => injectGlobal`
  ${emotionReset}
  :root {
      font-family: ${sans.body};
      -webkit-font-smoothing: antialiased;
      ${webpageLike(false)}
  }
  a {
      color: ${palette.brand.main};
  }
`;

export default injectGlobalStyles;
