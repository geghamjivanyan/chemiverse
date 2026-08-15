import type { KnowledgeEntity, EntityType } from './model';

// Физические сущности (Ֆիզիկա 7): величины, формулы, законы.
// Описания — краткие определения на армянском; поле formula показывается карточкой.
type SeedEntity = Omit<KnowledgeEntity, 'relatedLearningBlocks' | 'lessonIds' | 'pageNumbers'> & { type: EntityType };

export const PHYSICS_ENTITIES: SeedEntity[] = [
  {
    id: 'speed', name: 'Արագություն', type: 'measurement', formula: 'v = s / t',
    description: 'Ֆիզիկական մեծություն, որը ցույց է տալիս, թե մարմինը միավոր ժամանակում ինչ ճանապարհ է անցնում։ Չափման միավորը՝ մ/վ։',
    aliases: ['արագություն', 'скорость', 'speed', 'velocity'],
    relatedEntities: ['path', 'mechanical_motion'],
  },
  {
    id: 'path', name: 'Ճանապարհ', type: 'measurement', formula: 's = v · t',
    description: 'Հետագծի երկարությունը, որն անցնում է մարմինը շարժման ընթացքում։ Չափվում է մետրերով։',
    aliases: ['ճանապարհ', 'путь', 'path', 'distance'],
    relatedEntities: ['speed', 'mechanical_motion'],
  },
  {
    id: 'mechanical_motion', name: 'Մեխանիկական շարժում', type: 'process',
    description: 'Ժամանակի ընթացքում մարմնի դիրքի փոփոխությունն այլ մարմինների նկատմամբ։',
    aliases: ['մեխանիկական շարժում', 'механическое движение', 'mechanical motion'],
    relatedEntities: ['speed', 'path'],
  },
  {
    id: 'mass', name: 'Զանգված', type: 'measurement', formula: 'm = ρ · V',
    description: 'Մարմնի իներտության չափն է. որքան մեծ է զանգվածը, այնքան դժվար է փոխել մարմնի արագությունը։ Չափման միավորը՝ կգ։',
    aliases: ['զանգված', 'масса', 'mass'],
    relatedEntities: ['density', 'gravity_force', 'weight'],
  },
  {
    id: 'density', name: 'Խտություն', type: 'measurement', formula: 'ρ = m / V',
    description: 'Ցույց է տալիս միավոր ծավալի նյութի զանգվածը։ Չափման միավորը՝ կգ/մ³։',
    aliases: ['խտություն', 'плотность', 'density'],
    relatedEntities: ['mass', 'archimedes_law'],
  },
  {
    id: 'force', name: 'Ուժ', type: 'measurement', formula: 'F',
    description: 'Մարմինների փոխազդեցության չափն է. ուժը փոխում է մարմնի արագությունը կամ ձևը։ Չափման միավորը՝ նյուտոն (Ն)։',
    aliases: ['ուժ', 'сила', 'force'],
    relatedEntities: ['gravity_force', 'elastic_force', 'friction_force', 'weight'],
  },
  {
    id: 'gravity_force', name: 'Ծանրության ուժ', type: 'formula', formula: 'F = m · g',
    description: 'Ուժը, որով Երկիրը ձգում է մարմինը։ Համեմատական է մարմնի զանգվածին (g ≈ 9,8 Ն/կգ)։',
    aliases: ['ծանրության ուժ', 'сила тяжести', 'gravity'],
    relatedEntities: ['force', 'mass', 'weight'],
  },
  {
    id: 'elastic_force', name: 'Առաձգականության ուժ', type: 'formula', formula: 'F = k · Δl',
    description: 'Ուժ, որն առաջանում է մարմնի ձևափոխման ժամանակ և ուղղված է ձևափոխությանը հակառակ (Հուկի օրենք)։',
    aliases: ['առաձգականության ուժ', 'Հուկի օրենք', 'сила упругости', 'закон Гука', 'Hooke'],
    relatedEntities: ['force', 'weight'],
  },
  {
    id: 'weight', name: 'Մարմնի կշիռ', type: 'formula', formula: 'P = m · g',
    description: 'Ուժը, որով մարմինը ձգողության հետևանքով ազդում է հենարանի կամ կախոցի վրա։',
    aliases: ['կշիռ', 'вес', 'weight'],
    relatedEntities: ['gravity_force', 'mass', 'force'],
  },
  {
    id: 'friction_force', name: 'Շփման ուժ', type: 'measurement',
    description: 'Ուժ, որն առաջանում է մի մարմնի՝ մյուսի մակերևույթով շարժվելիս և խոչընդոտում է շարժմանը։',
    aliases: ['շփման ուժ', 'շփում', 'сила трения', 'friction'],
    relatedEntities: ['force', 'weight'],
  },
  {
    id: 'work', name: 'Մեխանիկական աշխատանք', type: 'formula', formula: 'A = F · s',
    description: 'Կատարվում է, երբ մարմինը ուժի ազդեցությամբ ճանապարհ է անցնում։ Չափման միավորը՝ ջոուլ (Ջ)։',
    aliases: ['աշխատանք', 'работа', 'work'],
    relatedEntities: ['force', 'path', 'power', 'efficiency'],
  },
  {
    id: 'power', name: 'Հզորություն', type: 'formula', formula: 'N = A / t',
    description: 'Ցույց է տալիս միավոր ժամանակում կատարված աշխատանքը։ Չափման միավորը՝ վատտ (Վտ)։',
    aliases: ['հզորություն', 'мощность', 'power'],
    relatedEntities: ['work'],
  },
  {
    id: 'lever', name: 'Լծակ', type: 'scientific_term', formula: 'F₁ · l₁ = F₂ · l₂',
    description: 'Պարզ մեխանիզմ՝ հենման կետի շուրջ պտտվող կոշտ ձող։ Հավասարակշռված է, երբ ուժերի և բազուկների արտադրյալները հավասար են։',
    aliases: ['լծակ', 'рычаг', 'lever'],
    relatedEntities: ['force', 'work', 'efficiency'],
  },
  {
    id: 'efficiency', name: 'Օգտակար գործողության գործակից (ՕԳԳ)', type: 'formula', formula: 'η = A₀ / A · 100%',
    description: 'Օգտակար աշխատանքի հարաբերությունը կատարված ամբողջ աշխատանքին։ Միշտ փոքր է 100 %-ից։',
    aliases: ['ՕԳԳ', 'օգտակար գործողության գործակից', 'КПД', 'efficiency'],
    relatedEntities: ['work', 'lever'],
  },
  {
    id: 'pressure', name: 'Ճնշում', type: 'formula', formula: 'p = F / S',
    description: 'Ցույց է տալիս միավոր մակերեսի վրա ուղղահայաց ազդող ուժը։ Չափման միավորը՝ պասկալ (Պա)։',
    aliases: ['ճնշում', 'давление', 'pressure'],
    relatedEntities: ['force', 'hydrostatic_pressure', 'pascal_law', 'atmospheric_pressure'],
  },
  {
    id: 'pascal_law', name: 'Պասկալի օրենք', type: 'law',
    description: 'Հեղուկին կամ գազին հաղորդված ճնշումը փոխանցվում է բոլոր ուղղություններով անփոփոխ։',
    aliases: ['Պասկալի օրենք', 'закон Паскаля', 'Pascal'],
    relatedEntities: ['pressure', 'hydrostatic_pressure'],
  },
  {
    id: 'hydrostatic_pressure', name: 'Հիդրոստատիկ ճնշում', type: 'formula', formula: 'p = ρ · g · h',
    description: 'Հեղուկի սյան ճնշումը, որը կախված է հեղուկի խտությունից և սյան բարձրությունից։',
    aliases: ['հիդրոստատիկ ճնշում', 'гидростатическое давление', 'hydrostatic pressure'],
    relatedEntities: ['pressure', 'density', 'pascal_law', 'archimedes_law'],
  },
  {
    id: 'atmospheric_pressure', name: 'Մթնոլորտային ճնշում', type: 'measurement',
    description: 'Երկրի օդային թաղանթի ճնշումը մակերևույթի և մարմինների վրա. չափվում է բարոմետրով (Տորիչելիի փորձ)։',
    aliases: ['մթնոլորտային ճնշում', 'атмосферное давление', 'atmospheric pressure', 'Տորիչելի'],
    relatedEntities: ['pressure', 'hydrostatic_pressure'],
  },
  {
    id: 'archimedes_law', name: 'Արքիմեդի օրենք', type: 'law', formula: 'F = ρ · g · V',
    description: 'Հեղուկի (կամ գազի) մեջ ընկղմված մարմնի վրա ազդում է վեր ուղղված արտամղող ուժ, որը հավասար է մարմնի արտամղած հեղուկի կշռին։',
    aliases: ['Արքիմեդի օրենք', 'закон Архимеда', 'Archimedes'],
    relatedEntities: ['density', 'hydrostatic_pressure', 'weight'],
  },
];
