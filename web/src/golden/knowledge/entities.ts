/**
 * Knowledge Entity registry — pure data (the "JSON") consumed by the Knowledge
 * Card Engine. Keyword blocks link to an entity via `entityId`. Content migrated
 * from Chemistry 7 (§2/3, pp. 48–51): the three subatomic particles, the nucleus,
 * the atom, and the scientists who discovered them. User-facing text is Armenian.
 */
import type { KnowledgeEntity } from './model';

export const KNOWLEDGE_ENTITIES: Record<string, KnowledgeEntity> = {
  atom: {
    id: 'atom',
    type: 'Գիտական հասկացություն',
    name: 'Ատոմ',
    subtitle: 'Նյութի փոքրագույն միավորը',
    definition: 'Նյութը կազմող փոքրագույն մասնիկը, որն ունի զանգված, չափ և որոշակի կառուցվածք։ Ատոմը քիմիապես անբաժանելի է, բայց ֆիզիկական ճանապարհով՝ բաժանելի։',
    facts: [
      'Ողջ սովորական նյութը կազմված է ատոմներից։',
      'Ատոմն էլեկտրաչեզոք է՝ էլեկտրոնների թիվը հավասար է պրոտոնների թվին։',
    ],
    tags: ['հիմնական', 'մասնիկ', 'կառուցվածք'],
    keyProperties: [
      { label: 'Կազմված է', value: 'Միջուկից և էլեկտրոններից' },
      { label: 'Ընդհանուր լիցքը', value: 'Էլեկտրաչեզոք (0)' },
      { label: 'Հավասարություն', value: 'Էլեկտրոնների թիվ = պրոտոնների թիվ' },
    ],
    relatedEntities: ['nucleus', 'proton', 'neutron', 'electron'],
    lessonReferences: [
      { conceptId: 'atom-structure.intro' },
      { conceptId: 'atom-structure.structure' },
    ],
  },
  nucleus: {
    id: 'nucleus',
    type: 'Ատոմի կառուցվածք',
    name: 'Միջուկ',
    definition: 'Ատոմի դրական լիցքով կենտրոնը՝ կազմված պրոտոններից և նեյտրոններից։ Միջուկում է կենտրոնացած ատոմի զանգվածի գրեթե ողջ մասը։',
    keyProperties: [
      { label: 'Պարունակում է', value: 'Պրոտոններ և նեյտրոններ' },
      { label: 'Լիցքը', value: 'Դրական' },
      { label: 'Կայունությունը', value: 'Նեյտրոնները թույլ չեն տալիս, որ միջուկը «քանդվի»' },
    ],
    relatedEntities: ['proton', 'neutron', 'atom'],
    lessonReferences: [{ conceptId: 'atom-structure.structure' }],
  },
  proton: {
    id: 'proton',
    type: 'Ատոմային մասնիկ',
    name: 'Պրոտոն',
    definition: 'Ատոմի միջուկում գտնվող դրական լիցքով մասնիկ։ Հայտնաբերել է Է. Ռեզերֆորդը՝ ապացուցելով, որ միջուկն ունի դրական լիցք։',
    keyProperties: [
      { label: 'Լիցքը', value: '+1 (դրական)' },
      { label: 'Տեղը', value: 'Միջուկ' },
      { label: 'Զանգվածը', value: 'Մոտ է նեյտրոնի զանգվածին' },
      { label: 'Հայտնաբերող', value: 'Է. Ռեզերֆորդ' },
    ],
    relatedEntities: ['neutron', 'electron', 'nucleus', 'rutherford', 'atom'],
    lessonReferences: [
      { conceptId: 'atom-structure.structure' },
      { conceptId: 'atom-structure.models' },
    ],
  },
  neutron: {
    id: 'neutron',
    type: 'Ատոմային մասնիկ',
    name: 'Նեյտրոն',
    definition: 'Ատոմի միջուկում գտնվող լիցք չունեցող (չեզոք) մասնիկ։ Այն մխրճվում է պրոտոնների միջև՝ թույլ չտալով, որ միջուկը «քանդվի»։ Հայտնաբերել է Ջ. Չեդվիկը 1932 թ.։',
    keyProperties: [
      { label: 'Լիցքը', value: '0 (չեզոք)' },
      { label: 'Տեղը', value: 'Միջուկ' },
      { label: 'Զանգվածը', value: 'Մոտ է պրոտոնի զանգվածին' },
      { label: 'Հայտնաբերող', value: 'Ջ. Չեդվիկ (1932 թ.)' },
    ],
    relatedEntities: ['proton', 'electron', 'nucleus', 'chadwick', 'atom'],
    lessonReferences: [
      { conceptId: 'atom-structure.structure' },
      { conceptId: 'atom-structure.models' },
    ],
  },
  electron: {
    id: 'electron',
    type: 'Ատոմային մասնիկ',
    name: 'Էլեկտրոն',
    definition: 'Բացասական լիցքով թեթև մասնիկ, որ շարժվում է միջուկի շուրջը։ Հայտնաբերել է Ջ. Թոմսոնը 1897 թ.։ Էլեկտրոնի զանգվածը մոտ 2000 անգամ փոքր է պրոտոնի զանգվածից։',
    keyProperties: [
      { label: 'Լիցքը', value: '−1 (բացասական)' },
      { label: 'Տեղը', value: 'Միջուկի շուրջ' },
      { label: 'Զանգվածը', value: 'Մոտ 2000 անգամ փոքր պրոտոնից' },
      { label: 'Հայտնաբերող', value: 'Ջ. Թոմսոն (1897 թ.)' },
    ],
    relatedEntities: ['proton', 'neutron', 'atom', 'thomson'],
    lessonReferences: [
      { conceptId: 'atom-structure.structure' },
      { conceptId: 'atom-structure.models' },
    ],
  },
  thomson: {
    id: 'thomson',
    type: 'Գիտնական',
    name: 'Ջ. Թոմսոն',
    definition: 'Անգլիացի ֆիզիկոս։ 1897 թ. գիտական փորձերով հայտնաբերեց էլեկտրոնը՝ ատոմի կազմում առկա շատ փոքր զանգված ունեցող բացասական մասնիկը։ 1904 թ. առաջարկեց ատոմի կառուցվածքի առաջին՝ «կեքս»-ի մոդելը։',
    keyProperties: [
      { label: 'Երկիրը', value: 'Անգլիա' },
      { label: 'Հայտնագործություն', value: 'Էլեկտրոն (1897 թ.)' },
      { label: 'Մոդել', value: '«Կեքս»-ի մոդել (1904 թ.)' },
    ],
    relatedEntities: ['electron', 'atom'],
    lessonReferences: [{ conceptId: 'atom-structure.models' }],
  },
  rutherford: {
    id: 'rutherford',
    type: 'Գիտնական',
    name: 'Է. Ռեզերֆորդ',
    definition: 'Անգլիացի ֆիզիկոս։ 1911 թ. կատարեց բարդ գիտափորձ և ներկայացրեց «Ատոմի մոլորակային մոդելը»։ Փորձնական ճանապարհով հաստատեց, որ միջուկում կան դրական լիցքով մասնիկներ, որոնք անվանեց պրոտոններ։',
    keyProperties: [
      { label: 'Երկիրը', value: 'Անգլիա' },
      { label: 'Մոդել', value: 'Ատոմի մոլորակային մոդել (1911 թ.)' },
      { label: 'Հայտնագործություն', value: 'Պրոտոն (միջուկի դրական լիցք)' },
    ],
    relatedEntities: ['proton', 'nucleus', 'bohr', 'atom'],
    lessonReferences: [{ conceptId: 'atom-structure.models' }],
  },
  bohr: {
    id: 'bohr',
    type: 'Գիտնական',
    name: 'Ն. Բոր',
    definition: 'Ռեզերֆորդի աշակերտը։ Նրա առաջարկած դրույթները հիմք հանդիսացան ատոմի մոլորակային մոդելի համար (այդ դրույթներն ուսումնասիրվում են բարձր դասարաններում)։',
    keyProperties: [
      { label: 'Դերը', value: 'Ռեզերֆորդի աշակերտ' },
      { label: 'Ներդրում', value: 'Ատոմի մոդելի դրույթներ' },
    ],
    relatedEntities: ['rutherford', 'atom'],
    lessonReferences: [{ conceptId: 'atom-structure.models' }],
  },
  chadwick: {
    id: 'chadwick',
    type: 'Գիտնական',
    name: 'Ջ. Չեդվիկ',
    definition: 'Անգլիացի ֆիզիկոս։ 1932 թ. միջուկում հայտնաբերեց ևս մեկ մասնիկ՝ նեյտրոնը՝ լիցք չունեցող (չեզոք) մասնիկը։',
    keyProperties: [
      { label: 'Երկիրը', value: 'Անգլիա' },
      { label: 'Հայտնագործություն', value: 'Նեյտրոն (1932 թ.)' },
    ],
    relatedEntities: ['neutron', 'nucleus'],
    lessonReferences: [{ conceptId: 'atom-structure.models' }],
  },
};
