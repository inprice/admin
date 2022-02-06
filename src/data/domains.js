const domains = {
  'Yours': { favicon: 'yours.ico', flagicon: 'us.png' },

  'amazon.com': { favicon: 'amazon.ico', flagicon: 'us.png' },
  'ebay.com': { favicon: 'ebay.ico', flagicon: 'us.png' },
  'apple.com': { favicon: 'apple.ico', flagicon: 'us.png' },
  'bestbuy.com': { favicon: 'bestbuy.ico', flagicon: 'us.png' },
  'bonanza.com': { favicon: 'bonanza.ico', flagicon: 'us.png' },
  'etsy.com': { favicon: 'etsy.ico', flagicon: 'us.png' },
  'lidl.com': { favicon: 'lidl.ico', flagicon: 'us.png' },
  'target.com': { favicon: 'target.ico', flagicon: 'us.png' },
  'vidaxl.us': { favicon: 'vidaxl.ico', flagicon: 'us.png' },
  'walmart.com': { favicon: 'walmart.ico', flagicon: 'us.png' },

  'amazon.co.uk': { favicon: 'amazon.ico', flagicon: 'uk.png' },
  'ebay.co.uk': { favicon: 'ebay.ico', flagicon: 'uk.png' },
  'apple.com/uk': { favicon: 'apple.ico', flagicon: 'uk.png' },
  'argos.co.uk': { favicon: 'argos.ico', flagicon: 'uk.png' },
  'global.direct.asda.com': { favicon: 'asda.ico', flagicon: 'uk.png' },
  'groceries.argos.com': { favicon: 'asda.ico', flagicon: 'uk.png' },
  'asda-photo.co.uk': { favicon: 'asda.ico', flagicon: 'uk.png' },
  'asos.com': { favicon: 'asos.ico', flagicon: 'uk.png' },
  'bonprix.co.uk': { favicon: 'bonprix.ico', flagicon: 'uk.png' },
  'currys.co.uk': { favicon: 'currys.ico', flagicon: 'uk.png' },
  'debenhams.com': { favicon: 'debenhams.ico', flagicon: 'uk.png' },
  'euronics.co.uk': { favicon: 'euronics.ico', flagicon: 'uk.png' },
  'lidl.co.uk': { favicon: 'lidl.ico', flagicon: 'uk.png' },
  'newlook.com': { favicon: 'newlook.ico', flagicon: 'uk.png' },
  'zalando.co.uk': { favicon: 'zalando.ico', flagicon: 'uk.png' },
  'zavvi.com': { favicon: 'zavvi.ico', flagicon: 'uk.png' },

  'amazon.ca': { favicon: 'amazon.ico', flagicon: 'ca.png' },
  'ebay.ca': { favicon: 'ebay.ico', flagicon: 'ca.png' },
  'apple.com/ca': { favicon: 'apple.ico', flagicon: 'ca.png' },
  'bestbuy.ca': { favicon: 'bestbuy.ico', flagicon: 'ca.png' },
  'canadiantire.ca': { favicon: 'canadiantire.ico', flagicon: 'ca.png' },

  'amazon.com.au': { favicon: 'amazon.ico', flagicon: 'au.png' },
  'ebay.com.au': { favicon: 'ebay.ico', flagicon: 'au.png' },
  'apple.com/au': { favicon: 'apple.ico', flagicon: 'au.png' },
  'appliancesonline.com.au': { favicon: 'appliancesonline.ico', flagicon: 'au.png' },
  'bigw.com.au': { favicon: 'bigw.ico', flagicon: 'au.png' },
  'harveynorman.com.au': { favicon: 'harveynorman.ico', flagicon: 'au.png' },
  'kogan.com': { favicon: 'kogan.ico', flagicon: 'au.png' },
  'vidaxl.com.au': { favicon: 'vidaxl.ico', flagicon: 'au.png' },
  'thegoodguys.com.au': { favicon: 'thegoodguys.ico', flagicon: 'au.png' },

  'amazon.de': { favicon: 'amazon.ico', flagicon: 'de.png' },
  'ebay.de': { favicon: 'ebay.ico', flagicon: 'de.png' },
  'apple.com/de': { favicon: 'apple.ico', flagicon: 'de.png' },
  'bonprix.de': { favicon: 'bonprix.ico', flagicon: 'de.png' },
  'euronics.de': { favicon: 'euronics.ico', flagicon: 'de.png' },
  'mediamarkt.de': { favicon: 'mediamarkt.ico', flagicon: 'de.png' },
  'notebooksbilliger.de': { favicon: 'notebooksbilliger.ico', flagicon: 'de.png' },
  'otto.de': { favicon: 'otto.ico', flagicon: 'de.png' },
  'saturn.de': { favicon: 'saturn.ico', flagicon: 'de.png' },
  'lidl.de': { favicon: 'lidl.ico', flagicon: 'de.png' },
  'zalando.de': { favicon: 'zalando.ico', flagicon: 'de.png' },

  'amazon.nl': { favicon: 'amazon.ico', flagicon: 'nl.png' },
  'ebay.nl': { favicon: 'ebay.ico', flagicon: 'nl.png' },
  'apple.com/nl': { favicon: 'apple.ico', flagicon: 'nl.png' },
  'bol.com': { favicon: 'bol.ico', flagicon: 'nl.png' },
  'bonprix.nl': { favicon: 'bonprix.ico', flagicon: 'nl.png' },
  'coolblue.nl': { favicon: 'coolblue.ico', flagicon: 'nl.png' },
  'debijenkorf.nl': { favicon: 'debijenkorf.ico', flagicon: 'nl.png' },
  'lidl.nl': { favicon: 'lidl.ico', flagicon: 'nl.png' },
  'mediamarkt.nl': { favicon: 'mediamarkt.ico', flagicon: 'nl.png' },
  'vidaxl.nl': { favicon: 'vidaxl.ico', flagicon: 'nl.png' },
  'wehkamp.nl': { favicon: 'wehkamp.ico', flagicon: 'nl.png' },
  'zalando.nl': { favicon: 'zalando.ico', flagicon: 'nl.png' },

  'amazon.fr': { favicon: 'amazon.ico', flagicon: 'fr.png' },
  'ebay.fr': { favicon: 'ebay.ico', flagicon: 'fr.png' },
  'apple.com/fr': { favicon: 'apple.ico', flagicon: 'fr.png' },
  'auchan.fr': { favicon: 'auchan.ico', flagicon: 'fr.png' },
  'bonprix.fr': { favicon: 'bonprix.ico', flagicon: 'fr.png' },
  'cdiscount.com': { favicon: 'cdiscount.ico', flagicon: 'fr.png' },
  'laredoute.fr': { favicon: 'laredoute.ico', flagicon: 'fr.png' },
  'lidl.fr': { favicon: 'lidl.ico', flagicon: 'fr.png' },
  'zalando.fr': { favicon: 'zalando.ico', flagicon: 'fr.png' },
  
  'amazon.it': { favicon: 'amazon.ico', flagicon: 'it.png' },
  'ebay.it': { favicon: 'ebay.ico', flagicon: 'it.png' },
  'apple.com/it': { favicon: 'apple.ico', flagicon: 'it.png' },
  'bonprix.it': { favicon: 'bonprix.ico', flagicon: 'it.png' },
  'euronics.it': { favicon: 'euronics.ico', flagicon: 'it.png' },
  'lidl.it': { favicon: 'lidl.ico', flagicon: 'it.png' },
  'mediaworld.it': { favicon: 'mediaworld.ico', flagicon: 'it.png' },
  'vidaxl.it': { favicon: 'vidaxl.ico', flagicon: 'it.png' },
  'zalando.it': { favicon: 'zalando.ico', flagicon: 'it.png' },
  
  'amazon.es': { favicon: 'amazon.ico', flagicon: 'es.png' },
  'ebay.es': { favicon: 'ebay.ico', flagicon: 'es.png' },
  'apple.com/es': { favicon: 'apple.ico', flagicon: 'es.png' },
  'electroking.es': { favicon: 'electroking.ico', flagicon: 'es.png' },
  'euronics.es': { favicon: 'euronics.ico', flagicon: 'es.png' },
  '101gigas.com': { favicon: '101gigas.ico', flagicon: 'es.png' },
  'lidl.es': { favicon: 'lidl.ico', flagicon: 'es.png' },
  'ulabox.com': { favicon: 'ulabox.ico', flagicon: 'es.png' },
  'zalando.es': { favicon: 'zalando.ico', flagicon: 'es.png' },
  
  'amazon.com.tr': { favicon: 'amazon.ico', flagicon: 'tr.png' },
  'apple.com/tr': { favicon: 'apple.ico', flagicon: 'tr.png' },
  'gittigidiyor.com': { favicon: 'gittigidiyor.ico', flagicon: 'tr.png' },
  'hepsiburada.com': { favicon: 'hepsiburada.ico', flagicon: 'tr.png' },
  'mediamarkt.com.tr': { favicon: 'mediamarkt.ico', flagicon: 'tr.png' },
  'n11.com': { favicon: 'n11.ico', flagicon: 'tr.png' },
  'teknosa.com': { favicon: 'teknosa.ico', flagicon: 'tr.png' },
  'trendyol.com': { favicon: 'trendyol.ico', flagicon: 'tr.png' },

  'walmart.ca': { favicon: 'walmart.ico', flagicon: 'ca.png' },
  'fnac.com': { favicon: 'fnac.ico', flagicon: 'fr.png' },
  'mediamarkt.es': { favicon: 'mediamarkt.ico', flagicon: 'es.png' },
  'eprice.it': { favicon: 'eprice.ico', flagicon: 'it.png' }
};

const notFound = {
  favicon: '/icon/not-found.png', flagicon: '/icon/not-found.png'
};

export default {

  find(domain) {
    if (domain) {
      const found = domains[domain];
      if (found) {
        return {
          favicon: `/icon/website/${found.favicon}`, flagicon: `/icon/flag/${found.flagicon}`
        };
      }
    }
    return notFound;
  }

};