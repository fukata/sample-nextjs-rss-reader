import { signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import LoadingDots from "@/components/app/loading-dots";

// TODO: 複数ヶ所でアプリタイトルを取得しているのでまとめる
const pageTitle = "Login";
const logo = "/favicon.ico";
const description =
  "Platforms Starter Kit is a comprehensive template for building multi-tenant applications with custom domains.";

export default function Login() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>{pageTitle}</title>
        <link rel="icon" href={logo} />
        <link rel="shortcut icon" type="image/x-icon" href={logo} />
        <link rel="apple-touch-icon" sizes="180x180" href={logo} />
        <meta name="theme-color" content="#7b46f6" />

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta itemProp="name" content={pageTitle} />
        <meta itemProp="description" content={description} />
        <meta itemProp="image" content={logo} />
        <meta name="description" content={description} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={logo} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Elegance" />
        <meta name="twitter:creator" content="@StevenTey" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={logo} />
      </Head>
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Image
          src="/logo.png"
          className="mx-auto h-12 w-auto"
          alt="Platforms Starter Kit"
          width="48px"
          height="48px"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sample App
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
         <p className="text-gray-600 text-center">Login with</p>
          <button
            disabled={loading}
            onClick={() => {
              setLoading(true);
              signIn("google");
            }}
            className={`${
              loading ? "cursor-not-allowed bg-white" : "bg-white"
            } hover:bg-gray-100 group flex justify-center items-center space-x-5 w-full sm:px-4 h-16 rounded-md focus:outline-none border border-2 border-gray`}
          >
            {loading ? (
              <LoadingDots color="#000" />
            ) : (
              <Image
                src="/google-logo.svg"
                className="w-6 h-6"
                alt="Login with Google"
                width="28px"
                height="28px"
              />
            )}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            下記の利用規約に同意したものとします。<br />
            <a
              href="/terms.html"
              target="_blank"
              className="font-medium"
            >
              利用規約
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
