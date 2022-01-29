import Head from "next/head";
import Link from "next/link";
import {pageTitle} from "@/lib/helper";

export default function Index() {
  return (
    <div className="">
      <Head>
        <title>{pageTitle()}</title>
      </Head>
      <div className="">
        <h1>{pageTitle()}</h1>

        <Link href="/login">ログイン</Link>
      </div>
    </div>
  );
}
