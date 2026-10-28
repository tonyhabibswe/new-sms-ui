# Student Management System (SMS)

## Quick Start Guide

**Version:** 2.0  
**Last Updated:** October 28, 2026

---

## Demo Available

Try SMS yourself with our live demo:

**URL:** https://demo-sms.codewitht.com/  
**Username:** admin  
**Password:** Th1s1s@wes0me

---

## Table of Contents

1. [Welcome to SMS](#welcome-to-sms)
2. [Getting Started](#getting-started)
3. [Managing Semesters](#managing-semesters)
4. [Course Sections and Students](#course-sections-and-students)
5. [Taking Attendance](#taking-attendance)
6. [Working with the Gradebook](#working-with-the-gradebook)
7. [Managing Courses](#managing-courses)
8. [Managing Majors](#managing-majors)
9. [Using SMS on a Phone](#using-sms-on-a-phone)

---

## Welcome to SMS

The Student Management System is your one-stop platform for managing academic activities. Whether you're an instructor taking attendance or an administrator planning a semester, SMS makes it simple.

### What You Can Do

📅 **Plan Semesters** - Set up terms, their holidays and their course sections  
📖 **Manage Courses** - Keep your course catalog and passing grades  
🎓 **Track Majors** - Give each academic program a clear name  
✅ **Take Attendance** - Mark each session in a few taps  
📊 **Enter Grades** - Use a weighted gradebook with Excel export  
📱 **Access Anywhere** - Works on desktop, tablet, and phone

---

## Getting Started

### Sign In

1. Open your browser and go to your institution's SMS website
2. Enter your **username** and **password** (tap the eye icon to check what you typed)
3. Click **"Sign in"**

### Finding Your Way Around

- **On a computer:** the menu on the left has **Semesters**, **Courses** and **Majors**
- **On a phone:** the same pages are in the tab bar at the bottom, next to **Account**
- **Breadcrumbs** at the top show where you are once you open a semester, a section or a course. Click any of them to go back up. On a phone, use the **‹** back link instead
- **Your account** is at the bottom of the left menu (or the **Account** tab on a phone). Open it to switch the **Theme** (Light, Dark or System) or to **Log out**

---

## Managing Semesters

Semesters organize your academic calendar. Each one holds its holidays and its course sections.

### The Semesters Page

- The **current semester** sits at the top with its progress through the term and links to its course sections and holidays
- **Other semesters** are listed below as cards. Use the search box, or the **All / Upcoming / Ended** filters, to find one

### Add a New Semester

1. Go to **Semesters**
2. Click **"New semester"**
3. Enter the name, the start date and the end date
4. Pick the holiday dates (you can name them later)
5. Click **"Save changes"**

### Open, Rename or Delete a Semester

- Click a semester's name to open it
- To rename a semester, open it and click **"Edit semester"**
- Semesters in the list below the current one also have a **⋯** button → **"Edit"** or **"Delete"**

### Holidays

1. Open a semester and switch to its **Holidays** tab
2. Click **"Add holiday"**, pick the date and enter a name, then **"Save changes"**
3. To rename a holiday, **double-click** its name, type, and press Enter

---

## Course Sections and Students

A course section is one class of a course in a semester, like CS101 · A in Fall 2026.

### Add a Course Section

1. Open a semester (its **Course sections** tab opens first)
2. Click **"Add course section"**
3. Choose the course, then enter the section, the days, the start and end time and the room. You can also pick a curve algorithm
4. Click **"Save changes"**

SMS schedules the section's sessions on the chosen days for the whole semester and skips the holidays.

### The Section Page

Click a section's course code to open its page. It shows:

- **Today's session** (or the latest one) with a **"Take attendance"** button
- Shortcuts to the **Gradebook**, the **Sessions**, the **Students** and **Import CSV**

### Section Actions

The **⋯** button on each section in the list offers:

- **Sessions** and **Gradebook** (also shown as buttons on a computer)
- **Add a student** - enter the student ID, names, major, email and campus
- **Import students (CSV)** - choose the class list CSV file to enrol everyone at once
- **Edit section** - change the section code or the curve algorithm
- **Delete section**

---

## Taking Attendance

### Open a Session

1. Open a course section and go to **Sessions** (or click **"Take attendance"** on the section page)
2. Sessions are listed up to today, newest first. Today's session is marked **Today**
3. Click **"Attendance"** next to the session you want

To add an extra session, click **"Add session"** and enter the date, times and room.

### Mark Students

- Each student has a **Present | Absent** switch. Tap one and it's saved right away
- **"Mark everyone present"** marks the whole class in one go
- On a computer, tick students (or **Select all**), then click **"Set present"** or **"Set absent"**
- Use the search box, or the **All / Present / Absent / Not marked** filters, to find students quickly
- Students marked **Holiday**, **Exam** or **Dismissed** show that label instead of the switch

The counts at the top update as you go. Look for **"Saved as you mark it"**: there is no save button to press.

### Export Attendance

Click **"Export attendance"** to download the section's attendance as an Excel file. On a phone, export it from the gradebook's **Students** tab.

---

## Working with the Gradebook

The Gradebook is where you set up grading, enter grades and manage the students of a section.

### Opening the Gradebook

Open a course section and click **"Gradebook"** (from its page, its **⋯** menu, or the button in the list).

### The Three Tabs

---

### Tab 1: Grades

**Enter student grades here - works like a spreadsheet!**

- Each row = one student, each column = one grade item
- Click a grade, type the new value, and press Enter (Esc cancels)
- Changed grades are outlined in blue until you save
- Click **"Save"** (it shows how many changes you have), or **"Discard"** to undo them

**The system automatically calculates:**
- Category averages
- Final grade
- Letter grade (failing grades are highlighted)
- Curved final and letter grades (the same as the final grade unless the section has a curve)

You'll also find the **class average**, a **search** box, **"Export to Excel"** and a refresh button here.

> **On a phone:** pick an item at the top, then enter each student's grade down the list and tap **"Save"** in the bar at the bottom.

---

### Tab 2: Categories & Items

**Set up your grading structure here.** On a phone this tab is called **Setup**.

**Categories:**

- Create categories like "Assignments", "Exams" or "Projects"
- Give each one a weight. The box above the list tells you whether the weights add up to 100%

**Items:**

- Select a category to see its items (the first one is selected for you)
- Add items like "Midterm" or "Homework 1" with their maximum points

**Example:**

1. Click **"Add category"** → Name: "Assignments", Weight: 40
2. Select it → Click **"Add item"** → Title: "Assignment 1", Max points: 100
3. Use the pencil to edit, or the bin to delete

> **Important:** Category weights must total 100% for final grades to be accurate

---

### Tab 3: Students

**See everyone enrolled in the section.**

- Each student's absences, sessions marked and total sessions
- Search by first or last name
- **"Export attendance"** downloads the section's attendance

**Update a Student's Status:**

Pick from the status list: Enrolled, Auditor, W (withdrawn), UW (unofficial withdrawal) or I (incomplete).

---

### Complete Workflow

1. **Categories & Items** → Create categories (weights must total 100%) and add grade items
2. **Grades** → Enter scores, check the calculated grades, click Save
3. **Students** → Keep enrolment statuses up to date

---

## Managing Courses

Your course catalog lives here.

### Add a New Course

1. Go to **Courses**
2. Click **"New course"**
3. Enter the course code and name
4. Click **"Save changes"**

Use the search box to find a course by code or name. The **⋯** button on a course lets you **edit** or **delete** it.

### Passing Grades

A passing grade is the final grade a student of a given major needs to pass the course in a given semester.

1. Click **"Passing grades"** on a course (or **⋯** → **"Passing grades"**)
2. Click **"Add passing grade"**
3. Choose the major and the semester, and enter the grade
4. Click **"Save"**

---

## Managing Majors

Majors are added automatically along with the students who study them, so there's nothing to create here.

### Rename a Major

Each major has a system name (from the student records) and an optional label. When a label is set, SMS shows it instead of the system name.

1. Go to **Majors**
2. **Double-click** a major's label
3. Type the new name and press Enter (Esc cancels)

---

## Using SMS on a Phone

SMS is built to work on your phone or tablet!

### Quick Tips

- **Navigation:** Use the tab bar at the bottom: Semesters, Courses, Majors and Account
- **Going back:** Tap the **‹** link at the top of the page
- **Lists:** Each row becomes a card. Tap **⋯** on a card for its actions
- **Forms:** Open over the page. Tap ✕ to close one without saving
- **Attendance and Gradebook:** These pages have their own bar at the bottom instead of the tab bar. Use the **‹** link to leave them

> **Pro Tip:** Selecting students and the **Columns** button are only on larger screens. Use a computer for bulk changes.

---

## Need Help?

### Common Questions

**Q: Can't sign in?**  
A: Check your username and password. Contact IT if you need a reset.

**Q: Grades not saving?**  
A: Click the **Save** button after entering grades. Changed grades stay outlined in blue until they're saved. A grade can't be higher than the item's maximum points.

**Q: Do I need to save attendance?**  
A: No. Each tap is saved straight away.

**Q: Where's the menu on my phone?**  
A: It's the tab bar at the bottom of the screen. On the attendance and gradebook pages, tap the **‹** link at the top to go back.

**Q: Changes not appearing?**  
A: Try refreshing the page.

### Get Support

Need more help? Contact your institution's IT support team.

---

## Quick Reference

### Navigation

- **Semesters** → Academic terms, their holidays and course sections
- **Courses** → Course catalog and passing grades
- **Majors** → Academic programs

### Course Section

- **Sessions** → Take attendance for each class
- **Gradebook** → Grades, grading setup and students

### Tips

- ✓ Use search boxes and filters to find things quickly
- ✓ Click ⋯ for more options
- ✓ Double-click to quick-edit names and labels
- ✓ Attendance saves itself, grades need **Save**

---

**Thank you for using SMS!**

_Version 2.0 | Last Updated: October 28, 2026_
