const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('node:path');
const clubsService = require('../utilities/clubsService.js');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../static/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter, 
  limits: { fileSize: 5 * 1024 * 1024 }
});





router.get('/clubs', async (req, res) => {
  try {
    const clubs = await clubsService.loadClubs();
    const clubCount = clubs.length;
    res.render('clubs', { clubs, clubCount, title: 'Home' });
  } catch (error) {
    res.status(500).send('Error rendering data.');
  }
});

router.get('/', async (req, res) => {
  res.redirect('/clubs');
});

router.get('/clubs/create', async (req, res) => {
  try {
    res.render('createClub', { title: 'Create Club' });
  } catch (error) {
    res.status(500).send('Error rendering data.');
  }
});

router.post('/clubs/create', upload.single('logo'), async (req, res) => {
  let { name, shortName, tla, venue, address, website, email, founded } = req.body;
  try {
      if (name.length > 60) {
        return res.status(400).send('Club name cannot exceed 60 characters');
      }

      if (shortName.length > name.length) {
        return res.status(400).send('Club short name cannot be longer than the name');
      }
  
      const tlaRegex = /^[A-Za-z]{3}$/;
      if (!tlaRegex.test(tla)) {
        return res.status(400).send('TLA must be exactly 3 alphabetical characters');
      }


      if (venue.length > 60) {
        return res.status(400).send('Stadium name cannot exceed 60 characters');
      }

      if (address.length > 200) {
        return res.status(400).send('Address cannot exceed 60 characters');
      }

      if (website.length > 60) {
        return res.status(400).send('Website cannot exceed 60 characters');
      }

      if (email.length > 60) {
        return res.status(400).send('Email cannot exceed 60 characters');
      }

      if (founded.length > 4) {
        return res.status(400).send('Founded year is invalid');
      }

      if(!website) {
        website = "N/A";
      }

      if(!founded) {
        founded = "N/A";
      }

      let crestUrl;
      if (req.file) {
        crestUrl = `/uploads/${req.file.filename}`;
      } else {
        crestUrl = `/uploads/defaultLogo.png`;
      }

      const newClub = {
          name,
          tla,
          venue,
          address,
          website,
          email,
          founded,
          crestUrl
      };
      await clubsService.addClub(newClub);
      res.redirect('/clubs');
  } catch (error) {
      res.status(500).send('Error adding new club.');
  }
});

router.get('/clubs/:id/edit', async (req, res) => {
  try {
    const clubID = parseInt(req.params.id);
    const club = await clubsService.getClubInfo({id: clubID});
    if (club) {
      res.render('editClub', { club, title: 'Edit club'});
    } else {
      res.status(404).send('Club not found');
    }
  } catch (error) {
    res.status(500).send('Error editing club')
  }
});

router.post('/clubs/:id/edit', upload.single('logo'), async (req, res) => {
  let { name, shortName, tla, venue, address, website, email, founded } = req.body;
  try {
    if (name.length > 60) {
      return res.status(400).send('Club name cannot exceed 60 characters');
    }

    if (shortName.length > name.length) {
      return res.status(400).send('Club short name cannot be longer than the name');
    }

    const tlaRegex = /^[A-Za-z]{3}$/;
    if (!tlaRegex.test(tla)) {
      return res.status(400).send('TLA must be exactly 3 alphabetical characters');
    }


    if (venue.length > 60) {
      return res.status(400).send('Stadium name cannot exceed 60 characters');
    }

    if (address.length > 200) {
      return res.status(400).send('Address cannot exceed 60 characters');
    }

    if (website.length > 60) {
      return res.status(400).send('Website cannot exceed 60 characters');
    }

    if (email.length > 60) {
      return res.status(400).send('Email cannot exceed 60 characters');
    }

    if (founded.length > 4) {
      return res.status(400).send('Founded year is invalid');
    }

    let crestUrl;
    if (req.file) {
      crestUrl = `/uploads/${req.file.filename}`;
    } else {
      crestUrl = req.body.currentLogo;
    }

    const newInfo = {
      id: parseInt(req.params.id),
      name,
      shortName,
      tla,
      crestUrl,
      address,
      website,
      email,
      founded,
      venue
    };

    await clubsService.editClub(newInfo);
    res.redirect('/clubs');
  } catch (error) {
    console.error('Error editing club:', error);
    res.status(500).send(`Error editing ${name} club.`);
  }
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
