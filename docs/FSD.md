# Feature-Sliced Design (FSD) в GilgaChat

Проект использует архитектуру [Feature-Sliced Design](https://feature-sliced.design/). Слои и импорты организованы по правилам FSD.

## Слои (снизу вверх)

- **shared** — переиспользуемый код без привязки к бизнесу: UI на базе **Block** (Handlebars + `registerComponent`), стили (`variables`, `global`), типы и утилиты (`shared/lib`).
  - Примеры UI: `Button`, `Input`, `Label`, `Link`, `FormField`, `IconButton`, `Textarea`, `Search`, атомы сайдбара (`SidebarAvatar`, `SidebarPrimaryLine`, `SidebarSecondaryLine`, `SidebarUserStatus`). Регистрация общих блоков — `shared/ui/block/registerBlocks.ts`.
- **entities** — бизнес-сущности. Пока слой минимальный (`entities/user`), при росте доменной логики сюда выносят типы и модели.
- **features** — пользовательские сценарии: авторизация (`features/auth`), регистрация (`features/registration`), редактирование профиля (`features/edit-profile`).
- **widgets** — составные блоки: **MainLayout**, **MessengerLayout**, **Sidebar** (шапка, секции чатов, список, панель пользователя), **messengerCreate** (FAB «+», модалки Create DM / Create Group на **Block** + Handlebars), **ChatPage** (оболочка экрана переписки) и её части — **ChatHeader**, **ChatThread**, **ChatTimelineRow**, **ChatFooter**, **MessageComposer**, **NoChatStub**.
- **pages** — композиция страниц: auth, register, profile, messenger, not-found, server-error. Каждая страница экспортирует функцию `render*Page(container, props?)` или setup-функции (например, `setupMessengerChatPage` для правой колонки мессенджера).
- **app** — инициализация приложения, роутинг по hash, подключение глобальных стилей, `registerComponent` для виджетов и блоков чата. Точка входа: `src/app/index.ts`.

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

- `@/shared/ui`, `@/shared/lib/types`, `@/shared/lib/utils` (в т.ч. маппинг ленты чата `chatTimeline`)
- `@/features/auth`, `@/features/registration`, `@/features/edit-profile`
- `@/widgets/mainLayout`, `@/widgets/messengerLayout`, `@/widgets/sidebar`, `@/widgets/messengerCreate`, `@/widgets/chatPage`, `@/widgets/messageComposer`, `@/widgets/noChatStub`
- `@/pages/auth`, `@/pages/register`, `@/pages/profile`, `@/pages/messenger`, `@/pages/not-found`, `@/pages/server-error`
- `@/app` — точка входа и класс App

Внутренние файлы `widgets/chatPage/*` (кроме публичного `ChatPage` из `index.ts`) подключаются через `registerComponent` в `app`, а не импортируются из pages напрямую.

## Точка входа

В `index.html` подключён `src/app/index.ts`. Он подключает глобальные стили (`@/shared/styles/global.scss`), шрифты, `registerBlocks`, регистрирует виджеты мессенджера и чата и создаёт экземпляр `App`, который вешает обработку `hashchange` и по hash вызывает соответствующую `render*Page`.

## Структура каталогов (кратко)

```
src/
├── app/                 # Инициализация, роутинг, registerComponent для чата/сайдбара
├── pages/               # Страницы (auth, register, profile, messenger, not-found, server-error)
├── widgets/
│   ├── mainLayout/
│   ├── messengerLayout/
│   ├── sidebar/         # Sidebar, секции, элементы списка, панель пользователя
│   ├── chatPage/        # ChatPage, ChatHeader, ChatThread, ChatTimelineRow, ChatFooter
│   ├── messageComposer/
│   ├── messengerCreate/ # FAB + модалки создания чатов (setupMessengerCreateUi)
│   └── noChatStub/
├── features/            # auth, registration, edit-profile
├── entities/            # user (заглушка)
└── shared/
    ├── ui/              # block, button, input, label, link, formField, iconButton, textarea, search, sidebar/*
    ├── styles/          # variables, global, _colors, _buttons, …
    └── lib/             # types (в т.ч. лента чата), utils, mocks
```
