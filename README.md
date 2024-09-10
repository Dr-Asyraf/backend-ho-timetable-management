# Backend HO Timetable Management System

A timetable management system made for housemanship doctors (HOs) in a hospital department, adhering to specific shift rules and accommodating last-minute changes.
This timetable management system is built with Node.js, Express and PostgreSQL.
This project allows leaders to generate timetable by weeks for all HOs and leaders can manually adjust the shifts generated. Leaders can also add new wards into the system.
HOs can view their timetable of the current week

## Features

Leader:
- **Generate Timetable**: Generate a weekly timetable following the specific shift rules for all HOs.
- **Mark a HO as absent and get suggestions**: Leader can mark any HO absent and the system will suggest replacement based on the specific shift rules
- **List all shifts**: List all the shifts of a specific HO
- **Edit & Delete shifts**: Edit and delete specific shifts of any HO

HO:
- **View Timetable**: HOs can view their weekly shifts

## Prerequisites

- Node.js
- PostgreSQL
- npm

## Usage
- Deployed on render.com : https://backend-ho-timetable-management.onrender.com
