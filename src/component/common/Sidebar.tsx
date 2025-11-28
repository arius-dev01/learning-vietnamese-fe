import {
  faBook,
  faChartLine,
  faCog,
  faGamepad,
  faHome,
  faSignOutAlt,
  faUsers,
  faVolumeUp
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const menuItems = [
    { name: "Dashboard", link: "/admin/dashboard", icon: faChartLine, role: "ADMIN" },
    { name: "Users", link: "/admin/users", icon: faUsers, role: "ADMIN" },
    { name: "Lessons", link: "/admin/lessons", icon: faBook },
    { name: "Games", link: "/admin/games", icon: faGamepad },
    { name: "Vocabulary", link: "/admin/vocabularies", icon: faVolumeUp },
    // { name: "Reports", link: "/admin/reports", icon: faFileAlt },
  ];
  if(user == null) return null;
  const fullName = decodeURIComponent(escape(user.fullName));
  console.log(user);
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className='min-h-screen w-64 bg-white border-r border-gray-200 shadow-sm font-system'>
      <div className=''>
        <div className='p-6 border-b border-gray-200'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-sm border border-gray-200'>
              <FontAwesomeIcon icon={faCog} className='text-gray-600 text-lg' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-gray-900 tracking-tight'>Admin Panel</h2>
              <p className='text-gray-500 text-sm font-normal'>Management Console</p>
            </div>
          </div>
        </div>

        <nav className='p-4'>
          <ul className="space-y-1">
            {menuItems.filter(it => !it.role || it.role === user.role).map((item) => (
              <li key={item.link}>
                <Link
                  to={item.link}
                  className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm
                  transition-all duration-200 group
                  ${isActive(item.link)
                      ? 'bg-[#007AFF] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                `}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`text-base ${isActive(item.link) ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}
                  />
                  <span className='font-medium tracking-tight'>{item.name}</span>
                  {isActive(item.link) && (
                    <div className='ml-auto w-1.5 h-1.5 bg-white rounded-full opacity-90'></div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className='absolute bottom-0 w-64 p-4 border-t border-r border-gray-200 bg-white'>
        <div className='space-y-1'>
          {/* <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group"
          >
            <FontAwesomeIcon icon={faHome} className='text-base text-gray-500 group-hover:text-gray-700' />
            <span className='font-medium tracking-tight'>Back to App</span>
          </Link> */}

          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className='text-base text-red-500 group-hover:text-red-600' />
            <span className='font-medium tracking-tight'>Logout</span>
          </button>
        </div>

        <div className='mt-4 p-3 bg-gray-50 rounded-xl  shadow-sm'>
          <div className='flex items-center gap-3'>
            {/* <div className='w-9 h-9 bg-gradient-to-br from-[#007AFF] to-[#0056CC] rounded-full flex items-center justify-center shadow-sm'>
              <span className='text-white text-sm font-semibold'>A</span>
            </div> */}
            <div className='flex-1'>
              <p className='text-gray-900 text-sm font-semibold tracking-tight'>{user?.role}</p>
              <p className='text-gray-500 text-xs font-normal'>{fullName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
