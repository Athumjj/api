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
    let { username, avatarUrl, fundoUrl } = req.query;

    if (!username || !avatarUrl || !fundoUrl) {
        return res.status(400).send('Missing username or avatarUrl');
    }

    // Convert avatar URL to PNG
    avatarUrl = convertToPng(avatarUrl);
    fundoUrl = convertToPng(fundoUrl);

    const canvas = createCanvas(1280, 720);
    const ctx = canvas.getContext('2d');

    // Background
    const fundo = await loadImage(fundoUrl);
    ctx.drawImage(fundo, 0, 0, canvas.width, canvas.height);
    const bgImage = await loadImage("https://cdn.discordapp.com/attachments/1232193462690910220/1267242641431724223/1722204575960.png?ex=66a8132d&is=66a6c1ad&hm=6e399f879a798488fdaf717e4832fea0ec47b9dadb0063bcbfc41e7e813a87bf&");
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    try {
        // Load avatar
        const avatar = await loadImage(avatarUrl);
        ctx.drawImage(avatar, 70, 35, 150, 150);

        const avatarMold = await loadImage("https://cdn.discordapp.com/attachments/1243775486514040934/1267246776709156928/281_Sem_Titulo_20240728192414.png?ex=66a81707&is=66a6c587&hm=1d177313e8983b8738ab57dc18b948d49876b1d07d2b9d0770b8f0029a6def48&");
        ctx.drawImage(avatarMold, 0, 0, canvas.width, canvas.height);
        
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
