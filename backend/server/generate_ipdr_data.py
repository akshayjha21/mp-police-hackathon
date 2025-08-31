import random
import uuid
from datetime import datetime, timedelta
import json

def random_ip():
    return ".".join(str(random.randint(0, 255)) for _ in range(4))

def random_date(start, end):
    return start + timedelta(seconds=random.randint(0, int((end - start).total_seconds())))

def generate_non_suspicious_ipdr(num_records=10000):
    records = []
    start_date = datetime(2019, 1, 1)
    end_date = datetime(2019, 12, 31)
    access_types = ['2G', '3G', '4G', '5G']

    for _ in range(num_records):
        start_time = random_date(start_date, end_date)
        duration_sec = random.randint(60, 3600)  # 1 min to 1 hour
        end_time = start_time + timedelta(seconds=duration_sec)
        uplink_vol = random.randint(100, 5000)  # bytes
        downlink_vol = random.randint(100, 5000)
        total_vol = uplink_vol + downlink_vol

        record = {
            "_id": str(uuid.uuid4()),
            "phoneNumber": str(random.randint(9000000000, 9999999999)),
            "startTime": start_time.isoformat() + "Z",
            "endTime": end_time.isoformat() + "Z",
            "accessType": random.choice(access_types),
            "destIP": random_ip(),
            "destPort": random.choice([80, 443, 5060, 1719, 22]),
            "downlinkVolume": downlink_vol,
            "uplinkVolume": uplink_vol,
            "totalVolume": total_vol,
            "imei": str(random.randint(100000000000000, 999999999999999)),
            "imsi": str(random.randint(400000000000000, 499999999999999)),
            "privateIP": random_ip(),
            "privatePort": random.randint(1024, 65535),
            "publicIP": random_ip(),
            "publicPort": random.randint(1024, 65535),
            "__v": 0
        }
        records.append(record)
    return records

# Generate 10,000 non-suspicious records
data = generate_non_suspicious_ipdr(10000)

# Save to JSON file
with open("non_suspicious_ipdr_10000.json", "w") as f:
    json.dump(data, f, indent=2)

print(f"Generated {len(data)} non-suspicious IPDR records in non_suspicious_ipdr_10000.json")
