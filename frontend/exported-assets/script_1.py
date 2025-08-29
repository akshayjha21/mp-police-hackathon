# Now let's build the core IPDR Analysis Engine
import pandas as pd
import networkx as nx
from collections import defaultdict, Counter
import json
from datetime import datetime, timedelta

class IPDRAnalysisEngine:
    def __init__(self):
        self.data = None
        self.communication_graph = None
        self.relationship_map = defaultdict(list)
        self.suspicious_patterns = []
        
    def load_data(self, file_path_or_dataframe):
        """Load IPDR data from file or DataFrame"""
        if isinstance(file_path_or_dataframe, str):
            # Determine file type and load accordingly
            if file_path_or_dataframe.endswith('.csv'):
                self.data = pd.read_csv(file_path_or_dataframe)
            elif file_path_or_dataframe.endswith('.json'):
                self.data = pd.read_json(file_path_or_dataframe)
        else:
            self.data = file_path_or_dataframe.copy()
            
        # Convert timestamps if they're strings
        if 'START_TIME' in self.data.columns:
            self.data['START_TIME'] = pd.to_datetime(self.data['START_TIME'])
        if 'END_TIME' in self.data.columns:
            self.data['END_TIME'] = pd.to_datetime(self.data['END_TIME'])
            
        print(f"Loaded {len(self.data)} IPDR records")
        return True
    
    def extract_a_party_b_party_relationships(self):
        """Extract and map A-party to B-party relationships"""
        relationships = []
        
        # Method 1: Direct B-Party identification from logs
        direct_relationships = self.data[self.data['B_PARTY_MSISDN'].notna()]
        
        for _, record in direct_relationships.iterrows():
            relationship = {
                'A_PARTY': record['MSISDN'],
                'B_PARTY': record['B_PARTY_MSISDN'],
                'COMMUNICATION_TYPE': record['APP_TYPE'],
                'TIMESTAMP': record['START_TIME'],
                'DURATION': record['SESSION_DURATION'],
                'LOCATION': record['CELL_ID'],
                'METHOD': 'DIRECT'
            }
            relationships.append(relationship)
        
        # Method 2: Correlation-based relationship detection
        # Group by time windows to find concurrent app usage (indicating communication)
        time_window = 5  # 5-minute window
        
        for app_type in ['WhatsApp', 'HTTPS/Skype', 'Facebook']:
            app_data = self.data[self.data['APP_TYPE'] == app_type].copy()
            app_data = app_data.sort_values('START_TIME')
            
            for i, record1 in app_data.iterrows():
                # Find other records within the time window
                time_diff = abs((app_data['START_TIME'] - record1['START_TIME']).dt.total_seconds())
                concurrent_records = app_data[
                    (time_diff <= time_window * 60) & 
                    (app_data['MSISDN'] != record1['MSISDN'])
                ]
                
                for j, record2 in concurrent_records.iterrows():
                    if i != j:  # Different records
                        # Check if they could be communicating (same dest_ip or similar patterns)
                        if (record1['DEST_IP'] == record2['DEST_IP'] or 
                            abs(record1['SESSION_DURATION'] - record2['SESSION_DURATION']) < 30):
                            
                            relationship = {
                                'A_PARTY': record1['MSISDN'],
                                'B_PARTY': record2['MSISDN'],
                                'COMMUNICATION_TYPE': app_type,
                                'TIMESTAMP': record1['START_TIME'],
                                'DURATION': record1['SESSION_DURATION'],
                                'LOCATION': record1['CELL_ID'],
                                'METHOD': 'CORRELATED',
                                'CONFIDENCE': 0.8
                            }
                            relationships.append(relationship)
        
        self.relationships = pd.DataFrame(relationships)
        
        # Remove duplicates
        if not self.relationships.empty:
            self.relationships = self.relationships.drop_duplicates(
                subset=['A_PARTY', 'B_PARTY', 'TIMESTAMP']
            )
        
        print(f"Extracted {len(self.relationships)} A-Party to B-Party relationships")
        return self.relationships
    
    def build_communication_network(self):
        """Build network graph of communications"""
        self.communication_graph = nx.Graph()
        
        if hasattr(self, 'relationships') and not self.relationships.empty:
            for _, rel in self.relationships.iterrows():
                self.communication_graph.add_edge(
                    rel['A_PARTY'], 
                    rel['B_PARTY'],
                    weight=rel['DURATION'],
                    comm_type=rel['COMMUNICATION_TYPE'],
                    timestamp=rel['TIMESTAMP']
                )
        
        print(f"Built communication network with {self.communication_graph.number_of_nodes()} nodes and {self.communication_graph.number_of_edges()} edges")
        return self.communication_graph
    
    def detect_suspicious_patterns(self):
        """Detect suspicious communication patterns"""
        suspicious_patterns = []
        
        if self.data is None:
            return suspicious_patterns
        
        # Pattern 1: High-frequency late-night communications
        night_hours = self.data[
            (self.data['START_TIME'].dt.hour >= 22) | 
            (self.data['START_TIME'].dt.hour <= 6)
        ]
        
        night_communicators = night_hours.groupby('MSISDN').size()
        suspicious_night = night_communicators[night_communicators > 10]
        
        for msisdn, count in suspicious_night.items():
            suspicious_patterns.append({
                'PATTERN_TYPE': 'HIGH_NIGHT_ACTIVITY',
                'MSISDN': msisdn,
                'COUNT': count,
                'SEVERITY': 'MEDIUM'
            })
        
        # Pattern 2: Very short duration calls (possible signaling)
        short_calls = self.data[self.data['SESSION_DURATION'] < 30]
        short_call_users = short_calls.groupby('MSISDN').size()
        suspicious_short = short_call_users[short_call_users > 20]
        
        for msisdn, count in suspicious_short.items():
            suspicious_patterns.append({
                'PATTERN_TYPE': 'SHORT_DURATION_CALLS',
                'MSISDN': msisdn,
                'COUNT': count,
                'SEVERITY': 'HIGH'
            })
        
        # Pattern 3: Multiple device usage (same MSISDN, different IMEI)
        device_usage = self.data.groupby('MSISDN')['IMEI'].nunique()
        multiple_devices = device_usage[device_usage > 2]
        
        for msisdn, device_count in multiple_devices.items():
            suspicious_patterns.append({
                'PATTERN_TYPE': 'MULTIPLE_DEVICES',
                'MSISDN': msisdn,
                'DEVICE_COUNT': device_count,
                'SEVERITY': 'HIGH'
            })
        
        self.suspicious_patterns = suspicious_patterns
        print(f"Detected {len(suspicious_patterns)} suspicious patterns")
        return suspicious_patterns
    
    def search_communications(self, msisdn=None, date_range=None, app_type=None):
        """Search and filter communications"""
        result = self.data.copy()
        
        if msisdn:
            result = result[
                (result['MSISDN'].astype(str).str.contains(str(msisdn))) |
                (result['B_PARTY_MSISDN'].astype(str).str.contains(str(msisdn)))
            ]
        
        if date_range:
            start_date, end_date = date_range
            result = result[
                (result['START_TIME'] >= start_date) & 
                (result['START_TIME'] <= end_date)
            ]
        
        if app_type:
            result = result[result['APP_TYPE'] == app_type]
            
        return result
    
    def get_communication_summary(self):
        """Get summary statistics"""
        if self.data is None:
            return {}
        
        summary = {
            'total_records': len(self.data),
            'unique_users': self.data['MSISDN'].nunique(),
            'date_range': {
                'start': self.data['START_TIME'].min(),
                'end': self.data['START_TIME'].max()
            },
            'app_usage': self.data['APP_TYPE'].value_counts().to_dict(),
            'top_users': self.data.groupby('MSISDN').size().nlargest(10).to_dict(),
            'relationships_found': len(getattr(self, 'relationships', [])),
            'suspicious_patterns': len(getattr(self, 'suspicious_patterns', []))
        }
        
        return summary

# Initialize and test the engine
print("Initializing IPDR Analysis Engine...")
engine = IPDRAnalysisEngine()

# Load the sample data
engine.load_data(ipdr_data)

# Extract relationships
relationships = engine.extract_a_party_b_party_relationships()
print("\nSample relationships:")
if not relationships.empty:
    print(relationships.head())

# Build network
network = engine.build_communication_network()

# Detect suspicious patterns
suspicious = engine.detect_suspicious_patterns()
print("\nSuspicious patterns detected:")
for pattern in suspicious[:5]:  # Show first 5
    print(pattern)

# Get summary
summary = engine.get_communication_summary()
print(f"\n=== IPDR Analysis Summary ===")
print(f"Total Records: {summary['total_records']}")
print(f"Unique Users: {summary['unique_users']}")
print(f"Relationships Found: {summary['relationships_found']}")
print(f"Suspicious Patterns: {summary['suspicious_patterns']}")
print(f"App Usage: {summary['app_usage']}")