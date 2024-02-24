import os
import json

script_absolute_path = f"{os.path.dirname(__file__)}/{os.path.basename(__file__)}"
os.chdir(os.path.dirname(__file__))

import modules.TNS_parser as TNS
import modules.message_parser as msg_parser

project_path = "/home/twig/Development/school/vurderinger/IT/funnyDiscordMessageAnalysis/"
TNS_relative_path = f"package/activity/tns_testing/"
msg_relative_path = f"package/messages/"

TNS_absolute_path = f"{project_path}{TNS_relative_path}"
msg_absolute_path = f"{project_path}{msg_relative_path}"

# output pathes
output_most_used_chars_absolute_path = f"{project_path}code/python/output/most_used_chars.json"

# TNS.parse(TNS_absolute_path)
msg_data = msg_parser.parseDirectory(msg_absolute_path)

word_list = {}
most_used_chars = {}

for i in msg_data:
    for j in msg_data[i]:
        msg = msg_data[i][j][1]
        for char in msg:
            char = char.lower()
            if char not in most_used_chars:
                most_used_chars[char] = 0
            most_used_chars[char] += 1
        msg.split(" ")
        # print(msg)

# sort most used chars based on usage
most_used_chars = sorted(most_used_chars.items(), key=lambda x: x[1], reverse=True)
for i in most_used_chars:
    print(f"{i[0]} : {i[1]}")

def write_data():
    # most used chars
    with open (output_most_used_chars_absolute_path, "w") as f:
        json.dump(most_used_chars, f)

# write_data()