import { useLottie } from "lottie-react";
import InputRoom from "./inputRoom";
import delivery from "../assets/delivery.json";

function Hero() {
  const options = {
    animationData: delivery,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options);

  return (
    <section className="relative w-full overflow-hidden bg-linear-to-b from-sky-50/50 to-white">
      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2 flex flex-col space-y-8 text-center lg:text-left items-center lg:items-start order-2 lg:order-1">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-sky-100 text-sky-700 ring-1 ring-inset ring-sky-700/10">
              Live Location Tracking
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.2]">
              Track anything, <br />
              <span className="text-sky-600">Anywhere in Real-time.</span>
            </h1>

            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Join a room and start monitoring your devices on a live map.
              Simple, secure, and lightning fast.
            </p>

            <div className="w-full max-w-md shadow-2xl shadow-sky-200/50 rounded-2xl overflow-hidden">
              <InputRoom />
            </div>
          </div>

          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="relative mx-auto w-full max-w-75 sm:sm:max-w-100 lg:max-w-full drop-shadow-2xl">
              <div className="absolute -inset-4 bg-sky-400 opacity-10 blur-3xl rounded-full"></div>
              <div className="relative">{View}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
