const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

// Register a specific font
registerFont(path.join(__dirname, 'Fonte.otf'), { family: 'Open Sans' });

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

    const canvas = createCanvas(1280, 720);
    const ctx = canvas.getContext('2d');

    // Background
    const bgImage = await loadImage("https://cdn.discordapp.com/attachments/1232193462690910220/1267238181422633041/1722203503137.png?ex=66a80f06&is=66a6bd86&hm=2ee13440a861819bbde1bb03668885bb18025b1984490ff2bef621845bfe9944&");
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    try {
        // Load avatar
        const avatar = await loadImage(avatarUrl);
        ctx.drawImage(avatar, 50, 50, 138, 138);
        
        // Username
        ctx.font = 'bold 50px "Open Sans"';
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
