import { NotFoundPage } from '@/views/not-found';
import { AppProviders } from './providers';

/**
 * Служебные страницы рендерятся вне обычного дерева и не наследуют
 * провайдеры из layout — поэтому обёртка подключается здесь явно.
 */
const NotFound = () => (
  <AppProviders>
    <NotFoundPage />
  </AppProviders>
);

export default NotFound;
