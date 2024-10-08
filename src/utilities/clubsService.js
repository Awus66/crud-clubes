const fs = require('node:fs/promises');
const path = require('node:path');
const uploadDirectory = path.join(__dirname, '../../static/uploads');

async function loadClubs() {
  try {
    const data = await fs.readFile(path.join(__dirname, '../data', 'equipos.db.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading file:', error);
  }
}


async function saveClubs(clubs) {
    try {
      const data = JSON.stringify(clubs, null, 2);
      await fs.writeFile(path.join(__dirname, '../data', 'equipos.db.json'), data, 'utf8');
    } catch (error) {
      console.error('Error writing file:', error);
    }
}


async function addClub(newClub) {
    const clubs = await loadClubs();

    if (clubs.length > 0) {
        newClub.id = clubs[clubs.length - 1].id + 1;
    } else {
        newClub.id = 1;
    }
    clubs.push(newClub);
    await saveClubs(clubs);

}


async function removeClub(club) {
    const clubs = await loadClubs();
    const index = clubs.findIndex(c => c.id === club.id);

    if (index === -1) {
        throw new Error('Club not found');
    }

    const logoPath = path.join(uploadDirectory, path.basename(clubs[index].crestUrl));

    try {
        await fs.unlink(logoPath);
        console.log(`Logo file ${logoPath} deleted successfully`);
    } catch (err) {
        console.error(`Error deleting logo file: ${err.message}`);
    }

    clubs.splice(index, 1);
    await saveClubs(clubs);
}


async function editClub(newInfo) {
  const clubs = await loadClubs();
  const index = clubs.findIndex(c => c.id === newInfo.id);

  if (index === -1) {
      throw new Error('Club not found');
  }
  clubs[index].name = newInfo.name;
  clubs[index].tla = newInfo.tla;
  clubs[index].venue = newInfo.venue;
  clubs[index].crestUrl = newInfo.crestUrl;
  await saveClubs(clubs);
}


async function getClubInfo(club) {
  try {
      const filePath = path.join(__dirname, '../data',  'equipos.db.json');
      const data = await fs.readFile(filePath, 'utf8');
      const clubs = JSON.parse(data);
      
      const clubInfo = clubs.find(c => c.id === club.id);

      if (clubInfo) {
          return clubInfo;
      } else {
          throw new Error('Club not found');
      }
  } catch (error) {
      console.error('Error obtaining data from club:', error);
      return null;
  }
}

module.exports = {
  loadClubs,
  addClub,
  removeClub,
  editClub,
  getClubInfo
};
