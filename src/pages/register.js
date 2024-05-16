import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { firstname, lastname, email, password, repeatpassword } =
      event.target.elements;

    if (password.value !== repeatpassword.value) {
      setError("Passwords do not match.");
      return;
    }

    const userData = {
      firstName: firstname.value,
      lastName: lastname.value,
      email: email.value,
      password: password.value,
    };

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/login");
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error registering:", error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Register new account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="firstname"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              id="firstname"
              name="firstname"
              type="text"
              required
              autoComplete="given-name"
              className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3"
            />
          </div>
          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              required
              autoComplete="family-name"
              className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3"
            />
          </div>
          <div>
            <label
              htmlFor="repeatpassword"
              className="block text-sm font-medium text-gray-700"
            >
              Repeat Password
            </label>
            <input
              id="repeatpassword"
              name="repeatpassword"
              type="password"
              required
              autoComplete="new-password"
              className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full font-medium rounded-lg text-sm py-3 focus:ring-4 focus:outline-none focus:ring-primary-300"
          >
            Register
          </button>
          <p className="text-sm text-gray-700 mt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-500 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export async function getServerSideProps() {
  try {
    const response = await fetch(process.env.SITE_URI + "/api/users");
    const users = await response.json();

    if (users && users.data.length > 0) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error("Error checking users:", error);
  }

  return {
    props: {},
  };
}
