import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/engines.css';

import { route, start } from './lib/router.js';
import { CoverPage } from './pages/cover.js';
import { MenuPage } from './pages/menu.js';
import { LessonPage } from './pages/lesson.js';

route('/', CoverPage);
route('/indice', MenuPage);
route('/leccion/:id', LessonPage);

start(document.getElementById('app'));
