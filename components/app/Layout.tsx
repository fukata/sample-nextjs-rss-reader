import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { signOut } from "next-auth/react";
import Loader from "./Loader";
import useRequireAuth from "@/lib/useRequireAuth";
import {pageTitle} from "@/lib/helper";

export default function Layout({ children }: { children: any }) {
  const session = useRequireAuth();
  if (session == null) return <Loader />;

  const currentUser: any = session!.user;

  return (
    <>
      <Head>
        <title>{pageTitle()}</title>
      </Head>
      <div>
        <div className="absolute left-0 right-0 h-16 border-b bg-white border-gray-200">
          <div className="flex justify-between items-center h-full max-w-screen-xl mx-auto px-10 sm:px-20">
            <div className="flex space-x-4">
              <Link href="/">
                <a className="flex justify-center items-center">
                  <div className="h-8 w-8 inline-block rounded-full overflow-hidden align-middle">
                    {currentUser.image &&
                      <Image
                        src={currentUser.image}
                        width={40}
                        height={40}
                        alt={currentUser.name || ''}
                      />
                    }
                  </div>
                  <span className="sm:block inline-block ml-3 font-medium truncate">
                    {currentUser.name}
                  </span>
                </a>
              </Link>
              <div className="h-8 border border-gray-300" />
              <button
                className="text-gray-500 hover:text-gray-700 transition-all ease-in-out duration-150"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="pt-28">{children}</div>
      </div>
    </>
  );
}
