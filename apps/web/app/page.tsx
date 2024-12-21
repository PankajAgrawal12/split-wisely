import { SignInButton } from "@clerk/nextjs"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-50 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 mb-8">
                  Welcome to SplitWisely
                </h1>
                <p className="text-gray-600 mb-8">
                  Split expenses with friends and family, hassle-free.
                </p>
                <SignInButton mode="modal">
                  <button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition hover:scale-105">
                    Sign Up Now
                  </button>
                </SignInButton>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Already have an account?{" "}
                  <SignInButton mode="modal">
                    <button className="text-indigo-500 hover:text-indigo-600">
                      Log in
                    </button>
                  </SignInButton>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}