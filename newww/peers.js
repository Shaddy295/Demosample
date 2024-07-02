const express = require('express');
const router = express.Router();
const { fetchDataFromMongo, collectionNames } = require('../services/fetchService'); // Ensure this path is correct

router.get('/', async (req, res) => {
    console.log("hijisxnkm")
    const ticker = req.query.keyword; // Assuming you're passing keyword in query params
    console.log(ticker)
    if (!ticker) {
        return res.status(400).json({ error: 'Ticker symbol is required' });
    }

    try {
        const query = { ticker: ticker.toUpperCase() };
        const peerData = await fetchDataFromMongo(collectionNames.peers, query);
        console.log(peerData)
        if (peerData.length === 0) {
            return res.status(404).json({ error: 'No peer data found for this ticker' });
        }

        res.json(peerData);
    } catch (error) {
        console.error('Error fetching peer data:', error);
        res.status(500).json({ error: 'An error occurred while fetching peer data' });
    }
});

module.exports = router;
