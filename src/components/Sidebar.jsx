import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  BookPlus, 
  Users, 
  UserPlus, 
  BookmarkCheck, 
  Clock 
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/books', label: 'Books', icon: BookOpen },
    { to: '/books/add', label: 'Add Book', icon: BookPlus },
    { to: '/students', label: 'Students', icon: Users },
    { to: '/students/add', label: 'Add Student', icon: UserPlus },
    { to: '/issues/new', label: 'Issue Book', icon: BookmarkCheck },
    { to: '/issues', label: 'Issued Books', icon: Clock },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">CL</div>
        <div>
          <div className="sidebar-title">College Library</div>
          <div className="sidebar-subtitle">Management System</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span className="nav-text">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        Academic Project • v1.0
      </div>
    </aside>
  );
}
