import type { BondType, ElementCategory, Locale, Phase } from '@chemverse/shared';

/** Полный набор строк интерфейса. TypeScript заставит заполнить все ключи в каждом языке. */
export interface Dict {
  subtitle: string;
  searchPlaceholder: string;
  server: string;
  db: string;
  footer: string;
  detailHint1: string;
  detailHint2: string;
  protons: string;
  neutrons: string;
  electrons: string;
  atomicMass: string;
  amu: string;
  periodGroup: string;
  block: string;
  blockSuffix: string;
  state: string;
  electronegativity: string;
  configuration: string;
  shells: string;
  valences: string;
  language: string;
  reset: string;
  bench: string;
  benchHint: string;
  add: string;
  assemble: string;
  unknownCombo: string;
  discovered: string;
  close: string;
  composition: string;
  hands: string;
  handsHint: string;
  cameraDenied: string;
  loadingModel: string;
  inspect: string;
  inspectHint: string;
  exciteBtn: string;
  shellsBtn: string;
  resetBtn: string;
  modeBohr: string;
  modeOrbitals: string;
  molarMass: string;
  atoms: string;
  discoveredBy: string;
  density: string;
  melting: string;
  boiling: string;
  ionization: string;
  appearance: string;
  source: string;
  about: string;
  atomicRadius: string;
  oxidationStates: string;
  yearDiscovered: string;
  isotopes: string;
  tabOverview: string;
  tabProperties: string;
  tabFacts: string;
  supEN: string;
  supMelt: string;
  supDense: string;
  supLight: string;
  signIn: string;
  signUp: string;
  logout: string;
  nickname: string;
  password: string;
  continueGuest: string;
  signInGoogle: string;
  haveAccount: string;
  noAccount: string;
  loginTagline: string;
  heroTitle: string;
  heroSubtitle: string;
  start: string;
  zoomDiamond: string;
  zoomLattice: string;
  zoomAtom: string;
  zoomShells: string;
  zoomNucleus: string;
  scrollHint: string;
  navHub: string;
  navTable: string;
  navLab: string;
  navBooks: string;
  bookGrade: string;
  navSearch: string;
  navLearn: string;
  navNotebook: string;
  navProfile: string;
  back: string;
  hubHi: string;
  doorExplore: string;
  doorExploreDesc: string;
  doorLearn: string;
  doorLearnDesc: string;
  doorLab: string;
  doorLabDesc: string;
  comingSoon: string;
  moleculesOpened: string;
  searchElements: string;
  searchMolecules: string;
  searchSubstances: string;
  searchNothing: string;
  achievements: string;
  labSandbox: string;
  labChallenges: string;
  labReactions: string;
  labReal: string;
  labNotReal: string;
  labOpen: string;
  labAdded: string;
  labEmpty: string;
  labFrequent: string;
  labAllElements: string;
  authFailed: string;
  nicknameTaken: string;
  badCredentials: string;
  passwordShort: string;
  guest: string;
  bookSearch: string;
  nbTitle: string;
  nbAll: string;
  nbPage: string;
  nbAdd: string;
  nbPlaceholder: string;
  nbEmptyPage: string;
  nbEmptyAll: string;
  nbColor: string;
  nbGoto: string;
  nbEdit: string;
  nbDelete: string;
  categories: Record<ElementCategory, string>;
  phases: Record<Phase, string>;
  bond: Record<BondType, string>;
}

const en: Dict = {
  subtitle: 'Periodic table · 118 elements',
  searchPlaceholder: 'search: symbol, name or number…',
  server: 'server',
  db: 'db',
  footer: 'phase 1 · periodic table',
  detailHint1: 'Hover or pick an element',
  detailHint2: 'with mouse or arrow keys',
  protons: 'protons',
  neutrons: 'neutrons',
  electrons: 'electrons',
  atomicMass: 'Atomic mass',
  amu: 'amu',
  periodGroup: 'Period / group',
  block: 'Block',
  blockSuffix: '-block',
  state: 'State (STP)',
  electronegativity: 'Electronegativity',
  configuration: 'Configuration',
  shells: 'Shells',
  valences: 'Valences',
  language: 'Language',
  reset: 'Reset',
  bench: 'Bench',
  benchHint: 'Add atoms — build a molecule',
  add: 'Add',
  assemble: 'Assemble',
  unknownCombo: 'Unknown combination',
  discovered: 'Discovered',
  close: 'Close',
  composition: 'Composition',
  hands: 'Hands',
  handsHint: 'point with index finger · pinch = click',
  cameraDenied: 'camera unavailable',
  loadingModel: 'loading…',
  inspect: 'Enlarge',
  inspectHint: 'pinch + move = rotate · two pinches spread/turn = zoom/rotate',
  exciteBtn: 'Excite',
  shellsBtn: 'Shells',
  resetBtn: 'Reset',
  modeBohr: 'Shells',
  modeOrbitals: 'Orbitals',
  molarMass: 'Molar mass',
  atoms: 'Atoms',
  discoveredBy: 'Discovered by',
  density: 'Density',
  melting: 'Melting point',
  boiling: 'Boiling point',
  ionization: 'Ionization energy',
  appearance: 'Appearance',
  source: 'Source',
  about: 'About',
  atomicRadius: 'Atomic radius',
  oxidationStates: 'Oxidation states',
  yearDiscovered: 'Year discovered',
  isotopes: 'Natural isotopes',
  tabOverview: 'Overview',
  tabProperties: 'Properties',
  tabFacts: 'Facts',
  supEN: 'Most electronegative',
  supMelt: 'Highest melting point',
  supDense: 'Densest',
  supLight: 'Lightest',
  signIn: 'Sign in',
  signUp: 'Sign up',
  logout: 'Log out',
  nickname: 'Nickname',
  password: 'Password',
  continueGuest: 'Continue as guest',
  signInGoogle: 'Continue with Google',
  haveAccount: 'Already have an account?',
  noAccount: "Don't have an account?",
  loginTagline: 'Save your discoveries and continue anywhere',
  heroTitle: 'See inside matter',
  heroSubtitle: 'Build molecules, look inside atoms, discover the world',
  start: 'Start',
  zoomDiamond: 'Diamond',
  zoomLattice: 'Carbon crystal lattice',
  zoomAtom: 'Carbon atom',
  zoomShells: 'Electron shells',
  zoomNucleus: 'Nucleus · protons & neutrons',
  scrollHint: 'Scroll to dive in',
  navHub: 'Home',
  navTable: 'Periodic table',
  navLab: 'Lab',
  navBooks: 'Textbooks',
  bookGrade: 'Grade',
  navSearch: 'Search',
  navLearn: 'Learn',
  navNotebook: 'Notebook',
  navProfile: 'Profile',
  back: 'Back',
  hubHi: 'Hi',
  doorExplore: 'Explore',
  doorExploreDesc: 'Table, elements, molecules — browse freely',
  doorLearn: 'Learn from scratch',
  doorLearnDesc: 'A step-by-step path from atoms to reactions',
  doorLab: 'Lab',
  doorLabDesc: 'Combine atoms and build molecules',
  comingSoon: 'Coming soon',
  moleculesOpened: 'Molecules discovered',
  searchElements: 'Elements',
  searchMolecules: 'Molecules',
  searchSubstances: 'Substances',
  searchNothing: 'Nothing found',
  achievements: 'Achievements',
  labSandbox: 'Sandbox',
  labChallenges: 'Challenges',
  labReactions: 'Reactions',
  labReal: 'Real molecule ✓',
  labNotReal: 'No such substance',
  labOpen: 'Discover',
  labAdded: 'Added ✓',
  labEmpty: 'Pick atoms from the cabinet',
  labFrequent: 'Common',
  labAllElements: 'All elements',
  authFailed: 'Something went wrong',
  nicknameTaken: 'This nickname is taken',
  badCredentials: 'Wrong nickname or password',
  passwordShort: 'Password too short (min 6)',
  guest: 'Guest',
  bookSearch: 'Search in book…',
  nbTitle: 'Notebook',
  nbAll: 'All',
  nbPage: 'Page',
  nbAdd: 'Add',
  nbPlaceholder: 'Note for page',
  nbEmptyPage: 'No notes on this page',
  nbEmptyAll: 'No notes yet — add the first one',
  nbColor: 'Color',
  nbGoto: 'Go to page',
  nbEdit: 'Edit',
  nbDelete: 'Delete',
  categories: {
    'alkali-metal': 'Alkali metals',
    'alkaline-earth-metal': 'Alkaline earth metals',
    'transition-metal': 'Transition metals',
    'post-transition-metal': 'Post-transition metals',
    metalloid: 'Metalloids',
    nonmetal: 'Nonmetals',
    halogen: 'Halogens',
    'noble-gas': 'Noble gases',
    lanthanide: 'Lanthanides',
    actinide: 'Actinides',
    unknown: 'Unknown',
  },
  phases: { solid: 'solid', liquid: 'liquid', gas: 'gas', unknown: '—' },
  bond: { covalent: 'Covalent bond', ionic: 'Ionic bond', metallic: 'Metallic bond' },
};

const hy: Dict = {
  subtitle: 'Պարբերական աղյուսակ · 118 տարր',
  searchPlaceholder: 'որոնում՝ նշան, անուն կամ համար…',
  server: 'սերվեր',
  db: 'ԲԴ',
  footer: 'փուլ 1 · պարբերական աղյուսակ',
  detailHint1: 'Մատնանշեք կամ ընտրեք տարր',
  detailHint2: 'մկնիկով կամ սլաքներով',
  protons: 'պրոտոններ',
  neutrons: 'նեյտրոններ',
  electrons: 'էլեկտրոններ',
  atomicMass: 'Ատոմային զանգված',
  amu: 'ա.զ.մ.',
  periodGroup: 'Պարբերություն / խումբ',
  block: 'Բլոկ',
  blockSuffix: '-բլոկ',
  state: 'Վիճակ (ն.պ.)',
  electronegativity: 'Էլեկտրաբացասականություն',
  configuration: 'Կոնֆիգուրացիա',
  shells: 'Թաղանթներ',
  valences: 'Վալենտականություն',
  language: 'Լեզու',
  reset: 'Մաքրել',
  bench: 'Սեղան',
  benchHint: 'Ավելացրեք ատոմներ — կազմեք մոլեկուլ',
  add: 'Ավելացնել',
  assemble: 'Կազմել',
  unknownCombo: 'Անհայտ համակցություն',
  discovered: 'Բացահայտված',
  close: 'Փակել',
  composition: 'Բաղադրություն',
  hands: 'Ձեռքեր',
  handsHint: 'ցույց տվեք մատով · սեղմում = կտտոց',
  cameraDenied: 'տեսախցիկն անհասանելի է',
  loadingModel: 'բեռնում…',
  inspect: 'Խոշորացնել',
  inspectHint: 'սեղմում + շարժում = պտույտ · երկու սեղմում = մասշտաբ/պտույտ',
  exciteBtn: 'Գրգռել',
  shellsBtn: 'Թաղանթներ',
  resetBtn: 'Զրոյացնել',
  modeBohr: 'Թաղանթներ',
  modeOrbitals: 'Օրբիտալներ',
  molarMass: 'Մոլային զանգված',
  atoms: 'Ատոմներ',
  discoveredBy: 'Հայտնաբերել է',
  density: 'Խտություն',
  melting: 'Հալման ջերմաստիճան',
  boiling: 'Եռման ջերմաստիճան',
  ionization: 'Իոնացման էներգիա',
  appearance: 'Արտաքին տեսք',
  source: 'Աղբյուր',
  about: 'Նկարագրություն',
  atomicRadius: 'Ատոմային շառավիղ',
  oxidationStates: 'Օքսիդացման աստիճաններ',
  yearDiscovered: 'Հայտնաբերման տարի',
  isotopes: 'Բնական իզոտոպներ',
  tabOverview: 'Ակնարկ',
  tabProperties: 'Հատկություններ',
  tabFacts: 'Փաստեր',
  supEN: 'Ամենաէլեկտրաբացասականը',
  supMelt: 'Ամենաբարձր հալման ջերմաստիճանը',
  supDense: 'Ամենախիտը',
  supLight: 'Ամենաթեթևը',
  signIn: 'Մուտք',
  signUp: 'Գրանցում',
  logout: 'Ելք',
  nickname: 'Մականուն',
  password: 'Գաղտնաբառ',
  continueGuest: 'Շարունակել որպես հյուր',
  signInGoogle: 'Շարունակել Google-ով',
  haveAccount: 'Արդեն ունե՞ք հաշիվ',
  noAccount: 'Հաշիվ չունե՞ք',
  loginTagline: 'Պահպանիր բացահայտումներդ և շարունակիր ամենուր',
  heroTitle: 'Նայիր նյութի ներսում',
  heroSubtitle: 'Կառուցիր մոլեկուլներ, նայիր ատոմների ներսում, բացահայտիր աշխարհը',
  start: 'Սկսել',
  zoomDiamond: 'Ադամանդ',
  zoomLattice: 'Ածխածնի բյուրեղային ցանց',
  zoomAtom: 'Ածխածնի ատոմ',
  zoomShells: 'Էլեկտրոնային թաղանթներ',
  zoomNucleus: 'Միջուկ · պրոտոններ և նեյտրոններ',
  scrollHint: 'Պտտիր՝ սուզվելու համար',
  navHub: 'Գլխավոր',
  navTable: 'Աղյուսակ',
  navLab: 'Լաբորատորիա',
  navBooks: 'Դասագրքեր',
  bookGrade: 'Դասարան',
  navSearch: 'Որոնում',
  navLearn: 'Սովորել',
  navNotebook: 'Տետր',
  navProfile: 'Պրոֆիլ',
  back: 'Հետ',
  hubHi: 'Բարև',
  doorExplore: 'Ուսումնասիրել',
  doorExploreDesc: 'Աղյուսակ, տարրեր, մոլեկուլներ — ազատ դիտիր',
  doorLearn: 'Սովորել զրոյից',
  doorLearnDesc: 'Քայլ առ քայլ՝ ատոմներից մինչև ռեակցիաներ',
  doorLab: 'Լաբորատորիա',
  doorLabDesc: 'Միացրու ատոմները և կառուցիր մոլեկուլներ',
  comingSoon: 'Շուտով',
  moleculesOpened: 'Բացահայտված մոլեկուլներ',
  searchElements: 'Տարրեր',
  searchMolecules: 'Մոլեկուլներ',
  searchSubstances: 'Նյութեր',
  searchNothing: 'Ոչինչ չգտնվեց',
  achievements: 'Ձեռքբերումներ',
  labSandbox: 'Ավազատուփ',
  labChallenges: 'Առաջադրանքներ',
  labReactions: 'Ռեակցիաներ',
  labReal: 'Իրական մոլեկուլ ✓',
  labNotReal: 'Այդպիսի նյութ չկա',
  labOpen: 'Բացահայտել',
  labAdded: 'Ավելացված ✓',
  labEmpty: 'Ընտրիր ատոմներ պահարանից',
  labFrequent: 'Հաճախ',
  labAllElements: 'Ամբողջ աղյուսակը',
  authFailed: 'Ինչ-որ բան սխալ գնաց',
  nicknameTaken: 'Այս մականունը զբաղված է',
  badCredentials: 'Սխալ մականուն կամ գաղտնաբառ',
  passwordShort: 'Գաղտնաբառը շատ կարճ է (նվազ. 6)',
  guest: 'Հյուր',
  bookSearch: 'Որոնում գրքում…',
  nbTitle: 'Տետր',
  nbAll: 'Բոլորը',
  nbPage: 'Էջ',
  nbAdd: 'Ավելացնել',
  nbPlaceholder: 'Նշում էջ',
  nbEmptyPage: 'Այս էջում նշումներ չկան',
  nbEmptyAll: 'Դեռ նշումներ չկան — ավելացրու առաջինը',
  nbColor: 'Գույն',
  nbGoto: 'Անցնել էջ',
  nbEdit: 'Խմբագրել',
  nbDelete: 'Ջնջել',
  categories: {
    'alkali-metal': 'Ալկալիական մետաղներ',
    'alkaline-earth-metal': 'Հողալկալիական մետաղներ',
    'transition-metal': 'Անցումային մետաղներ',
    'post-transition-metal': 'Հետանցումային մետաղներ',
    metalloid: 'Կիսամետաղներ',
    nonmetal: 'Ոչ մետաղներ',
    halogen: 'Հալոգեններ',
    'noble-gas': 'Իներտ գազեր',
    lanthanide: 'Լանթանոիդներ',
    actinide: 'Ակտինոիդներ',
    unknown: 'Անհայտ',
  },
  phases: { solid: 'պինդ', liquid: 'հեղուկ', gas: 'գազ', unknown: '—' },
  bond: { covalent: 'Կովալենտային կապ', ionic: 'Իոնային կապ', metallic: 'Մետաղային կապ' },
};

const ru: Dict = {
  subtitle: 'Периодическая таблица · 118 элементов',
  searchPlaceholder: 'поиск: символ, имя или номер…',
  server: 'сервер',
  db: 'БД',
  footer: 'фаза 1 · таблица Менделеева',
  detailHint1: 'Наведите или выберите элемент',
  detailHint2: 'мышью или стрелками',
  protons: 'протоны',
  neutrons: 'нейтроны',
  electrons: 'электроны',
  atomicMass: 'Атомная масса',
  amu: 'а.е.м.',
  periodGroup: 'Период / группа',
  block: 'Блок',
  blockSuffix: '-блок',
  state: 'Состояние (н.у.)',
  electronegativity: 'Электроотрицательность',
  configuration: 'Конфигурация',
  shells: 'Оболочки',
  valences: 'Валентности',
  language: 'Язык',
  reset: 'Сбросить',
  bench: 'Стол',
  benchHint: 'Добавляйте атомы — соберите молекулу',
  add: 'Добавить',
  assemble: 'Собрать',
  unknownCombo: 'Неизвестная комбинация',
  discovered: 'Открыто',
  close: 'Закрыть',
  composition: 'Состав',
  hands: 'Руки',
  handsHint: 'указывай пальцем · щипок = клик',
  cameraDenied: 'камера недоступна',
  loadingModel: 'загрузка…',
  inspect: 'Увеличить',
  inspectHint: 'щипок + движение — вращать · два щипка развести/повернуть — масштаб/поворот',
  exciteBtn: 'Возбудить',
  shellsBtn: 'Оболочки',
  resetBtn: 'Сброс',
  modeBohr: 'Оболочки',
  modeOrbitals: 'Орбитали',
  molarMass: 'Молярная масса',
  atoms: 'Атомы',
  discoveredBy: 'Открыл',
  density: 'Плотность',
  melting: 'Температура плавления',
  boiling: 'Температура кипения',
  ionization: 'Энергия ионизации',
  appearance: 'Внешний вид',
  source: 'Источник',
  about: 'Описание',
  atomicRadius: 'Атомный радиус',
  oxidationStates: 'Степени окисления',
  yearDiscovered: 'Год открытия',
  isotopes: 'Природные изотопы',
  tabOverview: 'Обзор',
  tabProperties: 'Свойства',
  tabFacts: 'Факты',
  supEN: 'Самый электроотрицательный',
  supMelt: 'Самый тугоплавкий',
  supDense: 'Самый плотный',
  supLight: 'Самый лёгкий',
  signIn: 'Войти',
  signUp: 'Регистрация',
  logout: 'Выйти',
  nickname: 'Никнейм',
  password: 'Пароль',
  continueGuest: 'Продолжить гостем',
  signInGoogle: 'Войти через Google',
  haveAccount: 'Уже есть аккаунт?',
  noAccount: 'Нет аккаунта?',
  loginTagline: 'Сохрани свои открытия и продолжай где угодно',
  heroTitle: 'Загляни внутрь материи',
  heroSubtitle: 'Собирай молекулы, смотри внутрь атомов, открывай мир',
  start: 'Начать',
  zoomDiamond: 'Алмаз',
  zoomLattice: 'Кристаллическая решётка углерода',
  zoomAtom: 'Атом углерода',
  zoomShells: 'Электронные оболочки',
  zoomNucleus: 'Ядро · протоны и нейтроны',
  scrollHint: 'Крути колесо, чтобы нырнуть',
  navHub: 'Главная',
  navTable: 'Таблица',
  navLab: 'Лаборатория',
  navBooks: 'Учебники',
  bookGrade: 'Класс',
  navSearch: 'Поиск',
  navLearn: 'Учиться',
  navNotebook: 'Тетрадь',
  navProfile: 'Профиль',
  back: 'Назад',
  hubHi: 'Привет',
  doorExplore: 'Исследовать',
  doorExploreDesc: 'Таблица, элементы, молекулы — смотри свободно',
  doorLearn: 'Учиться с нуля',
  doorLearnDesc: 'Путь по шагам: от атомов до реакций',
  doorLab: 'Лаборатория',
  doorLabDesc: 'Соединяй атомы и собирай молекулы',
  comingSoon: 'Скоро',
  moleculesOpened: 'Открыто молекул',
  searchElements: 'Элементы',
  searchMolecules: 'Молекулы',
  searchSubstances: 'Вещества',
  searchNothing: 'Ничего не найдено',
  achievements: 'Достижения',
  labSandbox: 'Песочница',
  labChallenges: 'Задания',
  labReactions: 'Реакции',
  labReal: 'Настоящая молекула ✓',
  labNotReal: 'Такого вещества нет',
  labOpen: 'Открыть',
  labAdded: 'Добавлено ✓',
  labEmpty: 'Бери атомы из шкафа',
  labFrequent: 'Частые',
  labAllElements: 'Вся таблица элементов',
  authFailed: 'Что-то пошло не так',
  nicknameTaken: 'Этот никнейм занят',
  badCredentials: 'Неверный никнейм или пароль',
  passwordShort: 'Пароль слишком короткий (мин. 6)',
  guest: 'Гость',
  bookSearch: 'Поиск по книге…',
  nbTitle: 'Тетрадь',
  nbAll: 'Все',
  nbPage: 'Стр.',
  nbAdd: 'Добавить',
  nbPlaceholder: 'Заметка к стр.',
  nbEmptyPage: 'На этой странице заметок нет',
  nbEmptyAll: 'Заметок пока нет — добавь первую',
  nbColor: 'Цвет',
  nbGoto: 'Перейти на страницу',
  nbEdit: 'Редактировать',
  nbDelete: 'Удалить',
  categories: {
    'alkali-metal': 'Щелочные металлы',
    'alkaline-earth-metal': 'Щёлочноземельные',
    'transition-metal': 'Переходные металлы',
    'post-transition-metal': 'Постпереходные металлы',
    metalloid: 'Металлоиды',
    nonmetal: 'Неметаллы',
    halogen: 'Галогены',
    'noble-gas': 'Благородные газы',
    lanthanide: 'Лантаноиды',
    actinide: 'Актиноиды',
    unknown: 'Неизвестно',
  },
  phases: { solid: 'твёрдое', liquid: 'жидкое', gas: 'газ', unknown: '—' },
  bond: { covalent: 'Ковалентная связь', ionic: 'Ионная связь', metallic: 'Металлическая связь' },
};

export const dictionaries: Record<Locale, Dict> = { en, hy, ru };

export const LANGUAGES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'hy', label: 'ՀԱՅ' },
  { code: 'ru', label: 'РУ' },
];
