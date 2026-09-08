# Письмо для Лилии

Один живой 3D-мирок: ночной фестиваль-аркада. Лилия ходит на **WASD**, камера — мышью, предметы подсвечиваются, взаимодействие — **E**.

Темыч получает одно письмо на `tyomych.tovkach@tayviscon.com`.

## Как играть

1. Подойти к золотому конверту у тории — **E**. Письмо встаёт в мире.
2. Три автомата: клешни / баскетбол / слот. Подобрать светящиеся штуки вокруг (Япония до 2, спорт до 3, секрет до 3).
3. Когда три станции живые — у табло загораются **ДА** и **НЕТ**. Первое «нет» убегает, второе ломает мир; починить можно только золотым **ДА**.
4. Пройти сквозь портал (спокойно / поиграть / япония), взять вкус, фонарь-дату и солнце/луну (день/вечер).
5. Подойти к билетному автомату в конце площади — **E**, письмо улетает Темычу.

КубГУ и «Вкусно и точка» — закрытые двери, не точки встречи.

## Локально

```bash
npm install
cp .env.example .env
```

```
VITE_WEB3FORMS_KEY=твой_ключ
```

Без ключа мир работает, отправка с автомата не долетит.

```bash
npm run dev
```

`http://127.0.0.1:47821`

## GitHub Pages

Репозиторий: [tyomych-tovkach/lilia](https://github.com/tyomych-tovkach/lilia)  
Боевая ссылка: [tyomych-tovkach.github.io/lilia](https://tyomych-tovkach.github.io/lilia/)

1. Settings → Pages → Source: **GitHub Actions**.
2. Secret `VITE_WEB3FORMS_KEY` с [web3forms.com](https://web3forms.com) на почту `tyomych.tovkach@tayviscon.com`.
3. Дождись workflow **Deploy GitHub Pages**.
4. Сам пройди мир и проверь письмо, потом кинь ссылку Лилии.

Модели автоматов — [Kenney Mini Arcade](https://kenney.nl/assets/mini-arcade) (CC0).

## Стек

Vite, React, TypeScript, React Three Fiber, Drei, Rapier. Почта — Web3Forms.
