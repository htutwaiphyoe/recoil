# EWSD Project: Columbia University

Internal Realtime Idea Sharing Application for Columbia University

## Table of contents

- Project Introduction
- Project Scope
- Project TechStack
- Project Management

## Project Introduction

Columbia University is a group project for the coursework of Enterprise Web Software Development subject. According to requirements, a secure role-based web application would be built with a group by using the agile scrum methodology.

## Project Scope

The system allows collecting ideas from staff to improve the quality of a large University. Each staff can share any ideas that documents can be attached with and gives the Thumbs Up, Thumbs Down or comments. Ideas can be submitted after staff have agreed Terms and Conditions of the University and tagged with additional categories which are managed by the QA manager. The system also allows anonymous ideas and comments. Submitting ideas and comments will be restricted by the closure date and the final closure date of the academic year. A QA coordinator manages each department and its staff and receives email notifications when staff submit an idea. The administrator will control the overall system.

## Project TechStack

- Programming Language: `TypeScript`
- Framework: `NextJS`
- Styling: `TailwindCSS`
- Component Library: `DaisyUI`
- Deployment Server: `Vercel`
- Realtime Database: `Firebase`
- Authentication: `Firebase Client SDK`

## Project Management

The Agile Scrum Methodology is used to develop the system. All members are assigned to each role in Scrum such as Information Architect, Scrum Master, Developer, Database Designer, Product Owner, Tester and Designer implementing all aspects of scrum in detail including user stories, product backlogs, sprints, sprint backlogs and scrum meetings.

## Project Features

1. Authentication
    1. Login
    2. Forgot Password
    3. Reset Password
    4. Logout
2. Authorization
    1. Admin
    2. QA Manager
    3. QA Coordinator
    4. Staff
3. Ideas and comments
    1. Realtime
    2. Anonymous
    3. Disabled after closure date
4. Thumbs up, Thumbs down
    1. Realtime
5. Idea Filters
    1. Most Popular Ideas
    2. Most Viewed Ideas
    3. Latest Ideas and Comments
    4. Categories
    5. Pagination
6. Email notifications
    - Notification for ideas to QA Coordinator
    - Notification for comments to author
7. Admin Dashboard
    1. Users
    2. Categories
    3. Departments
    4. Closure Dates
    5. Download idea attachments
8. Reports and statistics
    1. Ideas without Comments
    2. Anonymous ideas
    3. Anonymous Comments
    4. Top liked ideas
    5. Top commented ideas
    6. Ideas per department
    7. Ideas per category
9. UI/UX
    1. Responsive

## Project Credentials

| Email                    | Password   | Role            |
|--------------------------|------------|-----------------|
| <admin@mailinator.com>     | Admin2023  | Administrator   |
| <john@mailinator.com>      | John2023   | QA Manager      |
| <david@mailinator.com>     | David2023  | QA Coordinator  |
| <timmy@mailinator.com>     | Timmy2023  | Staff           |
