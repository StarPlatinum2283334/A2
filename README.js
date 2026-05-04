// Генерация случайного пароля из выбранных символов (криптостойкая)
    function generateRandomPassword() {
        const length = parseInt(passwordLengthSlider.value);
        let passwordChars = [];
        
        const sets = [];
        if (lowercaseCheck.checked) sets.push('abcdefghijklmnopqrstuvwxyz');
        if (uppercaseCheck.checked) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        if (numbersCheck.checked) sets.push('0123456789');
        if (symbolsCheck.checked) sets.push('!@#$%^&*()_+-=[]{};:,.<>?');
        
        if (sets.length === 0) {
            sets.push('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*');
        }
        
        sets.forEach(set => {
            passwordChars.push(secureRandomChar(set));
        });
        
        const allChars = sets.join('');
        while (passwordChars.length < length) {
            passwordChars.push(secureRandomChar(allChars));
        }
        
        for (let i = passwordChars.length - 1; i > 0; i--) {
            const j = secureRandomInt(i + 1);
            [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
        }
        
        return passwordChars.join('');
    }
    
    function handleGenerate() {
        const newPassword = generateRandomPassword();
        generatedPasswordSpan.textContent = newPassword;
        generatedContainer.style.display = 'block';
    }
