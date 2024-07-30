const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

// Register fonts
const fontPath = path.join(__dirname, 'font/fonte.ttf');
const emojiFontPath = path.join(__dirname, 'font/emoji.ttf');
registerFont(fontPath, { family: 'Open Sans' });
registerFont(emojiFontPath, { family: 'Emoji' });

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

    try {
        // Load images
        const fundo = await loadImage(path.join(__dirname, 'image/banner-bot.png'));
        const bgImage = await loadImage(path.join(__dirname, 'image/bg.png'));
        const avatar = await loadImage(avatarUrl);
        const avatarMold = await loadImage(path.join(__dirname, 'image/avatarMold.png'));

        // Draw background and avatar
        ctx.drawImage(fundo, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(avatar, 70, 35, 150, 150);
        ctx.drawImage(avatarMold, 0, 0, canvas.width, canvas.height);

        // Define texts based on language
        let sobremim = '';
        let name = '';

        if (idioma === "en") {
            sobremim = "About me:";
            name = username + " 🇺🇸";
        } else if (idioma === "pt") {
            sobremim = "Sobre mim:";
            name = username + " 🇧🇷";
        } else if (idioma === "esp") {
            sobremim = "Sobre mi:";
            name = username + " 🇪🇸";
        }

        // Draw text
        ctx.font = 'bold 30px "Open Sans"';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sobremim, canvas.width / 2, 633);
        ctx.fillText(sobreMim, canvas.width / 2, 670);

        ctx.font = 'bold 50px "Emoji"';
        ctx.textAlign = 'left';
        ctx.fillText(name, 250, 110);

        // Send the image as response
        const buffer = canvas.toBuffer('image/png');
        res.set('Content-Type', 'image/png');
        res.send(buffer);
    } catch (error) {
        console.error('Error loading image:', error);
        res.status(500).send('Error loading images or processing request');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
