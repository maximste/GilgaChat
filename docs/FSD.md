# Feature-Sliced Design (FSD) в GilgaChat

Проект использует архитектуру [Feature-Sliced Design](https://feature-sliced.design/). Слои и импорты организованы по правилам FSD.

## Слои (снизу вверх)

- **shared** — переиспользуемый код без привязки к бизнесу: UI на базе **Block** (Handlebars + `registerComponent`), стили (`variables`, `global`), типы, утилиты и HTTP-клиент (`shared/lib`).
  - Примеры UI: `Button`, `Input`, `Label`, `Link`, `FormField`, `IconButton`, `Textarea`, `Search`, атомы сайдбара (`SidebarAvatar`, `SidebarPrimaryLine`, `SidebarSecondaryLine`, `SidebarUserStatus`), **toast** — `showErrorToast()` и компонент **ErrorToast** (Block + `.hbs`) для уведомлений об ошибках в правом верхнем углу. Регистрация общих блоков — `shared/ui/block/registerBlocks.ts`.
  - Слой **API** (без бизнес-логики страниц): `shared/lib/api` — `apiClient`, `HTTPTransport`, `authApi`, `chatsApi`, `userApi`, `ApiError` и типы ответов. Вызовы методов API в основном сосредоточены в **`app/controllers`**; виджеты при необходимости импортируют **`ApiError`** и типы для обработки ошибок и данных форм.
- **entities** — бизнес-сущности. Пока слой минимальный (`entities/user`), при росте доменной логики сюда выносят типы и модели.
- **features** — пользовательские сценарии: авторизация (`features/auth`), регистрация (`features/registration`), редактирование профиля (`features/edit-profile`).
- **widgets** — составные блоки: **MainLayout**, **MessengerLayout**, **Sidebar** (шапка, секции чатов, список, панель пользователя), **messengerCreate** (FAB «+», модалки Create DM / Create Group на **Block** + Handlebars), **ChatPage** (оболочка экрана переписки) и её части — **ChatHeader**, **ChatThread**, **ChatTimelineRow**, **ChatFooter**, **MessageComposer**, **NoChatStub**.
- **pages** — композиция страниц: auth, register, profile, messenger, not-found, server-error. Каждая страница экспортирует функцию `render*Page(container, props?)` или setup-функции (например, `setupMessengerChatPage` для правой колонки мессенджера).
- **app** — инициализация приложения, **Router** по pathname (History API, `APP_PATHS` в `shared/config/routes.ts`), подключение глобальных стилей, `registerComponent` для виджетов и блоков чата. Точка входа: `src/app/index.ts`.

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

- `@/shared/ui` (в т.ч. `showErrorToast`), `@/shared/lib/api`, `@/shared/lib/types`, `@/shared/lib/utils` (в т.ч. маппинг ленты чата `chatTimeline`)
- `@/features/auth`, `@/features/registration`, `@/features/edit-profile`
- `@/widgets/mainLayout`, `@/widgets/messengerLayout`, `@/widgets/sidebar`, `@/widgets/messengerCreate`, `@/widgets/chatPage`, `@/widgets/messageComposer`, `@/widgets/noChatStub`
- `@/pages/auth`, `@/pages/register`, `@/pages/profile`, `@/pages/messenger`, `@/pages/not-found`, `@/pages/server-error`
- `@/app` — точка входа и класс App

Внутренние файлы `widgets/chatPage/*` (кроме публичного `ChatPage` из `index.ts`) подключаются через `registerComponent` в `app`, а не импортируются из pages напрямую.

## Точка входа

В `index.html` подключён `src/app/index.ts`. Он подключает глобальные стили (`@/shared/styles/global.scss`), шрифты, `registerBlocks`, регистрирует виджеты мессенджера и чата и создаёт экземпляр `App`, который после загрузки DOM запускает роутер (`popstate` / `pushState`) и монтирует в `#app` блок выбранного маршрута.

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
    ├── ui/              # block, button, input, label, link, formField, iconButton, textarea, search, toast, sidebar/*
    ├── styles/          # variables, global, _colors, _buttons, …
    └── lib/             # api (клиент, auth/chats/user), types (в т.ч. лента чата), utils (в т.ч. HTTPTransport), mocks, validation
```
