const base_search_params = new URLSearchParams(document.location.search);

const runtime = {'words_amount':2,'word_spacer':' ', 'auto-copy':false, 'current_words':[],'uppercase':false,'saved_words':[]};

const keys = {"0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,"9":57,"backspace":8,"tab":9,"enter":13,"shift":16,"ctrl":17,"alt":18,"pausebreak":19,"capslock":20,"esc":27,"space":32,"pageup":33,"pagedown":34,"end":35,"home":36,"leftarrow":37,"uparrow":38,"rightarrow":39,"downarrow":40,"print_screen":44,"insert":45,"delete":46,"a":65,"b":66,"c":67,"d":68,"e":69,"f":70,"g":71,"h":72,"i":73,"j":74,"k":75,"l":76,"m":77,"n":78,"o":79,"p":80,"q":81,"r":82,"s":83,"t":84,"u":85,"v":86,"w":87,"x":88,"y":89,"z":90,"leftwindowkey":91,"rightwindowkey":92,"selectkey":93,"numpad0":96,"numpad1":97,"numpad2":98,"numpad3":99,"numpad4":100,"numpad5":101,"numpad6":102,"numpad7":103,"numpad8":104,"numpad9":105,"multiply":106,"add":107,"subtract":109,"decimalpoint":110,"divide":111,"f1":112,"f2":113,"f3":114,"f4":115,"f5":116,"f6":117,"f7":118,"f8":119,"f9":120,"f10":121,"f11":122,"f12":123,"numlock":144,"scrolllock":145,"semicolon":186,"equalsign":187,"comma":188,"dash":189,"period":190,"forwardslash":191,"graveaccent":192,"openbracket":219,"backslash":220,"closebracket":221,"singlequote":222};

const templates = {
    'wordElement':`%WORD%%SPACER%`,
    'output_template':'',
    'wordsaveTemplate': `<div class="wordsave" index="%INDEX%"><span>%WORD%</span><button class="del-wordsave" alt="Delete Saved Word" title="Delete">🞮</button><button class="copy-wordsave" alt="Copy Saved Word" title="Copy" onclick="copyText(`+'`%WORD%`'+`); summonCopyToast(event);">❏</button></div>`
};

var words;

let wordsList = document.querySelector('#words-list');

const savedWords = document.querySelector('#saved-words');

const copyBTN = document.querySelector('#copy-btn');
const clearWordsavesBTN = document.querySelector('#clearWordsaves');
const clearWordsavesPreBTN = document.querySelector('#clearWordsavesPre');
const saveWordBTN = document.querySelector('#saveWordBTN');
const moreWordsBTN = document.querySelector('#generate_words');

function summonCopyToast(event) {
    document.querySelectorAll('#copy-toast').forEach(e => {e.remove();});;
    const toast = document.createElement('div');
    toast.id = "copy-toast";
    toast.innerText = 'Copied!';
    toast.style.transform = 'translate(' + (event.clientX + 15) + 'px,' + event.clientY + 'px)';
    document.body.insertAdjacentElement('beforeend',toast);
}

summonCopyToast.at = function (x,y) {
    document.querySelectorAll('#copy-toast').forEach(e => {e.remove();});;
    const toast = document.createElement('div');
    toast.id = "copy-toast";
    toast.innerText = 'Copied!';
    toast.style.transform = 'translate(' + (x) + 'px,' + (y) + 'px)';
    document.body.insertAdjacentElement('beforeend',toast);
}

const wordsloaded = new Event('wordsloaded');

function shuffle(arrayIn) {
    let array = arrayIn
    let currentIndex = array.length;

  // While there remain elements to shuffle...
    while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array
}

capitalize = function (string) {
    return string.slice(0,1).toUpperCase() + string.slice(1);
}

function clamp(value,min,max) {
    return value < min ? min : value > max ? max : value;
}

function randInt(min,max) {
    return clamp(Math.round(Math.random() * max),min,max);
}

function update_words() {
    wordsList.remove();
    wordsList = document.querySelector('#app #center').insertAdjacentElement('afterbegin',document.createElement('div'));
    wordsList.id = 'words-list';
    wordsTEMP = [];
    runtime.current_words.forEach(word => {
        wordsTEMP.push(runtime.uppercase ? capitalize(word) : word);
    });
    wordsList.insertAdjacentHTML('beforeend',wordsTEMP.join(runtime.word_spacer));
    if (runtime.auto_copy) {
        copyWords();
    }
}

async function loadWords() {
    wordsTemp = await fetch('assets/words.json');
    words = shuffle(JSON.parse(await wordsTemp.text()));
    dispatchEvent(wordsloaded);
}

function shuffleWords() {
    words = shuffle(words);
    return words;
}

loadWordsaves(localStorage.getItem('words') != null ? localStorage.getItem('words').split(',') : []);

loadWords();

function populateWords() {
    wordsList.remove();
    wordsList = document.querySelector('#app #center').insertAdjacentElement('afterbegin',document.createElement('div'));
    wordsList.id = 'words-list';
    runtime.current_words = [];
    for (let w = 0; w < runtime.words_amount; w++) {
    shuffleWords();
    let word = words[Math.round(Math.random() * words.length)];
    if (runtime.uppercase) {
        word = capitalize(word);
    }
    wordsList.insertAdjacentHTML('beforeend',templates.wordElement.replaceAll('%WORD%',word).replaceAll('%SPACER%',runtime.word_spacer));
    runtime.current_words.push(word);
    }
    wordsList.innerHTML = wordsList.innerHTML.slice(0,-1);
    if (runtime.auto_copy) {copyWords();}
}

function setWords(words) {
    if (Array.isArray(words)) {
    wordsList.remove();
    wordsList = document.querySelector('#app #center').insertAdjacentElement('afterbegin',document.createElement('div'));
    wordsList.id = 'words-list';
    if (runtime.uppercase == true) {
        for (let w = 0;w < words.length;w++) {
            words[w] = (''+words[w]).split('',1)[0].toUpperCase() + (''+words[w]).slice(1);
        }
    }
    runtime.current_words = words;
    wordsList.innerHTML = words.join(runtime.word_spacer);
    if (runtime.auto_copy) {copyWords();}
    } else {
        console.error('Expected array, got: "' + typeof words + '" At: "' + words + '"');
    }
}

addEventListener('wordsloaded', function() {
    // if (!base_search_params.has('word')) {
        populateWords();
    // } else 
    // if (base_search_params.get('word') != null & base_search_params.get('word') != '') {
    //     setWords(base_search_params.get('word').split(','));
    // } else {
    //     populateWords();
    // }
});

document.querySelector('#options #wordsAmount').addEventListener('change', function() {

});

function copyWords() {
    const words_output_array = [];
    runtime.current_words.forEach(word => {
        words_output_array.push(runtime.uppercase ? capitalize(word) : word);
    });
    window.navigator.clipboard.writeText(words_output_array.join(runtime.word_spacer));
}

function copyText(string) {
    if (typeof string == 'string') {
    window.navigator.clipboard.writeText(string);
    } else {
        console.warn('Input must be a string!');
    }
}

addEventListener('click', function(event) {
    if (event.target.matches('#saved-words .wordsave .del-wordsave')) {
        const parent = event.target.parentNode;
        // runtime.saved_words.splice(parseInt(parent.getAttribute('index')),1);
        parent.remove();
        let out = [];
        document.querySelectorAll('.wordsave span').forEach(e => {
            out.push(e.innerText);
        });
        runtime.saved_words = out;
        localStorage.setItem('words',runtime.saved_words);
        update_save_button();
    }
});

addEventListener('keydown', function(event) {
const key = event.keyCode;
if (!document.activeElement.matches('input[type="text"]')) {
    if (key == keys.e) {
        populateWords();
    }
    if (key == keys.s) {
        addWordsave(wordsList.innerText);
    }
    if (key == keys.c & event.shiftKey) {
        if (!clearWordsavesPreBTN.hidden) {
            clearWordsavesPreBTN.click();
        } else {
            // clearSavedWords();
            clearWordsavesBTN.click();
        }
    }
    if (event.key == 'c' & !event.shiftKey) {
        summonCopyToast.at(window.innerWidth / 2 -30,window.innerHeight / 8);
        copyWords();
    }
    if (event.key == 'Enter') {
        if (event.target.matches('input[type="checkbox"]')) {
            // event.target.checked = !!(!event.target.checked);
            event.target.click();
        }
    }
}
});

copyBTN.addEventListener('mouseout', function() {
    copyBTN.innerText = 'Copy'
});

clearWordsavesBTN.addEventListener('mouseout', function() {
    const focused = !!document.activeElement == this;
    this.hidden = true;
    clearWordsavesPreBTN.hidden = false;
    moreWordsBTN.focus();
});

clearWordsavesBTN.addEventListener('blur', function() {
    const focused = !!document.activeElement == this;
    this.hidden = true;
    clearWordsavesPreBTN.hidden = false;
    moreWordsBTN.focus();
});

function addWordsave(word) {
    if (typeof word == 'string') {
    runtime.saved_words.push(word);
    savedWords.insertAdjacentHTML('beforeend',templates.wordsaveTemplate.replaceAll('%WORD%',word).replaceAll('%INDEX%',runtime.saved_words.length - 1));
    localStorage.setItem('words',localStorage.getItem('words') != null ? localStorage.getItem('words').split(',').concat(word) : [word]);
    update_save_button();
    }
}

function loadWordsaves(words) {
    if (Array.isArray(words)) {
        runtime.saved_words = words;
        localStorage.setItem('words',words);
        words.forEach(word => {
            if (word != '') {
                savedWords.insertAdjacentHTML('beforeend',templates.wordsaveTemplate.replaceAll('%WORD%',word).replaceAll('%INDEX%',runtime.saved_words.length - 1));
            }
        });
        update_save_button();
    }
}

function clearSavedWords() {
    savedWords.innerHTML = '';
    runtime.saved_words = [];
    localStorage.removeItem('words','')
    update_save_button();
}

function update_save_button() {
    if (document.querySelectorAll('#saved-words .wordsave').length > 0) {
        clearWordsavesPreBTN.disabled = false;
    } else {
        clearWordsavesPreBTN.disabled = true;
    }
}

// Tooltip

const tooltip = document.createElement('div');
tooltip.id = "tooltip";
document.body.insertAdjacentElement('beforeend',tooltip);

let offset = [25,5];

addEventListener('mousemove', function (event) {
    if (event.target.matches('[tooltip]')) {
        tooltip.innerHTML = event.target.getAttribute('tooltip');
        if (event.target.matches('[tooltip-offset]')) {
            offset = event.target.getAttribute('tooltip-offset').split(',');
            for (let i = 0; i < offset.length;i++) {
                const num = parseInt(offset[i]);
                offset[i] = isNaN(num) ? 0 : num;
            }
            if (!offset.length >= 2) {
                offset = [25,5];
            }
        } else {
            offset = [25,5];
        }
    }
    tooltip.style.transform = 'translate(' + (event.clientX + offset[0]) + 'px,' + (event.clientY + offset[1]) + 'px)';
});