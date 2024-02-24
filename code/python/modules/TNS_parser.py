import os
import json

def parse(path):
    debug_list = {}
    measured_events = {
        "event_type": [],
        "event_source:": [],
        "day": [],
        "duration_effective_connection_speed_2g": [],
        "duration_effective_connection_speed_3g": [],
        "duration_effective_connection_speed_4g": [],
        "duration_effective_connection_speed_5g": [],
        "duration_effective_connection_speed_unknown": [],
        "os": [],
        "os_version": [],
        "ip": [],
        "country_code": [],
        "region_code": [],
        "isp": [],
        "port": [],
        "ping_average": [],
        "duration_connected": []
    }
    file_names = os.listdir(path)
    for i in file_names:
        with open(f"{path}{i}", "r") as f:
            content = f.readlines()
            for i, line in enumerate(content):
                
                data = json.loads(line)
                if data["event_type"] not in debug_list:
                    debug_list[data["event_type"]] = 0
                
                debug_list[data["event_type"]] += 1
                
                for j in measured_events:
                    if j in data:
                        measured_events[j].append(data[j])
                    
    # print(measured_events["event_type"])
    for i in debug_list:
        print(debug_list[i], i)

if __name__ == "__main__":
    parse("/home/twig/Development/school/vurderinger/IT/funnyDiscordMessageAnalysis/package/activity/tns/")