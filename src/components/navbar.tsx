import Link from "next/link";

import { createClient } from "@/utils/supabase/server";
import AccountDropdown from "./account-dropdown";


export default async function Navbar() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  return (
    <nav className="bg-green-700 text-white shadow-sm px-8 absolute w-full top-0 py-2">
      <div className="flex justify-between items-center">
        <Link href="/"> Home </Link>

        {!data?.user && (
          <Link
            className="p-2 px-4 hover:bg-white rounded-lg hover:text-black"
            href="/sign-in"
          >
            Sign in
          </Link>
        )}
        {!error && (
          <div className="flex flex-row items-center space-x-4">
            <AccountDropdown user={data.user} />
          </div>
        )}
      </div>
    </nav>
  );
}
