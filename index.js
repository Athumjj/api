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
    const bgImage = await loadImage("https://cdn.discordapp.com/attachments/1232193462690910220/1267217261324926987/1722198522903.png?ex=66a7fb8a&is=66a6aa0a&hm=b286a1e55391e43d0cd2e7e9d9a90818249a01c644bf68e9041bbc70bbf3843f&");
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    try {
        // Load avatar
        const avatar = await loadImage(avatarUrl);
        ctx.drawImage(avatar, 25, 25, 200, 200);
        
        // Username
        ctx.font = 'bold 40px "Open Sans"';
        ctx.fillStyle = '#000000';
        ctx.fillText(username, 258, 105);

        const avatarMold = await loadImage("https://cdn.discordapp.com/attachments/1256477881635442759/1267151272520187984/280_Sem_Titulo_20240728130335.png?ex=66a7be15&is=66a66c95&hm=abafa951cf186843fc7928e6a2448feeffb96080f8e1b8b6a526111462974a23&");
        ctx.drawImage(avatarMold, 0, 0, canvas.width, canvas.height);

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
