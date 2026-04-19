
const { CrunchyrollClient } = require('crunchy-api');
const fs = require('fs');
const cookie = JSON.parse(fs.readFileSync('cookie.json', 'utf8')).cookie || JSON.parse(fs.readFileSync('cookie.json', 'utf8')).crunchyrollCookie;
(async () => {
  const client = new CrunchyrollClient(); 
  await client.authenticateWithRtCookie({ cookie });
  const d = await client.getWatchHistory({ page_size: 1, page: 1 });
  console.log(JSON.stringify(d.data[0].panel ? d.data[0].panel.images : d.data[0].images, null, 2));
})();

