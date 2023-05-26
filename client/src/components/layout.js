import Navbar from './navbar';
import { useEffect, useState } from 'react';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
