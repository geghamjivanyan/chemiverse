// Курируемый набор знаменитых/школьных реакций для вкладки «Реакции».
// en/ru заполнены; hy подтянем переводом (GPT) — пока fallback на ru/en.

export type Effect = 'flame' | 'explosion' | 'gas' | 'fizz' | 'heat' | 'light' | 'precipitate';

export interface Species {
  f: string; // формула (Хилл, как в нашей базе)
  n?: number; // коэффициент
}

export interface Reaction {
  id: string;
  title: { en: string; ru: string; hy?: string };
  desc: { en: string; ru: string; hy?: string };
  effect: Effect;
  left: Species[];
  right: Species[];
}

export const EFFECTS: Record<Effect, { emoji: string; en: string; ru: string; hy: string }> = {
  flame: { emoji: '🔥', en: 'Flame', ru: 'Пламя', hy: 'Բոց' },
  explosion: { emoji: '💥', en: 'Explosion', ru: 'Взрыв', hy: 'Պայթյուն' },
  gas: { emoji: '💨', en: 'Gas released', ru: 'Выделяется газ', hy: 'Գազ' },
  fizz: { emoji: '🫧', en: 'Fizzing', ru: 'Шипение', hy: 'Փրփուր' },
  heat: { emoji: '🌡️', en: 'Heat', ru: 'Тепло', hy: 'Ջերմություն' },
  light: { emoji: '✨', en: 'Bright light', ru: 'Яркий свет', hy: 'Լույս' },
  precipitate: { emoji: '⬇️', en: 'Precipitate', ru: 'Осадок', hy: 'Նստվածք' },
};

export const REACTIONS: Reaction[] = [
  {
    id: 'water',
    title: { en: 'Burning hydrogen', ru: 'Горение водорода' },
    desc: { en: 'Hydrogen burns in oxygen and forms water — with a loud pop.', ru: 'Водород горит в кислороде и образует воду — с громким хлопком.' },
    effect: 'explosion',
    left: [{ f: 'H2', n: 2 }, { f: 'O2' }],
    right: [{ f: 'H2O', n: 2 }],
  },
  {
    id: 'methane',
    title: { en: 'Burning natural gas', ru: 'Горение природного газа' },
    desc: { en: 'Methane burns on your stove, giving carbon dioxide and water.', ru: 'Метан горит в плите, давая углекислый газ и воду.' },
    effect: 'flame',
    left: [{ f: 'CH4' }, { f: 'O2', n: 2 }],
    right: [{ f: 'CO2' }, { f: 'H2O', n: 2 }],
  },
  {
    id: 'carbon',
    title: { en: 'Burning coal', ru: 'Горение угля' },
    desc: { en: 'Carbon burns and releases the carbon dioxide we exhale.', ru: 'Углерод сгорает и выделяет углекислый газ — тот, что мы выдыхаем.' },
    effect: 'flame',
    left: [{ f: 'C' }, { f: 'O2' }],
    right: [{ f: 'CO2' }],
  },
  {
    id: 'magnesium',
    title: { en: 'Burning magnesium', ru: 'Горение магния' },
    desc: { en: 'Magnesium burns with a blinding white light.', ru: 'Магний горит ослепительно ярким белым светом.' },
    effect: 'light',
    left: [{ f: 'Mg', n: 2 }, { f: 'O2' }],
    right: [{ f: 'MgO', n: 2 }],
  },
  {
    id: 'salt',
    title: { en: 'Making table salt', ru: 'Получение поваренной соли' },
    desc: { en: 'Sodium and chlorine combine into the salt on your table.', ru: 'Натрий и хлор соединяются в соль, что у тебя на столе.' },
    effect: 'flame',
    left: [{ f: 'Na', n: 2 }, { f: 'Cl2' }],
    right: [{ f: 'ClNa', n: 2 }],
  },
  {
    id: 'ammonia',
    title: { en: 'Making ammonia (Haber)', ru: 'Синтез аммиака (Габер)' },
    desc: { en: 'Nitrogen and hydrogen form ammonia — the basis of fertilizers.', ru: 'Азот и водород образуют аммиак — основу удобрений.' },
    effect: 'heat',
    left: [{ f: 'N2' }, { f: 'H2', n: 3 }],
    right: [{ f: 'H3N', n: 2 }],
  },
  {
    id: 'rust',
    title: { en: 'Rusting of iron', ru: 'Ржавление железа' },
    desc: { en: 'Iron reacts slowly with oxygen and turns into rust.', ru: 'Железо медленно реагирует с кислородом и превращается в ржавчину.' },
    effect: 'heat',
    left: [{ f: 'Fe', n: 4 }, { f: 'O2', n: 3 }],
    right: [{ f: 'Fe2O3', n: 2 }],
  },
  {
    id: 'peroxide',
    title: { en: 'Decomposing peroxide', ru: 'Разложение перекиси' },
    desc: { en: 'Hydrogen peroxide breaks down into water and oxygen.', ru: 'Перекись водорода распадается на воду и кислород.' },
    effect: 'gas',
    left: [{ f: 'H2O2', n: 2 }],
    right: [{ f: 'H2O', n: 2 }, { f: 'O2' }],
  },
  {
    id: 'neutralization',
    title: { en: 'Acid + base', ru: 'Кислота + щёлочь' },
    desc: { en: 'Hydrochloric acid and lye neutralize into salt and water.', ru: 'Соляная кислота и щёлочь нейтрализуются в соль и воду.' },
    effect: 'heat',
    left: [{ f: 'ClH' }, { f: 'HNaO' }],
    right: [{ f: 'ClNa' }, { f: 'H2O' }],
  },
  {
    id: 'zinc-acid',
    title: { en: 'Metal in acid', ru: 'Металл в кислоте' },
    desc: { en: 'Zinc dissolves in acid, bubbling off hydrogen gas.', ru: 'Цинк растворяется в кислоте, выделяя пузырьки водорода.' },
    effect: 'fizz',
    left: [{ f: 'Zn' }, { f: 'ClH', n: 2 }],
    right: [{ f: 'Cl2Zn' }, { f: 'H2' }],
  },
  {
    id: 'limestone',
    title: { en: 'Roasting limestone', ru: 'Обжиг известняка' },
    desc: { en: 'Heating chalk drives off carbon dioxide, leaving quicklime.', ru: 'При нагреве мела выходит углекислый газ, остаётся негашёная известь.' },
    effect: 'gas',
    left: [{ f: 'CCaO3' }],
    right: [{ f: 'CaO' }, { f: 'CO2' }],
  },
  {
    id: 'electrolysis',
    title: { en: 'Splitting water', ru: 'Электролиз воды' },
    desc: { en: 'Electricity splits water into hydrogen and oxygen.', ru: 'Электрический ток разлагает воду на водород и кислород.' },
    effect: 'gas',
    left: [{ f: 'H2O', n: 2 }],
    right: [{ f: 'H2', n: 2 }, { f: 'O2' }],
  },
  {
    id: 'soda-vinegar',
    title: { en: 'Baking soda + vinegar', ru: 'Сода + уксус' },
    desc: { en: 'The classic fizzy volcano — carbon dioxide foams up.', ru: 'Классический шипучий вулкан — пенится углекислый газ.' },
    effect: 'fizz',
    left: [{ f: 'C2H4O2' }, { f: 'CHNaO3' }],
    right: [{ f: 'C2H3NaO2' }, { f: 'H2O' }, { f: 'CO2' }],
  },
  {
    id: 'photosynthesis',
    title: { en: 'Photosynthesis', ru: 'Фотосинтез' },
    desc: { en: 'Plants turn carbon dioxide and water into sugar and oxygen.', ru: 'Растения превращают углекислый газ и воду в сахар и кислород.' },
    effect: 'light',
    left: [{ f: 'CO2', n: 6 }, { f: 'H2O', n: 6 }],
    right: [{ f: 'C6H12O6' }, { f: 'O2', n: 6 }],
  },
  {
    id: 'respiration',
    title: { en: 'Respiration', ru: 'Дыхание' },
    desc: { en: 'Your body burns sugar with oxygen to release energy.', ru: 'Тело сжигает сахар кислородом, чтобы получить энергию.' },
    effect: 'heat',
    left: [{ f: 'C6H12O6' }, { f: 'O2', n: 6 }],
    right: [{ f: 'CO2', n: 6 }, { f: 'H2O', n: 6 }],
  },
  {
    id: 'quicklime',
    title: { en: 'Slaking lime', ru: 'Гашение извести' },
    desc: { en: 'Quicklime reacts with water and gets very hot.', ru: 'Негашёная известь реагирует с водой и сильно нагревается.' },
    effect: 'heat',
    left: [{ f: 'CaO' }, { f: 'H2O' }],
    right: [{ f: 'CaH2O2' }],
  },
  {
    id: 'sulfur',
    title: { en: 'Burning sulfur', ru: 'Горение серы' },
    desc: { en: 'Sulfur burns with a blue flame into choking sulfur dioxide.', ru: 'Сера горит синим пламенем, давая едкий сернистый газ.' },
    effect: 'flame',
    left: [{ f: 'S' }, { f: 'O2' }],
    right: [{ f: 'O2S' }],
  },
  {
    id: 'hcl-synth',
    title: { en: 'Making hydrochloric acid', ru: 'Синтез соляной кислоты' },
    desc: { en: 'Hydrogen and chlorine combine into hydrogen chloride.', ru: 'Водород и хлор соединяются в хлороводород.' },
    effect: 'explosion',
    left: [{ f: 'H2' }, { f: 'Cl2' }],
    right: [{ f: 'ClH', n: 2 }],
  },
];
