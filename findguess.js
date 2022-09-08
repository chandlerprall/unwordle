module.exports = function findGuess(possibleWords) {
    // build a map of letter:occurances
    const charOccurances = {};
    for (let i = 0; i < possibleWords.length; i++) {
        const word = possibleWords[i];
        for (j = 0; j < word.length; j++) {
            const char = word[j];
            if (charOccurances.hasOwnProperty(char)) {
                charOccurances[char]++;
            } else {
                charOccurances[char] = 1;
            }
        }
    }

    // find error of each possible word
    const targetOccurance = possibleWords.length / 2;
    const wordErrors = possibleWords.map(word => {
        let error = 0;
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            const charOccurance = charOccurances[char] || 0;
            const charError = charOccurance === 0 ? Infinity : Math.abs(targetOccurance - charOccurance);
            error += charError;
            if (word.indexOf(char) !== i) error *= 2; // penalize repeated letters by 200%
        }
        return [word, error];
    });
    wordErrors.sort((a, b) => {
        return a[1] - b[1];
    });

    return wordErrors[0][0];
}
