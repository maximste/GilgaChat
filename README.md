<h1 align="center">GilgaChat</h1>

Современный интерфейс мессенджера на TypeScript, Handlebars и Vite.  
Репозиторий содержит фронтенд GilgaChat: экран авторизации, переиспользуемые компоненты и страницы, которые можно развивать в полноценный мессенджер.

**Демо:** [https://maximste.github.io/GilgaChat/](https://maximste.github.io/GilgaChat/)

## Обзор

GilgaChat — учебный фронтенд-проект, в котором показано, как собрать небольшую компонентную систему без тяжёлого фреймворка.  
Вместо React/Vue используются:

- **TypeScript** — типизация.
- **Handlebars** — шаблоны; вложенные блоки подключаются через зарегистрированные хелперы (`registerComponent`).
- **Vite** — сборка и dev-сервер.
- **SCSS** — стили.

В приложении реализована навигация по hash и есть главная страница (демо с ссылками), layout мессенджера (сайдбар и основная область: заглушка или экран переписки), формы входа и регистрации, страница профиля, страницы ошибок 404 и 500. Интерфейс строится на базовом классе **Block** (шаблон + DOM + жизненный цикл) и переиспользуемых UI-блоках.

Проект организован по [Feature-Sliced Design (FSD)](https://feature-sliced.design/): слои `shared`, `features`, `widgets`, `pages`, `app`. Подробнее — в [docs/FSD.md](docs/FSD.md).

## Возможности

**Главная страница**

Временное сообщение о демо и ссылки на все сверстанные страницы: Мессенджер, Вход, Регистрация, Профиль, 404, 500.

**Layout мессенджера** (`#messenger` или пустой hash)

Слева: сайдбар с названием приложения и выпадающим меню, поиском, списком личных сообщений (аватар, имя, превью последнего сообщения, индикатор статуса), списком групп (иконка, название, превью) и блоком текущего пользователя (имя, статус, ссылка на настройки).

Справа: пока чат не выбран — заглушка **NoChatStub** («Выберите чат»); после выбора диалога в списке — **ChatPage**: шапка с действиями, лента сообщений (даты и входящие/исходящие сообщения), индикатор набора, внизу **MessageComposer** для ввода и отправки. У чатов без сообщений в ленте показывается вложенная заглушка «Нет сообщений». Данные чатов и ленты пока на моках.

**Авторизация и профиль**

**Вход** (`#auth`) — форма входа с логотипом, полями email/пароль и ссылкой «Забыли пароль?».  
**Регистрация** (`#register`) — форма (login, display_name, email, имя, фамилия, телефон, пароль).  
**Профиль** (`#profile`) — карточка профиля, блок Profile Information (login, display name, email, имя, фамилия, телефон). Кнопка «Edit Profile» открывает форму редактирования (данные пользователя и опционально смена пароля: current password, new password).

Клиентская **валидация** полей на формах входа, регистрации и редактирования профиля.

**Страницы ошибок**

**404** (`#404`) — «Oops! You're Lost in Cyberspace» с изображением, подсказками и кнопками «Take Me Home» / «Go Back».  
**500** (`#500`) — «Houston, we have a problem!» с карточками статуса и кнопками «Try Again» / «Go Home».

**Переиспользуемые UI-компоненты**

Среди блоков в `shared/ui`: **Button**, **Input**, **Label**, **Link**, **FormField**, **IconButton**, **Textarea**, **Search**, атомы сайдбара (**SidebarAvatar**, **SidebarPrimaryLine** и др.). У типичного компонента: класс на TypeScript, шаблон `.hbs`, стили SCSS; родительские шаблоны вставляют дочерние блоки через `registerComponent`.

**Layout’ы**

**MainLayout** — шапка (GilgaChat, Вход / Регистрация) и область контента для авторизации, профиля, ошибок и главной.  
**MessengerLayout** — сайдбар и основная область мессенджера.  
**ChatPage** (виджет) — **ChatHeader**, **ChatThread** (строки ленты **ChatTimelineRow** + индикатор набора), **ChatFooter** с **MessageComposer**.

**Разработка и деплой**

Dev-сервер Vite с hot reload, сборка TypeScript + Vite.  
Netlify: публикация из `dist/`.  
GitHub Actions для CI (тесты по спринтам).  
ESLint, Stylelint, Prettier, husky (по настройкам репозитория).

## Стек

- **Язык:** TypeScript
- **Сборка и dev-сервер:** Vite
- **Шаблоны:** Handlebars
- **Стили:** SCSS
- **Деплой:** [GitHub Pages](https://maximste.github.io/GilgaChat/) (актуальная версия). Netlify (`https://gilgachat.netlify.app/`) — неактуальная версия; проект на Netlify не деплоится из-за проблем с работой сервиса.

## Дизайн и прототипы

Макет в Figma: [GilgaChat UI](https://www.figma.com/design/sbXZfnJcFjbmh9L6nxRv7W/GilgaChat?node-id=13-9452&t=vIzquu2G5jxpVV9o-1)

## Начало работы

### Требования

- **Node.js:** 22.x (рекомендуется, совпадает с настройками CI)
- **npm:** поставляется с Node.js

### Установка

```bash
git clone https://github.com/maximste/GilgaChat.git
cd GilgaChat
npm install
```

### Скрипты

Запуск dev-сервера:

```bash
npm run dev
```

Сборка для продакшена:

```bash
npm run build
```

Локальный просмотр продакшен-сборки:

```bash
npm run preview
```

Сборка и просмотр одной командой:

```bash
npm run start
```

## Структура проекта

```text
.
├── index.html               # Подключение src/app/index.ts
├── public
│   └── images/              # Статика (логотип, изображение для 404)
├── src
│   ├── app/                 # Точка входа, класс App, роутинг по hash, registerComponent для виджетов
│   ├── pages/               # Страницы и setup-функции (auth, register, profile, messenger, not-found, server-error)
│   ├── widgets/
│   │   ├── mainLayout/      # Шапка + контент (авторизация, профиль, ошибки, главная)
│   │   ├── messengerLayout/ # Сайдбар + область под чат / заглушку
│   │   ├── sidebar/         # Сайдбар: секции чатов, список, панель пользователя, событие выбора чата
│   │   ├── chatPage/        # ChatPage, ChatHeader, ChatThread, ChatTimelineRow, ChatFooter
│   │   ├── messageComposer/ # Поле ввода и отправка сообщения (событие в чат)
│   │   └── noChatStub/      # Заглушка «чат не выбран» / пустая область
│   ├── features/
│   │   ├── auth/ui/         # Форма входа
│   │   ├── registration/ui/ # Форма регистрации
│   │   └── editProfile/ui/  # Форма редактирования профиля
│   ├── entities/            # user (заглушка под рост домена)
│   └── shared/
│       ├── ui/              # block, button, input, label, link, formField, iconButton, textarea, search, sidebar/*
│       ├── styles/          # global, variables, _colors, _buttons, …
│       └── lib/             # types, utils, mocks, validation
├── docs/
│   └── FSD.md               # Слои FSD и правила импортов
├── vite.config.ts           # Конфиг Vite (base, build, preview port: 3000)
├── netlify.toml             # Netlify: команда сборки, каталог публикации dist
└── .github/workflows/       # CI (тесты по спринтам), деплой на GitHub Pages из ветки deploy
```

Кратко о слоях и импортах — в [docs/FSD.md](docs/FSD.md).

## Как устроено

Точка входа — `src/app/index.ts`: глобальные стили, регистрация общих и виджетных блоков, создание `App`. В `App` подписаны `DOMContentLoaded` и `hashchange`; по `window.location.hash` монтируется нужный корневой layout и вызываются функции из `pages/`.

**Роутинг**

- Пустой hash или `#messenger` — в `#app` монтируется **MessengerLayout**, затем **setupMessengerChatPage**: справа сначала **NoChatStub**, после выбора чата в сайдбаре — **ChatPage**.
- `#auth`, `#register`, `#profile`, `#404`, `#500` — **MainLayout** и в область контента рендерятся соответствующие страницы (**renderAuthPage**, **renderRegisterPage** и т.д.).
- Неизвестный hash — снова мессенджер (**MessengerLayout** + **setupMessengerChatPage**), как и для пустого hash.

При переходе с мессенджера на другой маршрут корень `#app` перерисовывается под **MainLayout**. Форма редактирования профиля открывается по клику «Edit Profile» внутри области контента профиля.

## Разработка и соглашения

Проект изначально был учебным по спринтам, поэтому могут встречаться ветки вроде `sprint_1`, `sprint_2` и т.п.  
Workflow GitHub Actions запускает автоматические тесты для этих веток при pull request в `main`.  
Для своей разработки или open-source можно оставить этот workflow или настроить свою стратегию веток.

## Деплой

Актуальная версия проекта раздаётся с **GitHub Pages** (см. раздел ниже). Конфигурация для Netlify в репозитории сохранена, но из-за проблем с работой сервиса Netlify проект там не деплоится; ссылка [gilgachat.netlify.app](https://gilgachat.netlify.app/) может вести на неактуальную версию.

Соберите проект локально:

```bash
npm run build
```

Результат сборки попадает в `dist/`. Содержимое `public/` (например, `images/`) копируется в `dist/`.

Раздавать можно вручную: содержимое `dist/` подойдёт для любого статического хостинга (GitHub Pages, Vercel, nginx и т.д.).

### GitHub Pages (автодеплой из ветки deploy)

1. В репозитории: **Settings → Pages**.
2. В блоке **Build and deployment** выберите **Source: GitHub Actions**.
3. Ветка **deploy**: при каждом пуше в неё workflow `.github/workflows/deploy-pages.yml` запускает сборку на GitHub (Node.js 22, `npm ci`, `npm run build`) и публикует каталог `dist/` на GitHub Pages.

Сайт будет доступен по адресу вида `https://<username>.github.io/<repo>/`. Для SPA важно задать **base** в `vite.config.ts` равным `'/<repo>/'` (например, `'/GilgaChat/'`), иначе маршруты по hash и статика будут отдаваться с неправильного пути.

## Планы

**Сделано:** переход на FSD и **Block**, экран мессенджера с сайдбаром и выбором чата, **ChatPage** (лента, **MessageComposer**, отправка сообщений на клиенте), валидация форм входа / регистрации / редактирования профиля, страницы регистрации и профиля, 404/500, линтинг и соглашения по коду, роутинг по hash, редиректы и заголовки для Netlify, автодеплой на GitHub Pages из ветки `deploy`.

**Дальше:** обработка ошибок с сервера (когда появится API), восстановление пароля, доработка чата (реальные данные, вложения, поиск по чату).

**Позже:** бэкенд-API для авторизации и чата.

## Лицензия

Проект создан в учебных целях и пока не содержит явной open-source лицензии.  
Если планируете использовать его в продакшене или как основу для open-source проекта, добавьте файл лицензии (например, MIT) по своему выбору.
