import type { ActId, CustomTalk, LocationId, NpcCast, Sign, TalkOption } from './types'

export const MAIL_TO = 'tyomych.tovkach@tayviscon.com'
export const DATE_MIN = '2026-09-12'
export const DATE_MAX = '2026-10-03'

export const DATE_CHIPS = [
  '2026-09-12',
  '2026-09-13',
  '2026-09-19',
  '2026-09-20',
  '2026-09-26',
  '2026-09-27',
  '2026-10-03',
] as const

export const ACT_ORDER: ActId[] = ['letter', 'japan', 'sport', 'secret', 'yesno', 'date', 'send']

export const npcs: Record<string, NpcCast> = {
  tanya: { id: 'tanya', name: 'Таня', role: 'смотрительница фойе', skin: '#f3c2ab', hair: '#3a2218', cloth: '#c45c4a', accent: '#ffd27a' },
  sonya: { id: 'sonya', name: 'Соня', role: 'подруга невесты', skin: '#f6d0b8', hair: '#1a1210', cloth: '#e8d5c4', accent: '#e8a0b8' },
  aya: { id: 'aya', name: 'Ая', role: 'хозяйка чайной', skin: '#efc4b0', hair: '#1c1010', cloth: '#5a1a28', accent: '#ff8aa0' },
  rita: { id: 'rita', name: 'Рита', role: 'тренер', skin: '#e8b898', hair: '#4a2818', cloth: '#2a6a44', accent: '#7dffb3' },
  nina: { id: 'nina', name: 'Нина', role: 'с блокнотом', skin: '#f0c8b4', hair: '#2a1828', cloth: '#3a2a6a', accent: '#d0a0ff' },
  olya: { id: 'olya', name: 'Оля', role: 'билетёрша', skin: '#f2c8b0', hair: '#c45a38', cloth: '#8a2030', accent: '#ffd27a' },
  katya: { id: 'katya', name: 'Катя', role: 'распорядительница', skin: '#f4d0bc', hair: '#5a3a28', cloth: '#c4a070', accent: '#ffe6b0' },
  gena: { id: 'gena', name: 'Гена', role: 'почтальон', skin: '#e8c0a8', hair: '#2a2a2a', cloth: '#3a5a8a', accent: '#ffd27a' },
  max: { id: 'max', name: 'Макс', role: 'студент', skin: '#e0b898', hair: '#1a1a1a', cloth: '#4a5a7a', accent: '#c9b48a' },
  lena: { id: 'lena', name: 'Лена', role: 'смена', skin: '#f0c4a8', hair: '#3a2010', cloth: '#1a4a32', accent: '#e8782c' },
}

export const signs: Record<LocationId, Sign> = {
  hub: { arch: 'ВЕЧЕР В СЕМИ АКТАХ', uiTitle: 'ФОЙЕ', uiObjective: 'Открой текущий акт' },
  letter: { arch: 'АКТ I · САД', uiTitle: 'АКТ I · Сад', uiObjective: 'Поговори с Соней' },
  japan: { arch: 'АКТ II · ЧАЙНАЯ', uiTitle: 'АКТ II · Чайная', uiObjective: 'Расскажи Ае про Японию' },
  sport: { arch: 'АКТ III · КОРТ', uiTitle: 'АКТ III · Корт', uiObjective: 'Скажи Рите, что твоё' },
  secret: { arch: 'АКТ IV · КРЫША', uiTitle: 'АКТ IV · Крыша', uiObjective: 'Шепни Нине секрет' },
  yesno: { arch: 'АКТ V · МОСТИК', uiTitle: 'АКТ V · Мостик', uiObjective: 'Ответь Оле' },
  date: { arch: 'АКТ VI · СТОЛ', uiTitle: 'АКТ VI · Стол', uiObjective: 'Собери вечер с Катей' },
  send: { arch: 'АКТ VII · ПОЧТА', uiTitle: 'АКТ VII · Почта', uiObjective: 'Отправь письмо Темычу' },
  kubgu: { arch: 'КУБГУ', uiTitle: 'Кампус', uiObjective: 'Свидание сюда не ставим' },
  vkusno: { arch: 'ВКУСНО И ТОЧКА', uiTitle: 'Смена', uiObjective: 'Это работа, не свидание' },
}

export const letterPaper = [
  'Лилия,',
  'Свадьба была живая.',
  'Сейчас я в отпуске с семьёй.',
  'Если увидимся — Краснодар, с 12 сентября по 3 октября.',
  'Дальше по двору люди спросят глупости. Это не анкета.',
  'Темыч.',
]

export const japanOptions: TalkOption[] = [
  { id: 'еда', playerLine: 'Еда.', npcReact: 'Вкусы. Хорошо.' },
  { id: 'поездки', playerLine: 'Поездки.', npcReact: 'Дороги. Записала.' },
  { id: 'аниме / манга', playerLine: 'Аниме и манга.', npcReact: 'Страницы шуршат.' },
  { id: 'язык', playerLine: 'Язык.', npcReact: 'Слова. Нравится.' },
  { id: 'эстетика', playerLine: 'Эстетика.', npcReact: 'Свет, ткань, тишина.' },
  { id: 'просто вайб', playerLine: 'Просто вайб.', npcReact: 'И этого хватит.' },
]

export const sportOptions: TalkOption[] = [
  { id: 'волейбол', playerLine: 'Волейбол.', npcReact: 'Сетка. Поняла.' },
  { id: 'баскетбол', playerLine: 'Баскетбол.', npcReact: 'Кольцо. Ок.' },
  { id: 'теннис', playerLine: 'Теннис.', npcReact: 'Корт. Хорошо.' },
  { id: 'смотрю', playerLine: 'Смотрю.', npcReact: 'Трибуна тоже спорт.' },
  { id: 'играю', playerLine: 'Играю.', npcReact: 'Живые руки.' },
  { id: 'давай научишь', playerLine: 'Давай научишь.', npcReact: 'Смелая строчка.' },
]

export const secretOptions: TalkOption[] = [
  { id: 'танцы', playerLine: 'Танцы.', npcReact: 'Свадьба это подтвердила.' },
  { id: 'музыка', playerLine: 'Музыка.', npcReact: 'Тихо записала.' },
  { id: 'кино', playerLine: 'Кино.', npcReact: 'Темнота и экран.' },
  { id: 'прогулки', playerLine: 'Прогулки.', npcReact: 'Шаги. Хорошо.' },
  { id: 'сладкое', playerLine: 'Сладкое.', npcReact: 'Честно.' },
]

export const japanCustom: CustomTalk = {
  playerLine: 'Своё слово.',
  npcAsk: 'Одно слово. Я запомню.',
  placeholder: 'своё слово про Японию',
  npcReact: 'Не из списка. Ещё лучше.',
  stateKey: 'japanCustom',
}

export const sportCustom: CustomTalk = {
  playerLine: 'Ещё какой спорт.',
  npcAsk: 'Назови. Запишу на ладони.',
  placeholder: 'ещё спорт / ритуал',
  npcReact: 'Есть.',
  stateKey: 'sportCustom',
}

export const secretCustom: CustomTalk = {
  playerLine: 'А ещё я…',
  npcAsk: 'Договаривай. Я не сдам — только Темычу в письме.',
  placeholder: 'а ещё я…',
  npcReact: 'Шёпот принят.',
  stateKey: 'secretCustom',
}

export const formatOptions: TalkOption[] = [
  { id: 'calm', playerLine: 'Спокойно.', npcReact: 'Без спектакля. Хорошо.' },
  { id: 'play', playerLine: 'Поиграть.', npcReact: 'Мяч или корт. Поняла.' },
  { id: 'japan', playerLine: 'Японское.', npcReact: 'Как мини-сцена, не как допрос.' },
  { id: 'custom', playerLine: 'Своё место.', npcReact: 'Напиши, где. Готовые сеттинги снимаю.' },
]

export const flavors: Record<'calm' | 'play' | 'japan', TalkOption[]> = {
  calm: [
    { id: 'кофе с японским акцентом', playerLine: 'Кофе с японским акцентом.', npcReact: 'Один. Записала.' },
    { id: 'ужин', playerLine: 'Ужин.', npcReact: 'Один. Записала.' },
    { id: 'прогулка', playerLine: 'Прогулка.', npcReact: 'Один. Записала.' },
    { id: 'десерт', playerLine: 'Десерт.', npcReact: 'Один. Записала.' },
  ],
  play: [
    { id: 'теннис', playerLine: 'Теннис.', npcReact: 'Один. Записала.' },
    { id: 'броски', playerLine: 'Броски.', npcReact: 'Один. Записала.' },
    { id: 'волейбол', playerLine: 'Волейбол.', npcReact: 'Один. Записала.' },
    { id: 'посмотреть игру', playerLine: 'Посмотреть игру.', npcReact: 'Один. Записала.' },
  ],
  japan: [
    { id: 'рамен или изакая', playerLine: 'Рамен или изакая.', npcReact: 'Один. Записала.' },
    { id: 'караоке', playerLine: 'Караоке.', npcReact: 'Один. Записала.' },
    { id: 'тематическое кафе', playerLine: 'Тематическое кафе.', npcReact: 'Один. Записала.' },
    { id: 'вечер как мини-фестиваль', playerLine: 'Вечер как мини-фестиваль.', npcReact: 'Один. Записала.' },
  ],
}

export const placeCustom: CustomTalk = {
  playerLine: 'Своё место.',
  npcAsk: 'Как выглядит встреча, которой нет на столе?',
  placeholder: 'книжный, набережная, тихий двор…',
  npcReact: 'Есть. Дальше — когда.',
  stateKey: 'customPlace',
}

export const slotOptions: TalkOption[] = [
  { id: 'day', playerLine: 'День.', npcReact: 'Записала. Почта в конце двора.' },
  { id: 'evening', playerLine: 'Вечер.', npcReact: 'Записала. Почта в конце двора.' },
]

export const copy = {
  hint: 'WASD ходить · Пробел прыжок · мышь — взгляд · E говорить',
  talkPrompt: 'E — поговорить',
  enterPrompt: 'E — войти',
  backPrompt: 'E — в фойе',
  locked: 'Ещё рано. Сначала текущий акт.',
  doneMark: 'готово',
  nowMark: 'сейчас',
  waitMark: 'ещё рано',
  loader: 'собираем вечер…',
  crashTitle: 'Критическая ошибка в постановке: обнаружен БАГ',
  crashBody: 'Реплика «Нет» перевелась как «уронить декорации». Поднять занавес может только Лилия.',
  restoreCta: 'Поднять занавес · Да',
  noDodge: '«Нет» ускакало. Неуклюжий реквизит.',
  sending: 'летит…',
  sendFail: 'Не долетело. Подойди ещё раз.',
}

export const greetings: Record<LocationId, string[]> = {
  hub: ['Лилия? Вечер разложен по актам. Не анкета — сцены.', 'Сначала сад. Потом чайная, корт, крыша, мостик, стол, почта.'],
  letter: [
    'Помнишь свадьбу? Ты — со стороны невесты, он — со стороны жениха.',
    'Флирт. Танцы. Вечер оборвали на самом интересном.',
    'Темыч сейчас в отпуске с семьёй. Сам не пришёл — оставил меня и письмо.',
    'Живая встреча — Краснодар, с двенадцатого сентября по третье октября. День или вечер.',
    'Дальше не допрос. Просто люди, которые спросят глупости.',
  ],
  japan: ['Садись. Не меню — любопытство.', 'Япония. Что откликается? Можно два стикера.'],
  sport: ['Разминка короткой. Что твоё?', 'До трёх. Можно смотреть, играть, учить.'],
  secret: ['Это уже не анкета. Это шёпот.', 'До трёх меток. И если хочешь — «а ещё я…».'],
  yesno: ['Сцена почти готова. Вопрос простой.', 'Встретимся в Краснодаре? Пока он в отпуске — слот живой.'],
  date: ['Один формат. Один вкус. Или своё место.'],
  send: ['Письмо одно. Глянь сводку — и решай.'],
  kubgu: ['КубГУ. Кампус, не дверь. Ты тут учишься.', 'Свидание в универ не ставим. Хотя столовка интригует.'],
  vkusno: ['Красное-зелёное. Бургеры. Смена.', 'Сюда не зовут. Ты тут работаешь, а не тусуешься.'],
}

export const farewells: Record<LocationId, string> = {
  hub: 'Можно вернуться в готовое. Перескочить — нет.',
  letter: 'Второй акт открыт. Чайная светится.',
  japan: 'Запомню. Корт ждёт — Рита уже стучит мячом.',
  sport: 'Ок. Крыша открыта. Там Нина — она собирает секреты.',
  secret: 'Хватит. Мостик внизу. Там вопрос побольше.',
  yesno: 'Хорошо. Стол бронирования зажёгся.',
  date: 'Записала. Почта в конце двора.',
  send: 'Улетело. Темыч уже читает. Час договорите в чате.',
  kubgu: 'Иди в акты. Я тут на пару.',
  vkusno: 'Пасхалка засчитана. Иди с вечера, не со смены.',
}

export const limits = {
  japan: { min: 1, max: 2 },
  sport: { min: 1, max: 3 },
  secret: { min: 1, max: 3 },
}
