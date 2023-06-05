const express = require('express');
const axios = require('axios');

const app = express();

app.get('/books', async (req, res) => {
  try {
    const { q } = req.query;
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q,
      },
    });
    const books = response.data.items;
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
