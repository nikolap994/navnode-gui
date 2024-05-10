import React from "react";
import Link from "next/link";

const Layout = ({ children }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8 px-4">{children}</div>
    </div>
  );
};

const Navbar = () => {
  return (
    <nav className="bg-blue-600 py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link className="text-white text-xl font-semibold" href="/">
          Home
        </Link>
        <Link className="text-white text-xl font-semibold" href="/server/">
          Servers
        </Link>
      </div>
    </nav>
  );
};

export default Layout;
