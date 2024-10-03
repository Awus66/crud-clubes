const express = require('express');
const router = express.Router();
const clubsService = require('../utilities/clubsService.js');


router.get('/clubs', async (req, res) => {
  try {
    const clubs = await clubsService.loadClubs();
    res.render('clubs', { clubs, title: 'Home' });
  } catch (error) {
    res.status(500).send('Error rendering data.');
  }
});

router.get('/', async (req, res) => {
  res.redirect('/clubs');
});

router.get('/clubs/:id', async (req, res) => {
  try {
    const clubID = parseInt(req.params.id);
    const club = await clubsService.getClubInfo({id: clubID});
    if (club) {
      res.render('viewClub', { club, title: club.name });
    } else {
      res.status(404).send('Club not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching club info')
  }
});

router.get('/clubs/create', async (req, res) => {
  try {
    res.render('createClub', { title: 'Create Club' });
  } catch (error) {
    res.status(500).send('Error rendering data.');
  }
});

router.post('/clubs/create', async (req, res) => {
  try {
    await clubsService.addClub(req.body);
    res.redirect('/clubs');
  } catch (error) {
    res.status(500).send('Error adding new club.');
  }
});

router.delete('/clubs/:id', async (req, res) => {
  try {
    const clubID = parseInt(req.params.id);
    await clubsService.removeClub({ id: clubID });
    res.status(200).json({ message: 'Club deleted successfully' });
  } catch (error) {
    res.status(500).send('Error removing club.');
  }
});

module.exports = router;
