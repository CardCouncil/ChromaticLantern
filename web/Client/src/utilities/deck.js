import shortid from "shortid";

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