# Product Requirements Document (PRD)

## SIMASTER-VSYEN: Integrated University Academic Information System

**Document Version:** 1.0  
**Date:** March 2026  
**Status:** Draft — For Faculty and University IT Review  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals and Objectives](#3-goals-and-objectives)
4. [Scope](#4-scope)
5. [Stakeholders](#5-stakeholders)
6. [User Personas](#6-user-personas)
7. [Functional Requirements](#7-functional-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [System Architecture Overview](#9-system-architecture-overview)
10. [Integration Requirements](#10-integration-requirements)
11. [Security and Compliance](#11-security-and-compliance)
12. [Success Metrics](#12-success-metrics)
13. [Timeline and Milestones](#13-timeline-and-milestones)
14. [Risks and Mitigations](#14-risks-and-mitigations)
15. [Assumptions and Dependencies](#15-assumptions-and-dependencies)
16. [Glossary](#16-glossary)

---

## 1. Executive Summary

SIMASTER-VSYEN is a next-generation university academic information system designed to modernise and unify the academic management workflows currently distributed across multiple disconnected platforms. The system introduces an **AI-assisted, vision-powered attendance module** that leverages CCTV infrastructure and integrates seamlessly with the university's existing Learning Management System (LMS) to deliver real-time, accurate attendance tracking without manual intervention.

This document defines the product requirements for the initial release proposed to the Faculty and University IT department. It outlines user needs, system capabilities, integration points, and success criteria necessary to gain institutional approval and begin development.

---

## 2. Problem Statement

University faculties currently face several recurring operational pain-points:

| Pain Point | Current Impact |
|---|---|
| Manual attendance recording (paper sheets or manual LMS input) | Time-consuming, error-prone, easily falsified |
| Disconnected systems (SIA, LMS, student portals) | Data duplication, inconsistent records, high administrative overhead |
| No real-time visibility into attendance patterns | Faculty and advisors cannot intervene early for at-risk students |
| Slow academic reporting cycles | Decisions based on stale data; delayed support for struggling students |
| No centralised audit trail | Difficult to resolve disputes or produce reports for accreditation |

The core challenge is that **existing tools were not designed to work together**, resulting in friction for every role in the academic ecosystem.

---

## 3. Goals and Objectives

### Primary Goal
Provide a unified, secure, and reliable academic information platform that automates routine processes and enables data-driven decision-making across the university.

### Objectives

1. **Automate attendance** — Reduce manual attendance recording effort by ≥ 90% through CCTV-based computer-vision recognition integrated with LMS records.
2. **Unify academic data** — Create a single source of truth for student records, course information, scheduling, and attendance across all faculties.
3. **Improve timeliness** — Deliver real-time dashboards and alerts so academic advisors can identify at-risk students within 24 hours of a missed attendance threshold.
4. **Reduce fraud** — Eliminate proxy attendance through biometric (face recognition) verification via existing CCTV infrastructure.
5. **Support accreditation** — Produce structured reports required for national and international accreditation bodies (BAN-PT, AUN-QA, etc.).

---

## 4. Scope

### In Scope (v1.0)

- **Attendance Management Module** — CCTV-integrated, LMS-synchronised, face-recognition-based attendance recording.
- **Student Academic Dashboard** — Personalised view of attendance history, grades, schedules, and academic standing.
- **Faculty Dashboard** — Per-class attendance report, grade entry, early-warning alerts.
- **Academic Advisor Portal** — Aggregate view of advisee status; alert configuration; meeting scheduling.
- **LMS Integration** — Bi-directional sync with the university's existing LMS (Moodle / Canvas / etc.) for course, grade, and attendance data.
- **Administrative Reporting** — Automated generation of attendance, grade distribution, and accreditation reports.
- **CCTV Integration API** — Middleware to ingest video feeds from existing IP cameras; perform face detection and recognition; return attendance events.
- **Role-Based Access Control (RBAC)** — Granular permissions for student, lecturer, advisor, faculty admin, and university IT roles.
- **Audit Log** — Immutable, time-stamped log of all system actions for compliance.

### Out of Scope (v1.0)

- Financial / tuition management
- Library management system
- Dormitory management
- Alumni portal
- Mobile native applications (web-responsive only for v1.0)

---

## 5. Stakeholders

| Stakeholder | Role | Primary Interest |
|---|---|---|
| Rector / Vice Rector Academic | Executive sponsor | ROI, accreditation compliance, strategic alignment |
| Faculty Dean | Faculty approver | Reliability, ease of adoption, faculty autonomy |
| Head of Academic Administration | Operations lead | Process automation, report quality |
| Lecturers / Teaching Staff | Primary end users | Minimal workflow disruption, accuracy |
| Academic Advisors / PA | End users | Early-warning data, advisee overview |
University IT Department | Technical owner | Security, maintainability, infrastructure fit |
| Students | End users | Transparency of records, dispute resolution |
| Quality Assurance / Accreditation Unit | Compliance users | Report generation, audit trail |

---

## 6. User Personas

### Persona 1 — Andi (Lecturer)
- **Background:** Senior lecturer, teaches 4 classes per semester, 30–40 students each.
- **Pain today:** Spends 5–10 minutes per session on manual attendance. Occasionally disputes from students claiming false absences.
- **Goal:** Walk into class, start teaching; attendance handled automatically. Review report from phone if needed.

### Persona 2 — Sari (Student)
- **Background:** Third-year undergraduate, active in student organisations.
- **Pain today:** Occasionally finds her attendance incorrectly recorded; appeals process is slow and opaque.
- **Goal:** See real-time attendance status; submit a correction request with evidence if needed; track progress toward minimum attendance requirements.

### Persona 3 — Budi (Academic Advisor)
- **Background:** Advises 25 students per semester.
- **Pain today:** Only discovers attendance issues at the semester midpoint when grades are at risk.
- **Goal:** Receive automated alerts when a student's attendance drops below 75%; schedule advisory meetings directly from the portal.

### Persona 4 — Dewi (Faculty Admin)
- **Background:** Manages academic data for 3 departments.
- **Pain today:** Manually collates Excel sheets from lecturers; produces accreditation reports quarterly.
- **Goal:** One-click export of standardised attendance and grade reports; no manual data aggregation.

### Persona 5 — IT Admin (University IT)
- **Background:** Manages campus network, servers, and existing CCTV infrastructure.
- **Pain today:** Asked to support ad-hoc data requests from multiple systems with no unified API.
- **Goal:** A maintainable system with well-documented APIs, role-based security, and minimal new hardware requirements.

---

## 7. Functional Requirements

### 7.1 Attendance Management Module

| ID | Requirement | Priority |
|---|---|---|
| ATT-01 | System shall capture student faces from CCTV feeds at the start of each scheduled class session. | Must Have |
| ATT-02 | System shall identify registered students via face recognition with ≥ 95% accuracy under normal classroom lighting conditions. | Must Have |
| ATT-03 | System shall mark attendance (Present / Late / Absent) and sync the result to the LMS within 5 minutes of class start. | Must Have |
| ATT-04 | System shall allow lecturers to manually override any auto-generated attendance record, with a mandatory reason field. | Must Have |
| ATT-05 | Students shall be able to submit an attendance correction request with supporting evidence (document upload). | Must Have |
| ATT-06 | System shall calculate and display cumulative attendance percentage per student per course in real time. | Must Have |
| ATT-07 | System shall generate an alert when a student's attendance falls below the configurable threshold (default: 75%). | Must Have |
| ATT-08 | System shall support online / hybrid class sessions where attendance is determined by LMS login activity and duration. | Should Have |
| ATT-09 | System shall produce a daily digest report of attendance anomalies for faculty admin review. | Should Have |
| ATT-10 | System shall store raw video events (face-match timestamps) in an audit log, not raw video footage. | Must Have |

### 7.2 Student Academic Dashboard

| ID | Requirement | Priority |
|---|---|---|
| STU-01 | Students shall view their full attendance history per course, per semester. | Must Have |
| STU-02 | Students shall see their current cumulative GPA and per-course grade status. | Must Have |
| STU-03 | Students shall view their class schedule with room and lecturer information. | Must Have |
| STU-04 | Students shall track the status of submitted attendance correction requests. | Must Have |
| STU-05 | Students shall receive in-app and email notifications for attendance warnings. | Should Have |

### 7.3 Faculty Dashboard

| ID | Requirement | Priority |
|---|---|---|
| FAC-01 | Lecturers shall view per-session and cumulative attendance for each enrolled student. | Must Have |
| FAC-02 | Lecturers shall enter, edit, and finalise grades through the system. | Must Have |
| FAC-03 | Lecturers shall export attendance and grade reports as PDF and XLSX. | Must Have |
| FAC-04 | Lecturers shall approve or reject student attendance correction requests. | Must Have |
| FAC-05 | Lecturers shall receive alerts for students below the attendance threshold. | Should Have |

### 7.4 Academic Advisor Portal

| ID | Requirement | Priority |
|---|---|---|
| ADV-01 | Advisors shall view an aggregate dashboard of all advisees' attendance and academic standing. | Must Have |
| ADV-02 | Advisors shall configure personal alert thresholds per advisee. | Should Have |
| ADV-03 | Advisors shall log and track advisory meeting notes within the system. | Should Have |

### 7.5 Administrative and Reporting

| ID | Requirement | Priority |
|---|---|---|
| ADM-01 | Admins shall generate accreditation-ready attendance and grade reports per department, faculty, and university. | Must Have |
| ADM-02 | Reports shall be exportable as PDF and XLSX in formats compatible with BAN-PT requirements. | Must Have |
| ADM-03 | Admins shall manage course schedules, room assignments, and faculty assignments. | Must Have |
| ADM-04 | Admins shall manage user accounts and role assignments. | Must Have |
| ADM-05 | System shall maintain an immutable audit log accessible to authorised admin and IT roles. | Must Have |

---

## 8. Non-Functional Requirements

### 8.1 Performance

| ID | Requirement |
|---|---|
| NFR-P01 | Attendance recognition pipeline shall complete within 3 minutes of class session start for classes up to 50 students. |
| NFR-P02 | Web application pages shall load within 2 seconds for 95th percentile of requests under normal load. |
| NFR-P03 | System shall support at least 5,000 concurrent users (peak: semester start / exam period). |
| NFR-P04 | LMS sync shall occur within 5 minutes of any attendance event. |

### 8.2 Availability and Reliability

| ID | Requirement |
|---|---|
| NFR-A01 | System uptime target: 99.5% during academic semesters (excluding planned maintenance windows). |
| NFR-A02 | Planned maintenance windows shall be scheduled outside peak hours (06:00–22:00 local time on weekdays). |
| NFR-A03 | System shall implement a fallback manual attendance mode in case CCTV pipeline is unavailable. |

### 8.3 Security

| ID | Requirement |
|---|---|
| NFR-S01 | All data in transit shall be encrypted using TLS 1.2 or higher. |
| NFR-S02 | Biometric data (face embeddings) shall be stored encrypted at rest and never exposed via API in raw form. |
| NFR-S03 | Authentication shall support Single Sign-On (SSO) via the university's existing Identity Provider (IdP). |
| NFR-S04 | All user actions shall be logged with user ID, timestamp, and action type. |
| NFR-S05 | Role-based access control shall enforce the principle of least privilege. |

### 8.4 Usability

| ID | Requirement |
|---|---|
| NFR-U01 | UI shall be fully responsive and functional on desktop browsers (Chrome, Firefox, Edge — latest 2 versions). |
| NFR-U02 | System shall support Bahasa Indonesia as the primary language with an English toggle. |
| NFR-U03 | Core workflows (attendance review, grade entry) shall be completable in ≤ 3 clicks from the dashboard. |

### 8.5 Maintainability

| ID | Requirement |
|---|---|
| NFR-M01 | Codebase shall follow documented coding standards and include unit tests with ≥ 80% code coverage. |
| NFR-M02 | System shall expose a versioned REST/GraphQL API for future integration with other university systems. |
| NFR-M03 | Deployment shall be containerised (Docker/Kubernetes) to allow horizontal scaling on university infrastructure. |

---

## 9. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SIMASTER-VSYEN Platform                       │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Student      │  │  Lecturer /  │  │  Admin /      │              │
│  │  Dashboard    │  │  Advisor     │  │  IT Portal    │              │
│  │  (Web App)    │  │  Portal      │  │               │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         └────────────────┬┘                  │                       │
│                          ▼                   │                       │
│              ┌─────────────────────┐         │                       │
│              │    API Gateway /    │◄────────┘                       │
│              │    Auth (SSO)       │                                  │
│              └────────┬────────────┘                                 │
│                       │                                               │
│         ┌─────────────┼─────────────┐                               │
│         ▼             ▼             ▼                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐                  │
│  │Attendance│  │ Academic │  │  Reporting /      │                  │
│  │ Service  │  │ Records  │  │  Notification     │                  │
│  │          │  │ Service  │  │  Service          │                  │
│  └────┬─────┘  └────┬─────┘  └──────────────────┘                  │
│       │              │                                                │
│       ▼              ▼                                               │
│  ┌──────────────────────────────────────────┐                       │
│  │          Core Database (PostgreSQL)       │                       │
│  │          + Audit Log Store                │                       │
│  └──────────────────────────────────────────┘                       │
│                                                                       │
│  ┌──────────────────────────────────────────┐                       │
│  │         Vision / AI Pipeline              │                       │
│  │  CCTV Feed Ingestion → Face Detection    │                       │
│  │  → Face Recognition → Attendance Event   │                       │
│  └──────────────────────────────────────────┘                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 10. Integration Requirements

### 10.1 LMS Integration

| Aspect | Detail |
|---|---|
| Supported LMS | Moodle (primary), with abstraction layer for future Canvas/Google Classroom support |
| Protocol | REST API (Moodle Web Services) |
| Data synced | Course enrolments, session schedules, attendance records, grades |
| Sync direction | Bi-directional; SIMASTER-VSYEN is the authoritative source for attendance |
| Frequency | Near-real-time (event-driven) for attendance; batch nightly for grade sync |

### 10.2 CCTV Integration

| Aspect | Detail |
|---|---|
| Camera type | Existing IP cameras (RTSP stream compatible) |
| New hardware required | Edge processing unit per classroom (optional; can use central server if bandwidth allows) |
| Data retained | Face embedding vectors and match timestamps only; raw video not stored by SIMASTER-VSYEN |
| Fallback | Manual attendance entry via lecturer interface if camera is offline |

### 10.3 University SSO / Identity Provider

| Aspect | Detail |
|---|---|
| Protocol | SAML 2.0 / OAuth 2.0 / OpenID Connect (to match university IdP) |
| User provisioning | Auto-provisioned on first SSO login; synced nightly with university HR/student system |
| Role mapping | Mapped from university IdP groups/attributes |

---

## 11. Security and Compliance

### Biometric Data Handling
- Face recognition embeddings (mathematical vectors) are classified as **sensitive personal data** under Indonesian Personal Data Protection Law (UU PDP No. 27/2022).
- Embeddings are stored encrypted (AES-256) with keys managed via a Hardware Security Module (HSM) or equivalent KMS.
- Embeddings are never returned in API responses; only derived data (attendance status) is exposed.
- Students shall be informed of biometric data processing via a clear consent notice at first login.

### Data Residency
- All data shall be stored on university-owned or university-contracted infrastructure within Indonesia.

### Penetration Testing
- A third-party penetration test shall be conducted before go-live and annually thereafter.

### Compliance
- UU PDP No. 27/2022 (Indonesian Personal Data Protection)
- Permendikbudristek regulations on academic administration
- BAN-PT accreditation data requirements

---

## 12. Success Metrics

| Metric | Baseline (current) | Target (end of Year 1) |
|---|---|---|
| Time spent on manual attendance per session (lecturer) | 5–10 minutes | < 30 seconds (manual override only) |
| Attendance recording accuracy | ~85% (self-reported) | ≥ 97% (verified by audit) |
| At-risk student early-alert lead time | ~8 weeks (midpoint review) | ≤ 5 business days from threshold breach |
| Accreditation report generation time | 3–5 days (manual) | < 1 hour (automated) |
| Student dispute resolution time | 5–10 business days | ≤ 2 business days |
| System uptime during semester | Not measured | ≥ 99.5% |

---

## 13. Timeline and Milestones

| Phase | Milestone | Target Completion |
|---|---|---|
| **Phase 0: Approval** | PRD approved by Faculty Dean and University IT | Month 1 |
| **Phase 1: Foundation** | System architecture, database schema, SSO integration, basic RBAC | Month 3 |
| **Phase 2: Core Academic** | Student & faculty dashboards, LMS integration, manual attendance | Month 5 |
| **Phase 3: Vision Pipeline** | CCTV integration, face recognition, automated attendance | Month 8 |
| **Phase 4: Reporting & Alerts** | Reporting module, early-warning alerts, advisor portal | Month 10 |
| **Phase 5: Pilot** | Controlled pilot with 2–3 departments | Month 11 |
| **Phase 6: Go-Live** | University-wide rollout | Month 13 |

---

## 14. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| CCTV infrastructure incompatible with RTSP ingestion | Medium | High | Conduct hardware audit in Phase 0; budget for partial camera upgrades if needed |
| Face recognition accuracy degraded by classroom lighting | Medium | High | Pilot testing in diverse lighting conditions; supplementary infrared sensors if required |
| Student or faculty resistance to biometric monitoring | High | Medium | Transparent communication, consent process, manual opt-out with alternative verification |
| LMS API changes breaking integration | Medium | Medium | Abstract LMS integration behind a stable internal API; version-pin LMS API calls |
| Data breach of biometric data | Low | Critical | Encryption at rest and in transit, access controls, penetration testing, incident response plan |
| Regulatory non-compliance (UU PDP) | Low | Critical | Legal review of data handling procedures before go-live |
| Scope creep delaying delivery | High | Medium | Fixed scope per phase; change control process for new requirements |

---

## 15. Assumptions and Dependencies

### Assumptions
- The university has an existing IP CCTV network in classrooms with accessible RTSP streams.
- A university-wide SSO / Identity Provider is already operational.
- An LMS (Moodle or equivalent) is in active use with a functioning Web Services API.
- University IT will provide server infrastructure meeting the specified requirements.
- Faculty and student data (names, enrolment, photos) can be sourced from the existing student information system.

### Dependencies
- Written approval from the Faculty Dean and University IT before Phase 1 begins.
- Access to CCTV RTSP streams and existing student photo database for face model training.
- University IT involvement in SSO integration and infrastructure provisioning.
- Legal clearance from university counsel on biometric data processing.

---

## 16. Glossary

| Term | Definition |
|---|---|
| BAN-PT | Badan Akreditasi Nasional Perguruan Tinggi — Indonesian national accreditation body for higher education |
| CCTV | Closed-Circuit Television — existing campus camera infrastructure used for vision-based attendance |
| Face Embedding | A mathematical vector representation of a face, used for recognition without storing raw images |
| LMS | Learning Management System (e.g., Moodle) — platform for course content, assignments, and grades |
| PRD | Product Requirements Document |
| RBAC | Role-Based Access Control |
| SIMASTER | Sistem Informasi Akademik Terpadu — Integrated Academic Information System |
| SSO | Single Sign-On — centralised university authentication |
| UU PDP | Undang-Undang Perlindungan Data Pribadi No. 27/2022 — Indonesian Personal Data Protection Law |
| VSYEN | Vision-Enabled — designation for the AI/computer-vision enhanced edition of SIMASTER |

---

*This document is prepared for internal faculty and university IT review. All requirements are subject to revision following stakeholder feedback.*
