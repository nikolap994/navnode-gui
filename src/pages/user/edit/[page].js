import React from "react";
import Head from "next/head";
import { getSession } from "next-auth/react";
import Link from "next/link";

export default function EditUser(props) {
  const submitForm = async (e) => {
    e.preventDefault();

    const id = e.target.id.value;
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      id,
      update: {
        firstName,
        lastName,
        email,
      },
    });

    let requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${props.SITE_URI}/api/users`,
        requestOptions
      );
      await response.text();
      window.location.href = "/user/";
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <Head>
        <title>Edit User</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit User</h1>
          <Link
            href="/user/"
            className="inline-block bg-white text-indigo-700 font-semibold py-2 px-4 rounded-md border border-indigo-900 hover:bg-indigo-900 hover:text-white transition"
          >
            Back
          </Link>
        </div>

        <form onSubmit={submitForm}>
          <input type="hidden" name="id" defaultValue={props.user._id} />

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
              defaultValue={props.user.firstName}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
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
              defaultValue={props.user.lastName}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
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
              defaultValue={props.user.email}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
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
      redirect: { destination: "/" },
    };
  } else {
    const userId = context.query.page;

    if (typeof userId === "undefined") {
      return {
        redirect: { destination: "/" },
      };
    }

    let requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${process.env.SITE_URI}/api/users?id=${userId}`,
        requestOptions
      );
      const result = await response.json();
      const user = result.data[0];

      return {
        props: {
          user,
          SITE_URI: process.env.SITE_URI,
        },
      };
    } catch (error) {
      console.log("error", error);
      return {
        redirect: { destination: "/" },
      };
    }
  }
}
