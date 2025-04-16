import { CheckIcon } from "@/assets/svgs/CheckIcon";
import { pricing_data } from "./pricing-data";

export default function LandingPricing() {
  return (
    <>
      <div className=" my-[6rem] md:mx-[6rem]">
        <div className="mx-auto my-8 w-[868px] max-w-full text-center">
          <p className="text-orange-500">Pricing</p>
          <h1 className="bg-gradient-to-r from-[#262626] to-[#525252] bg-clip-text text-3xl leading-tight text-transparent md:text-5xl">
            Every business has different needs
          </h1>
          <p className="mx-auto max-w-full py-4 text-gray-500 md:w-9/12">
            We offer flexible pricing plans tailored to meet the needs and
            demand of solopreneurs to large agencies.
          </p>
        </div>

        <div>
          <div className="flex justify-center gap-3">
            <p>Monthly</p>
            <div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" value="" className="peer sr-only" />
                <div className="dark:peer-focus:gray-300 peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] checked:outline-none focus:outline-none peer-checked:bg-gray-200 peer-checked:outline-none peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4  dark:border-gray-200 dark:bg-gray-300"></div>
              </label>
            </div>
            <p>Annually</p>
          </div>
          <div className="mx-auto mt-3 w-fit rounded-full bg-gray-900 px-4 py-1 text-center">
            <p className="text-sm text-gray-200">Save 25% on Annual plan 🔥</p>
          </div>
        </div>

        <div className="mt-5 grid gap-8 md:grid-cols-3">
          {pricing_data.map((item, i) => (
            <div
              key={i}
              className="w-full rounded-[8px] border border-gray-300 bg-gray-100 px-5 py-9"
            >
              <div className="text-center">
                <div>{item.icon}</div>
                <p className="my-2">{item.plan}</p>
                <div className="flex justify-center gap-2">
                  <h3 className="font-bold">${item.price}</h3>
                  <p className="text-gray-500">/month</p>
                </div>
              </div>
              <button
                className={
                  i === 1
                    ? "my-3 w-full rounded-[8px] border border-gray-300 bg-indigo-600 py-2  text-sm text-white"
                    : `my-3 w-full rounded-[8px] border border-gray-300 bg-white py-2 text-sm`
                }
              >
                Start free trial
              </button>

              <div className="mt-3 flex flex-col gap-3">
                {item.features.map((item, index) => (
                  <div className="flex items-center gap-3" key={index}>
                    <div>
                      <CheckIcon />
                    </div>
                    <p className="text-sm text-gray-800">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
