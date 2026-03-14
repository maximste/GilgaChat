<h1 align="center">GilgaChat</h1>

Современный интерфейс мессенджера на TypeScript, Handlebars и Vite.  
Репозиторий содержит фронтенд GilgaChat: экран авторизации, переиспользуемые компоненты и страницы, которые можно развивать в полноценный мессенджер.

**Демо:** [https://maximste.github.io/GilgaChat/](https://maximste.github.io/GilgaChat/)

---

## Обзор

GilgaChat — учебный фронтенд-проект, в котором показано, как собрать небольшую компонентную систему без тяжёлого фреймворка.  
Вместо React/Vue используются:

- **TypeScript** — типизация.
- **Handlebars** — шаблоны и партиалы.
- **Vite** — сборка и dev-сервер.
- **SCSS** — стили.

В приложении реализована **навигация по hash** и есть **главная страница** (демо с ссылками), **layout мессенджера** (сайдбар и заглушка), формы **входа** и **регистрации**, страница **профиля**, страницы ошибок **404** и **500** — всё на базе переиспользуемых UI-компонентов.

**Архитектура:** проект организован по [Feature-Sliced Design (FSD)](https://feature-sliced.design/). Описание слоёв, правил импортов и точки входа — в [docs/FSD.md](docs/FSD.md).

## Возможности

- **Главная страница**
  - Временное сообщение о демо и ссылки на все сверстанные страницы: Мессенджер, Вход, Регистрация, Профиль, 404, 500.

- **Layout мессенджера** (`#messenger`)
  - Слева: сайдбар с названием приложения и выпадающим меню, поиском, списком **личных сообщений** (аватар, имя, превью последнего сообщения, индикатор статуса), списком **групп** (иконка, название, превью) и блоком текущего пользователя (имя, статус, ссылка на настройки).
  - Справа: заглушка **NoChatStub** («Чат не выбран» — место под будущий экран переписки).

- **Авторизация и профиль**
  - **Вход** (`#auth`) — форма входа с логотипом, полями email/пароль и ссылкой «Забыли пароль?».
  - **Регистрация** (`#register`) — форма регистрации (login, display_name, email, имя, фамилия, телефон, пароль).
  - **Профиль** (`#profile`) — карточка профиля, блок Profile Information (login, display name, email, имя, фамилия, телефон). Кнопка «Edit Profile» открывает форму редактирования (данные пользователя и опционально смена пароля: current password, new password).

- **Страницы ошибок**
  - **404** (`#404`) — «Oops! You're Lost in Cyberspace» с изображением, подсказками и кнопками «Take Me Home» / «Go Back».
  - **500** (`#500`) — «Houston, we have a problem!» с карточками статуса и кнопками «Try Again» / «Go Home».

- **Переиспользуемые UI-компоненты**
  - `Button`, `Input`, `Label`, `Link`, `FormField` — базовые компоненты для форм и layout’ов.
  - У каждого: класс на TypeScript, шаблон Handlebars (`.hbs`), стили SCSS.

- **Layout’ы**
  - **MainLayout** — шапка (GilgaChat, Вход / Регистрация) и область контента для авторизации, профиля, ошибок и главной.
  - **MessengerLayout** — сайдбар и основная область (например, NoChatStub или будущий экран чата).

- **Разработка и деплой**
  - Dev-сервер Vite с hot reload, сборка TypeScript + Vite.
  - Netlify: публикация из `dist/`.
  - GitHub Actions для CI (тесты по спринтам).

## Стек

- **Язык:** TypeScript
- **Сборка и dev-сервер:** Vite
- **Шаблоны:** Handlebars
- **Стили:** SCSS
- **Деплой:** [GitHub Pages](https://maximste.github.io/GilgaChat/) (актуальная версия). Netlify (`https://gilgachat.netlify.app/`) — неактуальная версия; проект на Netlify не деплоится из-за проблем с работой сервиса.

## Дизайн и прототипы

- Макет в Figma: [GilgaChat UI](https://www.figma.com/design/sbXZfnJcFjbmh9L6nxRv7W/GilgaChat?node-id=13-9452&t=vIzquu2G5jxpVV9o-1)

## Начало работы

### Требования

- **Node.js**: 22.x (рекомендуется, совпадает с настройками CI)
- **npm**: поставляется с Node.js

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

## Структура проекта (FSD)

```text
.
├── index.html               # Подключение src/app/index.ts
├── public
│   └── images/              # Статика (логотип, изображение для 404)
├── src
│   ├── app/                 # Точка входа, роутинг по hash, класс App
│   ├── pages/               # Страницы: auth, register, profile, messenger, not-found, server-error
│   ├── widgets/             # main-layout, messenger-layout, no-chat-stub
│   ├── features/            # auth, registration, edit-profile
│   ├── entities/            # user (заглушка)
│   └── shared/
│       ├── ui/              # button, input, label, link, form-field
│       ├── styles/          # variables, global, _colors, _buttons, …
│       └── lib/             # types, utils (mydash)
├── docs/
│   └── FSD.md               # Описание архитектуры FSD
├── vite.config.ts           # Конфиг Vite (base, build, preview port: 3000)
├── netlify.toml             # Netlify: команда сборки, каталог публикации dist
└── .github/workflows/       # CI (тесты по спринтам)
```

Подробнее — в [docs/FSD.md](docs/FSD.md).

## Как устроено

- Точка входа — `src/app/index.ts`: подключаются глобальные стили и создаётся экземпляр `App`. В `App` подписаны события `DOMContentLoaded` и `hashchange`; по `window.location.hash` вызывается соответствующая страница из `pages/`.
- **Роутинг:**
  - `#messenger` или пустой hash → **renderMessengerPage** (MessengerLayout + NoChatStub).
  - `#auth`, `#register`, `#profile`, `#404`, `#500` → сначала рендерится **MainLayout**, затем в область контента вызывается **renderAuthPage**, **renderRegisterPage**, **renderProfilePage**, **renderNotFoundPage** или **renderServerErrorPage**.
  - Неизвестный hash → снова **renderMessengerPage**.
- При переходе с `#messenger` на другой маршрут корень перерисовывается с MainLayout. Компоненты (формы, страницы) используют Handlebars-партиалы и классы на TypeScript; форма редактирования профиля рендерится по клику на «Edit Profile» внутри области контента профиля.

## Разработка и соглашения

- Проект изначально был учебным по спринтам, поэтому могут встречаться ветки вроде `sprint_1`, `sprint_2` и т.п.
- Workflow GitHub Actions запускает автоматические тесты для этих веток при pull request в `main`.
- Для своей разработки или open-source можно оставить этот workflow или настроить свою стратегию веток.

## Деплой

Актуальная версия проекта раздаётся с **GitHub Pages** (см. раздел ниже). Конфигурация для Netlify в репозитории сохранена, но из-за проблем с работой сервиса Netlify проект там не деплоится; ссылка [gilgachat.netlify.app](https://gilgachat.netlify.app/) может вести на неактуальную версию.

- Соберите проект локально:

  ```bash
  npm run build
  ```

- Результат сборки попадает в `dist/`. Содержимое `public/` (например, `images/`) копируется в `dist/`.
- Раздавать можно вручную: содержимое `dist/` подойдёт для любого статического хостинга (GitHub Pages, Vercel, nginx и т.д.).

### GitHub Pages (автодеплой из ветки deploy)

1. В репозитории: **Settings → Pages**.
2. В блоке **Build and deployment** выберите **Source: GitHub Actions**.
3. Ветка **deploy**: при каждом пуше в неё workflow `.github/workflows/deploy-pages.yml` запускает сборку на GitHub (Node.js 22, `npm ci`, `npm run build`) и публикует каталог `dist/` на GitHub Pages.

Сайт будет доступен по адресу вида `https://<username>.github.io/<repo>/`. Для SPA важно задать **base** в `vite.config.ts` равным `'/<repo>/'` (например, `'/GilgaChat/'`), иначе маршруты по hash и статика будут отдаваться с неправильного пути.

## Планы

- **Сделано:** экран регистрации, страница профиля, 404/500, layout мессенджера (сайдбар и заглушка), роутинг по hash, редиректы и заголовки для Netlify.
- **Дальше:** полноценный экран чата в основной области мессенджера (сообщения, поле ввода), валидация форм и обработка ошибок, восстановление пароля.
- **Позже:** бэкенд-API для авторизации и чата.

## Лицензия

Проект создан в учебных целях и пока не содержит явной open-source лицензии.  
Если планируете использовать его в продакшене или как основу для open-source проекта, добавьте файл лицензии (например, MIT) по своему выбору.
