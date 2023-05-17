import Link from 'next/link';

const Navbar = () => {
  return (
    <div>
      <nav>
        <ul>
          <div>
            <li>
              <Link href="/login">Log in</Link>
            </li>
            <li>
              <Link href="/signup">Register</Link>
            </li>
          </div>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
