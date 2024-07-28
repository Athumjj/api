const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

// Register a specific font
registerFont(path.join(__dirname, 'OpenSans-Regular.ttf'), { family: 'Open Sans' });

// Function to clean avatar URL and convert to PNG
const convertToPng = (url) => {
    return url.replace(/(\.jpeg|\.jpg|\.webp)(\?.*)?$/, '.png');
};

app.get('/profile', async (req, res) => {
    let { username, avatarUrl } = req.query;

    if (!username || !avatarUrl) {
        return res.status(400).send('Missing username or avatarUrl');
    }

    // Convert avatar URL to PNG
    avatarUrl = convertToPng(avatarUrl);

    const canvas = createCanvas(640, 480);
    const ctx = canvas.getContext('2d');

    // Background
    const bgImage = await loadImage("https://cdn.discordapp.com/attachments/1256477881635442759/1267136493357367358/banner-bot.png?ex=66a7b052&is=66a65ed2&hm=37657b48b6154aa7332305288d490487425130b61ef2e184fc9ecb3efd81b8fb&");
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        

    try {
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
    } catch (error) {
        res.status(500).send('Error loading avatar image');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
