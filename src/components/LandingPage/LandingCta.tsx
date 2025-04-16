import SpiralArrow from "@/assets/svgs/SpiralArrow";

export default function LandingCta() {
  return (
    <div className="my-[6rem]">
      <div
        style={{ backgroundImage: `url(/images/dots-pattern.png)` }}
        className="relative mx-auto flex w-[868px] max-w-full flex-col items-center justify-between gap-20 rounded-[8px] bg-gray-900 px-[40px] py-[4rem] text-white md:flex-row"
      >
        <div className="flex-[50%]">
          <h3>Give it a try - risk free!</h3>
          <p className="mt-2 text-sm text-gray-200">
            See for yourself how Baas can speed up your work 10x 🔥. Aenean diam
            nisl, gravida varius ligula sed, efficitur sagittis mi. Duis at
            justo eu dui hendrerit finibus sit amet sed lorem.
          </p>
        </div>
        <div className="absolute bottom-0 left-[50%] hidden translate-x-[-10%] md:block">
          <SpiralArrow />
        </div>
        <div className="flex-[30%] text-center">
          <button className="w-full rounded-[6px] bg-indigo-600 px-[20px] py-[10px] text-xs text-white shadow-sm">
            Start FREE Trial
          </button>
          <p className="mt-4 text-xs text-gray-200">
            (No credit card required)
          </p>
        </div>
      </div>
    </div>
  );
}
