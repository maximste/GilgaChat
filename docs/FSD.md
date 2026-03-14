# Feature-Sliced Design (FSD) в GilgaChat

Проект использует архитектуру [Feature-Sliced Design](https://feature-sliced.design/). Слои и импорты организованы по правилам FSD.

## Слои (снизу вверх)

- **shared** — переиспользуемый код без привязки к бизнесу: UI-компоненты (Button, Input, Label, Link, FormField), стили (variables, global), типы и утилиты (`shared/lib`).
- **entities** — бизнес-сущности. Пока слой минимальный (`entities/user`), при росте доменной логики сюда выносят типы и модели.
- **features** — пользовательские сценарии: авторизация (`features/auth`), регистрация (`features/registration`), редактирование профиля (`features/edit-profile`).
- **widgets** — составные блоки: MainLayout, MessengerLayout, NoChatStub.
- **pages** — композиция страниц: auth, register, profile, messenger, not-found, server-error. Каждая страница экспортирует функцию `render*Page(container, props?)`.
- **app** — инициализация приложения, роутинг по hash, подключение глобальных стилей. Точка входа: `src/app/index.ts`.

## Правило импортов

Импорты разрешены только **вниз** по слоям:

- `app` → pages, при необходимости widgets
- `pages` → widgets, features
- `widgets` → features, shared
- `features` → entities, shared
- `entities` → shared
- `shared` — без импортов из других слоёв

Запрещено: импортировать из вышележащего слоя (например, features не импортируют из widgets или pages).

## Публичный API слайсов

Используются только публичные экспорты через `index.ts`. Внешний код импортирует слой целиком, без указания внутренних файлов:

- `@/shared/ui`, `@/shared/lib/types`
- `@/features/auth`, `@/features/registration`, `@/features/edit-profile`
- `@/widgets/main-layout`, `@/widgets/messenger-layout`, `@/widgets/no-chat-stub`
- `@/pages/auth`, `@/pages/register`, `@/pages/profile`, `@/pages/messenger`, `@/pages/not-found`, `@/pages/server-error`
- `@/app` — точка входа и класс App

## Точка входа

В `index.html` подключён `src/app/index.ts`. Он подключает глобальные стили (`@/shared/styles/global.scss`), шрифты и создаёт экземпляр `App`, который вешает обработку `hashchange` и по hash вызывает соответствующую `render*Page`.

## Структура каталогов (кратко)

```
src/
├── app/                 # Инициализация, роутинг
├── pages/               # Страницы (auth, register, profile, messenger, not-found, server-error)
├── widgets/             # main-layout, messenger-layout, no-chat-stub
├── features/            # auth, registration, edit-profile
├── entities/            # user (заглушка)
└── shared/
    ├── ui/              # button, input, label, link, form-field
    ├── styles/          # variables, global, _colors, _buttons, …
    └── lib/             # types, utils
```
