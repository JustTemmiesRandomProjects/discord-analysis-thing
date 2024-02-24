import csv
import os
from datetime import datetime

def parseFile(file_path):
    with open(file_path) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        returnData = {}
        for row in csv_reader:
            if line_count == 0:
                line_count += 1
            else:
                datetime_obj = datetime.fromisoformat(row[1][:-6])  # remove the timezone offset
                time = datetime_obj.timestamp()
                returnData[row[0]] = [time, row[2]]
                line_count += 1
        # print(f'Processed {line_count} lines.')
        return returnData
    
def parseDirectory(directory_path):
    child_folders = os.listdir(directory_path)
    data = {}
    for folder in child_folders:
        if "c" in folder:
            channel_ID = folder[1::]
            data[channel_ID] = parseFile(f"{directory_path}{folder}/messages.csv")
    
    messages = 0
    for i in data:
        for j in data[i]:
            # print(data[i][j])
            messages += 1
    
    return data

if __name__ == "__main__":
    # parseFile("/home/twig/Development/school/vurderinger/IT/funnyDiscordMessageAnalysis/package/messages/c1002049711643037697/messages.csv")
    parseDirectory("/home/twig/Development/school/vurderinger/IT/funnyDiscordMessageAnalysis/package/messages")