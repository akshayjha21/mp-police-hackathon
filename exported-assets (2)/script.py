import pandas as pd
import json
import numpy as np
from datetime import datetime, timedelta
import random
import re

# First, let's create sample IPDR data to work with
def generate_sample_ipdr_data(num_records=1000):
    """Generate realistic IPDR sample data for testing"""
    
    # Common mobile numbers and IPs for creating realistic relationships
    mobile_numbers = [f"91{random.randint(7000000000, 9999999999)}" for _ in range(50)]
    private_ips = [f"192.168.{random.randint(1,255)}.{random.randint(1,255)}" for _ in range(100)]
    public_ips = [f"{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}" for _ in range(200)]
    
    # Application-specific ports
    app_ports = {
        5223: "WhatsApp",
        443: "HTTPS/Skype", 
        80: "HTTP",
        1935: "Facebook",
        22: "SSH",
        21: "FTP",
        25: "SMTP",
        993: "IMAPS"
    }
    
    # Cell tower data
    cell_ids = [f"CELL_{i:04d}" for i in range(1, 101)]
    
    records = []
    base_time = datetime.now() - timedelta(days=30)
    
    for i in range(num_records):
        # Create realistic communication patterns
        a_party = random.choice(mobile_numbers)
        
        # Some records will have clear B-party relationships
        if random.random() < 0.3:  # 30% will have clear B-party connections
            b_party = random.choice(mobile_numbers)
            while b_party == a_party:
                b_party = random.choice(mobile_numbers)
        else:
            b_party = None
            
        dest_port = random.choice(list(app_ports.keys()))
        
        record = {
            'RECORD_ID': f"REC_{i:06d}",
            'MSISDN': a_party,
            'IMSI': f"405{random.randint(10000000000, 99999999999)}",
            'IMEI': f"{random.randint(100000000000000, 999999999999999)}",
            'PRIVATE_IP': random.choice(private_ips),
            'PUBLIC_IP': random.choice(public_ips),
            'DEST_IP': random.choice(public_ips),
            'DEST_PORT': dest_port,
            'APP_TYPE': app_ports[dest_port],
            'START_TIME': base_time + timedelta(
                days=random.randint(0, 29),
                hours=random.randint(0, 23),
                minutes=random.randint(0, 59)
            ),
            'END_TIME': None,
            'DATA_UP': random.randint(1000, 50000),
            'DATA_DOWN': random.randint(5000, 200000),
            'CELL_ID': random.choice(cell_ids),
            'B_PARTY_MSISDN': b_party,
            'SESSION_DURATION': random.randint(30, 3600),
            'LAT': 28.6139 + random.uniform(-0.5, 0.5),  # Delhi region
            'LON': 77.2090 + random.uniform(-0.5, 0.5)
        }
        
        # Calculate end time
        if record['START_TIME']:
            record['END_TIME'] = record['START_TIME'] + timedelta(seconds=record['SESSION_DURATION'])
            
        records.append(record)
    
    return pd.DataFrame(records)

# Generate sample data
print("Generating sample IPDR data...")
ipdr_data = generate_sample_ipdr_data(1000)

# Display sample data
print(f"\nGenerated {len(ipdr_data)} IPDR records")
print("\nSample records:")
print(ipdr_data.head())

# Save to CSV for later use
ipdr_data.to_csv('sample_ipdr_data.csv', index=False)
print("\nSample data saved to 'sample_ipdr_data.csv'")