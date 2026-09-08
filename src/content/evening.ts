import type { ActId, CustomTalk, LocationId, NpcCast, Sign, TalkOption } from './types.ts'

export const MAIL_TO = 'tyomych.tovkach@tayviscon.com'
export const DATE_MIN = '2026-09-12'
export const DATE_MAX = '2026-10-03'
export const DATE_CHAT = 'chat'

export const DATE_CHIPS = [
  '2026-09-12',
  '2026-09-13',
  '2026-09-19',
  '2026-09-20',
  '2026-09-26',
  '2026-09-27',
  '2026-10-03',
] as const

export const REQUIRED_ACTS: ActId[] = ['letter', 'yesno', 'date', 'send']
export const OPTIONAL_ACTS: ActId[] = ['japan', 'sport', 'secret']
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
  hub: { arch: 'ФОЙЕ', uiTitle: 'ФОЙЕ', uiObjective: 'Поговори с Таней, потом — в сад' },
  letter: { arch: 'АКТ I · САД', uiTitle: 'АКТ I · Сад', uiObjective: 'Поговори с Соней и прочти письмо' },
  japan: { arch: 'АКТ II · ЧАЙНАЯ', uiTitle: 'АКТ II · Чайная', uiObjective: 'Если хочешь — расскажи Ае про Японию' },
  sport: { arch: 'АКТ III · КОРТ', uiTitle: 'АКТ III · Корт', uiObjective: 'Если хочешь — скажи Рите, что твоё' },
  secret: { arch: 'АКТ IV · КРЫША', uiTitle: 'АКТ IV · Крыша', uiObjective: 'Если хочешь — расскажи Нине, что ещё любишь' },
  yesno: { arch: 'АКТ V · МОСТИК', uiTitle: 'АКТ V · Мостик', uiObjective: 'Ответь Оле. Можно честно' },
  date: { arch: 'АКТ VI · СТОЛ', uiTitle: 'АКТ VI · Стол', uiObjective: 'Собери вечер вместе с Катей' },
  send: { arch: 'АКТ VII · ПОЧТА', uiTitle: 'АКТ VII · Почта', uiObjective: 'Глянь сводку. Письмо уйдёт, только если нажмёшь' },
  kubgu: { arch: 'СЛУЖЕБКА', uiTitle: 'Кампус', uiObjective: 'КубГУ. Ты тут учишься — это не встреча' },
  vkusno: { arch: 'ПЕРСОНАЛ', uiTitle: 'Смена', uiObjective: '«Вкусно и точка». Ты тут работаешь — это не встреча' },
}

export const letterPaper = [
  'Лилия,',
  'На свадьбе ты была со стороны невесты, я — со стороны жениха.',
  'Мы флиртовали и танцевали. Мне с тобой было тепло.',
  'Сейчас я в отпуске с семьёй. Хочу увидеться с тобой в Краснодаре — с 12 сентября по 3 октября, днём или вечером. Вечер будет наш, не семейный обед.',
  'Если захочешь — дальше по фойе можно рассказать, что тебе близко. Если нет — тоже нормально.',
  'Темыч.',
]

export const japanOptions: TalkOption[] = [
  { id: 'еда', playerLine: 'Еда.', npcReact: 'Тогда вкусы. Запомню.' },
  { id: 'поездки', playerLine: 'Поездки.', npcReact: 'Дороги. Хорошо.' },
  { id: 'аниме / манга', playerLine: 'Аниме и манга.', npcReact: 'Страницы шуршат.' },
  { id: 'язык', playerLine: 'Язык.', npcReact: 'Слова. Нравится.' },
  { id: 'эстетика', playerLine: 'Эстетика.', npcReact: 'Свет, ткань, тишина.' },
  { id: 'настроение', playerLine: 'Просто настроение.', npcReact: 'И этого хватит.' },
]

export const sportKindOptions: TalkOption[] = [
  { id: 'волейбол', playerLine: 'Волейбол.', npcReact: 'Сетка. Поняла.' },
  { id: 'баскетбол', playerLine: 'Баскетбол.', npcReact: 'Кольцо. Ок.' },
  { id: 'теннис', playerLine: 'Теннис.', npcReact: 'Корт. Хорошо.' },
]

export const sportModeOptions: TalkOption[] = [
  { id: 'смотрю', playerLine: 'Смотрю.', npcReact: 'Трибуна тоже спорт.' },
  { id: 'играю', playerLine: 'Играю.', npcReact: 'Тогда живой матч, не лекция.' },
  { id: 'давай научишь', playerLine: 'Давай научишь.', npcReact: 'Смелость. Мне нравится.' },
]

export const sportOptions: TalkOption[] = [...sportKindOptions, ...sportModeOptions]

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
  npcAsk: 'Назови — любой ритуал считается.',
  placeholder: 'ещё спорт / ритуал',
  npcReact: 'Есть.',
  stateKey: 'sportCustom',
}

export const secretCustom: CustomTalk = {
  playerLine: 'А ещё я…',
  npcAsk: 'Своими словами. Это не тайна — просто чтобы вечер был про тебя.',
  placeholder: 'а ещё я…',
  npcReact: 'Услышала.',
  stateKey: 'secretCustom',
}

export const formatOptions: TalkOption[] = [
  { id: 'calm', playerLine: 'Спокойно.', npcReact: 'Тихий вечер. Мне нравится.' },
  { id: 'play', playerLine: 'Поиграть.', npcReact: 'Тогда корт или мяч — как скажешь.' },
  { id: 'japan', playerLine: 'Японское.', npcReact: 'Тогда место с характером, не допрос.' },
  { id: 'custom', playerLine: 'Своё место.', npcReact: 'Напиши, где тебе спокойно.' },
]

export const flavors: Record<'calm' | 'play' | 'japan', TalkOption[]> = {
  calm: [
    { id: 'кофе с японским акцентом', playerLine: 'Кофе с японским акцентом.', npcReact: 'Кофе. Тихо и тепло.' },
    { id: 'ужин', playerLine: 'Ужин.', npcReact: 'Стол на двоих.' },
    { id: 'прогулка', playerLine: 'Прогулка.', npcReact: 'Шаги, без спектакля.' },
    { id: 'десерт', playerLine: 'Десерт.', npcReact: 'Сладкое — тоже план.' },
  ],
  play: [
    { id: 'теннис', playerLine: 'Теннис.', npcReact: 'Корт. Запомню.' },
    { id: 'броски', playerLine: 'Броски.', npcReact: 'Кольцо и смех.' },
    { id: 'волейбол', playerLine: 'Волейбол.', npcReact: 'Сетка. Живо.' },
    { id: 'посмотреть игру', playerLine: 'Посмотреть игру.', npcReact: 'Трибуна на двоих.' },
  ],
  japan: [
    { id: 'рамен или изакая', playerLine: 'Рамен или изакая.', npcReact: 'Пар и свет.' },
    { id: 'караоке', playerLine: 'Караоке.', npcReact: 'Голос можно не беречь.' },
    { id: 'тематическое кафе', playerLine: 'Тематическое кафе.', npcReact: 'Маленькая сцена.' },
    { id: 'вечер как мини-фестиваль', playerLine: 'Вечер как мини-фестиваль.', npcReact: 'Фонари в кармане.' },
  ],
}

export const placeCustom: CustomTalk = {
  playerLine: 'Своё место.',
  npcAsk: 'Как выглядит встреча, которой нет на столе?',
  placeholder: 'книжный, набережная, тихий двор…',
  npcReact: 'Есть. Дальше — когда тебе удобно.',
  stateKey: 'customPlace',
}

export const slotOptions: TalkOption[] = [
  { id: 'day', playerLine: 'День.', npcReact: 'День. Почта — крайняя справа на северной стене.' },
  { id: 'evening', playerLine: 'Вечер.', npcReact: 'Вечер. Почта — крайняя справа на северной стене.' },
]

export const copy = {
  hint: 'WASD ходить · Пробел прыжок · клик по сцене — взгляд · Esc отпустить · E говорить · H подсказка',
  talkPrompt: 'E — поговорить',
  enterPrompt: 'E — войти',
  backPrompt: 'E — в фойе',
  locked: 'Ещё рано.',
  doneMark: 'готово',
  nowMark: 'сейчас',
  waitMark: 'ещё рано',
  optionalMark: 'по желанию',
  loader: 'собираем вечер…',
  noClose: 'Хорошо. Тогда без мостика — как скажешь. Можно вернуться, если передумаешь.',
  laterClose: 'Тогда в чате, без декораций. Можно вернуться сюда.',
  sending: 'летит…',
  sendFail: 'Не долетело. Можно нажать ещё раз.',
  sendAlready: 'Письмо уже у Темыча. Он напишет.',
  pcNote: 'Эта сцена собрана для ноутбука — удобнее с клавиатурой и мышью.',
}

export const greetings: Record<LocationId, string[]> = {
  hub: [
    'Лилия. Я Таня — смотрительница фойе.',
    'Прямо по ковру, золотая арка — Акт I, сад. Подойди и нажми E.',
    'С людьми тоже E. WASD — шаги, пробел — прыжок, клик по сцене — взгляд.',
    'Чайная, корт и крыша — по желанию, справа. Мостик откроется, когда прочтёшь письмо.',
  ],
  letter: [
    'Помнишь свадьбу? Ты была со стороны невесты, он — со стороны жениха.',
    'Вы флиртовали и танцевали. Ему это важно.',
    'Сейчас Темыч в отпуске с семьёй, поэтому прислал сад и письмо — не потому что не захотел прийти.',
    'Живая встреча — Краснодар, с двенадцатого сентября по третье октября. День или вечер, уже вдвоём.',
  ],
  japan: ['Садись. Не меню — любопытство. Можно пройти мимо, если не сейчас.', 'Япония. Что откликается? Можно два стикера.'],
  sport: ['Короткая разминка. Какой спорт твой? Можно до трёх.', 'А как — смотришь, играешь, учишь? Можно не выбирать.'],
  secret: ['Тут не шёпот и не допрос. Просто что ещё любишь.', 'До трёх меток. И если хочешь — «а ещё я…».'],
  yesno: [
    'Сцена почти готова. Вопрос простой, и «нет» здесь тоже ответ.',
    'Темыч хочет увидеться с тобой в Краснодаре, пока он в городе с семьёй — он сможет отойти на вечер для вас двоих. Встретимся?',
  ],
  date: ['Давай соберём вечер вместе. Один формат — или своё место.'],
  send: ['Одно письмо. Глянь сводку. Он будет рад, если отправишь — и напишет сам.'],
  kubgu: ['КубГУ, Ставропольская. Ты тут учишься.', 'Это служебка фойе, не свидание. Иди в сад, если ещё не была.'],
  vkusno: ['«Вкусно и точка». Зелёное, картошка, смена.', 'Сюда не зовут гулять. Ты тут работаешь. Вечер — в актах.'],
}

export const farewells: Record<LocationId, string> = {
  hub: 'Сад — прямо. Остальное подождёт.',
  letter: 'Письмо твоё. Мостик открыт прямо по фойе. Чайная, корт и крыша — справа, если захочешь.',
  japan: 'Запомню. Корт — дальше по правой стене.',
  sport: 'Ок. Крыша — ещё дальше по правой стене, если хочется чуть больше о себе.',
  secret: 'Хорошо. Мостик — вторая арка на северной стене.',
  yesno: 'Хорошо. Стол бронирования — справа от мостика.',
  date: 'Договорились. Почта — крайняя справа, если смотришь на сцену.',
  send: 'Улетело. Спасибо. Темыч напишет тебе в чате.',
  kubgu: 'Иди в акты. Я тут на пару.',
  vkusno: 'Пасхалка засчитана. Вечер — не со смены.',
}

export const limits = {
  japan: { min: 1, max: 2 },
  sport: { min: 1, max: 3 },
  sportMode: { min: 0, max: 2 },
  secret: { min: 1, max: 3 },
}
