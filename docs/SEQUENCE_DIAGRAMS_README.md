# Health Assistant - Sequence Diagrams

This document contains PlantUML sequence diagrams for the Health Assistant application.

## How to View the Diagrams

### Option 1: Online PlantUML Editor
1. Go to [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)
2. Copy the content from `sequence-diagrams.puml`
3. Paste it into the editor
4. View the generated diagrams

### Option 2: VS Code Extension
1. Install the "PlantUML" extension in VS Code
2. Open `sequence-diagrams.puml`
3. Press `Alt+D` to preview the diagram

### Option 3: Command Line (requires Java and Graphviz)
```bash
# Install PlantUML
npm install -g node-plantuml

# Generate PNG images
plantuml sequence-diagrams.puml

# This will create PNG files for each diagram
```

### Option 4: Online Viewer
Visit: https://www.planttext.com/
- Paste the diagram code
- Click "Refresh" to generate

## Available Diagrams

### 1. Patient Registration and Login Flow
Shows the complete authentication flow including:
- User registration with email verification
- Login process with session management
- Password reset functionality

### 2. Symptom Checker Flow
Demonstrates the AI-powered symptom analysis:
- Symptom input with autocomplete
- Follow-up symptom suggestions
- Severity selection
- Disease prediction algorithm
- Doctor recommendations

### 3. Appointment Booking Flow
Complete appointment management:
- Viewing available doctors
- Filtering by specialization
- Booking appointments
- Doctor approval/rejection process
- Status updates

### 4. Doctor Portal Flow
Doctor-side functionality:
- Doctor authentication
- Viewing appointments
- Confirming/rejecting appointments
- Adding diagnosis and prescriptions
- Viewing patient history

### 5. Medicine Reminder Flow
Medicine management system:
- Adding medicines with schedules
- Viewing medicine list
- Marking doses as taken
- Browser notifications
- Reminder management

### 6. Complete System Architecture
High-level overview showing:
- Patient and doctor flows
- Frontend-backend interactions
- Database operations
- Authentication flow
- Data storage

### 7. Mobile Login Issue Analysis
Comparison diagram showing:
- Current issue with session persistence
- Fixed implementation
- Mobile-specific considerations

## System Components

### Frontend
- **React App**: Main application interface
- **Symptom Checker**: AI-powered disease prediction
- **Appointments Page**: Doctor booking interface
- **Doctor Portal**: Separate interface for doctors
- **Dashboard**: User overview and quick actions

### Backend (Supabase)
- **Auth**: User authentication and session management
- **Database**: PostgreSQL with RLS policies
- **Storage**: File storage (future feature)
- **Realtime**: Live updates for appointments

### Client-Side Services
- **Disease Prediction Engine**: Local symptom analysis
- **Notification Service**: Browser notifications for reminders

## Key Features Illustrated

1. **Authentication**
   - Email/password registration
   - Secure login with JWT tokens
   - Session persistence (mobile-optimized)
   - Password reset flow

2. **Symptom Analysis**
   - Real-time symptom suggestions
   - Symptom type selection
   - Severity assessment
   - Multi-disease prediction
   - Confidence scoring

3. **Appointment Management**
   - Doctor search and filtering
   - Real-time availability
   - Booking confirmation
   - Status tracking
   - Doctor-patient communication

4. **Doctor Features**
   - Separate authentication
   - Appointment queue management
   - Patient history access
   - Diagnosis and prescription entry

5. **Medicine Reminders**
   - Schedule management
   - Browser notifications
   - Dose tracking
   - History logging

## Mobile Optimization

The diagrams include mobile-specific considerations:
- Session persistence using localStorage + cookies
- Custom storage implementation
- Auth state listeners
- Token refresh handling
- Offline capability considerations

## Database Schema (Referenced in Diagrams)

### Tables
- `users`: Patient profiles
- `doctors`: Doctor profiles
- `appointments`: Appointment records
- `symptom_checks`: Symptom analysis history
- `medicines`: Medicine reminders

### Row Level Security (RLS)
All tables have RLS policies ensuring:
- Users can only access their own data
- Doctors can only see their appointments
- Secure data isolation

## API Endpoints (Supabase)

All interactions use Supabase client library:
- `supabase.auth.*`: Authentication
- `supabase.from('table').*`: Database operations
- `supabase.storage.*`: File operations (future)

## Error Handling

Diagrams show error handling for:
- Authentication failures
- Network errors
- Invalid data
- Session expiration
- Database constraints

## Future Enhancements

Potential additions to diagrams:
- Video consultation flow
- Lab report upload
- Prescription management
- Payment integration
- Multi-language support

## Contributing

To add new diagrams:
1. Add new `@startuml` block in `sequence-diagrams.puml`
2. Follow existing naming conventions
3. Include error handling paths
4. Add documentation in this README
5. Test rendering in PlantUML editor

## License

These diagrams are part of the Health Assistant project documentation.
