import json

EN_dict_path = "/home/twig/Development/school/vurderinger/IT/funnyDiscordMessageAnalysis/code/dictionaries/dictionary.json"
NO_dict_path = "/home/twig/Development/school/vurderinger/IT/funnyDiscordMessageAnalysis/code/dictionaries/nno-nob.dict"
final_dict_path = "/home/twig/Development/school/vurderinger/IT/funnyDiscordMessageAnalysis/code/dictionaries/combined_dict.json"

combined_dict = []
with open(EN_dict_path) as f:
    data = json.load(f)
    for i in data:
        combined_dict.append(i)

with open(NO_dict_path) as f:
    for i in f.readlines():
        combined_dict.append(i.replace("\n", ""))

with open(final_dict_path, "w") as f:
    json.dump(combined_dict, f)