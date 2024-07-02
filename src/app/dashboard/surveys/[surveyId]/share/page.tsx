"use client";
import { useState } from 'react';
import Link from "next/link";

export default function SharePage({
  params: { surveyId },
}: {
  params: {
    surveyId: string;
  };
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${process.env.APP_URL}/surveys/${surveyId}`);
    setCopied(true);
  };

  return (
    <>
      <p className="text-[26px] text-center text-[#4e4e4e] mt-[40px]">
        GENERATE LINK
      </p>
      <div className="flex flex-col justify-center items-center h-[405px]">
        <p className="w-[522px] mb-[50px] text-[17px] text-center text-[#909090]">
          You have successfully created your survey, here is the link that you
          can share with your participants.
        </p>
        <div
          className="w-[623px] h-[71px] flex rounded-[20px] relative justify-center items-center bg-[#4f35b6]/40"
          style={{ boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)" }}
        >
          <Link href={`${process.env.APP_URL}/surveys/${surveyId}`} className="text-[17px] p-[60px] text-[#00f]">
            {`${process.env.APP_URL}/surveys/${surveyId}`}
          </Link>
          <button
            className="flex gap-[10px] pe-5"
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : (
              <>
                <svg
                  width="33"
                  height="33"
                  viewBox="0 0 33 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[33px] h-[33px] cursor-pointer"
                  preserveAspectRatio="none"
                >
                  <g clip-path="url(#clip0_106_313)">
                    <path
                      d="M29.0742 0.976962C29.4633 0.970503 29.8498 1.04238 30.2105 1.18831C30.5713 1.33424 30.899 1.55125 31.1742 1.82643C31.4493 2.1016 31.6663 2.42931 31.8123 2.79006C31.9582 3.15082 32.0301 3.53724 32.0236 3.92634V21.336C32.0236 22.1056 31.7179 22.8436 31.1737 23.3878C30.6296 23.9319 29.8916 24.2376 29.122 24.2376H11.7243C10.9547 24.2376 10.2167 23.9319 9.67252 23.3878C9.12836 22.8436 8.82266 22.1056 8.82266 21.336V3.92634C8.81632 3.54129 8.88669 3.15884 9.02967 2.80127C9.17265 2.44369 9.38538 2.11816 9.65545 1.84364C9.92552 1.56912 10.2475 1.35111 10.6027 1.20231C10.9579 1.05352 11.3392 0.97691 11.7243 0.976962H29.0742Z"
                      fill="#4F35B6"
                    ></path>
                    <path
                      d="M11.7239 26.1723C10.4527 26.1535 9.23967 25.6361 8.34628 24.7315C7.45288 23.827 6.95057 22.6076 6.94758 21.3363V8.76261H3.92656C3.53644 8.7561 3.14901 8.82834 2.78745 8.97501C2.42589 9.12168 2.09762 9.33976 1.82228 9.61622C1.54695 9.89267 1.33019 10.2218 1.18498 10.584C1.03978 10.9461 0.969103 11.3338 0.977185 11.7239V29.0739C0.970726 29.463 1.0426 29.8494 1.18853 30.2102C1.33447 30.5709 1.55148 30.8986 1.82665 31.1738C2.10182 31.449 2.42953 31.666 2.79029 31.8119C3.15104 31.9578 3.53746 32.0297 3.92656 32.0233H21.3362C22.1058 32.0233 22.8438 31.7176 23.388 31.1734C23.9321 30.6292 24.2378 29.8912 24.2378 29.1217V26.1723H11.7239Z"
                      fill="#4F35B6"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_106_313">
                      <rect width="33" height="33" fill="white"></rect>
                    </clipPath>
                  </defs>
                </svg>
                <svg
                  width="33"
                  height="33"
                  viewBox="0 0 33 33"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[33px] h-[33px] cursor-pointer"
                  preserveAspectRatio="none"
                >
                  <g clip-path="url(#clip0_106_317)">
                    <path
                      d="M31.8701 0.0536579C31.7304 0.0568969 31.5926 0.0867646 31.4642 0.141658L1.20977 13.1096C1.0826 13.1636 0.966597 13.2408 0.867667 13.3373C0.311067 13.8939 0.0547673 14.5704 0.00636729 15.303C-0.0167327 15.6704 0.0151673 16.0653 0.234067 16.48C0.452967 16.8947 0.944667 17.2797 1.46057 17.3655L12.3704 19.1783C15.5472 16.2666 22.1802 10.782 22.1802 10.782C22.1802 10.782 16.3447 17.0751 13.8224 20.3839L15.6858 31.5907C15.724 31.8154 15.8312 32.0226 15.9927 32.1836C16.4866 32.6719 17.1532 32.9457 17.8478 32.9457C18.5424 32.9457 19.209 32.6719 19.703 32.1836C19.8034 32.0861 19.8837 31.9698 19.9395 31.8415L32.9085 1.58706C32.9818 1.41763 33.0112 1.23245 32.994 1.04864C32.9768 0.864829 32.9135 0.68833 32.81 0.535468C32.7064 0.382606 32.566 0.258318 32.4018 0.174102C32.2375 0.0898854 32.0546 0.0484601 31.8701 0.0536579Z"
                      fill="#4F35B6"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_106_317">
                      <rect width="33" height="33" fill="white"></rect>
                    </clipPath>
                  </defs>
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
