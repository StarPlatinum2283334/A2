// Модуль генерации случайных паролей
// Использует криптографически безопасный генератор CSPRNG

// Криптографически безопасный генератор случайных чисел
function secureRandom(max) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return (arr[0] / (0xffffffff + 1)) * max;
}

// Генерация случайного пароля
function generateRandomPassword(length, options) {
    const {
        uppercase = true,
        lowercase = true,
        numbers = true,
        symbols = true
    } = options;
    
    let charset = '';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$%^&*()_+-=[]{};:,.<>?';
    
    if (charset === '') {
        charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(secureRandom(charset.length));
        password += charset[randomIndex];
    }
    
    return password;
}

// Генерация пароля с гарантированным включением всех типов символов
function generateBalancedPassword(length, options) {
    const { uppercase = true, lowercase = true, numbers = true, symbols = true } = options;
    
    const pools = [];
    if (uppercase) pools.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if (lowercase) pools.push('abcdefghijklmnopqrstuvwxyz');
    if (numbers) pools.push('0123456789');
    if (symbols) pools.push('!@#$%^&*()_+-=[]{};:,.<>?');
    
    if (pools.length === 0) {
        return generateRandomPassword(length, { uppercase: true, lowercase: true, numbers: true, symbols: true });
    }
    
    let password = '';
    
    // Гарантированно добавляем по одному символу из каждого выбранного пула
    for (let i = 0; i < pools.length && i < length; i++) {
        const pool = pools[i % pools.length];
        password += pool[Math.floor(secureRandom(pool.length))];
    }
    
    // Заполняем оставшиеся символы случайно из всех пулов
    const allChars = pools.join('');
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(secureRandom(allChars.length))];
    }
    
    // Перемешиваем для случайного порядка
    return password.split('').sort(() => secureRandom(1) - 0.5).join('');
}

// Расчет энтропии сгенерированного пароля
function calculatePasswordEntropy(password) {
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/\d/.test(password)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
    return Math.log2(charsetSize) * password.length;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateRandomPassword, generateBalancedPassword, calculatePasswordEntropy, secureRandom };
}
