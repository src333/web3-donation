import React from "react";

const Contact = () => {
  return (
    
    <div className="px-0 py-0 sm:px-0 lg:px-0 bg-white text-gray-800">
      <div className="relative bg-green-700 text-white py-16 text-center">
        {/* SVG wave */}
        <svg
          className="absolute bottom-0 left-0 w-full h-20 text-white"
          viewBox="0 0 1160 163"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M-164 13L-104 39.7C-44 66 76 120 196 141C316 162 436 152 556 119.7C676 88 796 34 916 13C1036 -8 1156 2 
            1216 7.7L1276 13V163H1216C1156 163 1036 163 916 163C796 163 676 163 556 163C436 163 316 163 196 163C76 163 
            -44 163 -104 163H-164V13Z"
          />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-green-800 mb-2">
            Contact Us
          </h1>
          <p className="text-gray-600">We'd love to hear from you.</p>
        </div>
        <div className="px-4 py-10 sm:px-6 lg:px-20 bg-white text-gray-800">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form className="space-y-5 bg-gray-50 p-6 rounded-xl shadow-md">
              <div>
                <label className="block mb-1 font-medium text-green-800">Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-green-800">Email</label>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-green-800">Subject</label>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-green-800">Message</label>
                <textarea
                  rows="4"
                  placeholder="Type your message here"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-green-700 text-white font-semibold px-6 py-2 rounded-md hover:bg-green-900 transition cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Address & Info */}
          <div className="space-y-6 text-green-900">
            <div className="p-4 bg-gray-100 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-2">Our Address</h2>
              <p>81-83 Duckett Street, E1 4TD</p>
              <p>London, United Kingdom</p>
            </div>

            <div className="p-4 bg-gray-100 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-2">Phone</h2>
              <p><a href="tel:02072658603">020 7265 8603</a></p>
              <p><a href="tel:07442490694">07442 490694</a></p>
            </div>

            <div className="p-4 bg-gray-100 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-2">Email</h2>
              <p><a href="mailto:info@yourmosque.org.uk">info@yourmosque.org.uk</a></p>
            </div>
          </div>
        </div>

        {/* Google Map */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-4 text-green-800">Find us on Google Map</h2>
          <iframe
            title="Mosque Location"
            className="w-full rounded-xl shadow"
            height="450"
            allowFullScreen=""
            loading="lazy"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.6283128516757!2d-0.04344862309968954!3d51.52003470977989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761d2c00e4f49b%3A0x1646fa18ee130fe1!2sStepney%20Shahjalal%20Mosque%20%26%20Cultural%20Centre!5e0!3m2!1sen!2suk!4v1685965587410!5m2!1sen!2suk"
          ></iframe>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Contact;
