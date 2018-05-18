import LocalizedStrings from './LocalizedStrings';

const Strings = new LocalizedStrings({
    en: {
        theaterName: 'Grand Theater',
        welcome: 'Welcome to Grand Theater',
        welcomePerformanceDateTime: '{0} ... {1} at {2}',
        listOfShows: 'List of all Shows',
        shows: 'Season',
        show: 'Show',
        tickets: 'Tickets',
        visit: 'Your Visit',
        about: 'About',
        stage: 'Stage',
        seatInfo: 'All about this seat',
        row: 'Row',
        seat: 'Seat',
        sold: '(unfortunately sold)',
        price: 'Price',
        total: 'Total',
        ticket: 'Ticket',
        select: 'Please use the seating chart to select tickets.',
        buy: 'Buy tickets',
        checkout: 'Checkout',
        date: 'Date',
        time: 'Time',
        O: 'Orchestra',
        G: 'Grand Tier',
        LO: 'Box',
        D: 'Dress Circle',
        B: 'Balcony',
        F: 'Family Circle',
        BA: 'Block A',
        BB: 'Block B',
        BC: 'Block C',
        BD: 'Block D',
        BE: 'Block E',
        BF: 'Block F',
        BG: 'Block G',
        BH: 'Block H',
        BK: 'Block K',
        L: 'left',
        M: 'center',
        R: 'right'
    },
    de: {
        theaterName: 'Großes Theater',
        welcome: 'Willkommen im Großen Theater',
        welcomePerformanceDateTime: '{0} ... {1} um {2} Uhr',
        listOfShows: 'Akuelle Produktionen des Großen Theaters',
        shows: 'Produktionen',
        show: 'Produktion',
        tickets: 'Karten',
        visit: 'Ihr Besuch',
        about: 'Info',
        stage: 'Bühne',
        seatInfo: 'Informationen zum Sitzplatz',
        row: 'Reihe',
        seat: 'Sitz',
        sold: '(leider schon verkauft)',
        price: 'Preis',
        total: 'Gesamtpreis',
        ticket: 'Sitzplatz',
        select: 'Wählen Sie bitte die gewünschten Plätze im Sitzplan aus.',
        buy: 'Karten kaufen',
        checkout: 'Bezahlen',
        date: 'Datum',
        time: 'Uhrzeit',
        O: 'Parkett',
        G: '1. Rang',
        LO: 'Loge',
        D: '2. Rang',
        B: '3. Rang',
        F: '4. Rang',
        L: 'links',
        M: 'mitte',
        R: 'rechts'
    }
});

Strings.setLanguage('en');

export default Strings;