const findAnswer = require('./findanswer');

// Run guesses for one word
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
findAnswer(
    (guess) => {
        return new Promise(resolve => {
            // readline.question(`Guess is ${guess} , please enter its score array:`, score => {
            //     resolve(JSON.parse(score));
            // });

            const answer = 'prize';
            resolve(guess.split('').map((char, idx) => {
                if (char === answer[idx]) return 2;
                if (answer.indexOf(char) !== -1) return 1;
                return 0;
            }));
        });
    }
).then(([answer, guesses]) => console.log(`\nFound ${answer} in ${guesses} tries 🤗`)).catch(e => console.error(e)).finally(() => readline.close());
