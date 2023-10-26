const fs = require('graceful-fs');
// const fn = '/home/bobby/Desktop/jitt/jitt/src/enums/shipping.json';

// const lookup = [
//     { min: 0, max: 0.25, 'media-mail': { price: 4.3, carrier: 'USPS Media Mail', id: 1635 }, standard: { price: 4.3, carrier: 'USPS Ground Advantage', id: 1581 } },
//     { min: 0.25, max: 0.5, 'media-mail': { price: 4.3, carrier: 'USPS Media Mail', id: 1635 }, standard: { price: 4.99, carrier: 'USPS Ground Advantage', id: 1582 } },
//     { min: 0.5, max: 1, 'media-mail': { price: 4.3, carrier: 'USPS Media Mail', id: 1635 }, standard: { price: 7.4, carrier: 'USPS Ground Advantage', id: 1583 } },
//     { min: 1, max: 2, 'media-mail': { price: 5, carrier: 'USPS Media Mail', id: 1636 }, standard: { price: 7.99, carrier: 'UPS SurePost', id: 1661 } },
//     { min: 2, max: 3, 'media-mail': { price: 5.7, carrier: 'USPS Media Mail', id: 1637 }, standard: { price: 7.99, carrier: 'UPS SurePost', id: 1662 } },
//     { min: 3, max: 4, 'media-mail': { price: 6.4, carrier: 'USPS Media Mail', id: 1638 }, standard: { price: 10.59, carrier: 'UPS SurePost', id: 1663 } },
//     { min: 4, max: 5, 'media-mail': { price: 7.1, carrier: 'USPS Media Mail', id: 1639 }, standard: { price: 10.99, carrier: 'FedEx Ground Economy', id: 1580 } },
//     { min: 5, max: 6, 'media-mail': { price: 8.65, carrier: 'USPS Media Mail', id: 1640 }, standard: { price: 13.5, carrier: 'UPS Ground', id: 1610 } },
//     { min: 6, max: 7, 'media-mail': { price: 9.35, carrier: 'USPS Media Mail', id: 1641 }, standard: { price: 13.5, carrier: 'UPS Ground', id: 1611 } },
//     { min: 7, max: 8, 'media-mail': { price: 10.05, carrier: 'USPS Media Mail', id: 1642 }, standard: { price: 14, carrier: 'UPS Ground', id: 1612 } },
//     { min: 8, max: 9, 'media-mail': { price: 10.75, carrier: 'USPS Media Mail', id: 1643 }, standard: { price: 14, carrier: 'UPS Ground', id: 1613 } },
//     { min: 9, max: 10, 'media-mail': { price: 11.45, carrier: 'USPS Media Mail', id: 1644 }, standard: { price: 17.25, carrier: 'UPS Ground', id: 1614 } },
//     { min: 10, max: 11, 'media-mail': { price: 14.35, carrier: 'USPS Media Mail', id: 1645 }, standard: { price: 17.25, carrier: 'UPS Ground', id: 1615 } },
//     { min: 11, max: 12, 'media-mail': { price: 15.05, carrier: 'USPS Media Mail', id: 1646 }, standard: { price: 17.25, carrier: 'UPS Ground', id: 1616 } },
//     { min: 12, max: 13, 'media-mail': { price: 15.75, carrier: 'USPS Media Mail', id: 1647 }, standard: { price: 20, carrier: 'UPS Ground', id: 1617 } },
//     { min: 13, max: 14, 'media-mail': { price: 16.45, carrier: 'USPS Media Mail', id: 1648 }, standard: { price: 20, carrier: 'UPS Ground', id: 1618 } },
//     { min: 14, max: 15, 'media-mail': { price: 16.45, carrier: 'USPS Media Mail', id: 1649 }, standard: { price: 25, carrier: 'FedEx Home', id: 1565 } },
//     { min: 15, max: 16, 'media-mail': { price: 17.15, carrier: 'USPS Media Mail', id: 1650 }, standard: { price: 28, carrier: 'FedEx Home', id: 1566 } },
//     { min: 16, max: 17, 'media-mail': { price: 17.85, carrier: 'USPS Media Mail', id: 1651 }, standard: { price: 28, carrier: 'FedEx Home', id: 1567 } },
//     { min: 17, max: 18, 'media-mail': { price: 18.55, carrier: 'USPS Media Mail', id: 1652 }, standard: { price: 28, carrier: 'FedEx Home', id: 1568 } },
//     { min: 18, max: 19, 'media-mail': { price: 19.25, carrier: 'USPS Media Mail', id: 1653 }, standard: { price: 28, carrier: 'FedEx Home', id: 1569 } },
//     { min: 19, max: 20, 'media-mail': { price: 19.95, carrier: 'USPS Media Mail', id: 1654 }, standard: { price: 30, carrier: 'UPS Ground', id: 1624 } },
//     { min: 20, max: 30, standard: { price: 35, carrier: 'UPS Ground', id: 1625 } },
//     { min: 30, max: 40, standard: { price: 60, carrier: 'UPS Ground', id: 1626 } },
//     {
//         min: 40,
//         max: 50,
//         standard: { price: 85, carrier: 'UPS Ground', id: 1627 }
//     }
// ];

const fn = '/home/bobby/Desktop/jitt/jitt/src/enums/color-classes.json';

const lookup = {
    pink: 'bg-pink-500 text-white border-pink-900',
    orange: 'bg-orange-500 text-white border-orange-900',
    yellow: 'bg-yellow-500 text-black border-zinc-900',
    green: 'bg-lime-500 text-white border-emerald-900',
    white: 'bg-white text-black border-black',
    purple: 'bg-purple-500 text-white bg-violet-900',
    blue: 'bg-sky-500 text-white bg-blue-900'
}

fs.writeFileSync(fn, JSON.stringify(lookup, null, '\t'))