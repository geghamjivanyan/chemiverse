// Интерактив на страницах учебника. На странице:
//  • words  — клик по слову в тексте → ключ материала;
//  • regions — клик по зоне поверх рисунка (доли страницы: x,y,w,h) → ключ материала.
import { PHYSICS_HOTSPOTS } from './hotspots-physics';

export interface Hotspot { text: string; key: string }
export interface Region { x: number; y: number; w: number; h: number; key: string }
export interface PageHotspots { words?: Hotspot[]; regions?: Region[] }

export const HOTSPOTS: Record<string, Record<number, PageHotspots>> = {
  'physics-7': PHYSICS_HOTSPOTS,
  // ключ — НОМЕР ФАЙЛА (pdf-страница). p14.html = печатная 13.
  'chemistry-7': {
    14: {
      // слова-вещества покрывает глобальный словарь (dictionary.ts) автоматически
      regions: [
        // Նկар 4 — 4 шара (координаты из Docling)
        { x: 0.11, y: 0.78, w: 0.11, h: 0.085, key: 'fe' },
        { x: 0.24, y: 0.78, w: 0.11, h: 0.085, key: 'rubber' },
        { x: 0.37, y: 0.78, w: 0.12, h: 0.085, key: 'wood' },
        { x: 0.49, y: 0.78, w: 0.12, h: 0.085, key: 'glass' },
        // Նկар 3 — предметы из железа
        { x: 0.11, y: 0.54, w: 0.75, h: 0.07, key: 'fe' },
      ],
    },
  },
};

type L = { ru: string; hy: string; en: string };
export interface Material {
  name: L;
  kind: 'element' | 'material' | 'molecule';
  z?: number; // элемент — атомный номер (3D-атом)
  formula?: string; // молекула — формула (3D-молекула)
  emoji?: string;
  desc: L;
}

export const MATERIALS: Record<string, Material> = {
  fe: {
    name: { ru: 'Железо', hy: 'Երկաթ', en: 'Iron' },
    kind: 'element', z: 26,
    desc: {
      ru: 'Железо — металл и химический элемент №26 (Fe). Прочное, притягивается магнитом, серебристо-серое. Основа стали и чугуна; самый используемый металл в технике и строительстве.',
      hy: 'Երկաթը մետաղ է և քիմիական տարր №26 (Fe)։ Ամուր է, ձգվում է մագնիսով, արծաթագույն-մոխրագույն։ Պողպատի և չուգունի հիմքն է՝ տեխնիկայում ու շինարարությունում ամենաշատ կիրառվող մետաղը։',
      en: 'Iron is a metal and chemical element no. 26 (Fe). Strong, attracted by a magnet, silvery-grey. It is the basis of steel and cast iron — the most widely used metal in technology and construction.',
    },
  },
  rubber: {
    name: { ru: 'Резина', hy: 'Ռետին', en: 'Rubber' },
    kind: 'material', emoji: '🛞',
    desc: {
      ru: 'Резина — упругий материал из натурального (латекс каучукового дерева) или синтетического каучука. Растягивается и возвращает форму, не пропускает воду; из неё делают шины, уплотнители, обувь.',
      hy: 'Ռետինը առաձգական նյութ է բնական (կաուչուկի ծառի լատեքս) կամ սինթետիկ կաուչուկից։ Ձգվում է և վերականգնում ձևը, ջուր չի անցկացնում. դրանից պատրաստում են անվադողեր, խցաններ, կոշիկ։',
      en: 'Rubber is an elastic material made from natural (rubber-tree latex) or synthetic caoutchouc. It stretches and springs back, is waterproof, and is used for tyres, seals and footwear.',
    },
  },
  wood: {
    name: { ru: 'Дерево', hy: 'Փայտ', en: 'Wood' },
    kind: 'material', emoji: '🪵',
    desc: {
      ru: 'Дерево (древесина) — природный волокнистый материал из стволов деревьев. Лёгкое, прочное, легко обрабатывается; идёт на строительство, мебель, бумагу. Состоит в основном из целлюлозы.',
      hy: 'Փայտը (բնափայտը) բնական մանրաթելային նյութ է ծառերի բներից։ Թեթև է, ամուր, հեշտ մշակվող. օգտագործվում է շինարարության, կահույքի, թղթի համար։ Հիմնականում բաղկացած է ցելյուլոզից։',
      en: 'Wood is a natural fibrous material from tree trunks. Light, strong and easy to work, it is used for building, furniture and paper. It consists mainly of cellulose.',
    },
  },
  glass: {
    name: { ru: 'Стекло', hy: 'Ապակի', en: 'Glass' },
    kind: 'material', emoji: '🔷',
    desc: {
      ru: 'Стекло — твёрдый прозрачный материал, который получают плавлением песка (диоксида кремния) с добавками. Хрупкое, не пропускает воду, в горячем виде легко формуется; из него делают окна, посуду, линзы.',
      hy: 'Ապակին կարծր թափանցիկ նյութ է, որ ստանում են ավազի (սիլիցիումի երկօքսիդ) հալումով՝ հավելումներով։ Փխրուն է, ջուր չի անցկացնում, տաք վիճակում հեշտ ձևավորվում. դրանից պատրաստում են պատուհաններ, ամանեղեն, ոսպնյակներ։',
      en: 'Glass is a hard transparent material made by melting sand (silicon dioxide) with additives. Brittle and waterproof, it is easily shaped when hot, and is used for windows, dishes and lenses.',
    },
  },
  cotton: {
    name: { ru: 'Хлопок', hy: 'Բամբակ', en: 'Cotton' },
    kind: 'material', emoji: '🧶',
    desc: {
      ru: 'Хлопок — натуральное мягкое волокно, которое растёт вокруг семян хлопчатника. Состоит почти полностью из целлюлозы; из него прядут нити и ткут хлопчатобумажные ткани.',
      hy: 'Բամբակը բնական փափուկ մանրաթել է, որ աճում է բամբակենու սերմերի շուրջ։ Բաղկացած է գրեթե ամբողջությամբ ցելյուլոզից. դրանից մանում են թել և գործում բամբակյա գործվածքներ։',
      en: 'Cotton is a soft natural fibre that grows around the seeds of the cotton plant. It is almost pure cellulose and is spun into thread and woven into cotton fabrics.',
    },
  },
  clay: {
    name: { ru: 'Глина', hy: 'Կավ', en: 'Clay' },
    kind: 'material', emoji: '🧱',
    desc: {
      ru: 'Глина — мелкозернистый природный материал из земли. Во влажном виде пластичная (легко лепится), а после обжига становится твёрдой; из неё делают посуду, кирпич, керамику.',
      hy: 'Կավը մանրահատիկ բնական նյութ է հողից։ Խոնավ վիճակում պլաստիկ է (հեշտ ձևավորվում), իսկ թրծելուց հետո դառնում է կարծր. դրանից պատրաստում են ամանեղեն, աղյուս, խեցեղեն։',
      en: 'Clay is a fine-grained natural earthy material. It is plastic (easily shaped) when wet and becomes hard after firing; it is used for pottery, bricks and ceramics.',
    },
  },
  paraffin: {
    name: { ru: 'Парафин', hy: 'Պարաֆին', en: 'Paraffin' },
    kind: 'material', emoji: '🕯️',
    desc: {
      ru: 'Парафин — белое воскоподобное вещество, смесь твёрдых углеводородов, получаемых из нефти. Легко плавится и горит; из него делают свечи, им пропитывают бумагу, используют в косметике.',
      hy: 'Պարաֆինը սպիտակ մոմանման նյութ է՝ նավթից ստացվող պինդ ածխաջրածինների խառնուրդ։ Հեշտ հալվում և այրվում է. դրանից պատրաստում են մոմեր, ներծծում թուղթը, օգտագործում կոսմետիկայում։',
      en: 'Paraffin is a white wax-like substance — a mixture of solid hydrocarbons obtained from petroleum. It melts and burns easily, and is used to make candles, to coat paper and in cosmetics.',
    },
  },
  water: {
    name: { ru: 'Вода', hy: 'Ջուր', en: 'Water' },
    kind: 'molecule', formula: 'H2O',
    desc: {
      ru: 'Вода — самое распространённое вещество на Земле и основа жизни. Её молекула состоит из двух атомов водорода и одного атома кислорода (H₂O). При обычных условиях — жидкость без цвета, запаха и вкуса.',
      hy: 'Ջուրը Երկրի վրա ամենատարածված նյութն է և կյանքի հիմքը։ Նրա մոլեկուլը կազմված է երկու ջրածնի և մեկ թթվածնի ատոմից (H₂O)։ Սովորական պայմաններում՝ անգույն, անհոտ և անհամ հեղուկ է։',
      en: 'Water is the most common substance on Earth and the basis of life. Its molecule consists of two hydrogen atoms and one oxygen atom (H₂O). Under normal conditions it is a colourless, odourless and tasteless liquid.',
    },
  },
};
