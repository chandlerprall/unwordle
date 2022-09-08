const { readFileSync } = require('fs');
const findAnswer = require('./findanswer');

const words = readFileSync('5wordlist.txt', 'utf-8').split(/[\r\n]+/).filter(x => x.length > 0).map(x => x.toLowerCase());

// Build a histogram of all guesses for all words in the list
(async function() {
    let answer;
    const stats = {};

    for (let i = 0; i < words.length; i++) {
        answer = words[i];

        const [, guesses] = await findAnswer(guess => {
            return new Promise(resolve => {
                resolve(guess.split('').map((char, idx) => {
                    if (char === answer[idx]) return 2;
                    if (answer.indexOf(char) !== -1) return 1;
                    return 0;
                }));
            });
        });

        if (stats.hasOwnProperty(guesses)) {
            stats[guesses] += 1;
        } else {
            stats[guesses] = 1;
        }
    }

    const largestGuesses = Object.keys(stats).map(x => parseInt(x, 10)).sort((a, b) => b - a)[0];
    const guessesTotal = Object.values(stats).reduce((guesses, total) => guesses + total, 0);
    const largestGuessesLength = largestGuesses.toString().length;
    for (let i = 0; i < largestGuesses; i++) {
        const guesses = i + 1;
        const guessesCount = stats[guesses] || 0;
        const percentage = guessesCount / guessesTotal;

        console.log(
            guesses.toString().padStart(largestGuessesLength, ' '),
            ''.padStart(percentage * 100, '▒'),
            `${(percentage*100).toPrecision(2)}%`
        );
    }
})();
