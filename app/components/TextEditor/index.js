/**
 *
 * Asynchronously loads the component for TextEditor
 *
 */

import Loadable from 'react-loadable'

export default Loadable({
  loader: () => import('./TextEditor'),
  loading: () => null,
})
