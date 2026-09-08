# Письмо для Лилии

Ночной фестиваль-аркада: приглашение на второй тайм после свадьбы. Лилия собирает карточку игрока, выбирает формат встречи — Темыч получает одно письмо на `tyomych.tovkach@tayviscon.com`.

Сайт заточен под ноутбук. На телефоне сначала просьба открыть на ноуте, затем упрощённый 2D-путь с теми же актами.

## Локально

```bash
npm install
cp .env.example .env
```

В `.env` положи ключ Web3Forms:

```
VITE_WEB3FORMS_KEY=твой_ключ
```

Без ключа аркада работает, но кнопка «отправить Темычу» не доставит письмо.

```bash
npm run dev
```

Откроется `http://127.0.0.1:47821`.

```bash
npm run build
npm run preview
```

## GitHub Pages

Репозиторий: [tyomych-tovkach/lilia](https://github.com/tyomych-tovkach/lilia)  
Боевая ссылка после деплоя: [tyomych-tovkach.github.io/lilia](https://tyomych-tovkach.github.io/lilia/)

1. Settings → Pages → Source: **GitHub Actions**.
2. Settings → Secrets and variables → Actions → `VITE_WEB3FORMS_KEY` = ключ с [web3forms.com](https://web3forms.com). При создании ключа укажи почту `tyomych.tovkach@tayviscon.com`.
3. Дождись workflow **Deploy GitHub Pages**.
4. Открой боевой URL, пройди путь до отправки и проверь почту (и спам).
5. Кинь Лилии ссылку в чат: «открой на ноутбуке, лучше в полный экран».

`vite.config.ts` ставит `base: './'`, поэтому ассеты живут и как project site (`username.github.io/repo/`), и как user site.

Ссылка секретна тем, что её видит только Лилия. Логина нет. В превью Telegram заголовок «Письмо для Лилии», без спойлера свидания.

## Что внутри

Шесть актов в одной Three.js-сцене (React Three Fiber): конверт у тории → письмо со свадьбы → три автомата разведки → табло Да/Нет → порталы встречи → сводка.

Главная шутка: первое «Нет» уворачивается, второе «ломает» мир. Настоящего отказа навсегда нет — Лилия чинит систему кнопкой «Да».

КубГУ и «Вкусно и точка» — пасхальные двери, не адреса свидания.

Даты встречи: **12.09.2026 – 03.10.2026**, слот день или вечер.

## Стек

Vite, React, TypeScript, React Three Fiber, Drei. Почта — Web3Forms (GitHub Pages сам письма не шлёт).
