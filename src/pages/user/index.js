import Head from "next/head";
import { getSession } from "next-auth/react";
import Link from "next/link";

export default function Users({ users }) {
  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`/api/users?_id=${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Users</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Users</h1>
          <Link
            href="/user/create"
            className="inline-block bg-white text-indigo-700 font-semibold py-2 px-4 rounded-md border border-indigo-900 hover:bg-indigo-900 hover:text-white transition"
          >
            Create new User
          </Link>
        </div>
        <div className="grid gap-4">
          {users.length > 0 &&
            users.map((user) => (
              <div
                className="p-4 border rounded-md flex justify-between items-center"
                key={user._id}
              >
                <div>
                  <h3 className="text-xl font-semibold">
                    {user.firstName} {user.lastName}
                  </h3>
                </div>
                <div>
                  <Link
                    href={`/user/edit/${user._id}`}
                    className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-900 transition"
                  >
                    Edit User
                  </Link>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="ml-4 bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-900 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
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

  try {
    const response = await fetch(process.env.SITE_URI + "/api/users", {
      method: "GET",
      redirect: "follow",
    });
    const data = await response.json();
    const users = data.data || [];

    return {
      props: {
        users,
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      props: {
        users: [],
      },
    };
  }
}
