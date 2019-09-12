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
 
function countCardType(type) {
  return Object.keys(type).map((k) => type[k]).reduce((acc, value) => acc + value, 0);
}

export function getCardTypes(deck, settings) {
  let groups = {};

  for (const key in settings.types.groups) {
    let name = settings.types.groups[key];
    groups[key] = {};
    const types = settings.types[key];
    for (const type of types) {
      for (const item of deck.cards) {
        if(item.card.type_line.includes(name) && item.card.type_line.includes(type)) {
          if(groups[key][type]) {
            groups[key][type]++;
          } else {
            groups[key][type] = 1;
          }
        }
      }
    }
  }

  let data = [
    {
      name: "Planeswalkers",
      count: countCardType(groups.walkers),
      types: groups.walkers
    },
    {
      name: "Creatures",
      count: countCardType(groups.creatures),
      types: groups.creatures
    },
    {
      name: "Artifacts",
      count: countCardType(groups.artifacts),
      types: groups.artifacts
    },
    {
      name: "Instants",
      count: countCardType(groups.instants),
      types: groups.instants
    },
    {
      name: "Sorceries",
      count: countCardType(groups.sorceries),
      types: groups.sorceries
    },
    {
      name: "Lands",
      count: countCardType(groups.lands),
      types: groups.lands
    }
  ];

  return data;
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