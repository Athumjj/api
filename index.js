const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const app = express();
const port = process.env.PORT || 3000;

// Função para desenhar um retângulo com cantos arredondados
function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

app.get('/profile', async (req, res) => {
    try {
        const { username, avatarUrl, bgColor, textColor, radius } = req.query;

        if (!username || !avatarUrl) {
            return res.status(400).send('Missing username or avatarUrl');
        }

        const canvas = createCanvas(700, 250);
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = bgColor || '#7289da';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        ctx.font = 'bold 40px sans-serif';
        ctx.fillStyle = textColor || '#ffffff';
        ctx.fillText(username, 250, 125);

        const buffer = canvas.toBuffer('image/png');
        res.set('Content-Type', 'image/png');
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating image');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
