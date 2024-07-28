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
    const bgImage = await loadImage("https://cdn.discordapp.com/attachments/1256477881635442759/1267136493357367358/banner-bot.png?ex=66a7b052&is=66a65ed2&hm=37657b48b6154aa7332305288d490487425130b61ef2e184fc9ecb3efd81b8fb&");
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    try {
        // Load avatar
    const avatar = await loadImage(avatarUrl);
    const avatarX = 25;
    const avatarY = 25;
    const avatarWidth = 200;
    const avatarHeight = 200;
    const cornerRadius = parseInt(radius) || 50; // Default radius to 50 if not provided

    // Create a clipping mask for the avatar with rounded corners
    ctx.save();
    drawRoundedRect(ctx, avatarX, avatarY, avatarWidth, avatarHeight, cornerRadius);
    ctx.clip();

    // Draw avatar
    ctx.drawImage(avatar, avatarX, avatarY, avatarWidth, avatarHeight);

    // Restore the context to stop clipping
    ctx.restore();
        
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
