// AUTO-GENERATED — не редактировать вручную.
// Источники: shared/data/periodic-table-source.json (Bowserinator, public domain),
// shared/data/wikidata-names.json (Wikidata, CC0) — армянские названия,
// + русские названия и валентности из shared/scripts/generate-elements.mjs.
// Регенерация: node shared/scripts/generate-elements.mjs
import type { Element } from './types';

export const elements: Element[] = [
  {
    "z": 1,
    "symbol": "H",
    "names": {
      "en": "Hydrogen",
      "hy": "Ջրածին",
      "ru": "Водород"
    },
    "mass": 1.008,
    "neutrons": 0,
    "period": 1,
    "group": 1,
    "block": "s",
    "category": "nonmetal",
    "shells": [
      1
    ],
    "electronConfig": "1s1",
    "valence": [
      1
    ],
    "electronegativity": 2.2,
    "phase": "gas",
    "color": "#ffffff",
    "xpos": 1,
    "ypos": 1,
    "density": 0.08988,
    "melt": 13.99,
    "boil": 20.271,
    "molarHeat": 28.836,
    "electronAffinity": 72.769,
    "ionizationEnergies": [
      1312
    ],
    "discoveredBy": "Henry Cavendish",
    "namedBy": "Antoine Lavoisier",
    "appearance": "colorless gas",
    "source": "https://en.wikipedia.org/wiki/Hydrogen",
    "atomicRadius": 120,
    "oxidationStates": [
      1,
      -1
    ],
    "yearDiscovered": "1766",
    "isotopes": [
      {
        "mass": 1,
        "abundance": 99.9885
      },
      {
        "mass": 2,
        "abundance": 0.0115
      }
    ]
  },
  {
    "z": 2,
    "symbol": "He",
    "names": {
      "en": "Helium",
      "hy": "Հելիում",
      "ru": "Гелий"
    },
    "mass": 4.0026022,
    "neutrons": 2,
    "period": 1,
    "group": 18,
    "block": "s",
    "category": "noble-gas",
    "shells": [
      2
    ],
    "electronConfig": "1s2",
    "valence": [
      0
    ],
    "electronegativity": null,
    "phase": "gas",
    "color": "#d9ffff",
    "xpos": 18,
    "ypos": 1,
    "density": 0.1786,
    "melt": 0.95,
    "boil": 4.222,
    "molarHeat": null,
    "electronAffinity": -48,
    "ionizationEnergies": [
      2372.3,
      5250.5
    ],
    "discoveredBy": "Pierre Janssen",
    "namedBy": null,
    "appearance": "colorless gas, exhibiting a red-orange glow when placed in a high-voltage electric field",
    "source": "https://en.wikipedia.org/wiki/Helium",
    "atomicRadius": 140,
    "oxidationStates": [
      0
    ],
    "yearDiscovered": "1868",
    "isotopes": [
      {
        "mass": 4,
        "abundance": 99.9999
      },
      {
        "mass": 3,
        "abundance": 0.0001
      }
    ]
  },
  {
    "z": 3,
    "symbol": "Li",
    "names": {
      "en": "Lithium",
      "hy": "Լիթիում",
      "ru": "Литий"
    },
    "mass": 6.94,
    "neutrons": 4,
    "period": 2,
    "group": 1,
    "block": "s",
    "category": "alkali-metal",
    "shells": [
      2,
      1
    ],
    "electronConfig": "[He] 2s1",
    "valence": [
      1
    ],
    "electronegativity": 0.98,
    "phase": "solid",
    "color": "#cc80ff",
    "xpos": 1,
    "ypos": 2,
    "density": 0.534,
    "melt": 453.65,
    "boil": 1603,
    "molarHeat": 24.86,
    "electronAffinity": 59.6326,
    "ionizationEnergies": [
      520.2,
      7298.1,
      11815
    ],
    "discoveredBy": "Johan August Arfwedson",
    "namedBy": null,
    "appearance": "silvery-white",
    "source": "https://en.wikipedia.org/wiki/Lithium",
    "atomicRadius": 182,
    "oxidationStates": [
      1
    ],
    "yearDiscovered": "1817",
    "isotopes": [
      {
        "mass": 7,
        "abundance": 92.41
      },
      {
        "mass": 6,
        "abundance": 7.59
      }
    ]
  },
  {
    "z": 4,
    "symbol": "Be",
    "names": {
      "en": "Beryllium",
      "hy": "Բերիլիում",
      "ru": "Бериллий"
    },
    "mass": 9.01218315,
    "neutrons": 5,
    "period": 2,
    "group": 2,
    "block": "s",
    "category": "alkaline-earth-metal",
    "shells": [
      2,
      2
    ],
    "electronConfig": "[He] 2s2",
    "valence": [
      2
    ],
    "electronegativity": 1.57,
    "phase": "solid",
    "color": "#c2ff00",
    "xpos": 2,
    "ypos": 2,
    "density": 1.85,
    "melt": 1560,
    "boil": 2742,
    "molarHeat": 16.443,
    "electronAffinity": -48,
    "ionizationEnergies": [
      899.5,
      1757.1,
      14848.7,
      21006.6
    ],
    "discoveredBy": "Louis Nicolas Vauquelin",
    "namedBy": null,
    "appearance": "white-gray metallic",
    "source": "https://en.wikipedia.org/wiki/Beryllium",
    "atomicRadius": 153,
    "oxidationStates": [
      2
    ],
    "yearDiscovered": "1798",
    "isotopes": [
      {
        "mass": 9,
        "abundance": 100
      }
    ]
  },
  {
    "z": 5,
    "symbol": "B",
    "names": {
      "en": "Boron",
      "hy": "Բոր",
      "ru": "Бор"
    },
    "mass": 10.81,
    "neutrons": 6,
    "period": 2,
    "group": 13,
    "block": "p",
    "category": "metalloid",
    "shells": [
      2,
      3
    ],
    "electronConfig": "[He] 2s2 2p1",
    "valence": [
      3
    ],
    "electronegativity": 2.04,
    "phase": "solid",
    "color": "#ffb5b5",
    "xpos": 13,
    "ypos": 2,
    "density": 2.08,
    "melt": 2349,
    "boil": 4200,
    "molarHeat": 11.087,
    "electronAffinity": 26.989,
    "ionizationEnergies": [
      800.6,
      2427.1,
      3659.7,
      25025.8,
      32826.7
    ],
    "discoveredBy": "Joseph Louis Gay-Lussac",
    "namedBy": null,
    "appearance": "black-brown",
    "source": "https://en.wikipedia.org/wiki/Boron",
    "atomicRadius": 192,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1808",
    "isotopes": [
      {
        "mass": 11,
        "abundance": 80.1
      },
      {
        "mass": 10,
        "abundance": 19.9
      }
    ]
  },
  {
    "z": 6,
    "symbol": "C",
    "names": {
      "en": "Carbon",
      "hy": "Ածխածին",
      "ru": "Углерод"
    },
    "mass": 12.011,
    "neutrons": 6,
    "period": 2,
    "group": 14,
    "block": "p",
    "category": "nonmetal",
    "shells": [
      2,
      4
    ],
    "electronConfig": "[He] 2s2 2p2",
    "valence": [
      4
    ],
    "electronegativity": 2.55,
    "phase": "solid",
    "color": "#909090",
    "xpos": 14,
    "ypos": 2,
    "density": 1.821,
    "melt": null,
    "boil": null,
    "molarHeat": 8.517,
    "electronAffinity": 121.7763,
    "ionizationEnergies": [
      1086.5,
      2352.6,
      4620.5,
      6222.7,
      37831,
      47277
    ],
    "discoveredBy": "Ancient Egypt",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Carbon",
    "atomicRadius": 170,
    "oxidationStates": [
      4,
      2,
      -4
    ],
    "yearDiscovered": "Ancient",
    "isotopes": [
      {
        "mass": 12,
        "abundance": 98.93
      },
      {
        "mass": 13,
        "abundance": 1.07
      }
    ]
  },
  {
    "z": 7,
    "symbol": "N",
    "names": {
      "en": "Nitrogen",
      "hy": "Ազոտ",
      "ru": "Азот"
    },
    "mass": 14.007,
    "neutrons": 7,
    "period": 2,
    "group": 15,
    "block": "p",
    "category": "nonmetal",
    "shells": [
      2,
      5
    ],
    "electronConfig": "[He] 2s2 2p3",
    "valence": [
      3
    ],
    "electronegativity": 3.04,
    "phase": "gas",
    "color": "#3050f8",
    "xpos": 15,
    "ypos": 2,
    "density": 1.251,
    "melt": 63.15,
    "boil": 77.355,
    "molarHeat": null,
    "electronAffinity": -6.8,
    "ionizationEnergies": [
      1402.3,
      2856,
      4578.1,
      7475,
      9444.9,
      53266.6,
      64360
    ],
    "discoveredBy": "Daniel Rutherford",
    "namedBy": "Jean-Antoine Chaptal",
    "appearance": "colorless gas, liquid or solid",
    "source": "https://en.wikipedia.org/wiki/Nitrogen",
    "atomicRadius": 155,
    "oxidationStates": [
      5,
      4,
      3,
      2,
      1,
      -1,
      -2,
      -3
    ],
    "yearDiscovered": "1772",
    "isotopes": [
      {
        "mass": 14,
        "abundance": 99.636
      },
      {
        "mass": 15,
        "abundance": 0.364
      }
    ]
  },
  {
    "z": 8,
    "symbol": "O",
    "names": {
      "en": "Oxygen",
      "hy": "Թթվածին",
      "ru": "Кислород"
    },
    "mass": 15.999,
    "neutrons": 8,
    "period": 2,
    "group": 16,
    "block": "p",
    "category": "nonmetal",
    "shells": [
      2,
      6
    ],
    "electronConfig": "[He] 2s2 2p4",
    "valence": [
      2
    ],
    "electronegativity": 3.44,
    "phase": "gas",
    "color": "#ff0d0d",
    "xpos": 16,
    "ypos": 2,
    "density": 1.429,
    "melt": 54.36,
    "boil": 90.188,
    "molarHeat": null,
    "electronAffinity": 140.976,
    "ionizationEnergies": [
      1313.9,
      3388.3,
      5300.5,
      7469.2,
      10989.5,
      13326.5,
      71330,
      84078
    ],
    "discoveredBy": "Carl Wilhelm Scheele",
    "namedBy": "Antoine Lavoisier",
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Oxygen",
    "atomicRadius": 152,
    "oxidationStates": [
      -2
    ],
    "yearDiscovered": "1774",
    "isotopes": [
      {
        "mass": 16,
        "abundance": 99.757
      },
      {
        "mass": 18,
        "abundance": 0.205
      },
      {
        "mass": 17,
        "abundance": 0.038
      }
    ]
  },
  {
    "z": 9,
    "symbol": "F",
    "names": {
      "en": "Fluorine",
      "hy": "Ֆտոր",
      "ru": "Фтор"
    },
    "mass": 18.9984031636,
    "neutrons": 10,
    "period": 2,
    "group": 17,
    "block": "p",
    "category": "halogen",
    "shells": [
      2,
      7
    ],
    "electronConfig": "[He] 2s2 2p5",
    "valence": [
      1
    ],
    "electronegativity": 3.98,
    "phase": "gas",
    "color": "#90e050",
    "xpos": 17,
    "ypos": 2,
    "density": 1.696,
    "melt": 53.48,
    "boil": 85.03,
    "molarHeat": null,
    "electronAffinity": 328.1649,
    "ionizationEnergies": [
      1681,
      3374.2,
      6050.4,
      8407.7,
      11022.7,
      15164.1,
      17868,
      92038.1,
      106434.3
    ],
    "discoveredBy": "André-Marie Ampère",
    "namedBy": "Humphry Davy",
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Fluorine",
    "atomicRadius": 135,
    "oxidationStates": [
      -1
    ],
    "yearDiscovered": "1670",
    "isotopes": [
      {
        "mass": 19,
        "abundance": 100
      }
    ]
  },
  {
    "z": 10,
    "symbol": "Ne",
    "names": {
      "en": "Neon",
      "hy": "Նեոն",
      "ru": "Неон"
    },
    "mass": 20.17976,
    "neutrons": 10,
    "period": 2,
    "group": 18,
    "block": "p",
    "category": "noble-gas",
    "shells": [
      2,
      8
    ],
    "electronConfig": "[He] 2s2 2p6",
    "valence": [
      0
    ],
    "electronegativity": null,
    "phase": "gas",
    "color": "#b3e3f5",
    "xpos": 18,
    "ypos": 2,
    "density": 0.9002,
    "melt": 24.56,
    "boil": 27.104,
    "molarHeat": null,
    "electronAffinity": -116,
    "ionizationEnergies": [
      2080.7,
      3952.3,
      6122,
      9371,
      12177,
      15238,
      19999,
      23069.5,
      115379.5,
      131432
    ],
    "discoveredBy": "Morris Travers",
    "namedBy": null,
    "appearance": "colorless gas exhibiting an orange-red glow when placed in a high voltage electric field",
    "source": "https://en.wikipedia.org/wiki/Neon",
    "atomicRadius": 154,
    "oxidationStates": [
      0
    ],
    "yearDiscovered": "1898",
    "isotopes": [
      {
        "mass": 20,
        "abundance": 90.48
      },
      {
        "mass": 22,
        "abundance": 9.25
      },
      {
        "mass": 21,
        "abundance": 0.27
      }
    ]
  },
  {
    "z": 11,
    "symbol": "Na",
    "names": {
      "en": "Sodium",
      "hy": "Նատրիում",
      "ru": "Натрий"
    },
    "mass": 22.989769282,
    "neutrons": 12,
    "period": 3,
    "group": 1,
    "block": "s",
    "category": "alkali-metal",
    "shells": [
      2,
      8,
      1
    ],
    "electronConfig": "[Ne] 3s1",
    "valence": [
      1
    ],
    "electronegativity": 0.93,
    "phase": "solid",
    "color": "#ab5cf2",
    "xpos": 1,
    "ypos": 3,
    "density": 0.968,
    "melt": 370.944,
    "boil": 1156.09,
    "molarHeat": 28.23,
    "electronAffinity": 52.867,
    "ionizationEnergies": [
      495.8,
      4562,
      6910.3,
      9543,
      13354,
      16613,
      20117,
      25496,
      28932,
      141362,
      159076
    ],
    "discoveredBy": "Humphry Davy",
    "namedBy": null,
    "appearance": "silvery white metallic",
    "source": "https://en.wikipedia.org/wiki/Sodium",
    "atomicRadius": 227,
    "oxidationStates": [
      1
    ],
    "yearDiscovered": "1807",
    "isotopes": [
      {
        "mass": 23,
        "abundance": 100
      }
    ]
  },
  {
    "z": 12,
    "symbol": "Mg",
    "names": {
      "en": "Magnesium",
      "hy": "Մագնեզիում",
      "ru": "Магний"
    },
    "mass": 24.305,
    "neutrons": 12,
    "period": 3,
    "group": 2,
    "block": "s",
    "category": "alkaline-earth-metal",
    "shells": [
      2,
      8,
      2
    ],
    "electronConfig": "[Ne] 3s2",
    "valence": [
      2
    ],
    "electronegativity": 1.31,
    "phase": "solid",
    "color": "#8aff00",
    "xpos": 2,
    "ypos": 3,
    "density": 1.738,
    "melt": 923,
    "boil": 1363,
    "molarHeat": 24.869,
    "electronAffinity": -40,
    "ionizationEnergies": [
      737.7,
      1450.7,
      7732.7,
      10542.5,
      13630,
      18020,
      21711,
      25661,
      31653,
      35458,
      169988,
      189368
    ],
    "discoveredBy": "Joseph Black",
    "namedBy": null,
    "appearance": "shiny grey solid",
    "source": "https://en.wikipedia.org/wiki/Magnesium",
    "atomicRadius": 173,
    "oxidationStates": [
      2
    ],
    "yearDiscovered": "1808",
    "isotopes": [
      {
        "mass": 24,
        "abundance": 78.99
      },
      {
        "mass": 26,
        "abundance": 11.01
      },
      {
        "mass": 25,
        "abundance": 10
      }
    ]
  },
  {
    "z": 13,
    "symbol": "Al",
    "names": {
      "en": "Aluminium",
      "hy": "Ալյումին",
      "ru": "Алюминий"
    },
    "mass": 26.98153857,
    "neutrons": 14,
    "period": 3,
    "group": 13,
    "block": "p",
    "category": "post-transition-metal",
    "shells": [
      2,
      8,
      3
    ],
    "electronConfig": "[Ne] 3s2 3p1",
    "valence": [
      3
    ],
    "electronegativity": 1.61,
    "phase": "solid",
    "color": "#bfa6a6",
    "xpos": 13,
    "ypos": 3,
    "density": 2.7,
    "melt": 933.47,
    "boil": 2743,
    "molarHeat": 24.2,
    "electronAffinity": 41.762,
    "ionizationEnergies": [
      577.5,
      1816.7,
      2744.8,
      11577,
      14842,
      18379,
      23326,
      27465,
      31853,
      38473,
      42647,
      201266,
      222316
    ],
    "discoveredBy": null,
    "namedBy": "Humphry Davy",
    "appearance": "silvery gray metallic",
    "source": "https://en.wikipedia.org/wiki/Aluminium",
    "atomicRadius": 184,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "Ancient",
    "isotopes": [
      {
        "mass": 27,
        "abundance": 100
      }
    ]
  },
  {
    "z": 14,
    "symbol": "Si",
    "names": {
      "en": "Silicon",
      "hy": "Սիլիցիում",
      "ru": "Кремний"
    },
    "mass": 28.085,
    "neutrons": 14,
    "period": 3,
    "group": 14,
    "block": "p",
    "category": "metalloid",
    "shells": [
      2,
      8,
      4
    ],
    "electronConfig": "[Ne] 3s2 3p2",
    "valence": [
      4
    ],
    "electronegativity": 1.9,
    "phase": "solid",
    "color": "#f0c8a0",
    "xpos": 14,
    "ypos": 3,
    "density": 2.329,
    "melt": 1687,
    "boil": 3538,
    "molarHeat": 19.789,
    "electronAffinity": 134.0684,
    "ionizationEnergies": [
      786.5,
      1577.1,
      3231.6,
      4355.5,
      16091,
      19805,
      23780,
      29287,
      33878,
      38726,
      45962,
      50502,
      235196,
      257923
    ],
    "discoveredBy": "Jöns Jacob Berzelius",
    "namedBy": "Thomas Thomson (chemist)",
    "appearance": "crystalline, reflective with bluish-tinged faces",
    "source": "https://en.wikipedia.org/wiki/Silicon",
    "atomicRadius": 210,
    "oxidationStates": [
      4,
      2,
      -4
    ],
    "yearDiscovered": "1854",
    "isotopes": [
      {
        "mass": 28,
        "abundance": 92.223
      },
      {
        "mass": 29,
        "abundance": 4.685
      },
      {
        "mass": 30,
        "abundance": 3.092
      }
    ]
  },
  {
    "z": 15,
    "symbol": "P",
    "names": {
      "en": "Phosphorus",
      "hy": "Ֆոսֆոր",
      "ru": "Фосфор"
    },
    "mass": 30.9737619985,
    "neutrons": 16,
    "period": 3,
    "group": 15,
    "block": "p",
    "category": "nonmetal",
    "shells": [
      2,
      8,
      5
    ],
    "electronConfig": "[Ne] 3s2 3p3",
    "valence": [
      3,
      5
    ],
    "electronegativity": 2.19,
    "phase": "solid",
    "color": "#ff8000",
    "xpos": 15,
    "ypos": 3,
    "density": 1.823,
    "melt": null,
    "boil": null,
    "molarHeat": 23.824,
    "electronAffinity": 72.037,
    "ionizationEnergies": [
      1011.8,
      1907,
      2914.1,
      4963.6,
      6273.9,
      21267,
      25431,
      29872,
      35905,
      40950,
      46261,
      54110,
      59024,
      271791,
      296195
    ],
    "discoveredBy": "Hennig Brand",
    "namedBy": null,
    "appearance": "colourless, waxy white, yellow, scarlet, red, violet, black",
    "source": "https://en.wikipedia.org/wiki/Phosphorus",
    "atomicRadius": 180,
    "oxidationStates": [
      5,
      3,
      -3
    ],
    "yearDiscovered": "1669",
    "isotopes": [
      {
        "mass": 31,
        "abundance": 100
      }
    ]
  },
  {
    "z": 16,
    "symbol": "S",
    "names": {
      "en": "Sulfur",
      "hy": "Ծծումբ",
      "ru": "Сера"
    },
    "mass": 32.06,
    "neutrons": 16,
    "period": 3,
    "group": 16,
    "block": "p",
    "category": "nonmetal",
    "shells": [
      2,
      8,
      6
    ],
    "electronConfig": "[Ne] 3s2 3p4",
    "valence": [
      2,
      4,
      6
    ],
    "electronegativity": 2.58,
    "phase": "solid",
    "color": "#ffff30",
    "xpos": 16,
    "ypos": 3,
    "density": 2.07,
    "melt": 388.36,
    "boil": 717.8,
    "molarHeat": 22.75,
    "electronAffinity": 200.4101,
    "ionizationEnergies": [
      999.6,
      2252,
      3357,
      4556,
      7004.3,
      8495.8,
      27107,
      31719,
      36621,
      43177,
      48710,
      54460,
      62930,
      68216,
      311048,
      337138
    ],
    "discoveredBy": "Ancient china",
    "namedBy": null,
    "appearance": "lemon yellow sintered microcrystals",
    "source": "https://en.wikipedia.org/wiki/Sulfur",
    "atomicRadius": 180,
    "oxidationStates": [
      6,
      4,
      -2
    ],
    "yearDiscovered": "Ancient",
    "isotopes": [
      {
        "mass": 32,
        "abundance": 94.99
      },
      {
        "mass": 34,
        "abundance": 4.25
      },
      {
        "mass": 33,
        "abundance": 0.75
      },
      {
        "mass": 36,
        "abundance": 0.01
      }
    ]
  },
  {
    "z": 17,
    "symbol": "Cl",
    "names": {
      "en": "Chlorine",
      "hy": "Քլոր",
      "ru": "Хлор"
    },
    "mass": 35.45,
    "neutrons": 18,
    "period": 3,
    "group": 17,
    "block": "p",
    "category": "halogen",
    "shells": [
      2,
      8,
      7
    ],
    "electronConfig": "[Ne] 3s2 3p5",
    "valence": [
      1
    ],
    "electronegativity": 3.16,
    "phase": "gas",
    "color": "#1ff01f",
    "xpos": 17,
    "ypos": 3,
    "density": 3.2,
    "melt": 171.6,
    "boil": 239.11,
    "molarHeat": null,
    "electronAffinity": 348.575,
    "ionizationEnergies": [
      1251.2,
      2298,
      3822,
      5158.6,
      6542,
      9362,
      11018,
      33604,
      38600,
      43961,
      51068,
      57119,
      63363,
      72341,
      78095,
      352994,
      380760
    ],
    "discoveredBy": "Carl Wilhelm Scheele",
    "namedBy": null,
    "appearance": "pale yellow-green gas",
    "source": "https://en.wikipedia.org/wiki/Chlorine",
    "atomicRadius": 175,
    "oxidationStates": [
      7,
      5,
      1,
      -1
    ],
    "yearDiscovered": "1774",
    "isotopes": [
      {
        "mass": 35,
        "abundance": 75.76
      },
      {
        "mass": 37,
        "abundance": 24.24
      }
    ]
  },
  {
    "z": 18,
    "symbol": "Ar",
    "names": {
      "en": "Argon",
      "hy": "Արգոն",
      "ru": "Аргон"
    },
    "mass": 39.9481,
    "neutrons": 22,
    "period": 3,
    "group": 18,
    "block": "p",
    "category": "noble-gas",
    "shells": [
      2,
      8,
      8
    ],
    "electronConfig": "[Ne] 3s2 3p6",
    "valence": [
      0
    ],
    "electronegativity": null,
    "phase": "gas",
    "color": "#80d1e3",
    "xpos": 18,
    "ypos": 3,
    "density": 1.784,
    "melt": 83.81,
    "boil": 87.302,
    "molarHeat": null,
    "electronAffinity": -96,
    "ionizationEnergies": [
      1520.6,
      2665.8,
      3931,
      5771,
      7238,
      8781,
      11995,
      13842,
      40760,
      46186,
      52002,
      59653,
      66199,
      72918,
      82473,
      88576,
      397605,
      427066
    ],
    "discoveredBy": "Lord Rayleigh",
    "namedBy": null,
    "appearance": "colorless gas exhibiting a lilac/violet glow when placed in a high voltage electric field",
    "source": "https://en.wikipedia.org/wiki/Argon",
    "atomicRadius": 188,
    "oxidationStates": [
      0
    ],
    "yearDiscovered": "1894",
    "isotopes": [
      {
        "mass": 40,
        "abundance": 99.6035
      },
      {
        "mass": 36,
        "abundance": 0.3336
      },
      {
        "mass": 38,
        "abundance": 0.0629
      }
    ]
  },
  {
    "z": 19,
    "symbol": "K",
    "names": {
      "en": "Potassium",
      "hy": "Կալիում",
      "ru": "Калий"
    },
    "mass": 39.09831,
    "neutrons": 20,
    "period": 4,
    "group": 1,
    "block": "s",
    "category": "alkali-metal",
    "shells": [
      2,
      8,
      8,
      1
    ],
    "electronConfig": "[Ar] 4s1",
    "valence": [
      1
    ],
    "electronegativity": 0.82,
    "phase": "solid",
    "color": "#8f40d4",
    "xpos": 1,
    "ypos": 4,
    "density": 0.862,
    "melt": 336.7,
    "boil": 1032,
    "molarHeat": 29.6,
    "electronAffinity": 48.383,
    "ionizationEnergies": [
      418.8,
      3052,
      4420,
      5877,
      7975,
      9590,
      11343,
      14944,
      16963.7,
      48610,
      54490,
      60730,
      68950,
      75900,
      83080,
      93400,
      99710,
      444880,
      476063
    ],
    "discoveredBy": "Humphry Davy",
    "namedBy": null,
    "appearance": "silvery gray",
    "source": "https://en.wikipedia.org/wiki/Potassium",
    "atomicRadius": 275,
    "oxidationStates": [
      1
    ],
    "yearDiscovered": "1807",
    "isotopes": [
      {
        "mass": 39,
        "abundance": 93.2581
      },
      {
        "mass": 41,
        "abundance": 6.7302
      },
      {
        "mass": 40,
        "abundance": 0.0117
      }
    ]
  },
  {
    "z": 20,
    "symbol": "Ca",
    "names": {
      "en": "Calcium",
      "hy": "Կալցիում",
      "ru": "Кальций"
    },
    "mass": 40.0784,
    "neutrons": 20,
    "period": 4,
    "group": 2,
    "block": "s",
    "category": "alkaline-earth-metal",
    "shells": [
      2,
      8,
      8,
      2
    ],
    "electronConfig": "[Ar] 4s2",
    "valence": [
      2
    ],
    "electronegativity": 1,
    "phase": "solid",
    "color": "#3dff00",
    "xpos": 2,
    "ypos": 4,
    "density": 1.55,
    "melt": 1115,
    "boil": 1757,
    "molarHeat": 25.929,
    "electronAffinity": 2.37,
    "ionizationEnergies": [
      589.8,
      1145.4,
      4912.4,
      6491,
      8153,
      10496,
      12270,
      14206,
      18191,
      20385,
      57110,
      63410,
      70110,
      78890,
      86310,
      94000,
      104900,
      111711,
      494850,
      527762
    ],
    "discoveredBy": "Humphry Davy",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Calcium",
    "atomicRadius": 231,
    "oxidationStates": [
      2
    ],
    "yearDiscovered": "Ancient",
    "isotopes": [
      {
        "mass": 40,
        "abundance": 96.941
      },
      {
        "mass": 44,
        "abundance": 2.086
      },
      {
        "mass": 42,
        "abundance": 0.647
      },
      {
        "mass": 48,
        "abundance": 0.187
      },
      {
        "mass": 43,
        "abundance": 0.135
      },
      {
        "mass": 46,
        "abundance": 0.004
      }
    ]
  },
  {
    "z": 21,
    "symbol": "Sc",
    "names": {
      "en": "Scandium",
      "hy": "Սկանդիում",
      "ru": "Скандий"
    },
    "mass": 44.9559085,
    "neutrons": 24,
    "period": 4,
    "group": 3,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      9,
      2
    ],
    "electronConfig": "[Ar] 3d1 4s2",
    "valence": [
      3
    ],
    "electronegativity": 1.36,
    "phase": "solid",
    "color": "#e6e6e6",
    "xpos": 3,
    "ypos": 4,
    "density": 2.985,
    "melt": 1814,
    "boil": 3109,
    "molarHeat": 25.52,
    "electronAffinity": 18,
    "ionizationEnergies": [
      633.1,
      1235,
      2388.6,
      7090.6,
      8843,
      10679,
      13310,
      15250,
      17370,
      21726,
      24102,
      66320,
      73010,
      80160,
      89490,
      97400,
      105600,
      117000,
      124270,
      547530,
      582163
    ],
    "discoveredBy": "Lars Fredrik Nilson",
    "namedBy": null,
    "appearance": "silvery white",
    "source": "https://en.wikipedia.org/wiki/Scandium",
    "atomicRadius": 211,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1879",
    "isotopes": [
      {
        "mass": 45,
        "abundance": 100
      }
    ]
  },
  {
    "z": 22,
    "symbol": "Ti",
    "names": {
      "en": "Titanium",
      "hy": "Տիտան",
      "ru": "Титан"
    },
    "mass": 47.8671,
    "neutrons": 26,
    "period": 4,
    "group": 4,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      10,
      2
    ],
    "electronConfig": "[Ar] 3d2 4s2",
    "valence": [
      4
    ],
    "electronegativity": 1.54,
    "phase": "solid",
    "color": "#bfc2c7",
    "xpos": 4,
    "ypos": 4,
    "density": 4.506,
    "melt": 1941,
    "boil": 3560,
    "molarHeat": 25.06,
    "electronAffinity": 7.289,
    "ionizationEnergies": [
      658.8,
      1309.8,
      2652.5,
      4174.6,
      9581,
      11533,
      13590,
      16440,
      18530,
      20833,
      25575,
      28125,
      76015,
      83280,
      90880,
      100700,
      109100,
      117800,
      129900,
      137530,
      602930,
      639294
    ],
    "discoveredBy": "William Gregor",
    "namedBy": "Martin Heinrich Klaproth",
    "appearance": "silvery grey-white metallic",
    "source": "https://en.wikipedia.org/wiki/Titanium",
    "atomicRadius": 187,
    "oxidationStates": [
      4,
      3,
      2
    ],
    "yearDiscovered": "1791",
    "isotopes": [
      {
        "mass": 48,
        "abundance": 73.72
      },
      {
        "mass": 46,
        "abundance": 8.25
      },
      {
        "mass": 47,
        "abundance": 7.44
      },
      {
        "mass": 49,
        "abundance": 5.41
      },
      {
        "mass": 50,
        "abundance": 5.18
      }
    ]
  },
  {
    "z": 23,
    "symbol": "V",
    "names": {
      "en": "Vanadium",
      "hy": "Վանադիում",
      "ru": "Ванадий"
    },
    "mass": 50.94151,
    "neutrons": 28,
    "period": 4,
    "group": 5,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      11,
      2
    ],
    "electronConfig": "[Ar] 3d3 4s2",
    "valence": [
      5
    ],
    "electronegativity": 1.63,
    "phase": "solid",
    "color": "#a6a6ab",
    "xpos": 5,
    "ypos": 4,
    "density": 6,
    "melt": 2183,
    "boil": 3680,
    "molarHeat": 24.89,
    "electronAffinity": 50.911,
    "ionizationEnergies": [
      650.9,
      1414,
      2830,
      4507,
      6298.7,
      12363,
      14530,
      16730,
      19860,
      22240,
      24670,
      29730,
      32446,
      86450,
      94170,
      102300,
      112700,
      121600,
      130700,
      143400,
      151440,
      661050,
      699144
    ],
    "discoveredBy": "Andrés Manuel del Río",
    "namedBy": "Isotopes of vanadium",
    "appearance": "blue-silver-grey metal",
    "source": "https://en.wikipedia.org/wiki/Vanadium",
    "atomicRadius": 179,
    "oxidationStates": [
      5,
      4,
      3,
      2
    ],
    "yearDiscovered": "1801",
    "isotopes": [
      {
        "mass": 51,
        "abundance": 99.75
      },
      {
        "mass": 50,
        "abundance": 0.25
      }
    ]
  },
  {
    "z": 24,
    "symbol": "Cr",
    "names": {
      "en": "Chromium",
      "hy": "Քրոմ",
      "ru": "Хром"
    },
    "mass": 51.99616,
    "neutrons": 28,
    "period": 4,
    "group": 6,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      13,
      1
    ],
    "electronConfig": "[Ar] 3d5 4s1",
    "valence": [
      3,
      6
    ],
    "electronegativity": 1.66,
    "phase": "solid",
    "color": "#8a99c7",
    "xpos": 6,
    "ypos": 4,
    "density": 7.19,
    "melt": 2180,
    "boil": 2944,
    "molarHeat": 23.35,
    "electronAffinity": 65.21,
    "ionizationEnergies": [
      652.9,
      1590.6,
      2987,
      4743,
      6702,
      8744.9,
      15455,
      17820,
      20190,
      23580,
      26130,
      28750,
      34230,
      37066,
      97510,
      105800,
      114300,
      125300,
      134700,
      144300,
      157700,
      166090,
      721870,
      761733
    ],
    "discoveredBy": "Louis Nicolas Vauquelin",
    "namedBy": null,
    "appearance": "silvery metallic",
    "source": "https://en.wikipedia.org/wiki/Chromium",
    "atomicRadius": 189,
    "oxidationStates": [
      6,
      3,
      2
    ],
    "yearDiscovered": "1797",
    "isotopes": [
      {
        "mass": 52,
        "abundance": 83.789
      },
      {
        "mass": 53,
        "abundance": 9.501
      },
      {
        "mass": 50,
        "abundance": 4.345
      },
      {
        "mass": 54,
        "abundance": 2.365
      }
    ]
  },
  {
    "z": 25,
    "symbol": "Mn",
    "names": {
      "en": "Manganese",
      "hy": "Մանգան",
      "ru": "Марганец"
    },
    "mass": 54.9380443,
    "neutrons": 30,
    "period": 4,
    "group": 7,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      13,
      2
    ],
    "electronConfig": "[Ar] 3d5 4s2",
    "valence": [
      2,
      4,
      7
    ],
    "electronegativity": 1.55,
    "phase": "solid",
    "color": "#9c7ac7",
    "xpos": 7,
    "ypos": 4,
    "density": 7.21,
    "melt": 1519,
    "boil": 2334,
    "molarHeat": 26.32,
    "electronAffinity": -50,
    "ionizationEnergies": [
      717.3,
      1509,
      3248,
      4940,
      6990,
      9220,
      11500,
      18770,
      21400,
      23960,
      27590,
      30330,
      33150,
      38880,
      41987,
      109480,
      118100,
      127100,
      138600,
      148500,
      158600,
      172500,
      181380,
      785450,
      827067
    ],
    "discoveredBy": "Torbern Olof Bergman",
    "namedBy": null,
    "appearance": "silvery metallic",
    "source": "https://en.wikipedia.org/wiki/Manganese",
    "atomicRadius": 197,
    "oxidationStates": [
      7,
      4,
      3,
      2
    ],
    "yearDiscovered": "1774",
    "isotopes": [
      {
        "mass": 55,
        "abundance": 100
      }
    ]
  },
  {
    "z": 26,
    "symbol": "Fe",
    "names": {
      "en": "Iron",
      "hy": "Երկաթ",
      "ru": "Железо"
    },
    "mass": 55.8452,
    "neutrons": 30,
    "period": 4,
    "group": 8,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      14,
      2
    ],
    "electronConfig": "[Ar] 3d6 4s2",
    "valence": [
      2,
      3
    ],
    "electronegativity": 1.83,
    "phase": "solid",
    "color": "#e06633",
    "xpos": 8,
    "ypos": 4,
    "density": 7.874,
    "melt": 1811,
    "boil": 3134,
    "molarHeat": 25.1,
    "electronAffinity": 14.785,
    "ionizationEnergies": [
      762.5,
      1561.9,
      2957,
      5290,
      7240,
      9560,
      12060,
      14580,
      22540,
      25290,
      28000,
      31920,
      34830,
      37840,
      44100,
      47206,
      122200,
      131000,
      140500,
      152600,
      163000,
      173600,
      188100,
      195200,
      851800,
      895161
    ],
    "discoveredBy": "5000 BC",
    "namedBy": null,
    "appearance": "lustrous metallic with a grayish tinge",
    "source": "https://en.wikipedia.org/wiki/Iron",
    "atomicRadius": 194,
    "oxidationStates": [
      3,
      2
    ],
    "yearDiscovered": "Ancient",
    "isotopes": [
      {
        "mass": 56,
        "abundance": 91.754
      },
      {
        "mass": 54,
        "abundance": 5.845
      },
      {
        "mass": 57,
        "abundance": 2.119
      },
      {
        "mass": 58,
        "abundance": 0.282
      }
    ]
  },
  {
    "z": 27,
    "symbol": "Co",
    "names": {
      "en": "Cobalt",
      "hy": "Կոբալտ",
      "ru": "Кобальт"
    },
    "mass": 58.9331944,
    "neutrons": 32,
    "period": 4,
    "group": 9,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      15,
      2
    ],
    "electronConfig": "[Ar] 3d7 4s2",
    "valence": [
      2,
      3
    ],
    "electronegativity": 1.88,
    "phase": "solid",
    "color": "#f090a0",
    "xpos": 9,
    "ypos": 4,
    "density": 8.9,
    "melt": 1768,
    "boil": 3200,
    "molarHeat": 24.81,
    "electronAffinity": 63.898,
    "ionizationEnergies": [
      760.4,
      1648,
      3232,
      4950,
      7670,
      9840,
      12440,
      15230,
      17959,
      26570,
      29400,
      32400,
      36600,
      39700,
      42800,
      49396,
      52737,
      134810,
      145170,
      154700,
      167400,
      178100,
      189300,
      204500,
      214100,
      920870,
      966023
    ],
    "discoveredBy": "Georg Brandt",
    "namedBy": null,
    "appearance": "hard lustrous gray metal",
    "source": "https://en.wikipedia.org/wiki/Cobalt",
    "atomicRadius": 192,
    "oxidationStates": [
      3,
      2
    ],
    "yearDiscovered": "1735",
    "isotopes": [
      {
        "mass": 59,
        "abundance": 100
      }
    ]
  },
  {
    "z": 28,
    "symbol": "Ni",
    "names": {
      "en": "Nickel",
      "hy": "Նիկել",
      "ru": "Никель"
    },
    "mass": 58.69344,
    "neutrons": 31,
    "period": 4,
    "group": 10,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      16,
      2
    ],
    "electronConfig": "[Ar] 3d8 4s2",
    "valence": [
      2
    ],
    "electronegativity": 1.91,
    "phase": "solid",
    "color": "#50d050",
    "xpos": 10,
    "ypos": 4,
    "density": 8.908,
    "melt": 1728,
    "boil": 3003,
    "molarHeat": 26.07,
    "electronAffinity": 111.65,
    "ionizationEnergies": [
      737.1,
      1753,
      3395,
      5300,
      7339,
      10400,
      12800,
      15600,
      18600,
      21670,
      30970,
      34000,
      37100,
      41500,
      44800,
      48100,
      55101,
      58570,
      148700,
      159000,
      169400,
      182700,
      194000,
      205600,
      221400,
      231490,
      992718,
      1039668
    ],
    "discoveredBy": "Axel Fredrik Cronstedt",
    "namedBy": null,
    "appearance": "lustrous, metallic, and silver with a gold tinge",
    "source": "https://en.wikipedia.org/wiki/Nickel",
    "atomicRadius": 163,
    "oxidationStates": [
      3,
      2
    ],
    "yearDiscovered": "1751",
    "isotopes": [
      {
        "mass": 58,
        "abundance": 68.077
      },
      {
        "mass": 60,
        "abundance": 26.223
      },
      {
        "mass": 62,
        "abundance": 3.6346
      },
      {
        "mass": 61,
        "abundance": 1.1399
      },
      {
        "mass": 64,
        "abundance": 0.9255
      }
    ]
  },
  {
    "z": 29,
    "symbol": "Cu",
    "names": {
      "en": "Copper",
      "hy": "Պղինձ",
      "ru": "Медь"
    },
    "mass": 63.5463,
    "neutrons": 35,
    "period": 4,
    "group": 11,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      1
    ],
    "electronConfig": "[Ar] 3d10 4s1",
    "valence": [
      1,
      2
    ],
    "electronegativity": 1.9,
    "phase": "solid",
    "color": "#c88033",
    "xpos": 11,
    "ypos": 4,
    "density": 8.96,
    "melt": 1357.77,
    "boil": 2835,
    "molarHeat": 24.44,
    "electronAffinity": 119.235,
    "ionizationEnergies": [
      745.5,
      1957.9,
      3555,
      5536,
      7700,
      9900,
      13400,
      16000,
      19200,
      22400,
      25600,
      35600,
      38700,
      42000,
      46700,
      50200,
      53700,
      61100,
      64702,
      163700,
      174100,
      184900,
      198800,
      210500,
      222700,
      239100,
      249660,
      1067358,
      1116105
    ],
    "discoveredBy": "Middle East",
    "namedBy": null,
    "appearance": "red-orange metallic luster",
    "source": "https://en.wikipedia.org/wiki/Copper",
    "atomicRadius": 140,
    "oxidationStates": [
      2,
      1
    ],
    "yearDiscovered": "Ancient",
    "isotopes": [
      {
        "mass": 63,
        "abundance": 69.15
      },
      {
        "mass": 65,
        "abundance": 30.85
      }
    ]
  },
  {
    "z": 30,
    "symbol": "Zn",
    "names": {
      "en": "Zinc",
      "hy": "Ցինկ",
      "ru": "Цинк"
    },
    "mass": 65.382,
    "neutrons": 35,
    "period": 4,
    "group": 12,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      2
    ],
    "electronConfig": "[Ar] 3d10 4s2",
    "valence": [
      2
    ],
    "electronegativity": 1.65,
    "phase": "solid",
    "color": "#7d80b0",
    "xpos": 12,
    "ypos": 4,
    "density": 7.14,
    "melt": 692.68,
    "boil": 1180,
    "molarHeat": 25.47,
    "electronAffinity": -58,
    "ionizationEnergies": [
      906.4,
      1733.3,
      3833,
      5731,
      7970,
      10400,
      12900,
      16800,
      19600,
      23000,
      26400,
      29990,
      40490,
      43800,
      47300,
      52300,
      55900,
      59700,
      67300,
      71200,
      179100
    ],
    "discoveredBy": "India",
    "namedBy": null,
    "appearance": "silver-gray",
    "source": "https://en.wikipedia.org/wiki/Zinc",
    "atomicRadius": 139,
    "oxidationStates": [
      2
    ],
    "yearDiscovered": "1746",
    "isotopes": [
      {
        "mass": 64,
        "abundance": 49.17
      },
      {
        "mass": 66,
        "abundance": 27.73
      },
      {
        "mass": 68,
        "abundance": 18.45
      },
      {
        "mass": 67,
        "abundance": 4.04
      },
      {
        "mass": 70,
        "abundance": 0.61
      }
    ]
  },
  {
    "z": 31,
    "symbol": "Ga",
    "names": {
      "en": "Gallium",
      "hy": "Գալիում",
      "ru": "Галлий"
    },
    "mass": 69.7231,
    "neutrons": 39,
    "period": 4,
    "group": 13,
    "block": "p",
    "category": "post-transition-metal",
    "shells": [
      2,
      8,
      18,
      3
    ],
    "electronConfig": "[Ar] 3d10 4s2 4p1",
    "valence": [
      3
    ],
    "electronegativity": 1.81,
    "phase": "solid",
    "color": "#c28f8f",
    "xpos": 13,
    "ypos": 4,
    "density": 5.91,
    "melt": 302.9146,
    "boil": 2673,
    "molarHeat": 25.86,
    "electronAffinity": 41,
    "ionizationEnergies": [
      578.8,
      1979.3,
      2963,
      6180
    ],
    "discoveredBy": "Lecoq de Boisbaudran",
    "namedBy": null,
    "appearance": "silver-white",
    "source": "https://en.wikipedia.org/wiki/Gallium",
    "atomicRadius": 187,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1875",
    "isotopes": [
      {
        "mass": 69,
        "abundance": 60.108
      },
      {
        "mass": 71,
        "abundance": 39.892
      }
    ]
  },
  {
    "z": 32,
    "symbol": "Ge",
    "names": {
      "en": "Germanium",
      "hy": "Գերմանիում",
      "ru": "Германий"
    },
    "mass": 72.6308,
    "neutrons": 41,
    "period": 4,
    "group": 14,
    "block": "p",
    "category": "metalloid",
    "shells": [
      2,
      8,
      18,
      4
    ],
    "electronConfig": "[Ar] 3d10 4s2 4p2",
    "valence": [
      4
    ],
    "electronegativity": 2.01,
    "phase": "solid",
    "color": "#668f8f",
    "xpos": 14,
    "ypos": 4,
    "density": 5.323,
    "melt": 1211.4,
    "boil": 3106,
    "molarHeat": 23.222,
    "electronAffinity": 118.9352,
    "ionizationEnergies": [
      762,
      1537.5,
      3302.1,
      4411,
      9020
    ],
    "discoveredBy": "Clemens Winkler",
    "namedBy": null,
    "appearance": "grayish-white",
    "source": "https://en.wikipedia.org/wiki/Germanium",
    "atomicRadius": 211,
    "oxidationStates": [
      4,
      2
    ],
    "yearDiscovered": "1886",
    "isotopes": [
      {
        "mass": 74,
        "abundance": 36.5
      },
      {
        "mass": 72,
        "abundance": 27.45
      },
      {
        "mass": 70,
        "abundance": 20.57
      },
      {
        "mass": 73,
        "abundance": 7.75
      },
      {
        "mass": 76,
        "abundance": 7.73
      }
    ]
  },
  {
    "z": 33,
    "symbol": "As",
    "names": {
      "en": "Arsenic",
      "hy": "Արսեն",
      "ru": "Мышьяк"
    },
    "mass": 74.9215956,
    "neutrons": 42,
    "period": 4,
    "group": 15,
    "block": "p",
    "category": "metalloid",
    "shells": [
      2,
      8,
      18,
      5
    ],
    "electronConfig": "[Ar] 3d10 4s2 4p3",
    "valence": [
      3,
      5
    ],
    "electronegativity": 2.18,
    "phase": "solid",
    "color": "#bd80e3",
    "xpos": 15,
    "ypos": 4,
    "density": 5.727,
    "melt": null,
    "boil": null,
    "molarHeat": 24.64,
    "electronAffinity": 77.65,
    "ionizationEnergies": [
      947,
      1798,
      2735,
      4837,
      6043,
      12310
    ],
    "discoveredBy": "Bronze Age",
    "namedBy": null,
    "appearance": "metallic grey",
    "source": "https://en.wikipedia.org/wiki/Arsenic",
    "atomicRadius": 185,
    "oxidationStates": [
      5,
      3,
      -3
    ],
    "yearDiscovered": "Ancient",
    "isotopes": [
      {
        "mass": 75,
        "abundance": 100
      }
    ]
  },
  {
    "z": 34,
    "symbol": "Se",
    "names": {
      "en": "Selenium",
      "hy": "Սելեն",
      "ru": "Селен"
    },
    "mass": 78.9718,
    "neutrons": 45,
    "period": 4,
    "group": 16,
    "block": "p",
    "category": "nonmetal",
    "shells": [
      2,
      8,
      18,
      6
    ],
    "electronConfig": "[Ar] 3d10 4s2 4p4",
    "valence": [
      2,
      4,
      6
    ],
    "electronegativity": 2.55,
    "phase": "solid",
    "color": "#ffa100",
    "xpos": 16,
    "ypos": 4,
    "density": 4.81,
    "melt": 494,
    "boil": 958,
    "molarHeat": 25.363,
    "electronAffinity": 194.9587,
    "ionizationEnergies": [
      941,
      2045,
      2973.7,
      4144,
      6590,
      7880,
      14990
    ],
    "discoveredBy": "Jöns Jakob Berzelius",
    "namedBy": null,
    "appearance": "black, red, and gray (not pictured) allotropes",
    "source": "https://en.wikipedia.org/wiki/Selenium",
    "atomicRadius": 190,
    "oxidationStates": [
      6,
      4,
      -2
    ],
    "yearDiscovered": "1817",
    "isotopes": [
      {
        "mass": 80,
        "abundance": 49.61
      },
      {
        "mass": 78,
        "abundance": 23.77
      },
      {
        "mass": 76,
        "abundance": 9.37
      },
      {
        "mass": 82,
        "abundance": 8.73
      },
      {
        "mass": 77,
        "abundance": 7.63
      },
      {
        "mass": 74,
        "abundance": 0.89
      }
    ]
  },
  {
    "z": 35,
    "symbol": "Br",
    "names": {
      "en": "Bromine",
      "hy": "Բրոմ",
      "ru": "Бром"
    },
    "mass": 79.904,
    "neutrons": 45,
    "period": 4,
    "group": 17,
    "block": "p",
    "category": "halogen",
    "shells": [
      2,
      8,
      18,
      7
    ],
    "electronConfig": "[Ar] 3d10 4s2 4p5",
    "valence": [
      1
    ],
    "electronegativity": 2.96,
    "phase": "liquid",
    "color": "#a62929",
    "xpos": 17,
    "ypos": 4,
    "density": 3.1028,
    "melt": 265.8,
    "boil": 332,
    "molarHeat": null,
    "electronAffinity": 324.537,
    "ionizationEnergies": [
      1139.9,
      2103,
      3470,
      4560,
      5760,
      8550,
      9940,
      18600
    ],
    "discoveredBy": "Antoine Jérôme Balard",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Bromine",
    "atomicRadius": 183,
    "oxidationStates": [
      5,
      1,
      -1
    ],
    "yearDiscovered": "1826",
    "isotopes": [
      {
        "mass": 79,
        "abundance": 50.69
      },
      {
        "mass": 81,
        "abundance": 49.31
      }
    ]
  },
  {
    "z": 36,
    "symbol": "Kr",
    "names": {
      "en": "Krypton",
      "hy": "Կրիպտոն",
      "ru": "Криптон"
    },
    "mass": 83.7982,
    "neutrons": 48,
    "period": 4,
    "group": 18,
    "block": "p",
    "category": "noble-gas",
    "shells": [
      2,
      8,
      18,
      8
    ],
    "electronConfig": "[Ar] 3d10 4s2 4p6",
    "valence": [
      0
    ],
    "electronegativity": 3,
    "phase": "gas",
    "color": "#5cb8d1",
    "xpos": 18,
    "ypos": 4,
    "density": 3.749,
    "melt": 115.78,
    "boil": 119.93,
    "molarHeat": null,
    "electronAffinity": -96,
    "ionizationEnergies": [
      1350.8,
      2350.4,
      3565,
      5070,
      6240,
      7570,
      10710,
      12138,
      22274,
      25880,
      29700,
      33800,
      37700,
      43100,
      47500,
      52200,
      57100,
      61800,
      75800,
      80400,
      85300,
      90400,
      96300,
      101400,
      111100,
      116290,
      282500,
      296200,
      311400,
      326200
    ],
    "discoveredBy": "William Ramsay",
    "namedBy": null,
    "appearance": "colorless gas, exhibiting a whitish glow in a high electric field",
    "source": "https://en.wikipedia.org/wiki/Krypton",
    "atomicRadius": 202,
    "oxidationStates": [
      0
    ],
    "yearDiscovered": "1898",
    "isotopes": [
      {
        "mass": 84,
        "abundance": 56.987
      },
      {
        "mass": 86,
        "abundance": 17.279
      },
      {
        "mass": 82,
        "abundance": 11.593
      },
      {
        "mass": 83,
        "abundance": 11.5
      },
      {
        "mass": 80,
        "abundance": 2.286
      },
      {
        "mass": 78,
        "abundance": 0.355
      }
    ]
  },
  {
    "z": 37,
    "symbol": "Rb",
    "names": {
      "en": "Rubidium",
      "hy": "Ռուբիդիում",
      "ru": "Рубидий"
    },
    "mass": 85.46783,
    "neutrons": 48,
    "period": 5,
    "group": 1,
    "block": "s",
    "category": "alkali-metal",
    "shells": [
      2,
      8,
      18,
      8,
      1
    ],
    "electronConfig": "[Kr] 5s1",
    "valence": [
      1
    ],
    "electronegativity": 0.82,
    "phase": "solid",
    "color": "#702eb0",
    "xpos": 1,
    "ypos": 5,
    "density": 1.532,
    "melt": 312.45,
    "boil": 961,
    "molarHeat": 31.06,
    "electronAffinity": 46.884,
    "ionizationEnergies": [
      403,
      2633,
      3860,
      5080,
      6850,
      8140,
      9570,
      13120,
      14500,
      26740
    ],
    "discoveredBy": "Robert Bunsen",
    "namedBy": null,
    "appearance": "grey white",
    "source": "https://en.wikipedia.org/wiki/Rubidium",
    "atomicRadius": 303,
    "oxidationStates": [
      1
    ],
    "yearDiscovered": "1861",
    "isotopes": [
      {
        "mass": 85,
        "abundance": 72.17
      },
      {
        "mass": 87,
        "abundance": 27.83
      }
    ]
  },
  {
    "z": 38,
    "symbol": "Sr",
    "names": {
      "en": "Strontium",
      "hy": "Ստրոնցիում",
      "ru": "Стронций"
    },
    "mass": 87.621,
    "neutrons": 50,
    "period": 5,
    "group": 2,
    "block": "s",
    "category": "alkaline-earth-metal",
    "shells": [
      2,
      8,
      18,
      8,
      2
    ],
    "electronConfig": "[Kr] 5s2",
    "valence": [
      2
    ],
    "electronegativity": 0.95,
    "phase": "solid",
    "color": "#00ff00",
    "xpos": 2,
    "ypos": 5,
    "density": 2.64,
    "melt": 1050,
    "boil": 1650,
    "molarHeat": 26.4,
    "electronAffinity": 5.023,
    "ionizationEnergies": [
      549.5,
      1064.2,
      4138,
      5500,
      6910,
      8760,
      10230,
      11800,
      15600,
      17100,
      31270
    ],
    "discoveredBy": "William Cruickshank (chemist)",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Strontium",
    "atomicRadius": 249,
    "oxidationStates": [
      2
    ],
    "yearDiscovered": "1790",
    "isotopes": [
      {
        "mass": 88,
        "abundance": 82.58
      },
      {
        "mass": 86,
        "abundance": 9.86
      },
      {
        "mass": 87,
        "abundance": 7
      },
      {
        "mass": 84,
        "abundance": 0.56
      }
    ]
  },
  {
    "z": 39,
    "symbol": "Y",
    "names": {
      "en": "Yttrium",
      "hy": "Իտրիում",
      "ru": "Иттрий"
    },
    "mass": 88.905842,
    "neutrons": 50,
    "period": 5,
    "group": 3,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      9,
      2
    ],
    "electronConfig": "[Kr] 4d1 5s2",
    "valence": [
      3
    ],
    "electronegativity": 1.22,
    "phase": "solid",
    "color": "#94ffff",
    "xpos": 3,
    "ypos": 5,
    "density": 4.472,
    "melt": 1799,
    "boil": 3203,
    "molarHeat": 26.53,
    "electronAffinity": 29.6,
    "ionizationEnergies": [
      600,
      1180,
      1980,
      5847,
      7430,
      8970,
      11190,
      12450,
      14110,
      18400,
      19900,
      36090
    ],
    "discoveredBy": "Johan Gadolin",
    "namedBy": null,
    "appearance": "silvery white",
    "source": "https://en.wikipedia.org/wiki/Yttrium",
    "atomicRadius": 219,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1794",
    "isotopes": [
      {
        "mass": 89,
        "abundance": 100
      }
    ]
  },
  {
    "z": 40,
    "symbol": "Zr",
    "names": {
      "en": "Zirconium",
      "hy": "Ցիրկոնիում",
      "ru": "Цирконий"
    },
    "mass": 91.2242,
    "neutrons": 51,
    "period": 5,
    "group": 4,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      10,
      2
    ],
    "electronConfig": "[Kr] 4d2 5s2",
    "valence": [
      4
    ],
    "electronegativity": 1.33,
    "phase": "solid",
    "color": "#94e0e0",
    "xpos": 4,
    "ypos": 5,
    "density": 6.52,
    "melt": 2128,
    "boil": 4650,
    "molarHeat": 25.36,
    "electronAffinity": 41.806,
    "ionizationEnergies": [
      640.1,
      1270,
      2218,
      3313,
      7752,
      9500
    ],
    "discoveredBy": "Martin Heinrich Klaproth",
    "namedBy": null,
    "appearance": "silvery white",
    "source": "https://en.wikipedia.org/wiki/Zirconium",
    "atomicRadius": 186,
    "oxidationStates": [
      4
    ],
    "yearDiscovered": "1789",
    "isotopes": [
      {
        "mass": 90,
        "abundance": 51.45
      },
      {
        "mass": 94,
        "abundance": 17.38
      },
      {
        "mass": 92,
        "abundance": 17.15
      },
      {
        "mass": 91,
        "abundance": 11.22
      },
      {
        "mass": 96,
        "abundance": 2.8
      }
    ]
  },
  {
    "z": 41,
    "symbol": "Nb",
    "names": {
      "en": "Niobium",
      "hy": "Նիոբիում",
      "ru": "Ниобий"
    },
    "mass": 92.906372,
    "neutrons": 52,
    "period": 5,
    "group": 5,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      12,
      1
    ],
    "electronConfig": "[Kr] 4d4 5s1",
    "valence": [
      5
    ],
    "electronegativity": 1.6,
    "phase": "solid",
    "color": "#73c2c9",
    "xpos": 5,
    "ypos": 5,
    "density": 8.57,
    "melt": 2750,
    "boil": 5017,
    "molarHeat": 24.6,
    "electronAffinity": 88.516,
    "ionizationEnergies": [
      652.1,
      1380,
      2416,
      3700,
      4877,
      9847,
      12100
    ],
    "discoveredBy": "Charles Hatchett",
    "namedBy": null,
    "appearance": "gray metallic, bluish when oxidized",
    "source": "https://en.wikipedia.org/wiki/Niobium",
    "atomicRadius": 207,
    "oxidationStates": [
      5,
      3
    ],
    "yearDiscovered": "1801",
    "isotopes": [
      {
        "mass": 93,
        "abundance": 100
      }
    ]
  },
  {
    "z": 42,
    "symbol": "Mo",
    "names": {
      "en": "Molybdenum",
      "hy": "Մոլիբդեն",
      "ru": "Молибден"
    },
    "mass": 95.951,
    "neutrons": 54,
    "period": 5,
    "group": 6,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      13,
      1
    ],
    "electronConfig": "[Kr] 4d5 5s1",
    "valence": [
      6
    ],
    "electronegativity": 2.16,
    "phase": "solid",
    "color": "#54b5b5",
    "xpos": 6,
    "ypos": 5,
    "density": 10.28,
    "melt": 2896,
    "boil": 4912,
    "molarHeat": 24.06,
    "electronAffinity": 72.1,
    "ionizationEnergies": [
      684.3,
      1560,
      2618,
      4480,
      5257,
      6640.8,
      12125,
      13860,
      15835,
      17980,
      20190,
      22219,
      26930,
      29196,
      52490,
      55000,
      61400,
      67700,
      74000,
      80400,
      87000,
      93400,
      98420,
      104400,
      121900,
      127700,
      133800,
      139800,
      148100,
      154500
    ],
    "discoveredBy": "Carl Wilhelm Scheele",
    "namedBy": null,
    "appearance": "gray metallic",
    "source": "https://en.wikipedia.org/wiki/Molybdenum",
    "atomicRadius": 209,
    "oxidationStates": [
      6
    ],
    "yearDiscovered": "1778",
    "isotopes": [
      {
        "mass": 98,
        "abundance": 24.39
      },
      {
        "mass": 96,
        "abundance": 16.67
      },
      {
        "mass": 95,
        "abundance": 15.84
      },
      {
        "mass": 92,
        "abundance": 14.53
      },
      {
        "mass": 100,
        "abundance": 9.82
      },
      {
        "mass": 97,
        "abundance": 9.6
      },
      {
        "mass": 94,
        "abundance": 9.15
      }
    ]
  },
  {
    "z": 43,
    "symbol": "Tc",
    "names": {
      "en": "Technetium",
      "hy": "Տեխնեցիում",
      "ru": "Технеций"
    },
    "mass": 98,
    "neutrons": 55,
    "period": 5,
    "group": 7,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      13,
      2
    ],
    "electronConfig": "[Kr] 4d5 5s2",
    "valence": [
      7
    ],
    "electronegativity": 1.9,
    "phase": "solid",
    "color": "#3b9e9e",
    "xpos": 7,
    "ypos": 5,
    "density": 11,
    "melt": 2430,
    "boil": 4538,
    "molarHeat": 24.27,
    "electronAffinity": 53,
    "ionizationEnergies": [
      702,
      1470,
      2850
    ],
    "discoveredBy": "Emilio Segrè",
    "namedBy": null,
    "appearance": "shiny gray metal",
    "source": "https://en.wikipedia.org/wiki/Technetium",
    "atomicRadius": 209,
    "oxidationStates": [
      7,
      6,
      4
    ],
    "yearDiscovered": "1937",
    "isotopes": []
  },
  {
    "z": 44,
    "symbol": "Ru",
    "names": {
      "en": "Ruthenium",
      "hy": "Ռութենիում",
      "ru": "Рутений"
    },
    "mass": 101.072,
    "neutrons": 57,
    "period": 5,
    "group": 8,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      15,
      1
    ],
    "electronConfig": "[Kr] 4d7 5s1",
    "valence": [
      3,
      4
    ],
    "electronegativity": 2.2,
    "phase": "solid",
    "color": "#248f8f",
    "xpos": 8,
    "ypos": 5,
    "density": 12.45,
    "melt": 2607,
    "boil": 4423,
    "molarHeat": 24.06,
    "electronAffinity": 100.96,
    "ionizationEnergies": [
      710.2,
      1620,
      2747
    ],
    "discoveredBy": "Karl Ernst Claus",
    "namedBy": null,
    "appearance": "silvery white metallic",
    "source": "https://en.wikipedia.org/wiki/Ruthenium",
    "atomicRadius": 207,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1827",
    "isotopes": [
      {
        "mass": 102,
        "abundance": 31.55
      },
      {
        "mass": 104,
        "abundance": 18.62
      },
      {
        "mass": 101,
        "abundance": 17.06
      },
      {
        "mass": 99,
        "abundance": 12.76
      },
      {
        "mass": 100,
        "abundance": 12.6
      },
      {
        "mass": 96,
        "abundance": 5.54
      },
      {
        "mass": 98,
        "abundance": 1.87
      }
    ]
  },
  {
    "z": 45,
    "symbol": "Rh",
    "names": {
      "en": "Rhodium",
      "hy": "Ռոդիում",
      "ru": "Родий"
    },
    "mass": 102.905502,
    "neutrons": 58,
    "period": 5,
    "group": 9,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      16,
      1
    ],
    "electronConfig": "[Kr] 4d8 5s1",
    "valence": [
      3
    ],
    "electronegativity": 2.28,
    "phase": "solid",
    "color": "#0a7d8c",
    "xpos": 9,
    "ypos": 5,
    "density": 12.41,
    "melt": 2237,
    "boil": 3968,
    "molarHeat": 24.98,
    "electronAffinity": 110.27,
    "ionizationEnergies": [
      719.7,
      1740,
      2997
    ],
    "discoveredBy": "William Hyde Wollaston",
    "namedBy": null,
    "appearance": "silvery white metallic",
    "source": "https://en.wikipedia.org/wiki/Rhodium",
    "atomicRadius": 195,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1803",
    "isotopes": [
      {
        "mass": 103,
        "abundance": 100
      }
    ]
  },
  {
    "z": 46,
    "symbol": "Pd",
    "names": {
      "en": "Palladium",
      "hy": "Պալադիում",
      "ru": "Палладий"
    },
    "mass": 106.421,
    "neutrons": 60,
    "period": 5,
    "group": 10,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      18
    ],
    "electronConfig": "[Kr] 4d10",
    "valence": [
      2,
      4
    ],
    "electronegativity": 2.2,
    "phase": "solid",
    "color": "#006985",
    "xpos": 10,
    "ypos": 5,
    "density": 12.023,
    "melt": 1828.05,
    "boil": 3236,
    "molarHeat": 25.98,
    "electronAffinity": 54.24,
    "ionizationEnergies": [
      804.4,
      1870,
      3177
    ],
    "discoveredBy": "William Hyde Wollaston",
    "namedBy": null,
    "appearance": "silvery white",
    "source": "https://en.wikipedia.org/wiki/Palladium",
    "atomicRadius": 202,
    "oxidationStates": [
      3,
      2
    ],
    "yearDiscovered": "1803",
    "isotopes": [
      {
        "mass": 106,
        "abundance": 27.33
      },
      {
        "mass": 108,
        "abundance": 26.46
      },
      {
        "mass": 105,
        "abundance": 22.33
      },
      {
        "mass": 110,
        "abundance": 11.72
      },
      {
        "mass": 104,
        "abundance": 11.14
      },
      {
        "mass": 102,
        "abundance": 1.02
      }
    ]
  },
  {
    "z": 47,
    "symbol": "Ag",
    "names": {
      "en": "Silver",
      "hy": "Արծաթ",
      "ru": "Серебро"
    },
    "mass": 107.86822,
    "neutrons": 61,
    "period": 5,
    "group": 11,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      18,
      1
    ],
    "electronConfig": "[Kr] 4d10 5s1",
    "valence": [
      1
    ],
    "electronegativity": 1.93,
    "phase": "solid",
    "color": "#c0c0c0",
    "xpos": 11,
    "ypos": 5,
    "density": 10.49,
    "melt": 1234.93,
    "boil": 2435,
    "molarHeat": 25.35,
    "electronAffinity": 125.862,
    "ionizationEnergies": [
      731,
      2070,
      3361
    ],
    "discoveredBy": "unknown, before 5000 BC",
    "namedBy": null,
    "appearance": "lustrous white metal",
    "source": "https://en.wikipedia.org/wiki/Silver",
    "atomicRadius": 172,
    "oxidationStates": [
      1
    ],
    "yearDiscovered": "Ancient",
    "isotopes": [
      {
        "mass": 107,
        "abundance": 51.839
      },
      {
        "mass": 109,
        "abundance": 48.161
      }
    ]
  },
  {
    "z": 48,
    "symbol": "Cd",
    "names": {
      "en": "Cadmium",
      "hy": "Կադմիում",
      "ru": "Кадмий"
    },
    "mass": 112.4144,
    "neutrons": 64,
    "period": 5,
    "group": 12,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      18,
      2
    ],
    "electronConfig": "[Kr] 4d10 5s2",
    "valence": [
      2
    ],
    "electronegativity": 1.69,
    "phase": "solid",
    "color": "#ffd98f",
    "xpos": 12,
    "ypos": 5,
    "density": 8.65,
    "melt": 594.22,
    "boil": 1040,
    "molarHeat": 26.02,
    "electronAffinity": -68,
    "ionizationEnergies": [
      867.8,
      1631.4,
      3616
    ],
    "discoveredBy": "Karl Samuel Leberecht Hermann",
    "namedBy": "Isotopes of cadmium",
    "appearance": "silvery bluish-gray metallic",
    "source": "https://en.wikipedia.org/wiki/Cadmium",
    "atomicRadius": 158,
    "oxidationStates": [
      2
    ],
    "yearDiscovered": "1817",
    "isotopes": [
      {
        "mass": 114,
        "abundance": 28.73
      },
      {
        "mass": 112,
        "abundance": 24.13
      },
      {
        "mass": 111,
        "abundance": 12.8
      },
      {
        "mass": 110,
        "abundance": 12.49
      },
      {
        "mass": 113,
        "abundance": 12.22
      },
      {
        "mass": 116,
        "abundance": 7.49
      },
      {
        "mass": 106,
        "abundance": 1.25
      },
      {
        "mass": 108,
        "abundance": 0.89
      }
    ]
  },
  {
    "z": 49,
    "symbol": "In",
    "names": {
      "en": "Indium",
      "hy": "Ինդիում",
      "ru": "Индий"
    },
    "mass": 114.8181,
    "neutrons": 66,
    "period": 5,
    "group": 13,
    "block": "p",
    "category": "post-transition-metal",
    "shells": [
      2,
      8,
      18,
      18,
      3
    ],
    "electronConfig": "[Kr] 4d10 5s2 5p1",
    "valence": [
      3
    ],
    "electronegativity": 1.78,
    "phase": "solid",
    "color": "#a67573",
    "xpos": 13,
    "ypos": 5,
    "density": 7.31,
    "melt": 429.7485,
    "boil": 2345,
    "molarHeat": 26.74,
    "electronAffinity": 37.043,
    "ionizationEnergies": [
      558.3,
      1820.7,
      2704,
      5210
    ],
    "discoveredBy": "Ferdinand Reich",
    "namedBy": null,
    "appearance": "silvery lustrous gray",
    "source": "https://en.wikipedia.org/wiki/Indium",
    "atomicRadius": 193,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1863",
    "isotopes": [
      {
        "mass": 115,
        "abundance": 95.71
      },
      {
        "mass": 113,
        "abundance": 4.29
      }
    ]
  },
  {
    "z": 50,
    "symbol": "Sn",
    "names": {
      "en": "Tin",
      "hy": "Անագ",
      "ru": "Олово"
    },
    "mass": 118.7107,
    "neutrons": 69,
    "period": 5,
    "group": 14,
    "block": "p",
    "category": "post-transition-metal",
    "shells": [
      2,
      8,
      18,
      18,
      4
    ],
    "electronConfig": "[Kr] 4d10 5s2 5p2",
    "valence": [
      2,
      4
    ],
    "electronegativity": 1.96,
    "phase": "solid",
    "color": "#668080",
    "xpos": 14,
    "ypos": 5,
    "density": 7.365,
    "melt": 505.08,
    "boil": 2875,
    "molarHeat": 27.112,
    "electronAffinity": 107.2984,
    "ionizationEnergies": [
      708.6,
      1411.8,
      2943,
      3930.3,
      7456
    ],
    "discoveredBy": "unknown, before 3500 BC",
    "namedBy": null,
    "appearance": "silvery-white (beta, β) or gray (alpha, α)",
    "source": "https://en.wikipedia.org/wiki/Tin",
    "atomicRadius": 217,
    "oxidationStates": [
      4,
      2
    ],
    "yearDiscovered": "Ancient",
    "isotopes": [
      {
        "mass": 120,
        "abundance": 32.58
      },
      {
        "mass": 118,
        "abundance": 24.22
      },
      {
        "mass": 116,
        "abundance": 14.54
      },
      {
        "mass": 119,
        "abundance": 8.59
      },
      {
        "mass": 117,
        "abundance": 7.68
      },
      {
        "mass": 124,
        "abundance": 5.79
      },
      {
        "mass": 122,
        "abundance": 4.63
      },
      {
        "mass": 112,
        "abundance": 0.97
      },
      {
        "mass": 114,
        "abundance": 0.66
      },
      {
        "mass": 115,
        "abundance": 0.34
      }
    ]
  },
  {
    "z": 51,
    "symbol": "Sb",
    "names": {
      "en": "Antimony",
      "hy": "Ծարիր",
      "ru": "Сурьма"
    },
    "mass": 121.7601,
    "neutrons": 71,
    "period": 5,
    "group": 15,
    "block": "p",
    "category": "metalloid",
    "shells": [
      2,
      8,
      18,
      18,
      5
    ],
    "electronConfig": "[Kr] 4d10 5s2 5p3",
    "valence": [
      3,
      5
    ],
    "electronegativity": 2.05,
    "phase": "solid",
    "color": "#9e63b5",
    "xpos": 15,
    "ypos": 5,
    "density": 6.697,
    "melt": 903.78,
    "boil": 1908,
    "molarHeat": 25.23,
    "electronAffinity": 101.059,
    "ionizationEnergies": [
      834,
      1594.9,
      2440,
      4260,
      5400,
      10400
    ],
    "discoveredBy": "unknown, before 3000 BC",
    "namedBy": null,
    "appearance": "silvery lustrous gray",
    "source": "https://en.wikipedia.org/wiki/Antimony",
    "atomicRadius": 206,
    "oxidationStates": [
      5,
      3,
      -3
    ],
    "yearDiscovered": "Ancient",
    "isotopes": [
      {
        "mass": 121,
        "abundance": 57.21
      },
      {
        "mass": 123,
        "abundance": 42.79
      }
    ]
  },
  {
    "z": 52,
    "symbol": "Te",
    "names": {
      "en": "Tellurium",
      "hy": "Տելուր",
      "ru": "Теллур"
    },
    "mass": 127.603,
    "neutrons": 76,
    "period": 5,
    "group": 16,
    "block": "p",
    "category": "metalloid",
    "shells": [
      2,
      8,
      18,
      18,
      6
    ],
    "electronConfig": "[Kr] 4d10 5s2 5p4",
    "valence": [
      2,
      4,
      6
    ],
    "electronegativity": 2.1,
    "phase": "solid",
    "color": "#d47a00",
    "xpos": 16,
    "ypos": 5,
    "density": 6.24,
    "melt": 722.66,
    "boil": 1261,
    "molarHeat": 25.73,
    "electronAffinity": 190.161,
    "ionizationEnergies": [
      869.3,
      1790,
      2698,
      3610,
      5668,
      6820,
      13200
    ],
    "discoveredBy": "Franz-Joseph Müller von Reichenstein",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Tellurium",
    "atomicRadius": 206,
    "oxidationStates": [
      6,
      4,
      -2
    ],
    "yearDiscovered": "1782",
    "isotopes": [
      {
        "mass": 130,
        "abundance": 34.08
      },
      {
        "mass": 128,
        "abundance": 31.74
      },
      {
        "mass": 126,
        "abundance": 18.84
      },
      {
        "mass": 125,
        "abundance": 7.07
      },
      {
        "mass": 124,
        "abundance": 4.74
      },
      {
        "mass": 122,
        "abundance": 2.55
      },
      {
        "mass": 123,
        "abundance": 0.89
      },
      {
        "mass": 120,
        "abundance": 0.09
      }
    ]
  },
  {
    "z": 53,
    "symbol": "I",
    "names": {
      "en": "Iodine",
      "hy": "Յոդ",
      "ru": "Иод"
    },
    "mass": 126.904473,
    "neutrons": 74,
    "period": 5,
    "group": 17,
    "block": "p",
    "category": "halogen",
    "shells": [
      2,
      8,
      18,
      18,
      7
    ],
    "electronConfig": "[Kr] 4d10 5s2 5p5",
    "valence": [
      1
    ],
    "electronegativity": 2.66,
    "phase": "solid",
    "color": "#940094",
    "xpos": 17,
    "ypos": 5,
    "density": 4.933,
    "melt": 386.85,
    "boil": 457.4,
    "molarHeat": null,
    "electronAffinity": 295.1531,
    "ionizationEnergies": [
      1008.4,
      1845.9,
      3180
    ],
    "discoveredBy": "Bernard Courtois",
    "namedBy": null,
    "appearance": "lustrous metallic gray, violet as a gas",
    "source": "https://en.wikipedia.org/wiki/Iodine",
    "atomicRadius": 198,
    "oxidationStates": [
      7,
      5,
      1,
      -1
    ],
    "yearDiscovered": "1811",
    "isotopes": [
      {
        "mass": 127,
        "abundance": 100
      }
    ]
  },
  {
    "z": 54,
    "symbol": "Xe",
    "names": {
      "en": "Xenon",
      "hy": "Քսենոն",
      "ru": "Ксенон"
    },
    "mass": 131.2936,
    "neutrons": 77,
    "period": 5,
    "group": 18,
    "block": "p",
    "category": "noble-gas",
    "shells": [
      2,
      8,
      18,
      18,
      8
    ],
    "electronConfig": "[Kr] 4d10 5s2 5p6",
    "valence": [
      0
    ],
    "electronegativity": 2.6,
    "phase": "gas",
    "color": "#429eb0",
    "xpos": 18,
    "ypos": 5,
    "density": 5.894,
    "melt": 161.4,
    "boil": 165.051,
    "molarHeat": null,
    "electronAffinity": -77,
    "ionizationEnergies": [
      1170.4,
      2046.4,
      3099.4
    ],
    "discoveredBy": "William Ramsay",
    "namedBy": null,
    "appearance": "colorless gas, exhibiting a blue glow when placed in a high voltage electric field",
    "source": "https://en.wikipedia.org/wiki/Xenon",
    "atomicRadius": 216,
    "oxidationStates": [
      0
    ],
    "yearDiscovered": "1898",
    "isotopes": [
      {
        "mass": 132,
        "abundance": 26.9086
      },
      {
        "mass": 129,
        "abundance": 26.4006
      },
      {
        "mass": 131,
        "abundance": 21.2324
      },
      {
        "mass": 134,
        "abundance": 10.4357
      },
      {
        "mass": 136,
        "abundance": 8.8573
      },
      {
        "mass": 130,
        "abundance": 4.071
      },
      {
        "mass": 128,
        "abundance": 1.9102
      },
      {
        "mass": 124,
        "abundance": 0.0952
      },
      {
        "mass": 126,
        "abundance": 0.089
      }
    ]
  },
  {
    "z": 55,
    "symbol": "Cs",
    "names": {
      "en": "Cesium",
      "hy": "Ցեզիում",
      "ru": "Цезий"
    },
    "mass": 132.905451966,
    "neutrons": 78,
    "period": 6,
    "group": 1,
    "block": "s",
    "category": "alkali-metal",
    "shells": [
      2,
      8,
      18,
      18,
      8,
      1
    ],
    "electronConfig": "[Xe] 6s1",
    "valence": [
      1
    ],
    "electronegativity": 0.79,
    "phase": "solid",
    "color": "#57178f",
    "xpos": 1,
    "ypos": 6,
    "density": 1.93,
    "melt": 301.7,
    "boil": 944,
    "molarHeat": 32.21,
    "electronAffinity": 45.505,
    "ionizationEnergies": [
      375.7,
      2234.3,
      3400
    ],
    "discoveredBy": "Robert Bunsen",
    "namedBy": null,
    "appearance": "silvery gold",
    "source": "https://en.wikipedia.org/wiki/Cesium",
    "atomicRadius": 343,
    "oxidationStates": [
      1
    ],
    "yearDiscovered": "1860",
    "isotopes": [
      {
        "mass": 133,
        "abundance": 100
      }
    ]
  },
  {
    "z": 56,
    "symbol": "Ba",
    "names": {
      "en": "Barium",
      "hy": "Բարիում",
      "ru": "Барий"
    },
    "mass": 137.3277,
    "neutrons": 81,
    "period": 6,
    "group": 2,
    "block": "s",
    "category": "alkaline-earth-metal",
    "shells": [
      2,
      8,
      18,
      18,
      8,
      2
    ],
    "electronConfig": "[Xe] 6s2",
    "valence": [
      2
    ],
    "electronegativity": 0.89,
    "phase": "solid",
    "color": "#00c900",
    "xpos": 2,
    "ypos": 6,
    "density": 3.51,
    "melt": 1000,
    "boil": 2118,
    "molarHeat": 28.07,
    "electronAffinity": 13.954,
    "ionizationEnergies": [
      502.9,
      965.2,
      3600
    ],
    "discoveredBy": "Carl Wilhelm Scheele",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Barium",
    "atomicRadius": 268,
    "oxidationStates": [
      2
    ],
    "yearDiscovered": "1808",
    "isotopes": [
      {
        "mass": 138,
        "abundance": 71.698
      },
      {
        "mass": 137,
        "abundance": 11.232
      },
      {
        "mass": 136,
        "abundance": 7.854
      },
      {
        "mass": 135,
        "abundance": 6.592
      },
      {
        "mass": 134,
        "abundance": 2.417
      },
      {
        "mass": 130,
        "abundance": 0.106
      },
      {
        "mass": 132,
        "abundance": 0.101
      }
    ]
  },
  {
    "z": 57,
    "symbol": "La",
    "names": {
      "en": "Lanthanum",
      "hy": "Լանթան",
      "ru": "Лантан"
    },
    "mass": 138.905477,
    "neutrons": 82,
    "period": 6,
    "group": 3,
    "block": "f",
    "category": "lanthanide",
    "shells": [
      2,
      8,
      18,
      18,
      9,
      2
    ],
    "electronConfig": "[Xe] 5d16s2",
    "valence": [
      3
    ],
    "electronegativity": 1.1,
    "phase": "solid",
    "color": "#70d4ff",
    "xpos": 3,
    "ypos": 9,
    "density": 6.162,
    "melt": 1193,
    "boil": 3737,
    "molarHeat": 27.11,
    "electronAffinity": 53,
    "ionizationEnergies": [
      538.1,
      1067,
      1850.3,
      4819,
      5940
    ],
    "discoveredBy": "Carl Gustaf Mosander",
    "namedBy": null,
    "appearance": "silvery white",
    "source": "https://en.wikipedia.org/wiki/Lanthanum",
    "atomicRadius": 240,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1839",
    "isotopes": [
      {
        "mass": 139,
        "abundance": 99.9112
      },
      {
        "mass": 138,
        "abundance": 0.0888
      }
    ]
  },
  {
    "z": 58,
    "symbol": "Ce",
    "names": {
      "en": "Cerium",
      "hy": "Ցերիում",
      "ru": "Церий"
    },
    "mass": 140.1161,
    "neutrons": 82,
    "period": 6,
    "group": 3,
    "block": "f",
    "category": "lanthanide",
    "shells": [
      2,
      8,
      18,
      19,
      9,
      2
    ],
    "electronConfig": "[Xe] 4f1 5d1 6s2",
    "valence": [
      3,
      4
    ],
    "electronegativity": 1.12,
    "phase": "solid",
    "color": "#ffffc7",
    "xpos": 4,
    "ypos": 9,
    "density": 6.77,
    "melt": 1068,
    "boil": 3716,
    "molarHeat": 26.94,
    "electronAffinity": 55,
    "ionizationEnergies": [
      534.4,
      1050,
      1949,
      3547,
      6325,
      7490
    ],
    "discoveredBy": "Martin Heinrich Klaproth",
    "namedBy": null,
    "appearance": "silvery white",
    "source": "https://en.wikipedia.org/wiki/Cerium",
    "atomicRadius": 235,
    "oxidationStates": [
      4,
      3
    ],
    "yearDiscovered": "1803",
    "isotopes": [
      {
        "mass": 140,
        "abundance": 88.45
      },
      {
        "mass": 142,
        "abundance": 11.114
      },
      {
        "mass": 138,
        "abundance": 0.251
      },
      {
        "mass": 136,
        "abundance": 0.185
      }
    ]
  },
  {
    "z": 59,
    "symbol": "Pr",
    "names": {
      "en": "Praseodymium",
      "hy": "Պրազեդիում",
      "ru": "Празеодим"
    },
    "mass": 140.907662,
    "neutrons": 82,
    "period": 6,
    "group": 3,
    "block": "f",
    "category": "lanthanide",
    "shells": [
      2,
      8,
      18,
      21,
      8,
      2
    ],
    "electronConfig": "[Xe] 4f3 6s2",
    "valence": [
      3
    ],
    "electronegativity": 1.13,
    "phase": "solid",
    "color": "#d9ffc7",
    "xpos": 5,
    "ypos": 9,
    "density": 6.77,
    "melt": 1208,
    "boil": 3403,
    "molarHeat": 27.2,
    "electronAffinity": 93,
    "ionizationEnergies": [
      527,
      1020,
      2086,
      3761,
      5551
    ],
    "discoveredBy": "Carl Auer von Welsbach",
    "namedBy": null,
    "appearance": "grayish white",
    "source": "https://en.wikipedia.org/wiki/Praseodymium",
    "atomicRadius": 239,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1885",
    "isotopes": [
      {
        "mass": 141,
        "abundance": 100
      }
    ]
  },
  {
    "z": 60,
    "symbol": "Nd",
    "names": {
      "en": "Neodymium",
      "hy": "Նեոդիմ",
      "ru": "Неодим"
    },
    "mass": 144.2423,
    "neutrons": 84,
    "period": 6,
    "group": 3,
    "block": "f",
    "category": "lanthanide",
    "shells": [
      2,
      8,
      18,
      22,
      8,
      2
    ],
    "electronConfig": "[Xe] 4f4 6s2",
    "valence": [
      3
    ],
    "electronegativity": 1.14,
    "phase": "solid",
    "color": "#c7ffc7",
    "xpos": 6,
    "ypos": 9,
    "density": 7.01,
    "melt": 1297,
    "boil": 3347,
    "molarHeat": 27.45,
    "electronAffinity": 184.87,
    "ionizationEnergies": [
      533.1,
      1040,
      2130,
      3900
    ],
    "discoveredBy": "Carl Auer von Welsbach",
    "namedBy": null,
    "appearance": "silvery white",
    "source": "https://en.wikipedia.org/wiki/Neodymium",
    "atomicRadius": 229,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1885",
    "isotopes": [
      {
        "mass": 142,
        "abundance": 27.152
      },
      {
        "mass": 144,
        "abundance": 23.798
      },
      {
        "mass": 146,
        "abundance": 17.189
      },
      {
        "mass": 143,
        "abundance": 12.174
      },
      {
        "mass": 145,
        "abundance": 8.293
      },
      {
        "mass": 148,
        "abundance": 5.756
      },
      {
        "mass": 150,
        "abundance": 5.638
      }
    ]
  },
  {
    "z": 61,
    "symbol": "Pm",
    "names": {
      "en": "Promethium",
      "hy": "Պրոմեթիում",
      "ru": "Прометий"
    },
    "mass": 145,
    "neutrons": 84,
    "period": 6,
    "group": 3,
    "block": "f",
    "category": "lanthanide",
    "shells": [
      2,
      8,
      18,
      23,
      8,
      2
    ],
    "electronConfig": "[Xe] 4f5 6s2",
    "valence": [
      3
    ],
    "electronegativity": 1.13,
    "phase": "solid",
    "color": "#a3ffc7",
    "xpos": 7,
    "ypos": 9,
    "density": 7.26,
    "melt": 1315,
    "boil": 3273,
    "molarHeat": null,
    "electronAffinity": 12.45,
    "ionizationEnergies": [
      540,
      1050,
      2150,
      3970
    ],
    "discoveredBy": "Chien Shiung Wu",
    "namedBy": "Isotopes of promethium",
    "appearance": "metallic",
    "source": "https://en.wikipedia.org/wiki/Promethium",
    "atomicRadius": 236,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1945",
    "isotopes": []
  },
  {
    "z": 62,
    "symbol": "Sm",
    "names": {
      "en": "Samarium",
      "hy": "Սամարիում",
      "ru": "Самарий"
    },
    "mass": 150.362,
    "neutrons": 88,
    "period": 6,
    "group": 3,
    "block": "f",
    "category": "lanthanide",
    "shells": [
      2,
      8,
      18,
      24,
      8,
      2
    ],
    "electronConfig": "[Xe] 4f6 6s2",
    "valence": [
      3
    ],
    "electronegativity": 1.17,
    "phase": "solid",
    "color": "#8fffc7",
    "xpos": 8,
    "ypos": 9,
    "density": 7.52,
    "melt": 1345,
    "boil": 2173,
    "molarHeat": 29.54,
    "electronAffinity": 15.63,
    "ionizationEnergies": [
      544.5,
      1070,
      2260,
      3990
    ],
    "discoveredBy": "Lecoq de Boisbaudran",
    "namedBy": null,
    "appearance": "silvery white",
    "source": "https://en.wikipedia.org/wiki/Samarium",
    "atomicRadius": 229,
    "oxidationStates": [
      3,
      2
    ],
    "yearDiscovered": "1879",
    "isotopes": [
      {
        "mass": 152,
        "abundance": 26.75
      },
      {
        "mass": 154,
        "abundance": 22.75
      },
      {
        "mass": 147,
        "abundance": 14.99
      },
      {
        "mass": 149,
        "abundance": 13.82
      },
      {
        "mass": 148,
        "abundance": 11.24
      },
      {
        "mass": 150,
        "abundance": 7.38
      },
      {
        "mass": 144,
        "abundance": 3.07
      }
    ]
  },
  {
    "z": 63,
    "symbol": "Eu",
    "names": {
      "en": "Europium",
      "hy": "Եվրոպիում",
      "ru": "Европий"
    },
    "mass": 151.9641,
    "neutrons": 89,
    "period": 6,
    "group": 3,
    "block": "f",
    "category": "lanthanide",
    "shells": [
      2,
      8,
      18,
      25,
      8,
      2
    ],
    "electronConfig": "[Xe] 4f7 6s2",
    "valence": [
      2,
      3
    ],
    "electronegativity": 1.2,
    "phase": "solid",
    "color": "#61ffc7",
    "xpos": 9,
    "ypos": 9,
    "density": 5.264,
    "melt": 1099,
    "boil": 1802,
    "molarHeat": 27.66,
    "electronAffinity": 11.2,
    "ionizationEnergies": [
      547.1,
      1085,
      2404,
      4120
    ],
    "discoveredBy": "Eugène-Anatole Demarçay",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Europium",
    "atomicRadius": 233,
    "oxidationStates": [
      3,
      2
    ],
    "yearDiscovered": "1901",
    "isotopes": [
      {
        "mass": 153,
        "abundance": 52.19
      },
      {
        "mass": 151,
        "abundance": 47.81
      }
    ]
  },
  {
    "z": 64,
    "symbol": "Gd",
    "names": {
      "en": "Gadolinium",
      "hy": "Գադոլինիում",
      "ru": "Гадолиний"
    },
    "mass": 157.253,
    "neutrons": 93,
    "period": 6,
    "group": 3,
    "block": "f",
    "category": "lanthanide",
    "shells": [
      2,
      8,
      18,
      25,
      9,
      2
    ],
    "electronConfig": "[Xe] 4f7 5d1 6s2",
    "valence": [
      3
    ],
    "electronegativity": 1.2,
    "phase": "solid",
    "color": "#45ffc7",
    "xpos": 10,
    "ypos": 9,
    "density": 7.9,
    "melt": 1585,
    "boil": 3273,
    "molarHeat": 37.03,
    "electronAffinity": 13.22,
    "ionizationEnergies": [
      593.4,
      1170,
      1990,
      4250
    ],
    "discoveredBy": "Jean Charles Galissard de Marignac",
    "namedBy": null,
    "appearance": "silvery white",
    "source": "https://en.wikipedia.org/wiki/Gadolinium",
    "atomicRadius": 237,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1880",
    "isotopes": [
      {
        "mass": 158,
        "abundance": 24.84
      },
      {
        "mass": 160,
        "abundance": 21.86
      },
      {
        "mass": 156,
        "abundance": 20.47
      },
      {
        "mass": 157,
        "abundance": 15.65
      },
      {
        "mass": 155,
        "abundance": 14.8
      },
      {
        "mass": 154,
        "abundance": 2.18
      },
      {
        "mass": 152,
        "abundance": 0.2
      }
    ]
  },
  {
    "z": 65,
    "symbol": "Tb",
    "names": {
      "en": "Terbium",
      "hy": "Տերբիում",
      "ru": "Тербий"
    },
    "mass": 158.925352,
    "neutrons": 94,
    "period": 6,
    "group": 3,
    "block": "f",
    "category": "lanthanide",
    "shells": [
      2,
      8,
      18,
      27,
      8,
      2
    ],
    "electronConfig": "[Xe] 4f9 6s2",
    "valence": [
      3
    ],
    "electronegativity": 1.1,
    "phase": "solid",
    "color": "#30ffc7",
    "xpos": 11,
    "ypos": 9,
    "density": 8.23,
    "melt": 1629,
    "boil": 3396,
    "molarHeat": 28.91,
    "electronAffinity": 112.4,
    "ionizationEnergies": [
      565.8,
      1110,
      2114,
      3839
    ],
    "discoveredBy": "Carl Gustaf Mosander",
    "namedBy": null,
    "appearance": "silvery white",
    "source": "https://en.wikipedia.org/wiki/Terbium",
    "atomicRadius": 221,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1843",
    "isotopes": [
      {
        "mass": 159,
        "abundance": 100
      }
    ]
  },
  {
    "z": 66,
    "symbol": "Dy",
    "names": {
      "en": "Dysprosium",
      "hy": "Դիսպրոզիում",
      "ru": "Диспрозий"
    },
    "mass": 162.5001,
    "neutrons": 97,
    "period": 6,
    "group": 3,
    "block": "f",
    "category": "lanthanide",
    "shells": [
      2,
      8,
      18,
      28,
      8,
      2
    ],
    "electronConfig": "[Xe] 4f10 6s2",
    "valence": [
      3
    ],
    "electronegativity": 1.22,
    "phase": "solid",
    "color": "#1fffc7",
    "xpos": 12,
    "ypos": 9,
    "density": 8.54,
    "melt": 1680,
    "boil": 2840,
    "molarHeat": 27.7,
    "electronAffinity": 33.96,
    "ionizationEnergies": [
      573,
      1130,
      2200,
      3990
    ],
    "discoveredBy": "Lecoq de Boisbaudran",
    "namedBy": null,
    "appearance": "silvery white",
    "source": "https://en.wikipedia.org/wiki/Dysprosium",
    "atomicRadius": 229,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1886",
    "isotopes": [
      {
        "mass": 164,
        "abundance": 28.26
      },
      {
        "mass": 162,
        "abundance": 25.475
      },
      {
        "mass": 163,
        "abundance": 24.896
      },
      {
        "mass": 161,
        "abundance": 18.889
      },
      {
        "mass": 160,
        "abundance": 2.329
      },
      {
        "mass": 158,
        "abundance": 0.095
      },
      {
        "mass": 156,
        "abundance": 0.056
      }
    ]
  },
  {
    "z": 67,
    "symbol": "Ho",
    "names": {
      "en": "Holmium",
      "hy": "Հոլմիում",
      "ru": "Гольмий"
    },
    "mass": 164.930332,
    "neutrons": 98,
    "period": 6,
    "group": 3,
    "block": "f",
    "category": "lanthanide",
    "shells": [
      2,
      8,
      18,
      29,
      8,
      2
    ],
    "electronConfig": "[Xe] 4f11 6s2",
    "valence": [
      3
    ],
    "electronegativity": 1.23,
    "phase": "solid",
    "color": "#00ff9c",
    "xpos": 13,
    "ypos": 9,
    "density": 8.79,
    "melt": 1734,
    "boil": 2873,
    "molarHeat": 27.15,
    "electronAffinity": 32.61,
    "ionizationEnergies": [
      581,
      1140,
      2204,
      4100
    ],
    "discoveredBy": "Marc Delafontaine",
    "namedBy": null,
    "appearance": "silvery white",
    "source": "https://en.wikipedia.org/wiki/Holmium",
    "atomicRadius": 216,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1878",
    "isotopes": [
      {
        "mass": 165,
        "abundance": 100
      }
    ]
  },
  {
    "z": 68,
    "symbol": "Er",
    "names": {
      "en": "Erbium",
      "hy": "Էրբիում",
      "ru": "Эрбий"
    },
    "mass": 167.2593,
    "neutrons": 99,
    "period": 6,
    "group": 3,
    "block": "f",
    "category": "lanthanide",
    "shells": [
      2,
      8,
      18,
      30,
      8,
      2
    ],
    "electronConfig": "[Xe] 4f12 6s2",
    "valence": [
      3
    ],
    "electronegativity": 1.24,
    "phase": "solid",
    "color": "#00e675",
    "xpos": 14,
    "ypos": 9,
    "density": 9.066,
    "melt": 1802,
    "boil": 3141,
    "molarHeat": 28.12,
    "electronAffinity": 30.1,
    "ionizationEnergies": [
      589.3,
      1150,
      2194,
      4120
    ],
    "discoveredBy": "Carl Gustaf Mosander",
    "namedBy": null,
    "appearance": "silvery white",
    "source": "https://en.wikipedia.org/wiki/Erbium",
    "atomicRadius": 235,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1843",
    "isotopes": [
      {
        "mass": 166,
        "abundance": 33.503
      },
      {
        "mass": 168,
        "abundance": 26.978
      },
      {
        "mass": 167,
        "abundance": 22.869
      },
      {
        "mass": 170,
        "abundance": 14.91
      },
      {
        "mass": 164,
        "abundance": 1.601
      },
      {
        "mass": 162,
        "abundance": 0.139
      }
    ]
  },
  {
    "z": 69,
    "symbol": "Tm",
    "names": {
      "en": "Thulium",
      "hy": "Թուլիում",
      "ru": "Тулий"
    },
    "mass": 168.934222,
    "neutrons": 100,
    "period": 6,
    "group": 3,
    "block": "f",
    "category": "lanthanide",
    "shells": [
      2,
      8,
      18,
      31,
      8,
      2
    ],
    "electronConfig": "[Xe] 4f13 6s2",
    "valence": [
      3
    ],
    "electronegativity": 1.25,
    "phase": "solid",
    "color": "#00d452",
    "xpos": 15,
    "ypos": 9,
    "density": 9.32,
    "melt": 1818,
    "boil": 2223,
    "molarHeat": 27.03,
    "electronAffinity": 99,
    "ionizationEnergies": [
      596.7,
      1160,
      2285,
      4120
    ],
    "discoveredBy": "Per Teodor Cleve",
    "namedBy": null,
    "appearance": "silvery gray",
    "source": "https://en.wikipedia.org/wiki/Thulium",
    "atomicRadius": 227,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1879",
    "isotopes": [
      {
        "mass": 169,
        "abundance": 100
      }
    ]
  },
  {
    "z": 70,
    "symbol": "Yb",
    "names": {
      "en": "Ytterbium",
      "hy": "Իտերբիում",
      "ru": "Иттербий"
    },
    "mass": 173.0451,
    "neutrons": 103,
    "period": 6,
    "group": 3,
    "block": "f",
    "category": "lanthanide",
    "shells": [
      2,
      8,
      18,
      32,
      8,
      2
    ],
    "electronConfig": "[Xe] 4f14 6s2",
    "valence": [
      3
    ],
    "electronegativity": 1.1,
    "phase": "solid",
    "color": "#00bf38",
    "xpos": 16,
    "ypos": 9,
    "density": 6.9,
    "melt": 1097,
    "boil": 1469,
    "molarHeat": 26.74,
    "electronAffinity": -1.93,
    "ionizationEnergies": [
      603.4,
      1174.8,
      2417,
      4203
    ],
    "discoveredBy": "Jean Charles Galissard de Marignac",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Ytterbium",
    "atomicRadius": 242,
    "oxidationStates": [
      3,
      2
    ],
    "yearDiscovered": "1878",
    "isotopes": [
      {
        "mass": 174,
        "abundance": 32.026
      },
      {
        "mass": 172,
        "abundance": 21.68
      },
      {
        "mass": 173,
        "abundance": 16.103
      },
      {
        "mass": 171,
        "abundance": 14.09
      },
      {
        "mass": 176,
        "abundance": 12.996
      },
      {
        "mass": 170,
        "abundance": 2.982
      },
      {
        "mass": 168,
        "abundance": 0.123
      }
    ]
  },
  {
    "z": 71,
    "symbol": "Lu",
    "names": {
      "en": "Lutetium",
      "hy": "Լուտեցիում",
      "ru": "Лютеций"
    },
    "mass": 174.96681,
    "neutrons": 104,
    "period": 6,
    "group": 3,
    "block": "d",
    "category": "lanthanide",
    "shells": [
      2,
      8,
      18,
      32,
      9,
      2
    ],
    "electronConfig": "[Xe] 4f14 5d1 6s2",
    "valence": [
      3
    ],
    "electronegativity": 1.27,
    "phase": "solid",
    "color": "#00ab24",
    "xpos": 17,
    "ypos": 9,
    "density": 9.841,
    "melt": 1925,
    "boil": 3675,
    "molarHeat": 26.86,
    "electronAffinity": 33.4,
    "ionizationEnergies": [
      523.5,
      1340,
      2022.3,
      4370,
      6445
    ],
    "discoveredBy": "Georges Urbain",
    "namedBy": null,
    "appearance": "silvery white",
    "source": "https://en.wikipedia.org/wiki/Lutetium",
    "atomicRadius": 221,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1907",
    "isotopes": [
      {
        "mass": 175,
        "abundance": 97.401
      },
      {
        "mass": 176,
        "abundance": 2.599
      }
    ]
  },
  {
    "z": 72,
    "symbol": "Hf",
    "names": {
      "en": "Hafnium",
      "hy": "Հաֆնիում",
      "ru": "Гафний"
    },
    "mass": 178.492,
    "neutrons": 106,
    "period": 6,
    "group": 4,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      10,
      2
    ],
    "electronConfig": "[Xe] 4f14 5d2 6s2",
    "valence": [
      4
    ],
    "electronegativity": 1.3,
    "phase": "solid",
    "color": "#4dc2ff",
    "xpos": 4,
    "ypos": 6,
    "density": 13.31,
    "melt": 2506,
    "boil": 4876,
    "molarHeat": 25.73,
    "electronAffinity": 17.18,
    "ionizationEnergies": [
      658.5,
      1440,
      2250,
      3216
    ],
    "discoveredBy": "Dirk Coster",
    "namedBy": null,
    "appearance": "steel gray",
    "source": "https://en.wikipedia.org/wiki/Hafnium",
    "atomicRadius": 212,
    "oxidationStates": [
      4
    ],
    "yearDiscovered": "1923",
    "isotopes": [
      {
        "mass": 180,
        "abundance": 35.08
      },
      {
        "mass": 178,
        "abundance": 27.28
      },
      {
        "mass": 177,
        "abundance": 18.6
      },
      {
        "mass": 179,
        "abundance": 13.62
      },
      {
        "mass": 176,
        "abundance": 5.26
      },
      {
        "mass": 174,
        "abundance": 0.16
      }
    ]
  },
  {
    "z": 73,
    "symbol": "Ta",
    "names": {
      "en": "Tantalum",
      "hy": "Տանտալ",
      "ru": "Тантал"
    },
    "mass": 180.947882,
    "neutrons": 108,
    "period": 6,
    "group": 5,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      11,
      2
    ],
    "electronConfig": "[Xe] 4f14 5d3 6s2",
    "valence": [
      5
    ],
    "electronegativity": 1.5,
    "phase": "solid",
    "color": "#4da6ff",
    "xpos": 5,
    "ypos": 6,
    "density": 16.69,
    "melt": 3290,
    "boil": 5731,
    "molarHeat": 25.36,
    "electronAffinity": 31,
    "ionizationEnergies": [
      761,
      1500
    ],
    "discoveredBy": "Anders Gustaf Ekeberg",
    "namedBy": null,
    "appearance": "gray blue",
    "source": "https://en.wikipedia.org/wiki/Tantalum",
    "atomicRadius": 217,
    "oxidationStates": [
      5
    ],
    "yearDiscovered": "1802",
    "isotopes": [
      {
        "mass": 181,
        "abundance": 99.988
      },
      {
        "mass": 180,
        "abundance": 0.012
      }
    ]
  },
  {
    "z": 74,
    "symbol": "W",
    "names": {
      "en": "Tungsten",
      "hy": "Վոլֆրամ",
      "ru": "Вольфрам"
    },
    "mass": 183.841,
    "neutrons": 110,
    "period": 6,
    "group": 6,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      12,
      2
    ],
    "electronConfig": "[Xe] 4f14 5d4 6s2",
    "valence": [
      6
    ],
    "electronegativity": 2.36,
    "phase": "solid",
    "color": "#2194d6",
    "xpos": 6,
    "ypos": 6,
    "density": 19.25,
    "melt": 3695,
    "boil": 6203,
    "molarHeat": 24.27,
    "electronAffinity": 78.76,
    "ionizationEnergies": [
      770,
      1700
    ],
    "discoveredBy": "Carl Wilhelm Scheele",
    "namedBy": null,
    "appearance": "grayish white, lustrous",
    "source": "https://en.wikipedia.org/wiki/Tungsten",
    "atomicRadius": 210,
    "oxidationStates": [
      6
    ],
    "yearDiscovered": "1783",
    "isotopes": [
      {
        "mass": 184,
        "abundance": 30.64
      },
      {
        "mass": 186,
        "abundance": 28.43
      },
      {
        "mass": 182,
        "abundance": 26.5
      },
      {
        "mass": 183,
        "abundance": 14.31
      },
      {
        "mass": 180,
        "abundance": 0.12
      }
    ]
  },
  {
    "z": 75,
    "symbol": "Re",
    "names": {
      "en": "Rhenium",
      "hy": "Ռենիում",
      "ru": "Рений"
    },
    "mass": 186.2071,
    "neutrons": 111,
    "period": 6,
    "group": 7,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      13,
      2
    ],
    "electronConfig": "[Xe] 4f14 5d5 6s2",
    "valence": [
      7
    ],
    "electronegativity": 1.9,
    "phase": "solid",
    "color": "#267dab",
    "xpos": 7,
    "ypos": 6,
    "density": 21.02,
    "melt": 3459,
    "boil": 5869,
    "molarHeat": 25.48,
    "electronAffinity": 5.8273,
    "ionizationEnergies": [
      760,
      1260,
      2510,
      3640
    ],
    "discoveredBy": "Masataka Ogawa",
    "namedBy": "Walter Noddack",
    "appearance": "silvery-grayish",
    "source": "https://en.wikipedia.org/wiki/Rhenium",
    "atomicRadius": 217,
    "oxidationStates": [
      7,
      6,
      4
    ],
    "yearDiscovered": "1925",
    "isotopes": [
      {
        "mass": 187,
        "abundance": 62.6
      },
      {
        "mass": 185,
        "abundance": 37.4
      }
    ]
  },
  {
    "z": 76,
    "symbol": "Os",
    "names": {
      "en": "Osmium",
      "hy": "Օսմիում",
      "ru": "Осмий"
    },
    "mass": 190.233,
    "neutrons": 114,
    "period": 6,
    "group": 8,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      14,
      2
    ],
    "electronConfig": "[Xe] 4f14 5d6 6s2",
    "valence": [
      4
    ],
    "electronegativity": 2.2,
    "phase": "solid",
    "color": "#266696",
    "xpos": 8,
    "ypos": 6,
    "density": 22.59,
    "melt": 3306,
    "boil": 5285,
    "molarHeat": 24.7,
    "electronAffinity": 103.99,
    "ionizationEnergies": [
      840,
      1600
    ],
    "discoveredBy": "Smithson Tennant",
    "namedBy": null,
    "appearance": "silvery, blue cast",
    "source": "https://en.wikipedia.org/wiki/Osmium",
    "atomicRadius": 216,
    "oxidationStates": [
      4,
      3
    ],
    "yearDiscovered": "1803",
    "isotopes": [
      {
        "mass": 192,
        "abundance": 40.78
      },
      {
        "mass": 190,
        "abundance": 26.26
      },
      {
        "mass": 189,
        "abundance": 16.15
      },
      {
        "mass": 188,
        "abundance": 13.24
      },
      {
        "mass": 187,
        "abundance": 1.96
      },
      {
        "mass": 186,
        "abundance": 1.59
      },
      {
        "mass": 184,
        "abundance": 0.02
      }
    ]
  },
  {
    "z": 77,
    "symbol": "Ir",
    "names": {
      "en": "Iridium",
      "hy": "Իրիդիում",
      "ru": "Иридий"
    },
    "mass": 192.2173,
    "neutrons": 115,
    "period": 6,
    "group": 9,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      15,
      2
    ],
    "electronConfig": "[Xe] 4f14 5d7 6s2",
    "valence": [
      3,
      4
    ],
    "electronegativity": 2.2,
    "phase": "solid",
    "color": "#175487",
    "xpos": 9,
    "ypos": 6,
    "density": 22.56,
    "melt": 2719,
    "boil": 4403,
    "molarHeat": 25.1,
    "electronAffinity": 150.94,
    "ionizationEnergies": [
      880,
      1600
    ],
    "discoveredBy": "Smithson Tennant",
    "namedBy": null,
    "appearance": "silvery white",
    "source": "https://en.wikipedia.org/wiki/Iridium",
    "atomicRadius": 202,
    "oxidationStates": [
      4,
      3
    ],
    "yearDiscovered": "1803",
    "isotopes": [
      {
        "mass": 193,
        "abundance": 62.7
      },
      {
        "mass": 191,
        "abundance": 37.3
      }
    ]
  },
  {
    "z": 78,
    "symbol": "Pt",
    "names": {
      "en": "Platinum",
      "hy": "Պլատին",
      "ru": "Платина"
    },
    "mass": 195.0849,
    "neutrons": 117,
    "period": 6,
    "group": 10,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      17,
      1
    ],
    "electronConfig": "[Xe] 4f14 5d9 6s1",
    "valence": [
      2,
      4
    ],
    "electronegativity": 2.28,
    "phase": "solid",
    "color": "#d0d0e0",
    "xpos": 10,
    "ypos": 6,
    "density": 21.45,
    "melt": 2041.4,
    "boil": 4098,
    "molarHeat": 25.86,
    "electronAffinity": 205.041,
    "ionizationEnergies": [
      870,
      1791
    ],
    "discoveredBy": "Antonio de Ulloa",
    "namedBy": null,
    "appearance": "silvery white",
    "source": "https://en.wikipedia.org/wiki/Platinum",
    "atomicRadius": 209,
    "oxidationStates": [
      4,
      2
    ],
    "yearDiscovered": "1735",
    "isotopes": [
      {
        "mass": 195,
        "abundance": 33.78
      },
      {
        "mass": 194,
        "abundance": 32.86
      },
      {
        "mass": 196,
        "abundance": 25.21
      },
      {
        "mass": 198,
        "abundance": 7.356
      },
      {
        "mass": 192,
        "abundance": 0.782
      },
      {
        "mass": 190,
        "abundance": 0.012
      }
    ]
  },
  {
    "z": 79,
    "symbol": "Au",
    "names": {
      "en": "Gold",
      "hy": "Ոսկի",
      "ru": "Золото"
    },
    "mass": 196.9665695,
    "neutrons": 118,
    "period": 6,
    "group": 11,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      18,
      1
    ],
    "electronConfig": "[Xe] 4f14 5d10 6s1",
    "valence": [
      1,
      3
    ],
    "electronegativity": 2.54,
    "phase": "solid",
    "color": "#ffd123",
    "xpos": 11,
    "ypos": 6,
    "density": 19.3,
    "melt": 1337.33,
    "boil": 3243,
    "molarHeat": 25.418,
    "electronAffinity": 222.747,
    "ionizationEnergies": [
      890.1,
      1980
    ],
    "discoveredBy": "Middle East",
    "namedBy": null,
    "appearance": "metallic yellow",
    "source": "https://en.wikipedia.org/wiki/Gold",
    "atomicRadius": 166,
    "oxidationStates": [
      3,
      1
    ],
    "yearDiscovered": "Ancient",
    "isotopes": [
      {
        "mass": 197,
        "abundance": 100
      }
    ]
  },
  {
    "z": 80,
    "symbol": "Hg",
    "names": {
      "en": "Mercury",
      "hy": "Սնդիկ",
      "ru": "Ртуть"
    },
    "mass": 200.5923,
    "neutrons": 121,
    "period": 6,
    "group": 12,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      18,
      2
    ],
    "electronConfig": "[Xe] 4f14 5d10 6s2",
    "valence": [
      1,
      2
    ],
    "electronegativity": 2,
    "phase": "liquid",
    "color": "#b8b8d0",
    "xpos": 12,
    "ypos": 6,
    "density": 13.534,
    "melt": 234.321,
    "boil": 629.88,
    "molarHeat": 27.983,
    "electronAffinity": -48,
    "ionizationEnergies": [
      1007.1,
      1810,
      3300
    ],
    "discoveredBy": "unknown, before 2000 BCE",
    "namedBy": null,
    "appearance": "silvery",
    "source": "https://en.wikipedia.org/wiki/Mercury (Element)",
    "atomicRadius": 209,
    "oxidationStates": [
      2,
      1
    ],
    "yearDiscovered": "Ancient",
    "isotopes": [
      {
        "mass": 202,
        "abundance": 29.86
      },
      {
        "mass": 200,
        "abundance": 23.1
      },
      {
        "mass": 199,
        "abundance": 16.87
      },
      {
        "mass": 201,
        "abundance": 13.18
      },
      {
        "mass": 198,
        "abundance": 9.97
      },
      {
        "mass": 204,
        "abundance": 6.87
      },
      {
        "mass": 196,
        "abundance": 0.15
      }
    ]
  },
  {
    "z": 81,
    "symbol": "Tl",
    "names": {
      "en": "Thallium",
      "hy": "Թալիում",
      "ru": "Таллий"
    },
    "mass": 204.38,
    "neutrons": 123,
    "period": 6,
    "group": 13,
    "block": "p",
    "category": "post-transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      18,
      3
    ],
    "electronConfig": "[Xe] 4f14 5d10 6s2 6p1",
    "valence": [
      1,
      3
    ],
    "electronegativity": 1.62,
    "phase": "solid",
    "color": "#a6544d",
    "xpos": 13,
    "ypos": 6,
    "density": 11.85,
    "melt": 577,
    "boil": 1746,
    "molarHeat": 26.32,
    "electronAffinity": 36.4,
    "ionizationEnergies": [
      589.4,
      1971,
      2878
    ],
    "discoveredBy": "William Crookes",
    "namedBy": null,
    "appearance": "silvery white",
    "source": "https://en.wikipedia.org/wiki/Thallium",
    "atomicRadius": 196,
    "oxidationStates": [
      3,
      1
    ],
    "yearDiscovered": "1861",
    "isotopes": [
      {
        "mass": 205,
        "abundance": 70.48
      },
      {
        "mass": 203,
        "abundance": 29.52
      }
    ]
  },
  {
    "z": 82,
    "symbol": "Pb",
    "names": {
      "en": "Lead",
      "hy": "Կապար",
      "ru": "Свинец"
    },
    "mass": 207.21,
    "neutrons": 125,
    "period": 6,
    "group": 14,
    "block": "p",
    "category": "post-transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      18,
      4
    ],
    "electronConfig": "[Xe] 4f14 5d10 6s2 6p2",
    "valence": [
      2,
      4
    ],
    "electronegativity": 1.87,
    "phase": "solid",
    "color": "#575961",
    "xpos": 14,
    "ypos": 6,
    "density": 11.34,
    "melt": 600.61,
    "boil": 2022,
    "molarHeat": 26.65,
    "electronAffinity": 34.4204,
    "ionizationEnergies": [
      715.6,
      1450.5,
      3081.5,
      4083,
      6640
    ],
    "discoveredBy": "Middle East",
    "namedBy": null,
    "appearance": "metallic gray",
    "source": "https://en.wikipedia.org/wiki/Lead_(element)",
    "atomicRadius": 202,
    "oxidationStates": [
      4,
      2
    ],
    "yearDiscovered": "Ancient",
    "isotopes": [
      {
        "mass": 208,
        "abundance": 52.4
      },
      {
        "mass": 206,
        "abundance": 24.1
      },
      {
        "mass": 207,
        "abundance": 22.1
      },
      {
        "mass": 204,
        "abundance": 1.4
      }
    ]
  },
  {
    "z": 83,
    "symbol": "Bi",
    "names": {
      "en": "Bismuth",
      "hy": "Բիսմութ",
      "ru": "Висмут"
    },
    "mass": 208.980401,
    "neutrons": 126,
    "period": 6,
    "group": 15,
    "block": "p",
    "category": "post-transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      18,
      5
    ],
    "electronConfig": "[Xe] 4f14 5d10 6s2 6p3",
    "valence": [
      3,
      5
    ],
    "electronegativity": 2.02,
    "phase": "solid",
    "color": "#9e4fb5",
    "xpos": 15,
    "ypos": 6,
    "density": 9.78,
    "melt": 544.7,
    "boil": 1837,
    "molarHeat": 25.52,
    "electronAffinity": 90.924,
    "ionizationEnergies": [
      703,
      1610,
      2466,
      4370,
      5400,
      8520
    ],
    "discoveredBy": "Claude François Geoffroy",
    "namedBy": null,
    "appearance": "lustrous silver",
    "source": "https://en.wikipedia.org/wiki/Bismuth",
    "atomicRadius": 207,
    "oxidationStates": [
      5,
      3
    ],
    "yearDiscovered": "1753",
    "isotopes": [
      {
        "mass": 209,
        "abundance": 100
      }
    ]
  },
  {
    "z": 84,
    "symbol": "Po",
    "names": {
      "en": "Polonium",
      "hy": "Պոլոնիում",
      "ru": "Полоний"
    },
    "mass": 209,
    "neutrons": 125,
    "period": 6,
    "group": 16,
    "block": "p",
    "category": "post-transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      18,
      6
    ],
    "electronConfig": "[Xe] 4f14 5d10 6s2 6p4",
    "valence": [
      2,
      4
    ],
    "electronegativity": 2,
    "phase": "solid",
    "color": "#ab5c00",
    "xpos": 16,
    "ypos": 6,
    "density": 9.196,
    "melt": 527,
    "boil": 1235,
    "molarHeat": 26.4,
    "electronAffinity": 136,
    "ionizationEnergies": [
      812.1
    ],
    "discoveredBy": "Pierre Curie",
    "namedBy": null,
    "appearance": "silvery",
    "source": "https://en.wikipedia.org/wiki/Polonium",
    "atomicRadius": 197,
    "oxidationStates": [
      4,
      2
    ],
    "yearDiscovered": "1898",
    "isotopes": []
  },
  {
    "z": 85,
    "symbol": "At",
    "names": {
      "en": "Astatine",
      "hy": "Աստատ",
      "ru": "Астат"
    },
    "mass": 210,
    "neutrons": 125,
    "period": 6,
    "group": 17,
    "block": "p",
    "category": "halogen",
    "shells": [
      2,
      8,
      18,
      32,
      18,
      7
    ],
    "electronConfig": "[Xe] 4f14 5d10 6s2 6p5",
    "valence": [
      1
    ],
    "electronegativity": 2.2,
    "phase": "solid",
    "color": "#754f45",
    "xpos": 17,
    "ypos": 6,
    "density": 6.35,
    "melt": 575,
    "boil": 610,
    "molarHeat": null,
    "electronAffinity": 233,
    "ionizationEnergies": [
      899.003
    ],
    "discoveredBy": "Dale R. Corson",
    "namedBy": null,
    "appearance": "unknown, probably metallic",
    "source": "https://en.wikipedia.org/wiki/Astatine",
    "atomicRadius": 202,
    "oxidationStates": [
      7,
      5,
      3,
      1,
      -1
    ],
    "yearDiscovered": "1940",
    "isotopes": []
  },
  {
    "z": 86,
    "symbol": "Rn",
    "names": {
      "en": "Radon",
      "hy": "Ռադոն",
      "ru": "Радон"
    },
    "mass": 222,
    "neutrons": 136,
    "period": 6,
    "group": 18,
    "block": "p",
    "category": "noble-gas",
    "shells": [
      2,
      8,
      18,
      32,
      18,
      8
    ],
    "electronConfig": "[Xe] 4f14 5d10 6s2 6p6",
    "valence": [
      0
    ],
    "electronegativity": 2.2,
    "phase": "gas",
    "color": "#428296",
    "xpos": 18,
    "ypos": 6,
    "density": 9.73,
    "melt": 202,
    "boil": 211.5,
    "molarHeat": null,
    "electronAffinity": -68,
    "ionizationEnergies": [
      1037
    ],
    "discoveredBy": "Friedrich Ernst Dorn",
    "namedBy": null,
    "appearance": "colorless gas, occasionally glows green or red in discharge tubes",
    "source": "https://en.wikipedia.org/wiki/Radon",
    "atomicRadius": 220,
    "oxidationStates": [
      0
    ],
    "yearDiscovered": "1900",
    "isotopes": []
  },
  {
    "z": 87,
    "symbol": "Fr",
    "names": {
      "en": "Francium",
      "hy": "Ֆրանսիում",
      "ru": "Франций"
    },
    "mass": 223,
    "neutrons": 136,
    "period": 7,
    "group": 1,
    "block": "s",
    "category": "alkali-metal",
    "shells": [
      2,
      8,
      18,
      32,
      18,
      8,
      1
    ],
    "electronConfig": "[Rn] 7s1",
    "valence": [
      1
    ],
    "electronegativity": 0.79,
    "phase": "solid",
    "color": "#420066",
    "xpos": 1,
    "ypos": 7,
    "density": 1.87,
    "melt": 300,
    "boil": 950,
    "molarHeat": null,
    "electronAffinity": 46.89,
    "ionizationEnergies": [
      380
    ],
    "discoveredBy": "Marguerite Perey",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Francium",
    "atomicRadius": 348,
    "oxidationStates": [
      1
    ],
    "yearDiscovered": "1939",
    "isotopes": []
  },
  {
    "z": 88,
    "symbol": "Ra",
    "names": {
      "en": "Radium",
      "hy": "Ռադիում",
      "ru": "Радий"
    },
    "mass": 226,
    "neutrons": 138,
    "period": 7,
    "group": 2,
    "block": "s",
    "category": "alkaline-earth-metal",
    "shells": [
      2,
      8,
      18,
      32,
      18,
      8,
      2
    ],
    "electronConfig": "[Rn] 7s2",
    "valence": [
      2
    ],
    "electronegativity": 0.9,
    "phase": "solid",
    "color": "#007d00",
    "xpos": 2,
    "ypos": 7,
    "density": 5.5,
    "melt": 1233,
    "boil": 2010,
    "molarHeat": null,
    "electronAffinity": 9.6485,
    "ionizationEnergies": [
      509.3,
      979
    ],
    "discoveredBy": "Pierre Curie",
    "namedBy": null,
    "appearance": "silvery white metallic",
    "source": "https://en.wikipedia.org/wiki/Radium",
    "atomicRadius": 283,
    "oxidationStates": [
      2
    ],
    "yearDiscovered": "1898",
    "isotopes": []
  },
  {
    "z": 89,
    "symbol": "Ac",
    "names": {
      "en": "Actinium",
      "hy": "Ակտինիում",
      "ru": "Актиний"
    },
    "mass": 227,
    "neutrons": 138,
    "period": 7,
    "group": 3,
    "block": "f",
    "category": "actinide",
    "shells": [
      2,
      8,
      18,
      32,
      18,
      9,
      2
    ],
    "electronConfig": "[Rn] 6d1 7s2",
    "valence": [
      3
    ],
    "electronegativity": 1.1,
    "phase": "solid",
    "color": "#70abfa",
    "xpos": 3,
    "ypos": 10,
    "density": 10,
    "melt": 1500,
    "boil": 3500,
    "molarHeat": 27.2,
    "electronAffinity": 33.77,
    "ionizationEnergies": [
      499,
      1170
    ],
    "discoveredBy": "Friedrich Oskar Giesel",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Actinium",
    "atomicRadius": 260,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1899",
    "isotopes": []
  },
  {
    "z": 90,
    "symbol": "Th",
    "names": {
      "en": "Thorium",
      "hy": "Թորիում",
      "ru": "Торий"
    },
    "mass": 232.03774,
    "neutrons": 142,
    "period": 7,
    "group": 3,
    "block": "f",
    "category": "actinide",
    "shells": [
      2,
      8,
      18,
      32,
      18,
      10,
      2
    ],
    "electronConfig": "[Rn] 6d2 7s2",
    "valence": [
      4
    ],
    "electronegativity": 1.3,
    "phase": "solid",
    "color": "#00baff",
    "xpos": 4,
    "ypos": 10,
    "density": 11.724,
    "melt": 2023,
    "boil": 5061,
    "molarHeat": 26.23,
    "electronAffinity": 112.72,
    "ionizationEnergies": [
      587,
      1110,
      1930,
      2780
    ],
    "discoveredBy": "Jöns Jakob Berzelius",
    "namedBy": null,
    "appearance": "silvery, often with black tarnish",
    "source": "https://en.wikipedia.org/wiki/Thorium",
    "atomicRadius": 237,
    "oxidationStates": [
      4
    ],
    "yearDiscovered": "1828",
    "isotopes": [
      {
        "mass": 232,
        "abundance": 100
      }
    ]
  },
  {
    "z": 91,
    "symbol": "Pa",
    "names": {
      "en": "Protactinium",
      "hy": "Պրոտակտինիում",
      "ru": "Протактиний"
    },
    "mass": 231.035882,
    "neutrons": 140,
    "period": 7,
    "group": 3,
    "block": "f",
    "category": "actinide",
    "shells": [
      2,
      8,
      18,
      32,
      20,
      9,
      2
    ],
    "electronConfig": "[Rn] 5f2 6d1 7s2",
    "valence": [
      5
    ],
    "electronegativity": 1.5,
    "phase": "solid",
    "color": "#00a1ff",
    "xpos": 5,
    "ypos": 10,
    "density": 15.37,
    "melt": 1841,
    "boil": 4300,
    "molarHeat": null,
    "electronAffinity": 53.03,
    "ionizationEnergies": [
      568
    ],
    "discoveredBy": "William Crookes",
    "namedBy": "Otto Hahn",
    "appearance": "bright, silvery metallic luster",
    "source": "https://en.wikipedia.org/wiki/Protactinium",
    "atomicRadius": 243,
    "oxidationStates": [
      5,
      4
    ],
    "yearDiscovered": "1913",
    "isotopes": [
      {
        "mass": 231,
        "abundance": 100
      }
    ]
  },
  {
    "z": 92,
    "symbol": "U",
    "names": {
      "en": "Uranium",
      "hy": "Ուրան",
      "ru": "Уран"
    },
    "mass": 238.028913,
    "neutrons": 146,
    "period": 7,
    "group": 3,
    "block": "f",
    "category": "actinide",
    "shells": [
      2,
      8,
      18,
      32,
      21,
      9,
      2
    ],
    "electronConfig": "[Rn] 5f3 6d1 7s2",
    "valence": [
      4,
      6
    ],
    "electronegativity": 1.38,
    "phase": "solid",
    "color": "#008fff",
    "xpos": 6,
    "ypos": 10,
    "density": 19.1,
    "melt": 1405.3,
    "boil": 4404,
    "molarHeat": 27.665,
    "electronAffinity": 50.94,
    "ionizationEnergies": [
      597.6,
      1420
    ],
    "discoveredBy": "Martin Heinrich Klaproth",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Uranium",
    "atomicRadius": 240,
    "oxidationStates": [
      6,
      5,
      4,
      3
    ],
    "yearDiscovered": "1789",
    "isotopes": [
      {
        "mass": 238,
        "abundance": 99.2742
      },
      {
        "mass": 235,
        "abundance": 0.7204
      },
      {
        "mass": 234,
        "abundance": 0.0054
      }
    ]
  },
  {
    "z": 93,
    "symbol": "Np",
    "names": {
      "en": "Neptunium",
      "hy": "Նեպտունիում",
      "ru": "Нептуний"
    },
    "mass": 237,
    "neutrons": 144,
    "period": 7,
    "group": 3,
    "block": "f",
    "category": "actinide",
    "shells": [
      2,
      8,
      18,
      32,
      22,
      9,
      2
    ],
    "electronConfig": "[Rn] 5f4 6d1 7s2",
    "valence": [
      5
    ],
    "electronegativity": 1.36,
    "phase": "solid",
    "color": "#0080ff",
    "xpos": 7,
    "ypos": 10,
    "density": 20.45,
    "melt": 912,
    "boil": 4447,
    "molarHeat": 29.46,
    "electronAffinity": 45.85,
    "ionizationEnergies": [
      604.5
    ],
    "discoveredBy": "Edwin McMillan",
    "namedBy": null,
    "appearance": "silvery metallic",
    "source": "https://en.wikipedia.org/wiki/Neptunium",
    "atomicRadius": 221,
    "oxidationStates": [
      6,
      5,
      4,
      3
    ],
    "yearDiscovered": "1940",
    "isotopes": []
  },
  {
    "z": 94,
    "symbol": "Pu",
    "names": {
      "en": "Plutonium",
      "hy": "Պլուտոնիում",
      "ru": "Плутоний"
    },
    "mass": 244,
    "neutrons": 150,
    "period": 7,
    "group": 3,
    "block": "f",
    "category": "actinide",
    "shells": [
      2,
      8,
      18,
      32,
      24,
      8,
      2
    ],
    "electronConfig": "[Rn] 5f6 7s2",
    "valence": [
      4
    ],
    "electronegativity": 1.28,
    "phase": "solid",
    "color": "#006bff",
    "xpos": 8,
    "ypos": 10,
    "density": 19.816,
    "melt": 912.5,
    "boil": 3505,
    "molarHeat": 35.5,
    "electronAffinity": -48.33,
    "ionizationEnergies": [
      584.7
    ],
    "discoveredBy": "Glenn T. Seaborg",
    "namedBy": null,
    "appearance": "silvery white, tarnishing to dark gray in air",
    "source": "https://en.wikipedia.org/wiki/Plutonium",
    "atomicRadius": 243,
    "oxidationStates": [
      6,
      5,
      4,
      3
    ],
    "yearDiscovered": "1940",
    "isotopes": []
  },
  {
    "z": 95,
    "symbol": "Am",
    "names": {
      "en": "Americium",
      "hy": "Ամերիցիում",
      "ru": "Америций"
    },
    "mass": 243,
    "neutrons": 148,
    "period": 7,
    "group": 3,
    "block": "f",
    "category": "actinide",
    "shells": [
      2,
      8,
      18,
      32,
      25,
      8,
      2
    ],
    "electronConfig": "[Rn] 5f7 7s2",
    "valence": [
      3
    ],
    "electronegativity": 1.13,
    "phase": "solid",
    "color": "#545cf2",
    "xpos": 9,
    "ypos": 10,
    "density": 12,
    "melt": 1449,
    "boil": 2880,
    "molarHeat": 62.7,
    "electronAffinity": 9.93,
    "ionizationEnergies": [
      578
    ],
    "discoveredBy": "Glenn T. Seaborg",
    "namedBy": null,
    "appearance": "silvery white",
    "source": "https://en.wikipedia.org/wiki/Americium",
    "atomicRadius": 244,
    "oxidationStates": [
      6,
      5,
      4,
      3
    ],
    "yearDiscovered": "1944",
    "isotopes": []
  },
  {
    "z": 96,
    "symbol": "Cm",
    "names": {
      "en": "Curium",
      "hy": "Կյուրիում",
      "ru": "Кюрий"
    },
    "mass": 247,
    "neutrons": 151,
    "period": 7,
    "group": 3,
    "block": "f",
    "category": "actinide",
    "shells": [
      2,
      8,
      18,
      32,
      25,
      9,
      2
    ],
    "electronConfig": "[Rn] 5f7 6d1 7s2",
    "valence": [
      3
    ],
    "electronegativity": 1.28,
    "phase": "solid",
    "color": "#785ce3",
    "xpos": 10,
    "ypos": 10,
    "density": 13.51,
    "melt": 1613,
    "boil": 3383,
    "molarHeat": null,
    "electronAffinity": 27.17,
    "ionizationEnergies": [
      581
    ],
    "discoveredBy": "Glenn T. Seaborg",
    "namedBy": null,
    "appearance": "silvery metallic, glows purple in the dark",
    "source": "https://en.wikipedia.org/wiki/Curium",
    "atomicRadius": 245,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1944",
    "isotopes": []
  },
  {
    "z": 97,
    "symbol": "Bk",
    "names": {
      "en": "Berkelium",
      "hy": "Բերկլիում",
      "ru": "Берклий"
    },
    "mass": 247,
    "neutrons": 150,
    "period": 7,
    "group": 3,
    "block": "f",
    "category": "actinide",
    "shells": [
      2,
      8,
      18,
      32,
      27,
      8,
      2
    ],
    "electronConfig": "[Rn] 5f9 7s2",
    "valence": [
      3
    ],
    "electronegativity": 1.3,
    "phase": "solid",
    "color": "#8a4fe3",
    "xpos": 11,
    "ypos": 10,
    "density": 14.78,
    "melt": 1259,
    "boil": 2900,
    "molarHeat": null,
    "electronAffinity": -165.24,
    "ionizationEnergies": [
      601
    ],
    "discoveredBy": "Lawrence Berkeley National Laboratory",
    "namedBy": null,
    "appearance": "silvery",
    "source": "https://en.wikipedia.org/wiki/Berkelium",
    "atomicRadius": 244,
    "oxidationStates": [
      4,
      3
    ],
    "yearDiscovered": "1949",
    "isotopes": []
  },
  {
    "z": 98,
    "symbol": "Cf",
    "names": {
      "en": "Californium",
      "hy": "Կալիֆոռնիում",
      "ru": "Калифорний"
    },
    "mass": 251,
    "neutrons": 153,
    "period": 7,
    "group": 3,
    "block": "f",
    "category": "actinide",
    "shells": [
      2,
      8,
      18,
      32,
      28,
      8,
      2
    ],
    "electronConfig": "[Rn] 5f10 7s2",
    "valence": [
      3
    ],
    "electronegativity": 1.3,
    "phase": "solid",
    "color": "#a136d4",
    "xpos": 12,
    "ypos": 10,
    "density": 15.1,
    "melt": 1173,
    "boil": 1743,
    "molarHeat": null,
    "electronAffinity": -97.31,
    "ionizationEnergies": [
      608
    ],
    "discoveredBy": "Lawrence Berkeley National Laboratory",
    "namedBy": null,
    "appearance": "silvery",
    "source": "https://en.wikipedia.org/wiki/Californium",
    "atomicRadius": 245,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1950",
    "isotopes": []
  },
  {
    "z": 99,
    "symbol": "Es",
    "names": {
      "en": "Einsteinium",
      "hy": "Էյնշտեյնիում",
      "ru": "Эйнштейний"
    },
    "mass": 252,
    "neutrons": 153,
    "period": 7,
    "group": 3,
    "block": "f",
    "category": "actinide",
    "shells": [
      2,
      8,
      18,
      32,
      29,
      8,
      2
    ],
    "electronConfig": "[Rn] 5f11 7s2",
    "valence": [
      3
    ],
    "electronegativity": 1.3,
    "phase": "solid",
    "color": "#b31fd4",
    "xpos": 13,
    "ypos": 10,
    "density": 8.84,
    "melt": 1133,
    "boil": 1269,
    "molarHeat": null,
    "electronAffinity": -28.6,
    "ionizationEnergies": [
      619
    ],
    "discoveredBy": "Lawrence Berkeley National Laboratory",
    "namedBy": null,
    "appearance": "silver-colored",
    "source": "https://en.wikipedia.org/wiki/Einsteinium",
    "atomicRadius": 245,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1952",
    "isotopes": []
  },
  {
    "z": 100,
    "symbol": "Fm",
    "names": {
      "en": "Fermium",
      "hy": "Ֆերմիում",
      "ru": "Фермий"
    },
    "mass": 257,
    "neutrons": 157,
    "period": 7,
    "group": 3,
    "block": "f",
    "category": "actinide",
    "shells": [
      2,
      8,
      18,
      32,
      30,
      8,
      2
    ],
    "electronConfig": "[Rn] 5f12 7s2",
    "valence": [
      3
    ],
    "electronegativity": 1.3,
    "phase": "solid",
    "color": "#b31fba",
    "xpos": 14,
    "ypos": 10,
    "density": null,
    "melt": 1800,
    "boil": null,
    "molarHeat": null,
    "electronAffinity": 33.96,
    "ionizationEnergies": [
      627
    ],
    "discoveredBy": "Lawrence Berkeley National Laboratory",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Fermium",
    "atomicRadius": null,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1952",
    "isotopes": []
  },
  {
    "z": 101,
    "symbol": "Md",
    "names": {
      "en": "Mendelevium",
      "hy": "Մենդելևիում",
      "ru": "Менделевий"
    },
    "mass": 258,
    "neutrons": 157,
    "period": 7,
    "group": 3,
    "block": "f",
    "category": "actinide",
    "shells": [
      2,
      8,
      18,
      32,
      31,
      8,
      2
    ],
    "electronConfig": "[Rn] 5f13 7s2",
    "valence": [
      3
    ],
    "electronegativity": 1.3,
    "phase": "solid",
    "color": "#b30da6",
    "xpos": 15,
    "ypos": 10,
    "density": null,
    "melt": 1100,
    "boil": null,
    "molarHeat": null,
    "electronAffinity": 93.91,
    "ionizationEnergies": [
      635
    ],
    "discoveredBy": "Lawrence Berkeley National Laboratory",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Mendelevium",
    "atomicRadius": null,
    "oxidationStates": [
      3,
      2
    ],
    "yearDiscovered": "1955",
    "isotopes": []
  },
  {
    "z": 102,
    "symbol": "No",
    "names": {
      "en": "Nobelium",
      "hy": "Նոբելիում",
      "ru": "Нобелий"
    },
    "mass": 259,
    "neutrons": 157,
    "period": 7,
    "group": 3,
    "block": "f",
    "category": "actinide",
    "shells": [
      2,
      8,
      18,
      32,
      32,
      8,
      2
    ],
    "electronConfig": "[Rn] 5f14 7s2",
    "valence": [
      2,
      3
    ],
    "electronegativity": 1.3,
    "phase": "solid",
    "color": "#bd0d87",
    "xpos": 16,
    "ypos": 10,
    "density": null,
    "melt": 1100,
    "boil": null,
    "molarHeat": null,
    "electronAffinity": -223.22,
    "ionizationEnergies": [
      642
    ],
    "discoveredBy": "Joint Institute for Nuclear Research",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Nobelium",
    "atomicRadius": null,
    "oxidationStates": [
      3,
      2
    ],
    "yearDiscovered": "1957",
    "isotopes": []
  },
  {
    "z": 103,
    "symbol": "Lr",
    "names": {
      "en": "Lawrencium",
      "hy": "Լոուրենսիում",
      "ru": "Лоуренсий"
    },
    "mass": 266,
    "neutrons": 163,
    "period": 7,
    "group": 3,
    "block": "d",
    "category": "actinide",
    "shells": [
      2,
      8,
      18,
      32,
      32,
      8,
      3
    ],
    "electronConfig": "[Rn] 5f14 7s2 7p1",
    "valence": [
      3
    ],
    "electronegativity": 1.3,
    "phase": "solid",
    "color": "#c70066",
    "xpos": 17,
    "ypos": 10,
    "density": null,
    "melt": 1900,
    "boil": null,
    "molarHeat": null,
    "electronAffinity": -30.04,
    "ionizationEnergies": [
      470
    ],
    "discoveredBy": "Lawrence Berkeley National Laboratory",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Lawrencium",
    "atomicRadius": null,
    "oxidationStates": [
      3
    ],
    "yearDiscovered": "1961",
    "isotopes": []
  },
  {
    "z": 104,
    "symbol": "Rf",
    "names": {
      "en": "Rutherfordium",
      "hy": "Ռեզերֆորդիում",
      "ru": "Резерфордий"
    },
    "mass": 267,
    "neutrons": 163,
    "period": 7,
    "group": 4,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      32,
      10,
      2
    ],
    "electronConfig": "[Rn] 5f14 6d2 7s2",
    "valence": [],
    "electronegativity": null,
    "phase": "solid",
    "color": "#cc0059",
    "xpos": 4,
    "ypos": 7,
    "density": 23.2,
    "melt": 2400,
    "boil": 5800,
    "molarHeat": null,
    "electronAffinity": null,
    "ionizationEnergies": [
      580
    ],
    "discoveredBy": "Joint Institute for Nuclear Research",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Rutherfordium",
    "atomicRadius": null,
    "oxidationStates": [
      4
    ],
    "yearDiscovered": "1964",
    "isotopes": []
  },
  {
    "z": 105,
    "symbol": "Db",
    "names": {
      "en": "Dubnium",
      "hy": "Դուբնիում",
      "ru": "Дубний"
    },
    "mass": 268,
    "neutrons": 163,
    "period": 7,
    "group": 5,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      32,
      11,
      2
    ],
    "electronConfig": "*[Rn] 5f14 6d3 7s2",
    "valence": [],
    "electronegativity": null,
    "phase": "solid",
    "color": "#d1004f",
    "xpos": 5,
    "ypos": 7,
    "density": 29.3,
    "melt": null,
    "boil": null,
    "molarHeat": null,
    "electronAffinity": null,
    "ionizationEnergies": [],
    "discoveredBy": "Joint Institute for Nuclear Research",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Dubnium",
    "atomicRadius": null,
    "oxidationStates": [
      5,
      4,
      3
    ],
    "yearDiscovered": "1967",
    "isotopes": []
  },
  {
    "z": 106,
    "symbol": "Sg",
    "names": {
      "en": "Seaborgium",
      "hy": "Սիբորգիում",
      "ru": "Сиборгий"
    },
    "mass": 269,
    "neutrons": 163,
    "period": 7,
    "group": 6,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      32,
      12,
      2
    ],
    "electronConfig": "*[Rn] 5f14 6d4 7s2",
    "valence": [],
    "electronegativity": null,
    "phase": "solid",
    "color": "#d90045",
    "xpos": 6,
    "ypos": 7,
    "density": 35,
    "melt": null,
    "boil": null,
    "molarHeat": null,
    "electronAffinity": null,
    "ionizationEnergies": [],
    "discoveredBy": "Lawrence Berkeley National Laboratory",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Seaborgium",
    "atomicRadius": null,
    "oxidationStates": [
      6,
      5,
      4,
      3,
      0
    ],
    "yearDiscovered": "1974",
    "isotopes": []
  },
  {
    "z": 107,
    "symbol": "Bh",
    "names": {
      "en": "Bohrium",
      "hy": "Բորիում",
      "ru": "Борий"
    },
    "mass": 270,
    "neutrons": 163,
    "period": 7,
    "group": 7,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      32,
      13,
      2
    ],
    "electronConfig": "*[Rn] 5f14 6d5 7s2",
    "valence": [],
    "electronegativity": null,
    "phase": "solid",
    "color": "#e00038",
    "xpos": 7,
    "ypos": 7,
    "density": 37.1,
    "melt": null,
    "boil": null,
    "molarHeat": null,
    "electronAffinity": null,
    "ionizationEnergies": [],
    "discoveredBy": "Gesellschaft für Schwerionenforschung",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Bohrium",
    "atomicRadius": null,
    "oxidationStates": [
      7,
      5,
      4,
      3
    ],
    "yearDiscovered": "1976",
    "isotopes": []
  },
  {
    "z": 108,
    "symbol": "Hs",
    "names": {
      "en": "Hassium",
      "hy": "Հասիում",
      "ru": "Хассий"
    },
    "mass": 269,
    "neutrons": 161,
    "period": 7,
    "group": 8,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      32,
      14,
      2
    ],
    "electronConfig": "*[Rn] 5f14 6d6 7s2",
    "valence": [],
    "electronegativity": null,
    "phase": "solid",
    "color": "#e6002e",
    "xpos": 8,
    "ypos": 7,
    "density": 40.7,
    "melt": 126,
    "boil": null,
    "molarHeat": null,
    "electronAffinity": null,
    "ionizationEnergies": [],
    "discoveredBy": "Gesellschaft für Schwerionenforschung",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Hassium",
    "atomicRadius": null,
    "oxidationStates": [
      8,
      6,
      5,
      4,
      3,
      2
    ],
    "yearDiscovered": "1984",
    "isotopes": []
  },
  {
    "z": 109,
    "symbol": "Mt",
    "names": {
      "en": "Meitnerium",
      "hy": "Մայտներիում",
      "ru": "Мейтнерий"
    },
    "mass": 278,
    "neutrons": 169,
    "period": 7,
    "group": 9,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      32,
      15,
      2
    ],
    "electronConfig": "*[Rn] 5f14 6d7 7s2",
    "valence": [],
    "electronegativity": null,
    "phase": "solid",
    "color": "#eb0026",
    "xpos": 9,
    "ypos": 7,
    "density": 37.4,
    "melt": null,
    "boil": null,
    "molarHeat": null,
    "electronAffinity": null,
    "ionizationEnergies": [],
    "discoveredBy": "Gesellschaft für Schwerionenforschung",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Meitnerium",
    "atomicRadius": null,
    "oxidationStates": [
      9,
      8,
      6,
      4,
      3,
      1
    ],
    "yearDiscovered": "1982",
    "isotopes": []
  },
  {
    "z": 110,
    "symbol": "Ds",
    "names": {
      "en": "Darmstadtium",
      "hy": "Դարմշտադտիում",
      "ru": "Дармштадтий"
    },
    "mass": 281,
    "neutrons": 171,
    "period": 7,
    "group": 10,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      32,
      16,
      2
    ],
    "electronConfig": "*[Rn] 5f14 6d9 7s1",
    "valence": [],
    "electronegativity": null,
    "phase": "solid",
    "color": "#cccccc",
    "xpos": 10,
    "ypos": 7,
    "density": 34.8,
    "melt": null,
    "boil": null,
    "molarHeat": null,
    "electronAffinity": null,
    "ionizationEnergies": [],
    "discoveredBy": "Gesellschaft für Schwerionenforschung",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Darmstadtium",
    "atomicRadius": null,
    "oxidationStates": [
      8,
      6,
      4,
      2,
      0
    ],
    "yearDiscovered": "1994",
    "isotopes": []
  },
  {
    "z": 111,
    "symbol": "Rg",
    "names": {
      "en": "Roentgenium",
      "hy": "Ռենտգենիում",
      "ru": "Рентгений"
    },
    "mass": 282,
    "neutrons": 171,
    "period": 7,
    "group": 11,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      32,
      17,
      2
    ],
    "electronConfig": "*[Rn] 5f14 6d10 7s1",
    "valence": [],
    "electronegativity": null,
    "phase": "solid",
    "color": "#cccccc",
    "xpos": 11,
    "ypos": 7,
    "density": 28.7,
    "melt": null,
    "boil": null,
    "molarHeat": null,
    "electronAffinity": 151,
    "ionizationEnergies": [],
    "discoveredBy": "Gesellschaft für Schwerionenforschung",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Roentgenium",
    "atomicRadius": null,
    "oxidationStates": [
      5,
      3,
      1,
      -1
    ],
    "yearDiscovered": "1994",
    "isotopes": []
  },
  {
    "z": 112,
    "symbol": "Cn",
    "names": {
      "en": "Copernicium",
      "hy": "Կոպեռնիցիում",
      "ru": "Коперниций"
    },
    "mass": 285,
    "neutrons": 173,
    "period": 7,
    "group": 12,
    "block": "d",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      32,
      18,
      2
    ],
    "electronConfig": "*[Rn] 5f14 6d10 7s2",
    "valence": [],
    "electronegativity": null,
    "phase": "liquid",
    "color": "#cccccc",
    "xpos": 12,
    "ypos": 7,
    "density": 14,
    "melt": null,
    "boil": 3570,
    "molarHeat": null,
    "electronAffinity": null,
    "ionizationEnergies": [],
    "discoveredBy": "Gesellschaft für Schwerionenforschung",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Copernicium",
    "atomicRadius": null,
    "oxidationStates": [
      2,
      1,
      0
    ],
    "yearDiscovered": "1996",
    "isotopes": []
  },
  {
    "z": 113,
    "symbol": "Nh",
    "names": {
      "en": "Nihonium",
      "hy": "Նիհոնիում",
      "ru": "Нихоний"
    },
    "mass": 286,
    "neutrons": 173,
    "period": 7,
    "group": 13,
    "block": "p",
    "category": "transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      32,
      18,
      3
    ],
    "electronConfig": "*[Rn] 5f14 6d10 7s2 7p1",
    "valence": [],
    "electronegativity": null,
    "phase": "solid",
    "color": "#cccccc",
    "xpos": 13,
    "ypos": 7,
    "density": 16,
    "melt": 700,
    "boil": 1430,
    "molarHeat": null,
    "electronAffinity": 66.6,
    "ionizationEnergies": [],
    "discoveredBy": "RIKEN",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Ununtrium",
    "atomicRadius": null,
    "oxidationStates": [
      0
    ],
    "yearDiscovered": "2004",
    "isotopes": []
  },
  {
    "z": 114,
    "symbol": "Fl",
    "names": {
      "en": "Flerovium",
      "hy": "Ֆլերովիում",
      "ru": "Флеровий"
    },
    "mass": 289,
    "neutrons": 175,
    "period": 7,
    "group": 14,
    "block": "p",
    "category": "post-transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      32,
      18,
      4
    ],
    "electronConfig": "*[Rn] 5f14 6d10 7s2 7p2",
    "valence": [],
    "electronegativity": null,
    "phase": "solid",
    "color": "#cccccc",
    "xpos": 14,
    "ypos": 7,
    "density": 14,
    "melt": 340,
    "boil": 420,
    "molarHeat": null,
    "electronAffinity": null,
    "ionizationEnergies": [],
    "discoveredBy": "Joint Institute for Nuclear Research",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Flerovium",
    "atomicRadius": null,
    "oxidationStates": [
      6,
      4,
      2,
      1,
      0
    ],
    "yearDiscovered": "1998",
    "isotopes": []
  },
  {
    "z": 115,
    "symbol": "Mc",
    "names": {
      "en": "Moscovium",
      "hy": "Մոսկովիում",
      "ru": "Московий"
    },
    "mass": 289,
    "neutrons": 174,
    "period": 7,
    "group": 15,
    "block": "p",
    "category": "post-transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      32,
      18,
      5
    ],
    "electronConfig": "*[Rn] 5f14 6d10 7s2 7p3",
    "valence": [],
    "electronegativity": null,
    "phase": "solid",
    "color": "#cccccc",
    "xpos": 15,
    "ypos": 7,
    "density": 13.5,
    "melt": 670,
    "boil": 1400,
    "molarHeat": null,
    "electronAffinity": 35.3,
    "ionizationEnergies": [],
    "discoveredBy": "Joint Institute for Nuclear Research",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Ununpentium",
    "atomicRadius": null,
    "oxidationStates": [
      3,
      1
    ],
    "yearDiscovered": "2003",
    "isotopes": []
  },
  {
    "z": 116,
    "symbol": "Lv",
    "names": {
      "en": "Livermorium",
      "hy": "Լիվերմորիում",
      "ru": "Ливерморий"
    },
    "mass": 293,
    "neutrons": 177,
    "period": 7,
    "group": 16,
    "block": "p",
    "category": "post-transition-metal",
    "shells": [
      2,
      8,
      18,
      32,
      32,
      18,
      6
    ],
    "electronConfig": "*[Rn] 5f14 6d10 7s2 7p4",
    "valence": [],
    "electronegativity": null,
    "phase": "solid",
    "color": "#cccccc",
    "xpos": 16,
    "ypos": 7,
    "density": 12.9,
    "melt": 709,
    "boil": 1085,
    "molarHeat": null,
    "electronAffinity": 74.9,
    "ionizationEnergies": [],
    "discoveredBy": "Joint Institute for Nuclear Research",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Livermorium",
    "atomicRadius": null,
    "oxidationStates": [
      4,
      2,
      -2
    ],
    "yearDiscovered": "2000",
    "isotopes": []
  },
  {
    "z": 117,
    "symbol": "Ts",
    "names": {
      "en": "Tennessine",
      "hy": "Թենեսսին",
      "ru": "Теннессин"
    },
    "mass": 294,
    "neutrons": 177,
    "period": 7,
    "group": 17,
    "block": "p",
    "category": "halogen",
    "shells": [
      2,
      8,
      18,
      32,
      32,
      18,
      7
    ],
    "electronConfig": "*[Rn] 5f14 6d10 7s2 7p5",
    "valence": [],
    "electronegativity": null,
    "phase": "solid",
    "color": "#cccccc",
    "xpos": 17,
    "ypos": 7,
    "density": 7.17,
    "melt": 723,
    "boil": 883,
    "molarHeat": null,
    "electronAffinity": 165.9,
    "ionizationEnergies": [],
    "discoveredBy": "Joint Institute for Nuclear Research",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Tennessine",
    "atomicRadius": null,
    "oxidationStates": [
      5,
      3,
      1,
      -1
    ],
    "yearDiscovered": "2010",
    "isotopes": []
  },
  {
    "z": 118,
    "symbol": "Og",
    "names": {
      "en": "Oganesson",
      "hy": "Օգանեսոն",
      "ru": "Оганесон"
    },
    "mass": 294,
    "neutrons": 176,
    "period": 7,
    "group": 18,
    "block": "p",
    "category": "noble-gas",
    "shells": [
      2,
      8,
      18,
      32,
      32,
      18,
      8
    ],
    "electronConfig": "*[Rn] 5f14 6d10 7s2 7p6",
    "valence": [],
    "electronegativity": null,
    "phase": "solid",
    "color": "#cccccc",
    "xpos": 18,
    "ypos": 7,
    "density": 4.95,
    "melt": null,
    "boil": 350,
    "molarHeat": null,
    "electronAffinity": 5.40318,
    "ionizationEnergies": [],
    "discoveredBy": "Joint Institute for Nuclear Research",
    "namedBy": null,
    "appearance": null,
    "source": "https://en.wikipedia.org/wiki/Oganesson",
    "atomicRadius": null,
    "oxidationStates": [
      6,
      4,
      2,
      1,
      0,
      -1
    ],
    "yearDiscovered": "2006",
    "isotopes": []
  }
];
