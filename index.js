const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

// Register a specific font
registerFont(path.join(__dirname, 'OpenSans-Regular.ttf'), { family: 'Open Sans' });

// Function to clean avatar URL
const cleanAvatarUrl = (url) => {
    return url.replace(/(\.png|\.jpeg|\.jpg|\.webp)(\?.*)?$/, '$1');
};

app.get('/profile', async (req, res) => {
    let { username, avatarUrl } = req.query;

    if (!username || !avatarUrl) {
        return res.status(400).send('Missing username or avatarUrl');
    }

    // Clean the avatar URL
    avatarUrl = cleanAvatarUrl(avatarUrl);

    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#7289da';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load avatar
    const avatar = await loadImage(avatarUrl);
    ctx.drawImage(avatar, 25, 25, 200, 200);

    // Username
    ctx.font = 'bold 40px "Open Sans"';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(username, 250, 125);

    const buffer = canvas.toBuffer('image/png');
    res.set('Content-Type', 'image/png');
    res.send(buffer);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
