import shortid from "shortid";

/*
export function  checkColor(state, id, symbol) {
  let deck = state.building.decks.find(_ => _.id == id);
  if(deck) {
    let cost = deck.cards
      .map(_ => (_.card.mana_cost.match(symbol) || []).length)
      .reduce((state, value) => state + value, 0);
    return cost;
  } else {
    return 0;
  }
}

export function countColorless(state, id) {
  let deck = state.building.decks.find(_ => _.id == id);
  if(deck) {
    let cost = deck.cards
      .map(_ => {
        let regx = /{(\d*?)}/g;
        let matches = regx.exec( _.card.mana_cost);
        return (matches) ? parseInt(matches[1]) : 0;
      })
      .reduce((state, value) => state + value, 0);
      
    return cost;
  } else {
    return 0;
  }
}
*/

/*
export function getManaSymbols(deck) {
  let symbols = [/W/g, /U/g, /B/g, /R/g, /G/g, /C/g, /P/g];
  let colors = ["W","U","B","R","G","C","P"];
  let cards = deck.cards.map(item => {
    return symbols.map(s => (item.card.mana_cost.match(s) || []).length)
  });
  let counts = {};
  for (const item of cards) {
    let key = "";
    for (let i = 0; i < item.length; i++) {
      const amount = item[i];
      for (let count = 1; count <= amount; count++) {
        key += colors[i];
      }
    }

    if(counts[key]) {
      counts[key]++;
    } else {
      counts[key] = 1;
    }
  }
  console.log(counts);
}
*/

export function getCardTypes(deck, settings) {
  let groups = [
    {
      name: "Planeswalkers",
      search: "Planeswalker",
      count: 0,
      key: "walkers",
      types: []
    },
    {
      name: "Creatures",
      search: "Creature",
      count: 0,
      key: "creatures",
      types: []
    },
    {
      name: "Artifacts",
      search: "Artifact",
      count: 0,
      key: "artifacts",
      types: []
    },
    {
      name: "Enchantments",
      search: "Enchantment",
      count: 0,
      key: "enchantments",
      types: []
    },
    {
      name: "Instants",
      search: "Instant",
      count: 0,
      key: "instants",
      types: []
    },
    {
      name: "Sorceries",
      search: "Sorcery",
      count: 0,
      key: "sorceries",
      types: []
    },
    {
      name: "Lands",
      search: "Land",
      count: 0,
      key: "lands",
      types: []
    }
  ];

  for (const item of deck.cards) {
    for (const group of groups) {
      if(item.card.type_line.includes(group.search)) {
        group.count++;
      }

      const types = settings.types[group.key];
      for (const type of types) {
        if(item.card.type_line.includes(type)) {
          if(group.types[type]) {
            group.types[type]++;
          } else {
            group.types[type] = 1;
          }
        }
      }
    }
  }

  return groups;
}

export function compressDeck(deck) {
  let cards = deck.cards.map(_ => {
    return {
      s: _.card.set,
      n: _.card.collector_number,
      a: _.target,
    }
  });

  let data = {
    n: deck.name,
    i: deck.identity,
    t: deck.type,
    g: deck.general,
    c: cards
  };
  return data;
}

export function exportDeck(deck) {
  let data = compressDeck(deck);
  let json = JSON.stringify(data);
  let code = Buffer.from(json).toString("base64");
  return code;
}

export function importDeck(code) {
  let json = Buffer.from(code, "base64").toString();
  let obj = JSON.parse(json);
  let data = {
    deck: {
      id: shortid.generate(),
      name: obj.n,
      type: obj.t,
      identity: obj.i,
      general: obj.g,
    },
    cards: obj.c.map(_ => {
      return { set: _.s, collector_number: _.n, amount: _.a };
    })
  }
  return data;
}