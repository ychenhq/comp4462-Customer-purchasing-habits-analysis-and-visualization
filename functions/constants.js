const stateCodeToName = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
  AS: "American Samoa",
  GU: "Guam",
  MP: "Northern Mariana Islands",
  PR: "Puerto Rico",
  VI: "U.S. Virgin Islands",
};

const colorMap = {
  Cyan: "#00FFFF",
  Gold: "#FFD700",
  Purple: "#800080",
  Silver: "#C0C0C0",
  Beige: "#F5F5DC",
  White: "#FFFFFF",
  Charcoal: "#36454F",
  Yellow: "#FFFF00",
  Blue: "#0000FF",
  Pink: "#FFC0CB",
  Olive: "#808000",
  Indigo: "#4B0082",
  Brown: "#A52A2A",
  Peach: "#FFE5B4",
  Red: "#FF0000",
  Violet: "#EE82EE",
  Maroon: "#800000",
  Red: "#FF0000",
  Tomato: "#FF6347",
  Crimson: "#DC143C",
  OrangeRed: "#FF4500",
  Coral: "#FF7F50",
  DarkOrange: "#FF8C00",
  GoldenRod: "#DAA520",
  Yellow: "#FFFF00",
  LemonChiffon: "#FFFACD",
  Khaki: "#F0E68C",
  PaleGoldenRod: "#EEE8AA",
  Olive: "#808000",
  Lime: "#00FF00",
  LimeGreen: "#32CD32",
  GreenYellow: "#ADFF2F",
  Chartreuse: "#7FFF00",
  SpringGreen: "#00FF7F",
  MediumSeaGreen: "#3CB371",
  SeaGreen: "#2E8B57",
  ForestGreen: "#228B22",
  Green: "#008000",
  DarkGreen: "#006400",
  Teal: "#008080",
  Aqua: "#00FFFF",
  Turquoise: "#40E0D0",
  SkyBlue: "#87CEEB",
  DodgerBlue: "#1E90FF",
  Blue: "#0000FF",
  RoyalBlue: "#4169E1",
  MediumSlateBlue: "#7B68EE",
  SlateBlue: "#6A5ACD",
  DarkSlateBlue: "#483D8B",
  Indigo: "#4B0082",
  DarkMagenta: "#8B008B",
  Magenta: "#FF00FF",
  MediumOrchid: "#BA55D3",
  Orchid: "#DA70D6",
  Plum: "#DDA0DD",
  Thistle: "#D8BFD8",
  Lavender: "#E6E6FA",
  White: "#FFFFFF",
  LightGray: "#D3D3D3",
  Silver: "#C0C0C0",
  DarkGray: "#A9A9A9",
  Gray: "#808080",
  DimGray: "#696969",
  Black: "#000000",
  SlateGray: "#708090",
  DarkSlateGray: "#2F4F4F",
  //here are the season colors
  Spring: "#77DD77",
  Summer: "#FFB347",
  Fall: "#FF6961",
  Winter: "#AEC6CF",
  //here are the category colors
  Clothing: "#F4A261",
  Accessories: "#2A9D8F",
  Footwear: "#E76F51",
  Outwear: "#264653",
};

// this data is generated by python and imported here

const statePurchaseAmounts = {
  AL: 22692,
  AK: 23046,
  AZ: 21224,
  AR: 16124,
  CA: 25114,
  CO: 22894,
  CT: 20529,
  DE: 28693,
  FL: 18375,
  GA: 16034,
  HI: 14714,
  ID: 27211,
  IL: 20416,
  IN: 18210,
  IA: 20620,
  KS: 17920,
  KY: 23097,
  LA: 15385,
  ME: 19703,
  MD: 20589,
  MA: 21469,
  MI: 22761,
  MN: 20433,
  MS: 24992,
  MO: 20975,
  MT: 29589,
  NE: 24995,
  NV: 24968,
  NH: 19205,
  NJ: 18043,
  NM: 27476,
  NY: 20509,
  NC: 20085,
  ND: 26824,
  OH: 26315,
  OK: 19838,
  OR: 21391,
  PA: 20740,
  RI: 14428,
  SC: 17796,
  SD: 18792,
  TN: 20859,
  TX: 22529,
  UT: 21158,
  VT: 26427,
  VA: 27835,
  WA: 20676,
  WV: 21396,
  WI: 17471,
  WY: 22067,
};

// Map to translate frequencies to labels
const frequencyLabels = {
  Weekly: "Weekly",
  Annually: "Annually",
  "Every 3 Months": "Every 3 Months",
  "Bi-Weekly": "Bi-Weekly",
  Quarterly: "Quarterly",
  Fortnightly: "Fortnightly",
  Monthly: "Monthly",
};
