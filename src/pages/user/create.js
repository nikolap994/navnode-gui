import React from "react";
import Head from "next/head";
import { getSession } from "next-auth/react";
import Link from "next/link";

export default function CreateUser(props) {
  const submitForm = async (e) => {
    e.preventDefault();
    const SITE_URI = props.SITE_URI;
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const password = e.target.password.value;
    const email = e.target.email.value;

    if (firstName && lastName && password && email) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          password,
          email,
        }),
      };

      try {
        const response = await fetch(`${SITE_URI}/api/users`, requestOptions);
        const result = await response.json();
        if (result.data._id) {
          console.log("New User Created");
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  return (
    <>
      <Head>
        <title>New User</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Users</h1>
          <Link
            href="/user/"
            className="inline-block bg-white text-indigo-700 font-semibold py-2 px-4 rounded-md border border-indigo-900 hover:bg-indigo-900 hover:text-white transition"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto mt-8 px-4">
        <form onSubmit={submitForm}>
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              required
              type="text"
              name="firstName"
              id="firstName"
              className="mt-1 p-3 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              required
              type="text"
              name="lastName"
              id="lastName"
              className="mt-1 p-3 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              required
              type="email"
              name="email"
              id="email"
              className="mt-1 p-3 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              required
              type="password"
              name="password"
              id="password"
              className="mt-1 p-3 w-full border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-700 text-white py-3 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      SITE_URI: process.env.SITE_URI,
    },
  };
}
