A wordle solver.

### Interactive version

Most useful for authoring & debugging the algorithm. You can hard code an answer in [_unwordle_manual.js:15_](https://github.com/chandlerprall/unwordle/blob/main/unwordle_manual.js#L15), or uncomment [lines 11-13](https://github.com/chandlerprall/unwordle/blob/main/unwordle_manual.js#L11-L13) & comment out [lines 15-20](https://github.com/chandlerprall/unwordle/blob/main/unwordle_manual.js#L15-L20) to make the script prompt for the result of a guess. The format for the response is `[number, number, number, number, number] | null`, where `0` represents the letter is absent, `1` means the letter exists but in a different location, and `2` indicates right letter right place; `null` indicates the guessed word is not in the wordle dictionary and a new guess should be made.

#### Hard coded

Given a [hard coded answer of `prize`](https://github.com/chandlerprall/unwordle/blob/main/unwordle_manual.js#L15):

```
$ node unwordle_manual.js
There are 5757 possible words, guessing arose
There are 27 possible words, guessing tripe
There are 4 possible words, guessing prime
There are 3 possible words, guessing price
There are 2 possible words, guessing pride
There are 1 possible words, guessing prize

Found prize in 6 tries 🤗
```

#### Interactive

By switching to the interactive version we can pick a word and make the script guess. Sticking with `prize` from the previous run:

```
$ node unwordle_manual.js
There are 5757 possible words, guessing arose
Guess is arose , please enter its score array:[0,2,0,0,2]
There are 27 possible words, guessing tripe
Guess is tripe , please enter its score array:[0,2,2,1,2]
There are 4 possible words, guessing prime
Guess is prime , please enter its score array:[2,2,2,0,2]
There are 3 possible words, guessing price
Guess is price , please enter its score array:[2,2,2,0,2]
There are 2 possible words, guessing pride
Guess is pride , please enter its score array:[2,2,2,0,2]
There are 1 possible words, guessing prize
Guess is prize , please enter its score array:[2,2,2,2,2]

Found prize in 6 tries 🤗
```

### Histogram

To test how changes to algorithm & heuristic affects the results, `node histogram` runs the solver against the entire word list and creates a histogram of how many guesses it takes to find that word.

Currently it looks like this, with 92.84% of words found within 6 guesses.
```
 1  0.017%
 2 ▒▒ 2.5%
 3 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 24%
 4 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 38%
 5 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ 19%
 6 ▒▒▒▒▒▒▒▒ 8.4%
 7 ▒▒▒ 3.7%
 8 ▒ 1.8%
 9  0.83%
10  0.38%
11  0.10%
12  0.035%
```

### Automation

Uses puppeteer to load and solve the daily wordle 

* use npm or yarn to install dependencies
* run `node unwordle` to launch puppeteer and watch the daily wordle be solved
* recordings are saved to `./recordings`

### Other

5wordlist.txt is from https://www-cs-faculty.stanford.edu/~knuth/sgb-words.txt
