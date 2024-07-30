const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

// Register a specific font
registerFont(path.join(__dirname, 'fonte.ttf'), { family: 'Open Sans' });

// Function to clean avatar URL and convert to PNG
const convertToPng = (url) => {
    return url.replace(/(\.jpeg|\.jpg|\.webp)(\?.*)?$/, '.png');
};

app.get('/profile', async (req, res) => {
    let { username, idioma, sobreMim, avatarUrl } = req.query;

    if (!username || !idioma || !sobreMim || !avatarUrl) {
        return res.status(400).send('Missing username or idioma or sobreMim or avatarUrl');
    }

    // Convert avatar URL to PNG
    avatarUrl = convertToPng(avatarUrl);

    const canvas = createCanvas(1280, 720);
    const ctx = canvas.getContext('2d');

    // Background
    const fundo = await loadImage(path.join(__dirname, 'image/banner-bot.png'));
    ctx.drawImage(fundo, 0, 0, canvas.width,  canvas.height);
    
    const bgImage = await loadImage(path.join(__dirname, 'image/bg.png'));
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    try {
        // Load avatar
        const avatar = await loadImage(avatarUrl);
        ctx.drawImage(avatar, 70, 35, 150, 150);

        const avatarMold = await loadImage(path.join(__dirname, 'image/avatarMold.png'));
        ctx.drawImage(avatarMold, 0, 0, canvas.width, canvas.height);

        // Username
        let sobremim = null;
        let name = null;
        if (idioma === "en") {
            sobremim = "About me:";
        }else if (idioma === "pt") {
            sobremim = "Sobre mim:";
        }else if (idioma === "esp") {
            sobremim = "Sobre mi:";
        }
        ctx.font = 'bold 30px "Open Sans"';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sobremim, canvas.width / 2, 633);

        ctx.font = 'bold 30px "Open Sans"';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sobreMim, canvas.width / 2, 670);
        
        ctx.font = 'bold 50px "Open Sans"';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(name, 250, 110);

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
