# Mobile Responsive Testing Checklist

**Feature**: Mobile Responsive Design for Majors & Courses Pages  
**Last Updated**: December 24, 2024  
**Implementation**: [MOBILE_RESPONSIVE_IMPLEMENTATION.md](../MOBILE_RESPONSIVE_IMPLEMENTATION.md)

---

## 📱 Device Testing Matrix

### Viewport Sizes to Test

| Device             | Viewport        | Priority    | Browser                    |
| ------------------ | --------------- | ----------- | -------------------------- |
| iPhone SE          | 320px × 568px   | 🔴 Critical | Safari Mobile              |
| iPhone 13          | 390px × 844px   | 🔴 Critical | Safari Mobile              |
| iPhone 14 Pro      | 393px × 852px   | 🟡 High     | Safari Mobile              |
| Samsung Galaxy S22 | 360px × 800px   | 🔴 Critical | Chrome Mobile              |
| iPad (Portrait)    | 768px × 1024px  | 🟡 High     | Safari                     |
| iPad (Landscape)   | 1024px × 768px  | 🟢 Medium   | Safari                     |
| Desktop HD         | 1920px × 1080px | 🟡 High     | Chrome/Firefox/Safari/Edge |

---

## ✅ Majors Page Testing

### Page Load & Layout (Mobile)

| Test                         | 320px | 390px | 768px | Status | Notes                         |
| ---------------------------- | ----- | ----- | ----- | ------ | ----------------------------- |
| Page is visible (not hidden) | ⬜    | ⬜    | ⬜    |        | No `hidden md:flex`           |
| No horizontal scroll         | ⬜    | ⬜    | ⬜    |        | Except table area             |
| Title renders correctly      | ⬜    | ⬜    | ⬜    |        | "Majors" visible              |
| Description is readable      | ⬜    | ⬜    | ⬜    |        | Not truncated                 |
| Padding is appropriate       | ⬜    | ⬜    | ⬜    |        | p-4 on mobile, p-8 on desktop |

### DataTable (Mobile)

| Test                       | 320px | 390px | 768px | Status | Notes                 |
| -------------------------- | ----- | ----- | ----- | ------ | --------------------- |
| Table scrolls horizontally | ⬜    | ⬜    | ⬜    |        | Smooth scroll         |
| Scroll performance 60fps   | ⬜    | ⬜    | ⬜    |        | Use DevTools          |
| All columns accessible     | ⬜    | ⬜    | ⬜    |        | Via horizontal scroll |
| Border displays correctly  | ⬜    | ⬜    | ⬜    |        | Rounded corners       |
| Empty state shows          | ⬜    | ⬜    | ⬜    |        | "No results" message  |

### Toolbar (Mobile)

| Test                           | 320px | 390px | 768px | Status | Notes                 |
| ------------------------------ | ----- | ----- | ----- | ------ | --------------------- |
| Stacks vertically              | ⬜    | ⬜    | N/A   |        | On mobile only        |
| Rows horizontally on desktop   | N/A   | N/A   | ⬜    |        | 768px+                |
| Filter input is full-width     | ⬜    | ⬜    | N/A   |        | On mobile             |
| Filter input height 44px+      | ⬜    | ⬜    | ⬜    |        | Touch-friendly        |
| Placeholder text visible       | ⬜    | ⬜    | ⬜    |        | "Filter majors..."    |
| Column visibility button works | ⬜    | ⬜    | ⬜    |        | Touch target adequate |

### Pagination (Mobile)

| Test                          | 320px | 390px | 768px | Status | Notes               |
| ----------------------------- | ----- | ----- | ----- | ------ | ------------------- |
| Stacks vertically             | ⬜    | ⬜    | N/A   |        | On mobile           |
| "Rows" label on mobile        | ⬜    | ⬜    | N/A   |        | Shortened           |
| "Rows per page" on desktop    | N/A   | N/A   | ⬜    |        | Full label          |
| First/Last buttons hidden     | ⬜    | ⬜    | ⬜    |        | Until lg breakpoint |
| Prev/Next buttons 44px+       | ⬜    | ⬜    | ⬜    |        | Touch-friendly      |
| Selection count hidden when 0 | ⬜    | ⬜    | N/A   |        | On mobile           |
| Page number visible           | ⬜    | ⬜    | ⬜    |        | "Page X of Y"       |

### Touch Interactions (Mobile)

| Test                             | 320px | 390px | 768px | Status | Notes             |
| -------------------------------- | ----- | ----- | ----- | ------ | ----------------- |
| Double-tap to edit label         | ⬜    | ⬜    | ⬜    |        | EditableLabelCell |
| Keyboard appears on edit         | ⬜    | ⬜    | ⬜    |        | Virtual keyboard  |
| Save on blur (tap outside)       | ⬜    | ⬜    | ⬜    |        | Touch interaction |
| No accidental edit during scroll | ⬜    | ⬜    | ⬜    |        | Scroll vs tap     |
| Column sort on tap               | ⬜    | ⬜    | ⬜    |        | Table header      |

---

## ✅ Courses Page Testing

### Page Load & Layout (Mobile)

| Test                         | 320px | 390px | 768px | Status | Notes               |
| ---------------------------- | ----- | ----- | ----- | ------ | ------------------- |
| Page is visible (not hidden) | ⬜    | ⬜    | ⬜    |        | No `hidden md:flex` |
| No horizontal scroll         | ⬜    | ⬜    | ⬜    |        | Except table area   |
| Title renders correctly      | ⬜    | ⬜    | ⬜    |        | "Courses" visible   |
| Add button visible           | ⬜    | ⬜    | ⬜    |        | PlusCircledIcon     |
| Add button position correct  | ⬜    | ⬜    | ⬜    |        | Aligned properly    |

### DataTable (Mobile)

| Test                       | 320px | 390px | 768px | Status | Notes          |
| -------------------------- | ----- | ----- | ----- | ------ | -------------- |
| Table scrolls horizontally | ⬜    | ⬜    | ⬜    |        | Smooth scroll  |
| Scroll performance 60fps   | ⬜    | ⬜    | ⬜    |        | Use DevTools   |
| All columns accessible     | ⬜    | ⬜    | ⬜    |        | Via scroll     |
| Action menu accessible     | ⬜    | ⬜    | ⬜    |        | Three-dot menu |

### Toolbar (Mobile)

| Test                      | 320px | 390px | 768px | Status | Notes                 |
| ------------------------- | ----- | ----- | ----- | ------ | --------------------- |
| Stacks vertically         | ⬜    | ⬜    | N/A   |        | On mobile             |
| Filter input full-width   | ⬜    | ⬜    | N/A   |        | On mobile             |
| Filter input height 44px+ | ⬜    | ⬜    | ⬜    |        | Touch-friendly        |
| Placeholder text correct  | ⬜    | ⬜    | ⬜    |        | "Filter courses..."   |
| Column visibility works   | ⬜    | ⬜    | ⬜    |        | Touch target adequate |

### Pagination (Mobile)

| Test                    | 320px | 390px | 768px | Status | Notes          |
| ----------------------- | ----- | ----- | ----- | ------ | -------------- |
| Stacks vertically       | ⬜    | ⬜    | N/A   |        | On mobile      |
| Prev/Next buttons 44px+ | ⬜    | ⬜    | ⬜    |        | Touch-friendly |
| Page navigation works   | ⬜    | ⬜    | ⬜    |        | All buttons    |
| Rows per page dropdown  | ⬜    | ⬜    | ⬜    |        | Touch-friendly |

### Dialogs - Add Course (Mobile)

| Test                                  | 320px | 390px | 768px | Status | Notes              |
| ------------------------------------- | ----- | ----- | ----- | ------ | ------------------ |
| Dialog opens full-screen              | ⬜    | ⬜    | N/A   |        | On mobile          |
| Dialog centered on tablet             | N/A   | N/A   | ⬜    |        | 768px+             |
| Title size responsive                 | ⬜    | ⬜    | ⬜    |        | text-lg sm:text-xl |
| Description size correct              | ⬜    | ⬜    | ⬜    |        | text-sm            |
| Form fields full-width                | ⬜    | ⬜    | ⬜    |        | Easy to fill       |
| Virtual keyboard doesn't break layout | ⬜    | ⬜    | ⬜    |        | dvh units          |
| Close button accessible               | ⬜    | ⬜    | ⬜    |        | Top-right X        |
| Save button accessible                | ⬜    | ⬜    | ⬜    |        | Touch target       |
| Dialog scrolls when needed            | ⬜    | ⬜    | ⬜    |        | Overflow content   |

### Dialogs - Edit Course (Mobile)

| Test                         | 320px | 390px | 768px | Status | Notes          |
| ---------------------------- | ----- | ----- | ----- | ------ | -------------- |
| Opens from dropdown menu     | ⬜    | ⬜    | ⬜    |        | Three-dot menu |
| Dialog full-screen on mobile | ⬜    | ⬜    | N/A   |        | h-[100dvh]     |
| Pre-filled form data visible | ⬜    | ⬜    | ⬜    |        | All fields     |
| Save changes works           | ⬜    | ⬜    | ⬜    |        | Updates data   |
| Cancel works                 | ⬜    | ⬜    | ⬜    |        | Closes dialog  |

### Dialogs - Delete Course (Mobile)

| Test                         | 320px | 390px | 768px | Status | Notes          |
| ---------------------------- | ----- | ----- | ----- | ------ | -------------- |
| Opens from dropdown menu     | ⬜    | ⬜    | ⬜    |        | Three-dot menu |
| Dialog full-screen on mobile | ⬜    | ⬜    | N/A   |        | h-[100dvh]     |
| Course code displayed        | ⬜    | ⬜    | ⬜    |        | Confirmation   |
| Delete button visible        | ⬜    | ⬜    | ⬜    |        | Red text       |
| Delete button works          | ⬜    | ⬜    | ⬜    |        | Removes course |
| Cancel works                 | ⬜    | ⬜    | ⬜    |        | Closes dialog  |

### Touch Interactions (Mobile)

| Test                             | 320px | 390px | 768px | Status | Notes          |
| -------------------------------- | ----- | ----- | ----- | ------ | -------------- |
| Dropdown menu opens on tap       | ⬜    | ⬜    | ⬜    |        | Three dots     |
| Menu items touch-friendly        | ⬜    | ⬜    | ⬜    |        | 44px height    |
| No accidental menu during scroll | ⬜    | ⬜    | ⬜    |        | Scroll vs tap  |
| Column sort on tap               | ⬜    | ⬜    | ⬜    |        | Table headers  |
| Add button easy to tap           | ⬜    | ⬜    | ⬜    |        | Top-right icon |

---

## 🎨 Dark/Light Theme Testing

| Test                     | Light Mode | Dark Mode | Notes           |
| ------------------------ | ---------- | --------- | --------------- |
| Majors page contrast     | ⬜         | ⬜        | WCAG AA 4.5:1   |
| Courses page contrast    | ⬜         | ⬜        | WCAG AA 4.5:1   |
| Dialog contrast          | ⬜         | ⬜        | Text readable   |
| Table borders visible    | ⬜         | ⬜        | Not too faint   |
| Focus indicators visible | ⬜         | ⬜        | On all elements |
| Hover states visible     | N/A        | N/A       | Desktop only    |

---

## 🌐 Cross-Browser Testing (Mobile)

### iOS Testing

| Test                | Safari 17+ | Chrome iOS | Firefox iOS | Status |
| ------------------- | ---------- | ---------- | ----------- | ------ |
| Majors page loads   | ⬜         | ⬜         | ⬜          |        |
| Courses page loads  | ⬜         | ⬜         | ⬜          |        |
| Dialogs work        | ⬜         | ⬜         | ⬜          |        |
| Touch interactions  | ⬜         | ⬜         | ⬜          |        |
| Virtual keyboard    | ⬜         | ⬜         | ⬜          |        |
| Table scroll smooth | ⬜         | ⬜         | ⬜          |        |

### Android Testing

| Test                | Chrome 120+ | Samsung Internet | Firefox Android | Status |
| ------------------- | ----------- | ---------------- | --------------- | ------ |
| Majors page loads   | ⬜          | ⬜               | ⬜              |        |
| Courses page loads  | ⬜          | ⬜               | ⬜              |        |
| Dialogs work        | ⬜          | ⬜               | ⬜              |        |
| Touch interactions  | ⬜          | ⬜               | ⬜              |        |
| Virtual keyboard    | ⬜          | ⬜               | ⬜              |        |
| Table scroll smooth | ⬜          | ⬜               | ⬜              |        |

---

## ♿ Accessibility Testing

### Screen Readers (Mobile)

| Test                      | VoiceOver (iOS) | TalkBack (Android) | Status |
| ------------------------- | --------------- | ------------------ | ------ |
| Page title announced      | ⬜              | ⬜                 |        |
| Table structure announced | ⬜              | ⬜                 |        |
| Column headers read       | ⬜              | ⬜                 |        |
| Cell content read         | ⬜              | ⬜                 |        |
| Button labels clear       | ⬜              | ⬜                 |        |
| Dialog announced          | ⬜              | ⬜                 |        |
| Form labels read          | ⬜              | ⬜                 |        |
| Error messages read       | ⬜              | ⬜                 |        |

### Keyboard Navigation (Mobile Browsers)

| Test                           | Chrome | Safari | Firefox | Status |
| ------------------------------ | ------ | ------ | ------- | ------ |
| Tab through controls           | ⬜     | ⬜     | ⬜      |        |
| Filter input focused           | ⬜     | ⬜     | ⬜      |        |
| Pagination keyboard accessible | ⬜     | ⬜     | ⬜      |        |
| Dialog keyboard navigable      | ⬜     | ⬜     | ⬜      |        |
| Escape closes dialog           | ⬜     | ⬜     | ⬜      |        |
| Enter submits forms            | ⬜     | ⬜     | ⬜      |        |

### Visual Accessibility

| Test                      | 320px | 390px | 768px | Status |
| ------------------------- | ----- | ----- | ----- | ------ |
| Text minimum 16px         | ⬜    | ⬜    | ⬜    |        |
| Color contrast 4.5:1      | ⬜    | ⬜    | ⬜    |        |
| Focus indicators visible  | ⬜    | ⬜    | ⬜    |        |
| Touch targets 44x44px+    | ⬜    | ⬜    | ⬜    |        |
| No color-only information | ⬜    | ⬜    | ⬜    |        |

---

## ⚡ Performance Testing

### Lighthouse Audit (Mobile)

| Metric                         | Target  | Majors | Courses | Notes        |
| ------------------------------ | ------- | ------ | ------- | ------------ |
| Performance Score              | ≥ 90    | ⬜     | ⬜      | Use DevTools |
| Accessibility Score            | ≥ 95    | ⬜     | ⬜      |              |
| Best Practices                 | ≥ 95    | ⬜     | ⬜      |              |
| FCP (First Contentful Paint)   | < 1.5s  | ⬜     | ⬜      | On 3G        |
| LCP (Largest Contentful Paint) | < 2.5s  | ⬜     | ⬜      | On 3G        |
| CLS (Cumulative Layout Shift)  | < 0.1   | ⬜     | ⬜      |              |
| FID (First Input Delay)        | < 100ms | ⬜     | ⬜      |              |

### Scroll Performance

| Test                         | 320px | 390px | 768px | Status |
| ---------------------------- | ----- | ----- | ----- | ------ |
| Table scroll 60fps           | ⬜    | ⬜    | ⬜    |        |
| No jank during scroll        | ⬜    | ⬜    | ⬜    |        |
| Smooth filter typing         | ⬜    | ⬜    | ⬜    |        |
| Quick pagination response    | ⬜    | ⬜    | ⬜    |        |
| Dialog open animation smooth | ⬜    | ⬜    | ⬜    |        |

---

## 🧪 Edge Cases

### Data Edge Cases

| Test                               | Status | Notes                          |
| ---------------------------------- | ------ | ------------------------------ |
| Very long major label (200+ chars) | ⬜     | Test truncation                |
| Special characters in names        | ⬜     | Unicode, emojis                |
| Empty data state                   | ⬜     | "No results" message           |
| Single row                         | ⬜     | Pagination hidden              |
| 100+ rows                          | ⬜     | Performance with large dataset |
| 20+ columns                        | ⬜     | Horizontal scroll extent       |

### Network Edge Cases

| Test               | Status | Notes          |
| ------------------ | ------ | -------------- |
| Slow 3G connection | ⬜     | Loading states |
| Offline mode       | ⬜     | Error handling |
| API timeout        | ⬜     | Error message  |
| 401 JWT expiration | ⬜     | Auto-logout    |

### Device Edge Cases

| Test                  | Status | Notes                          |
| --------------------- | ------ | ------------------------------ |
| Landscape orientation | ⬜     | Both pages                     |
| Portrait orientation  | ⬜     | Both pages                     |
| Browser zoom 150%     | ⬜     | No overflow                    |
| Browser zoom 200%     | ⬜     | No overflow                    |
| High contrast mode    | ⬜     | Visibility                     |
| Reduced motion        | ⬜     | Transitions respect preference |

---

## 📝 Testing Notes

### How to Test

1. **Chrome DevTools Device Emulation**:

   ```
   F12 → Toggle Device Toolbar (Ctrl+Shift+M)
   Select device from dropdown or enter custom dimensions
   Test touch interactions with mouse click
   ```

2. **Real Device Testing** (Recommended):

   - Connect phone via USB
   - Enable USB debugging (Android) or Safari Web Inspector (iOS)
   - Access local dev server via network IP
   - Example: `http://192.168.1.100:3000/admin/majors/list`

3. **Lighthouse Audit**:

   ```
   Chrome DevTools → Lighthouse tab
   Select "Mobile" mode
   Categories: Performance, Accessibility, Best Practices
   Click "Analyze page load"
   ```

4. **Screen Reader Testing**:

   - **iOS**: Settings → Accessibility → VoiceOver → ON
   - **Android**: Settings → Accessibility → TalkBack → ON

5. **Performance Measurement**:
   ```
   Chrome DevTools → Performance tab
   Click record, scroll table, stop recording
   Check for 60fps (green line), identify jank (red)
   ```

### Testing Priority

1. **🔴 Critical** (Must Pass):

   - Page visible on mobile (not hidden)
   - No horizontal page scroll
   - All touch targets ≥ 44px
   - Dialogs work on mobile

2. **🟡 High** (Should Pass):

   - 60fps scroll performance
   - Lighthouse Performance ≥ 90
   - Screen reader announces correctly
   - Works on target devices

3. **🟢 Medium** (Nice to Have):
   - Works on all browsers
   - Landscape orientation optimal
   - High zoom levels work

---

## ✅ Sign-Off

### Tester Information

| Role                     | Name | Date | Signature |
| ------------------------ | ---- | ---- | --------- |
| Developer                |      |      |           |
| QA Engineer              |      |      |           |
| Product Owner            |      |      |           |
| Accessibility Specialist |      |      |           |

### Test Summary

- **Total Tests**: **\_** / **\_**
- **Passed**: **\_**
- **Failed**: **\_**
- **Blocked**: **\_**
- **Not Tested**: **\_**

### Critical Issues Found

1.
2.
3.

### Approval

- [ ] All critical tests passed
- [ ] All high priority tests passed
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Performance targets met
- [ ] Ready for production deployment

**Approved By**: ******\_\_\_\_******  
**Date**: ******\_\_\_\_******

---

**Last Updated**: December 24, 2024  
**Related Documents**:

- [MOBILE_RESPONSIVE_IMPLEMENTATION.md](../MOBILE_RESPONSIVE_IMPLEMENTATION.md)
- [spec-design-mobile-responsive-majors-courses.md](../spec/spec-design-mobile-responsive-majors-courses.md)
- [feature-mobile-responsive-majors-courses-1.md](../plan/feature-mobile-responsive-majors-courses-1.md)
