import React from 'react';

export const AuthQuote = () => {
  return (
    <div className="relative hidden md:flex flex-col bg-zinc-900 text-white p-12">
      <div className="flex items-start">
        <img
          src="https://www.brandpublic.agency/wp-content/uploads/2024/11/WK-Light-Logo.svg"
          alt="Logo"
          className="h-[90px]"
        />
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="mt-auto">
          <blockquote className="space-y-3">
            <p className="text-2xl font-light leading-relaxed">
              "You can always amend a big plan, but you can never expand a little one. I don't believe in little plans. I believe in planes big enough to meet a situation which we can't possibly foresee now."
            </p>
            <footer className="text-lg text-zinc-400">Harry S. Truman</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};