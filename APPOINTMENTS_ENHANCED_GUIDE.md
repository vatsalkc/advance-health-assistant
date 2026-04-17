# Enhanced Appointments System - User Guide

## Overview
The enhanced appointments system provides a comprehensive solution for managing medical appointments with improved UI/UX, automatic status management, and detailed appointment views.

## Key Features

### 1. Clickable Dashboard Cards
- Click on "Appointments", "Active Medicines", or "Health Checks" cards on the dashboard
- Cards are now interactive with hover effects and visual feedback
- Automatically navigate to the respective sections

### 2. Tab-Based Appointment Navigation
The appointments page now features 5 organized tabs:

#### All Appointments
- View all your appointments in one place
- Search and book new appointments with doctors
- Quick access to all appointment actions

#### Today
- See only appointments scheduled for today
- Quick status updates (Mark as Completed)
- Highlighted with special styling

#### Upcoming
- View all future appointments
- Plan ahead with your medical schedule
- Modify or cancel upcoming appointments

#### Completed
- Historical record of completed appointments
- View diagnosis and prescriptions
- Read-only view for reference

#### Cancelled
- Track cancelled or rejected appointments
- View rejection reasons if provided
- Historical reference

### 3. Automatic Appointment Management

#### Auto-Cancel Expired Pending Appointments
- System automatically checks for expired pending appointments
- Appointments with past dates and "Pending" status are auto-cancelled
- Runs every minute in the background
- Notification shown when appointments are auto-cancelled

### 4. Appointment Details Popup

#### Click on Any Appointment Card
When you click on an appointment card, a detailed modal popup appears showing:

**Doctor Information:**
- Doctor name with avatar
- Specialization badge
- Visual identification

**Appointment Information:**
- Full date (e.g., "Monday, December 25, 2023")
- Time
- Status badge with color coding
- Reason for visit

**Patient Information:**
- Patient name
- Contact phone number

**Medical Information (if available):**
- Diagnosis details
- Prescription information
- Rejection reason (if rejected)

**Quick Actions:**
- Modify appointment (if not completed/rejected)
- Cancel appointment (if not completed/rejected)
- Close button

### 5. Status Management

#### Appointment Statuses:
- **Pending** (Yellow) - Waiting for doctor confirmation
- **Confirmed** (Green) - Doctor has confirmed the appointment
- **Completed** (Blue) - Appointment has been completed
- **Cancelled** (Red) - Appointment was cancelled
- **Rejected** (Red) - Doctor rejected the appointment

#### Status Actions:
- Mark today's confirmed appointments as "Completed"
- Modify pending/confirmed appointments
- Cancel pending/confirmed appointments

### 6. Enhanced UI/UX

#### Visual Improvements:
- Modern gradient header with purple theme
- Pill-style navigation tabs with badges showing counts
- Hover effects on clickable elements
- Smooth transitions and animations
- Today's appointments highlighted with special styling
- Color-coded status badges

#### Responsive Design:
- Mobile-friendly layout
- Adaptive grid system
- Touch-friendly buttons
- Collapsible navigation on small screens

### 7. Notification System

#### Toast Notifications:
- Success messages for completed actions
- Info messages for reminders
- Warning messages for cancellations
- Auto-dismiss after 5 seconds

#### Appointment Reminders:
- Automatic reminders for today's appointments
- Checks every minute for upcoming appointments
- Browser notifications (if enabled)

## How to Use

### Booking an Appointment

1. Navigate to Appointments page
2. Go to "All" tab
3. Search for a doctor by name, specialization, or qualification
4. Click "Book" button on the doctor card
5. Fill in the appointment form:
   - Select date (today or future)
   - Select time
   - Enter reason for visit
6. Click "Confirm Booking"
7. Wait for doctor confirmation

### Viewing Appointment Details

1. Click on any appointment card
2. A detailed popup will appear
3. Review all appointment information
4. Use action buttons if needed:
   - Modify to change date/time/reason
   - Cancel to cancel the appointment
   - Close to dismiss the popup

### Managing Appointments

#### Modify an Appointment:
1. Click on the appointment card or use "Modify" button
2. Update date, time, or reason
3. Click "Save Changes"
4. Status resets to "Pending" for doctor re-confirmation

#### Cancel an Appointment:
1. Click "Cancel" button on appointment card
2. Confirm cancellation in the popup
3. Appointment status changes to "Cancelled"

#### Mark as Completed:
1. Go to "Today" tab
2. Find confirmed appointments
3. Click "Mark Completed" button
4. Status changes to "Completed"

### Filtering Appointments

Use the tab navigation to filter:
- **All**: See everything
- **Today**: Focus on today's schedule
- **Upcoming**: Plan ahead
- **Completed**: Review history
- **Cancelled**: Check cancelled appointments

## Technical Details

### Auto-Cancellation Logic
```javascript
// Runs every 60 seconds
- Checks all appointments with status "Pending"
- Compares appointment date with today's date
- If appointment date < today's date:
  - Updates status to "Cancelled"
  - Shows notification
  - Refreshes appointment list
```

### Status Workflow
```
New Appointment → Pending
                    ↓
Doctor Confirms → Confirmed
                    ↓
Patient Attends → Completed

Alternative paths:
Pending → Cancelled (by patient or auto-cancel)
Pending → Rejected (by doctor)
Confirmed → Cancelled (by patient)
```

### Notification Timing
- Today's appointments: Checked every minute
- Auto-cancel check: Every minute
- Toast notifications: Auto-dismiss after 5 seconds

## Accessibility Features

- Keyboard navigation support
- Focus indicators on interactive elements
- ARIA labels for screen readers
- High contrast color schemes
- Responsive text sizing

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## Tips for Best Experience

1. **Enable Notifications**: Allow browser notifications for appointment reminders
2. **Check Today Tab**: Start your day by checking today's appointments
3. **Book in Advance**: Book appointments at least 24 hours in advance
4. **Keep Information Updated**: Ensure your profile has correct contact information
5. **Review Completed**: Check completed appointments for prescriptions and diagnosis

## Troubleshooting

### Appointments Not Showing
- Refresh the page
- Check your internet connection
- Verify you're logged in
- Check the correct tab (All/Today/Upcoming)

### Can't Book Appointment
- Ensure date is not in the past
- Check if time is not in the past (for today)
- Verify all required fields are filled
- Check if doctor is available

### Auto-Cancel Not Working
- System checks every minute
- Refresh page to see updates
- Only affects "Pending" appointments
- Only cancels appointments with past dates

## Future Enhancements

Planned features:
- Email notifications for appointment confirmations
- SMS reminders
- Calendar integration (Google Calendar, Outlook)
- Video consultation links
- Appointment rescheduling suggestions
- Doctor availability calendar
- Multi-language support

## Support

For issues or questions:
1. Check this guide first
2. Review the troubleshooting section
3. Contact system administrator
4. Check browser console for errors

---

**Last Updated**: December 2024
**Version**: 2.0 Enhanced