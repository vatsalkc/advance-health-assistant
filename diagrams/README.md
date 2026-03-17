# Health Assistant System - UML Diagrams

This folder contains comprehensive UML diagrams for the Health Assistant System.

## 📁 Files

| Diagram | File | Description |
|---------|------|-------------|
| **Use Case** | `usecase-diagram.puml` | System functionality and user interactions |
| **Class** | `class-diagram.puml` | System structure and relationships |
| **Activity** | `activity-diagram.puml` | Workflow processes and decision flows |
| **State** | `state-diagram.puml` | Entity lifecycles and state transitions |
| **Sequence** | `sequence-diagram.puml` | Component interactions over time |

## 🔧 How to View

### Option 1: VS Code with PlantUML Extension
1. Install the "PlantUML" extension
2. Open any `.puml` file
3. Press `Alt+D` or use Command Palette → "PlantUML: Preview Current Diagram"

### Option 2: Online PlantUML Editor
1. Go to [plantuml.com/plantuml](http://www.plantuml.com/plantuml)
2. Copy and paste the content from any `.puml` file
3. View the rendered diagram

### Option 3: Local PlantUML Installation
```bash
# Install Java (required)
# Download plantuml.jar from plantuml.com
java -jar plantuml.jar diagrams/*.puml
```

## 📊 Diagram Overview

### Use Case Diagram
- Shows all system actors (Patient, Doctor, Admin, AI)
- Illustrates functional requirements
- Displays relationships between use cases

### Class Diagram
- Complete system architecture
- All major classes and their relationships
- Package organization and dependencies

### Activity Diagram
- Patient report upload workflow
- Doctor review process
- AI chatbot interaction flow
- Error handling scenarios

### State Diagram
- Medical report lifecycle states
- AI chatbot session states
- Appointment status transitions

### Sequence Diagram
- Complete patient-doctor interaction flow
- System component communications
- Error handling and recovery processes

## 🎯 Key System Features Illustrated

- **Patient Management**: Registration, authentication, profile management
- **Medical Records**: Upload, storage, viewing, deletion
- **Doctor Portal**: Patient review, diagnosis creation, report access
- **AI Integration**: Health chatbot, symptom analysis
- **File Management**: Secure storage, download, validation
- **Security**: Authentication, authorization, data protection

## 📝 Notes

- All diagrams use PlantUML syntax
- Diagrams are kept in sync with actual system implementation
- Color coding and styling enhance readability
- Comments and notes provide additional context

For detailed documentation, see `../UML_DIAGRAMS_DOCUMENTATION.md`