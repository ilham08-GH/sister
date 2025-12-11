// hash_generator.js
const bcrypt = require('bcryptjs');

async function generateHash(password) {
    // Gunakan salt 10, sama seperti standar yang kita gunakan
    const salt = await bcrypt.genSalt(10); 
    const hash = await bcrypt.hash(password, salt);
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
}

// Ganti '123' dengan password yang ingin Anda gunakan
generateHash('123');