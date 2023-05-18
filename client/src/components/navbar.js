import Link from 'next/link';
import ButtonLogout from './logout';

const Navbar = () => {
  return (
    <div>
      <ul>
        <div>
          <li>
            <Link href="/login">
              <div>Log in</div>
            </Link>
          </li>
          <li>
            <Link href="/signup">
              <div>Register</div>
            </Link>
          </li>
          <li>
            <Link href="/event">
              <div>Event</div>
            </Link>
          </li>
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
