const findGuess = require("./findguess");
const { readFileSync } = require("fs");

const words = readFileSync('5wordlist.txt', 'utf-8').split(/[\r\n]+/).filter(x => x.length > 0).map(x => x.toLowerCase());

module.exports = async function findAnswer(makeGuess) {
    let possibleWords = [...words];
    const knownPositions = []; // string[]
    knownPositions.length = words[0].length; // with length matching words
    const knownNotPositions = {}; // { [key: number]: string }
    const notPresent = new Set(); // Set<string>

    let guesses = 0;

    while (true) {
        const guess = findGuess(possibleWords);
        console.log(`There are ${possibleWords.length} possible words, guessing ${guess}`);

        const result = await makeGuess(guess, guesses);
        if (result == null) {
            // the guess wasn't accepted
            console.log(`\tThat guess wasn't accepted, trying again`);
            possibleWords = possibleWords.filter(word => word !== guess);
            continue;
        }
        guesses += 1;

        for (let i = 0; i < result.length; i++) {
            const char = guess[i];
            const charResult = result[i];

            if (charResult === 0) {
                // not present
                notPresent.add(char);
            } else if (charResult === 1) {
                // present, wrong position
                if (knownNotPositions.hasOwnProperty(i)) {
                    knownNotPositions[i].push(char);
                } else {
                    knownNotPositions[i] = [char];
                }
            } else {
                // exactly right
                knownPositions[i] = char;
            }
        }

        // do we have the answer now?
        if (knownPositions.filter(x => !!x).length === result.length) return [knownPositions.join(''), guesses];

        // update the possible words
        const matchesRe = buildMatchesRegex(possibleWords[0].length, knownPositions, knownNotPositions);
        possibleWords = possibleWords.filter(word => {
            // does it contain incorrect letters?
            for (let i = 0; i < word.length; i++) {
                const char = word[i];
                if (notPresent.has(char)) return false;
            }

            // does it contain required letters? (knownNotPositions only, the following regex ensures known positions are covered)
            const lettersWeNeed = Array.from(new Set(Object.values(knownNotPositions).reduce((arr, item) => [...arr, ...item], [])));
            for (let i = 0; i < lettersWeNeed.length; i++ ) {
                const letter = lettersWeNeed[i];
                if (word.indexOf(letter) === -1) return false;
            }

            // does it match the known letters data?
            if (!word.match(matchesRe)) return false;

            // could be our winner
            return true;
        });

        if (possibleWords.length === 0) {
            console.log('Answer does not exist in the word list 😟');
            process.exit(1);
        }
    }
}

function buildMatchesRegex(length, knownPositions, knownNotPositions) {
    let regex = '';
    for (let i = 0; i < length; i++) {
        if (knownPositions[i]) {
            // we know it has to be this letter
            regex += knownPositions[i];
        } else if (knownNotPositions.hasOwnProperty(i)) {
            regex += `[^${knownNotPositions[i].join('')}]`;
        } else {
            // could be anything
            regex += '.';
        }
    }

    return new RegExp(regex);
}
