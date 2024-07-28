const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const app = express();
const port = process.env.PORT || 3000;

app.get('/profile', async (req, res) => {
    const { username, avatarUrl } = req.query;

    if (!username || !avatarUrl) {
        return res.status(400).send('Missing username or avatarUrl');
    }

    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#7289da';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load avatar
    const avatar = await loadImage(avatarUrl);
    ctx.drawImage(avatar, 25, 25, 200, 200);

    // Username
    ctx.font = 'bold 40px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(username, 250, 125);

    const buffer = canvas.toBuffer('image/png');
    res.set('Content-Type', 'image/png');
    res.send(buffer);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
