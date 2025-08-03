const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeLegistarMeetings() {
  const url = 'https://princetonnj.legistar.com/Calendar.aspx';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const meetings = [];
  // Find the table with upcoming meetings
  $('table#ctl00_ContentPlaceHolder1_gridUpcomingMeetings_ctl00').find('tr').each((i, el) => {
    // Skip header row
    if (i === 0) return;
    const tds = $(el).find('td');
    if (tds.length < 6) return;
    const name = $(tds[0]).text().trim();
    const date = $(tds[1]).text().trim();
    const time = $(tds[3]).text().trim();
    const location = $(tds[4]).text().trim();
    const detailsLink = $(tds[5]).find('a').attr('href');
    const agendaLink = $(tds[6]).find('a').attr('href');
    const minutesLink = $(tds[10]).find('a').attr('href');
    meetings.push({
      name,
      date,
      time,
      location,
      detailsLink: detailsLink ? `https://princetonnj.legistar.com/${detailsLink}` : null,
      agendaLink: agendaLink ? `https://princetonnj.legistar.com/${agendaLink}` : null,
      minutesLink: minutesLink ? `https://princetonnj.legistar.com/${minutesLink}` : null,
    });
  });
  return meetings;
}

async function main() {
  const municipality = {
    name: 'Princeton',
    state: 'NJ',
    zipCode: '08540',
    population: 31000,
    latitude: 40.3573,
    longitude: -74.6672,
    slug: 'princeton-nj',
  };
  // Budget info (manually entered for now)
  const budget = {
    year: 2024,
    totalBudget: 70000000, // Example value
    categories: [
      { name: 'Public Safety', amount: 18000000 },
      { name: 'Public Works', amount: 12000000 },
      { name: 'Health & Human Services', amount: 8000000 },
      { name: 'Parks & Recreation', amount: 4000000 },
      { name: 'General Government', amount: 9000000 },
      { name: 'Other', amount: 19000000 },
    ],
  };
  const meetings = await scrapeLegistarMeetings();
  const output = { municipality, budget, meetings };
  fs.writeFileSync(__dirname + '/princeton_data.json', JSON.stringify(output, null, 2));
  console.log('Scraped and saved to scripts/princeton_data.json');
}

main(); 