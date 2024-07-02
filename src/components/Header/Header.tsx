"use client";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link className="block flex-shrink-0" href="/dashboard/surveys">
            <Image
              width={32}
              height={32}
              src={"/images/logo/logo-icon.svg"}
              alt="Logo"
            />
          </Link>
        </div>

        <div className="hidden sm:block w-full mx-12">
          <ul className="unstyled">
            <li>
              <Link href="/dashboard/surveys/create">Create a Survey</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
