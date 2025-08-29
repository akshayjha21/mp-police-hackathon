# IPDR A-Party to B-Party Mapping Tool
## Comprehensive Law Enforcement Investigation System

### Overview
The IPDR (Internet Protocol Detail Records) A-Party to B-Party Mapping Tool is an intelligent system designed for law enforcement investigations. It extracts and identifies communication relationships between initiators (A-party) and recipients (B-party) from telecom log files, enabling accurate mapping of communication patterns for investigative purposes.

### System Components

#### 1. **IPDR Analysis Engine** (`IPDRAnalysisEngine`)
Core processing engine that handles:
- Multi-format log file parsing (CSV, JSON, TXT)
- A-party to B-party relationship extraction
- Communication network mapping
- Suspicious pattern detection
- Advanced analytics and reporting

#### 2. **Web Dashboard** (Interactive Investigation Interface)
Professional law enforcement dashboard with:
- **Dashboard Tab**: Overview metrics, recent activity, geographic mapping
- **Search & Analysis Tab**: Advanced search, filtering, detailed record views
- **Network Visualization Tab**: Interactive communication network graphs
- **Suspicious Activity Tab**: Pattern alerts, severity indicators, investigation status
- **Case Management Tab**: Active cases, evidence tracking, report generation

#### 3. **Export & Search Utilities**
- **IPDRExporter**: Export data to CSV, JSON, and comprehensive reports
- **IPDRSearchEngine**: Advanced search with multiple criteria and pattern analysis

### Key Features

#### Relationship Detection Methods
1. **Direct B-Party Identification**: Extract explicitly recorded B-party information
2. **Correlation-based Detection**: Identify relationships through:
   - Concurrent app usage within time windows
   - Similar destination IPs and session patterns
   - Communication timing correlation

#### Suspicious Pattern Detection
- **High Night Activity**: Frequent communications during 10 PM - 6 AM
- **Short Duration Calls**: Multiple calls under 30 seconds (potential signaling)
- **Multiple Device Usage**: Same number across different IMEI devices
- **Unusual Communication Patterns**: Statistical anomaly detection

#### Advanced Search Capabilities
- MSISDN-based filtering (A-party and B-party)
- Date range filtering
- Application type filtering
- Duration range filtering
- Location-based filtering
- Complex multi-criteria searches

### Technical Architecture

#### Data Structure Support
```
IPDR Fields Supported:
- MSISDN: Mobile number identifier
- IMSI: International Mobile Subscriber Identity
- IMEI: International Mobile Equipment Identity
- PRIVATE_IP: Device IP address
- PUBLIC_IP: Network-facing IP
- DEST_IP: Destination IP address
- DEST_PORT: Application-specific port
- APP_TYPE: Communication application
- START_TIME/END_TIME: Session timestamps
- CELL_ID: Cell tower location
- LAT/LON: Geographic coordinates
```

#### Application Port Mapping
```
Port Mapping for B-Party Detection:
- 5223: WhatsApp
- 443: HTTPS/Skype
- 1935: Facebook
- 80: HTTP
- 22: SSH
- 21: FTP
- 25: SMTP
- 993: IMAPS
```

### Usage Instructions

#### 1. **System Initialization**
```python
from ipdr_engine import IPDRAnalysisEngine

# Initialize the engine
engine = IPDRAnalysisEngine()

# Load IPDR data
engine.load_data("path/to/ipdr_data.csv")
```

#### 2. **Relationship Extraction**
```python
# Extract A-party to B-party relationships
relationships = engine.extract_a_party_b_party_relationships()

# Build communication network
network = engine.build_communication_network()
```

#### 3. **Suspicious Pattern Detection**
```python
# Detect suspicious patterns
suspicious_patterns = engine.detect_suspicious_patterns()

# Get analysis summary
summary = engine.get_communication_summary()
```

#### 4. **Advanced Search**
```python
from ipdr_search import IPDRSearchEngine

search_engine = IPDRSearchEngine(engine)

# Advanced search with multiple criteria
criteria = {
    'msisdn': '917280305443',
    'date_range': ('2025-08-01', '2025-08-27'),
    'app_types': ['WhatsApp', 'Facebook'],
    'duration_range': (30, 3600)
}

results = search_engine.advanced_search(criteria)
```

#### 5. **Data Export**
```python
from ipdr_export import IPDRExporter

exporter = IPDRExporter(engine)

# Export relationships
exporter.export_relationships_csv("relationships.csv")

# Export suspicious patterns
exporter.export_suspicious_patterns_json("suspicious.json")

# Generate investigation report
exporter.export_investigation_report("CASE_001", "report.json")
```

### Web Dashboard Usage

#### Dashboard Navigation
1. **Dashboard**: Quick overview of key metrics and recent activity
2. **Search & Analysis**: Search specific numbers, filter by criteria, view detailed records
3. **Network Visualization**: Interactive graph showing communication relationships
4. **Suspicious Activity**: Monitor alerts and investigate unusual patterns
5. **Case Management**: Manage active investigations and generate reports

#### Investigation Workflow
1. **Data Import**: Load IPDR logs through the system
2. **Initial Analysis**: Review dashboard overview and metrics
3. **Search & Filter**: Use advanced search to focus on specific numbers or patterns
4. **Network Analysis**: Visualize communication relationships
5. **Pattern Investigation**: Review suspicious activity alerts
6. **Case Creation**: Create formal investigation cases
7. **Report Generation**: Export findings and evidence

### Security & Compliance

#### Data Protection
- Role-based access control
- Data encryption at rest and in transit
- Audit logging for all system interactions
- Secure session management

#### Legal Compliance
- Privacy law compliance frameworks
- Evidence chain-of-custody tracking
- Legal report formatting
- Data retention policies

### Sample Output Analysis

#### Relationship Detection Results
```
Extracted 296 A-Party to B-Party relationships from 1000 records
- Direct relationships: 296 (explicit B-party data)
- Correlated relationships: Variable (based on timing patterns)
- Confidence scoring for correlation-based relationships
```

#### Suspicious Pattern Examples
```
Detected Patterns:
- HIGH_NIGHT_ACTIVITY: 11 users with excessive late-night communications
- SHORT_DURATION_CALLS: 25 users with potential signaling behavior  
- MULTIPLE_DEVICES: 4 users with same number across different devices
```

### System Requirements

#### Backend Requirements
- Python 3.8+
- pandas, networkx, numpy libraries
- JSON processing capabilities
- CSV file handling

#### Web Dashboard Requirements
- Modern web browser (Chrome, Firefox, Safari)
- JavaScript enabled
- Chart.js for visualizations
- Responsive design for mobile compatibility

#### Hardware Recommendations
- 8GB+ RAM for large dataset processing
- SSD storage for fast data access
- Multi-core processor for parallel processing

### File Structure

```
IPDR Investigation System/
├── ipdr_engine.py              # Core analysis engine
├── ipdr_search.py              # Advanced search utilities
├── ipdr_export.py              # Data export functions
├── sample_ipdr_data.csv        # Sample dataset
├── relationships_export.csv     # Extracted relationships
├── suspicious_patterns.json    # Detected patterns
├── investigation_report.json   # Comprehensive report
└── web_dashboard/
    ├── index.html              # Main dashboard interface
    ├── style.css               # Professional styling
    └── app.js                  # Interactive functionality
```

### Support & Troubleshooting

#### Common Issues
1. **Large File Processing**: Use chunked processing for files > 1GB
2. **Memory Usage**: Monitor RAM usage during analysis
3. **Date Format Issues**: Ensure consistent timestamp formatting
4. **Network Visualization**: Limit nodes for better performance

#### Performance Optimization
- Index frequently searched fields
- Use database storage for large datasets
- Implement caching for repeated queries
- Optimize network graph rendering

### Future Enhancements

#### Planned Features
- Machine learning-based pattern detection
- Real-time data streaming
- Geographic heat mapping
- Voice call analysis integration
- Multi-language support
- API endpoints for integration

#### Advanced Analytics
- Behavioral profiling
- Predictive modeling
- Anomaly scoring algorithms
- Timeline correlation analysis
- Social network analysis metrics

---

**System Version**: 1.0  
**Last Updated**: August 27, 2025  
**Classification**: Law Enforcement Use Only  

For technical support or feature requests, contact the development team.