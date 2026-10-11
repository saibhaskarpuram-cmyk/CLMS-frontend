import React from 'react';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Dashboard Overview',
  '/books': 'Book Inventory',
  '/books/add': 'Add New Book',
  '/students': 'Student Directory',
  '/students/add': 'Register Student',
  '/issues/new': 'Issue Book',
  '/issues': 'Issued Books Records',
};

export default function Navbar() {
  const location = useLocation();

  // Match edit paths or fallback
  let currentTitle = pageTitles[location.pathname];
  if (!currentTitle) {
    if (location.pathname.startsWith('/books/edit/')) currentTitle = 'Edit Book Details';
    else if (location.pathname.startsWith('/students/edit/')) currentTitle = 'Edit Student Details';
    else currentTitle = 'Library Management';
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-page-title">{currentTitle}</h1>
      </div>
      <div className="navbar-right">
        <span className="badge badge-blue">Academic Session 2026-27</span>
      </div>
    </header>
  );
}
