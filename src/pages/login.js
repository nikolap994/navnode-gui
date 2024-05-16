import { getCsrfToken, getSession } from "next-auth/react";
import Link from "next/link";

export default function SignIn({ csrfToken }) {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Sign in to your account
        </h1>
        <form
          method="post"
          action="/api/auth/callback/credentials"
          className="space-y-4"
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              placeholder="Enter your email"
              autoComplete="email"
              name="email"
              type="email"
              required
              minLength="4"
              className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              placeholder="Enter your password"
              autoComplete="current-password"
              name="password"
              type="password"
              required
              minLength="4"
              className="bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3"
            />
          </div>
          <button
            type="submit"
            className="w-full font-medium rounded-lg text-sm py-3 focus:ring-4 focus:outline-none focus:ring-primary-300"
          >
            Login
          </button>
          <p className="text-sm text-gray-700 mt-2">
            Don’t have an account yet?{" "}
            <Link href="/register" className="text-primary-500 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
