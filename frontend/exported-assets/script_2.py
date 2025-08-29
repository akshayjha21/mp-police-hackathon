# Let's create additional utilities and export capabilities
import json
import csv
from datetime import datetime

class IPDRExporter:
    """Export IPDR analysis results in various formats"""
    
    def __init__(self, engine):
        self.engine = engine
    
    def export_relationships_csv(self, filename="relationships_export.csv"):
        """Export relationships to CSV"""
        if hasattr(self.engine, 'relationships') and not self.engine.relationships.empty:
            self.engine.relationships.to_csv(filename, index=False)
            return f"Relationships exported to {filename}"
        return "No relationships data to export"
    
    def export_suspicious_patterns_json(self, filename="suspicious_patterns.json"):
        """Export suspicious patterns to JSON"""
        with open(filename, 'w') as f:
            json.dump(self.engine.suspicious_patterns, f, indent=2, default=str)
        return f"Suspicious patterns exported to {filename}"
    
    def export_investigation_report(self, case_id, filename="investigation_report.json"):
        """Generate comprehensive investigation report"""
        summary = self.engine.get_communication_summary()
        
        report = {
            'case_id': case_id,
            'generated_at': datetime.now().isoformat(),
            'summary': summary,
            'relationships': self.engine.relationships.to_dict('records') if hasattr(self.engine, 'relationships') else [],
            'suspicious_patterns': self.engine.suspicious_patterns,
            'network_analysis': {
                'nodes': self.engine.communication_graph.number_of_nodes() if self.engine.communication_graph else 0,
                'edges': self.engine.communication_graph.number_of_edges() if self.engine.communication_graph else 0
            }
        }
        
        with open(filename, 'w') as f:
            json.dump(report, f, indent=2, default=str)
        
        return f"Investigation report exported to {filename}"

class IPDRSearchEngine:
    """Advanced search and filtering for IPDR data"""
    
    def __init__(self, engine):
        self.engine = engine
    
    def advanced_search(self, criteria):
        """
        Advanced search with multiple criteria
        criteria = {
            'msisdn': '917280305443',
            'date_range': ('2025-08-01', '2025-08-27'),
            'app_types': ['WhatsApp', 'Facebook'],
            'duration_range': (30, 3600),
            'location': 'CELL_0030'
        }
        """
        result = self.engine.data.copy()
        
        # Filter by MSISDN (A-party or B-party)
        if criteria.get('msisdn'):
            msisdn = str(criteria['msisdn'])
            result = result[
                (result['MSISDN'].astype(str).str.contains(msisdn, na=False)) |
                (result['B_PARTY_MSISDN'].astype(str).str.contains(msisdn, na=False))
            ]
        
        # Filter by date range
        if criteria.get('date_range'):
            start_date, end_date = criteria['date_range']
            result = result[
                (result['START_TIME'] >= start_date) & 
                (result['START_TIME'] <= end_date)
            ]
        
        # Filter by app types
        if criteria.get('app_types'):
            result = result[result['APP_TYPE'].isin(criteria['app_types'])]
        
        # Filter by duration range
        if criteria.get('duration_range'):
            min_dur, max_dur = criteria['duration_range']
            result = result[
                (result['SESSION_DURATION'] >= min_dur) & 
                (result['SESSION_DURATION'] <= max_dur)
            ]
        
        # Filter by location
        if criteria.get('location'):
            result = result[result['CELL_ID'] == criteria['location']]
        
        return result
    
    def find_communication_patterns(self, msisdn):
        """Find all communication patterns for a specific number"""
        user_data = self.engine.data[
            (self.engine.data['MSISDN'].astype(str) == str(msisdn)) |
            (self.engine.data['B_PARTY_MSISDN'].astype(str) == str(msisdn))
        ]
        
        patterns = {
            'total_communications': len(user_data),
            'unique_contacts': user_data['B_PARTY_MSISDN'].nunique(),
            'app_usage': user_data['APP_TYPE'].value_counts().to_dict(),
            'time_patterns': {
                'night_calls': len(user_data[
                    (user_data['START_TIME'].dt.hour >= 22) | 
                    (user_data['START_TIME'].dt.hour <= 6)
                ]),
                'day_calls': len(user_data[
                    (user_data['START_TIME'].dt.hour > 6) & 
                    (user_data['START_TIME'].dt.hour < 22)
                ])
            },
            'locations': user_data['CELL_ID'].value_counts().to_dict(),
            'average_duration': user_data['SESSION_DURATION'].mean()
        }
        
        return patterns

# Create exporter and search engine
exporter = IPDRExporter(engine)
search_engine = IPDRSearchEngine(engine)

# Test exports
print("=== Export Results ===")
csv_result = exporter.export_relationships_csv()
json_result = exporter.export_suspicious_patterns_json()
report_result = exporter.export_investigation_report("CASE_001")

print(csv_result)
print(json_result)  
print(report_result)

# Test advanced search
print("\n=== Advanced Search Test ===")
search_criteria = {
    'app_types': ['WhatsApp', 'Facebook'],
    'duration_range': (100, 2000)
}

search_results = search_engine.advanced_search(search_criteria)
print(f"Search returned {len(search_results)} records")

# Test pattern analysis
print("\n=== Pattern Analysis Test ===")
sample_msisdn = '917280305443'  # One of our suspicious users
patterns = search_engine.find_communication_patterns(sample_msisdn)
print(f"Communication patterns for {sample_msisdn}:")
for key, value in patterns.items():
    print(f"  {key}: {value}")

print("\n=== Files Created ===")
print("1. sample_ipdr_data.csv - Original IPDR data")
print("2. relationships_export.csv - A-Party to B-Party relationships")
print("3. suspicious_patterns.json - Detected suspicious patterns")
print("4. investigation_report.json - Comprehensive investigation report")
print("5. Web Dashboard - Complete IPDR Investigation Interface")