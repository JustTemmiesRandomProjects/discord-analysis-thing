function sorting_method_words(meta_data) {
    // make an array and sort the `most_used_words` dictionary
    graph_data = Object.keys(most_used_words).map(function (key) {
        return [key, most_used_words[key]];
    });

    graph_data.sort(function (first, second) {
        return second[1] - first[1];
    });

    graph_data = graph_data.slice(1, meta_data.entry_count + 1);

    return {
        labels: graph_data.map((row) => row[0]),
        datasets: [
            {
                label: "Times every word has been said",
                data: graph_data.map((row) => row[1]),
                borderWidth: meta_data.border_width,
            },
        ],
    };
}

function sorting_method_chars(meta_data) {
    // make an array and sort the `most_used_chars` dictionary
    graph_data = Object.keys(most_used_chars).map(function (key) {
        return [key, most_used_chars[key]];
    });

    // sort them
    graph_data.sort(function (first, second) {
        return second[1] - first[1];
    });

    // slice them
    graph_data = graph_data.slice(1, meta_data.entry_count + 1);

    return {
        labels: graph_data.map((row) => row[0]),
        datasets: [
            {
                label: "Amount of times the following characters have been used",
                data: graph_data.map((row) => row[1]),
                borderWidth: meta_data.border_width,
            },
        ],
    };
}

function sorting_method_time(meta_data) {
    message_timestamps.sort();

    const newest = message_timestamps[message_timestamps.length - 1];
    const oldest = message_timestamps[0];
    const total_delta = newest - oldest;
    const delta = total_delta / meta_data.entry_count;

    const graph_data = {};
    let delta_index = 1;
    for (let i = 1; i <= meta_data.entry_count; i++) {
        const upper_threshold = Math.floor(delta * i + oldest);
        graph_data[upper_threshold] = 0;
    }
    for (let i = 0; i < message_timestamps.length; i++) {
        const upper_threshold = Math.floor(delta * delta_index + oldest);
        if (message_timestamps[i] > upper_threshold) {
            delta_index++;
        }

        graph_data[upper_threshold]++;
    }

    graph_label = [];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // modified version of https://stackoverflow.com/a/6078873
    Object.keys(graph_data).forEach((timestamp) => {
        const a = new Date(timestamp * 1000);
        const year = a.getUTCFullYear();
        const month = months[a.getUTCMonth()];
        const date = a.getUTCDate();
        const time = date + " " + month + " " + year;
        graph_label.push(time);
    });

    return {
        labels: graph_label,
        datasets: [
            {
                label: "Messages sent over time",
                data: Object.values(graph_data),
                borderWidth: meta_data.border_width,
            },
        ],
    };
}
