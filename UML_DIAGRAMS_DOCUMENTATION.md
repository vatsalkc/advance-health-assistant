# Health Assistant System - UML Diagrams Documentation

This document provides comprehensive UML diagrams for the Health Assistant System, illustrating the system architecture, user interactions, and data flow.

## 📋 Diagram Overview

### 1. Use Case Diagram (`diagrams/usecase-diagram.puml`)
**Purpose**: Shows the functional requirements and interactions between different actors and the system.

**Key Features**:
- **Patient Use Cases**: Registration, appointment booking, report upload, AI chatbot interaction
- **Doctor Use Cases**: Patient management, diagnosis creation, report viewing
- **Admin Use Cases**: System management and analytics
- **AI System Use Cases**: Health query processing and symptom analysis

**Key Relationships**:
- Authentication dependencies for all user actions
- AI chatbot integration with health query processing
- Include/extend relationships showing system dependencies

### 2. Class Diagram (`diagrams/class-diagram.puml`)
**Purpose**: Illustrates the system's static structure, showing classes, their attributes, methods, and relationships.

**Key Packages**:
- **User Management**: User hierarchy (Patient, Doctor, Admin)
- **Medical Records**: Report, Diagnosis, and Appointment entities
- **AI Services**: Chatbot and symptom checker functionality
- **File Management**: Storage and viewing capabilities
- **Database**: Service interfaces and implementations
- **Authentication**: Security and session management

**Key Relationships**:
- Inheritance: User → Patient/Doctor/Admin
- Composition: Patient ↔ MedicalReport, Doctor ↔ Diagnosis
- Implementation: SupabaseService implements DatabaseService

### 3. Activity Diagram (`diagrams/activity-diagram.puml`)
**Purpose**: Shows the workflow of patient report upload and doctor review process.

**Key Processes**:
- **Patient Flow**: Authentication → Report Upload → File Validation → Success
- **Doctor Flow**: Login → Patient Selection → Report Review → Diagnosis Creation
- **AI Integration**: Chatbot interaction and health guidance
- **Error Handling**: Validation failures and retry mechanisms

**Decision Points**:
- User authentication checks
- File validation (type, size)
- Symptom severity assessment for AI recommendations

### 4. State Diagram (`diagrams/state-diagram.puml`)
**Purpose**: Depicts the lifecycle states of key system entities.

**State Machines**:
- **Medical Report Lifecycle**: Draft → Uploading → Uploaded → Under Review → Reviewed → Archived/Deleted
- **AI Chatbot Session**: Idle → Processing → Responding → Error handling
- **Appointment Lifecycle**: Requested → Confirmed → In Progress → Completed/Cancelled

**Key Transitions**:
- State changes triggered by user actions
- Automatic transitions (timeouts, system events)
- Error state handling and recovery

### 5. Sequence Diagram (`diagrams/sequence-diagram.puml`)
**Purpose**: Shows the interaction flow between system components over time.

**Key Scenarios**:
- **Complete Patient Journey**: Registration → Report Upload → AI Consultation → Doctor Review
- **Doctor Workflow**: Login → Patient Selection → Diagnosis Creation
- **File Management**: Upload, storage, and deletion processes
- **Error Handling**: Various failure scenarios and recovery

**System Components**:
- Web Application (Frontend)
- Authentication Service
- File Storage (Supabase)
- Database
- AI Chatbot (Gemini)
- Notification Service

## 🔧 Technical Implementation Details

### Authentication & Security
- JWT-based authentication with session management
- Row Level Security (RLS) for data isolation
- Secure file storage with access controls
- API key protection for external services

### File Management
- Supabase Storage for secure file handling
- Support for multiple file types (images, PDFs)
- File validation and size limits
- Automatic cleanup on deletion

### AI Integration
- Gemini AI for health consultations
- Symptom analysis and recommendations
- Safety filters and medical disclaimers
- Fallback handling for API failures

### Database Design
- Relational structure with proper foreign keys
- Audit trails for all medical records
- Soft deletes for important data
- Performance optimization with indexes

## 📊 System Metrics & Analytics

### User Engagement
- Patient registration and retention rates
- Doctor utilization and response times
- AI chatbot interaction frequency
- Report upload and review cycles

### Performance Monitoring
- File upload success rates
- API response times
- Database query performance
- Error rates and recovery times

## 🚀 Deployment Architecture

### Frontend (React)
- Component-based architecture
- State management with hooks
- Responsive design for mobile/desktop
- Progressive Web App capabilities

### Backend Services
- Supabase for database and authentication
- Supabase Storage for file management
- Gemini AI for chatbot functionality
- Real-time subscriptions for notifications

### Security Measures
- Environment variable protection
- HTTPS enforcement
- Input validation and sanitization
- Regular security audits

## 📈 Future Enhancements

### Planned Features
- Telemedicine video consultations
- Prescription management system
- Health analytics and trends
- Mobile application development

### Scalability Considerations
- Microservices architecture migration
- CDN integration for file delivery
- Database sharding for large datasets
- Load balancing for high availability

## 🔍 Diagram Usage Instructions

### Viewing Diagrams
1. Install PlantUML extension in your IDE
2. Open any `.puml` file in the `diagrams/` folder
3. Use the preview feature to render the diagram
4. Export as PNG/SVG for documentation

### Updating Diagrams
1. Modify the `.puml` files as needed
2. Ensure syntax correctness
3. Update this documentation accordingly
4. Commit changes to version control

### Integration with Development
- Use diagrams for code reviews
- Reference during feature development
- Update when system architecture changes
- Include in technical documentation

---

**Note**: These diagrams represent the current system architecture as of the latest commit. They should be updated whenever significant changes are made to the system structure or functionality.