/**
 * @durak-master/game-core
 *
 * Чистые правила дурака. Ключевое ограничение пакета:
 * ЗДЕСЬ НЕТ импортов транспорта, БД, NestJS, React и любых вендоров.
 * Только типы из @durak-master/schemas и чистые функции.
 *
 * Это позволяет:
 *   — тестировать правила без сети и БД;
 *   — переиспользовать движок на клиенте для предиктивного UI;
 *   — сменить транспорт/хостинг, не переписывая игру.
 *
 * Точка входа сервера — `reduce(state, userId, action)`: возвращает НОВОЕ
 * состояние либо код ошибки, и никогда не мутирует вход.
 */

export * from './bot';
export * from './deck';
export * from './reduce';
export * from './rules';
export * from './setup';
export * from './timeout';
export * from './view';
