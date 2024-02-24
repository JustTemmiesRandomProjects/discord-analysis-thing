const package_location = ["/package/messages"]//, "/package2/messages"];
let entry_count = 25;

// no touchy

window.onload = init();

var discord_data = [];
var most_used_chars = {};
var most_used_words = {};
var message_timestamps = [];

var chart = null;

let sorting_method = "words";
let border_width = Math.ceil(180 / entry_count); // size on graph line width

async function init() {
    // reset the dropdown to the default
    document.getElementById("sorting-method").value = "words";

    // subscribe to the dropdown menu
    document.getElementById("sorting-method").addEventListener("change", async () => {
        sorting_method = document.getElementById("sorting-method").value;

        graph_data = await sortData(sorting_method);

        await renderData(graph_data);
    });

    const entry_count_input = document.getElementById("entry-count-input");
    entry_count.value = entry_count;
    entry_count_input.addEventListener("change", async () => {
        const input = document.getElementById("entry-count-input").value;

        entry_count = input;
        border_width = Math.ceil(180 / entry_count);

        graph_data = await sortData(sorting_method);

        await renderData(graph_data);
    });

    // read the data from every channel, the result ends up in `discord_data`
    await readMessages();

    // analyze the data, make variables with the information we actually want
    await analyzeData();

    // sort the data
    graph_data = await sortData(sorting_method);

    // render the data
    await renderData(graph_data);
}

async function readMessages() {
    const requests = [];

    for (const directory of package_location) {
        // get the index file, this is a list over files to check, and the name of the channel/DM
        console.log(`fetching index file at ${directory}/index.json...`);
        const index_file = await fetch(`${directory}/index.json`).then((response) => response.json());

        // queue up all the requests we need to make
        for (let channel in index_file) {
            requests.push(fetch(`${directory}/c${channel}/messages.csv`).then((res) => res.text()));
        }
    }

    // reset our saved data, just in case
    discord_data = [];

    console.log(`fetching data from ${requests.length} channels...`);
    // actually execute all the queued up requests we've made, and send the resulting data to `parseCSVs`
    await Promise.all(requests).then((data) => parseCSVs(data));
}

async function parseCSVs(input_data) {
    console.log("parsing returned CSV files...");

    // split up the data, and send it to the `parseCSV` function
    input_data.forEach((data) => {
        parseCSV(data);
    });
}

function parseCSV(CSV_string) {
    delimiter = ",";

    var pattern = new RegExp( // regex to parse the CSV files
        "(\\" + delimiter + "|\\r?\\n|\\r|^)" + '(?:"([^"]*(?:""[^"]*)*)"|' + '([^"\\' + delimiter + "\\r\\n]*))",
        "gi"
    );

    // array to hold our individual pattern matching groups:
    var rows = [[]];
    // false if we don't find any matches
    var matches = false;
    var matched_value = null;

    // loop until we no longer find a regular expression match
    while ((matches = pattern.exec(CSV_string))) {
        // get the matched delimiter
        var matched_delimiter = matches[1];
        // check if the delimiter has a length (and is not the start of string)
        // and if it matches field delimiter. If not, it is a row delimiter.
        if (matched_delimiter.length && matched_delimiter !== delimiter) {
            // Since this is a new row of data, add an empty row to the array.
            rows.push([]);
        }

        matched_value = null;

        // once we have eliminated the delimiter, check to see
        // what kind of value was captured (quoted or unquoted):
        if (matches[2]) {
            // found quoted value. unescape any double quotes.
            matched_value = matches[2].replace(new RegExp('""', "g"), '"');
        } else {
            // found a non-quoted value
            matched_value = matches[3];
        }

        rows[rows.length - 1].push(matched_value);
    }

    // remove the first line describing the data, as this isn't really neccessary
    rows.slice(0, 1);

    // then finally, push it to the global `discord_data` variable
    discord_data.push(rows);
}

async function analyzeData() {
    console.log("analzying data...");

    most_used_chars = {};
    most_used_words = {};
    messages_by_timestamps = {};
    message_timestamps = [];

    const strings_to_exclude = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "!", "?", ",", ".", '"'];

    const word_list = [];
    discord_data.forEach((channel_data) => {
        channel_data.forEach((message_data) => {
            if (message_data != "") {
                const timestamp = message_data[1].split(" ");
                const msg = message_data[2];

                // most_used_chars code
                const chars = msg.split("");
                chars.forEach((char) => {
                    if (!(char in most_used_chars)) {
                        most_used_chars[char] = 0;
                    }

                    most_used_chars[char]++;
                });

                // most_used_words code
                let words = msg;
                // remove ignored characters
                // strings_to_exclude.forEach((char) => {
                //     words.replace(`/${char}/gi`, "");
                // });

                // convert newlines into spaces
                words = words.replace("\n", " ");

                if (!words.includes(" ")) {
                    words = [words];
                } else {
                    words = words.split(" ");
                }

                words.forEach((word) => {
                    word_list.push(word);
                });

                // timestamp code
                const unixtime =
                    new Date(`${timestamp[0]}T${String(timestamp[1]).split(".")[0]}`).getTime() / 1000;
                // sometimes the getTime() function returns NaN, i couldn't properly exclude it so we just check if it's over 5
                if (unixtime > 5) {
                    message_timestamps.push(unixtime);
                }
            }
        });
    });

    word_list.forEach((word) => {
        if (!(word in most_used_words)) {
            most_used_words[word] = 0;
        }

        most_used_words[word]++;
    });

    document.body.hidden = false;
}

async function sortData(sorting_method) {
    console.log(`sorting data by ${sorting_method}...`);

    const meta_data = {
        entry_count: entry_count,
        border_width: border_width,
    };

    if (sorting_method == "words") {
        return sorting_method_words(meta_data);
    } else if (sorting_method == "chars") {
        return sorting_method_chars(meta_data);
    } else if (sorting_method == "time") {
        return sorting_method_time(meta_data);
    }
}

async function renderData(input_data) {
    console.log("rendering data...");

    // draw the chart
    const ctx = document.getElementById("myChart");

    // if a chart already exists, destroy it
    if (chart != null) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "line",
        data: input_data,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 20,
                        },
                    },
                },
                x: {
                    ticks: {
                        font: {
                            // set the font size to be window_width / 5 / the entries on the chart
                            size: Math.min(Math.ceil(window.innerWidth / 5 / entry_count), 50),
                        },
                    },
                },
            },
        },
    });
}
