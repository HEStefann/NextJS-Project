"use client";
import { SurveyDTO } from "@/types/SurveyDTO";
import { useMemo } from "react";

interface SurveyFormProps {
  title: string;
  buttonText: string;
  defaultValues?: SurveyDTO["data"];
  action: (formData: FormData) => Promise<void>;
}

export default function SurveyForm(props: SurveyFormProps) {
  const defaultValues: Partial<SurveyDTO["data"]> = useMemo(() => {
    return props.defaultValues || {};
  }, [props]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (defaultValues.id) {
      try {
        await props.action(formData);
        window.alert("Survey updated successfully");
      } catch (error) {
        window.alert("Failed to update survey");
      }
    } else {
      await props.action(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-[26px] my-[40px] text-center text-[#4e4e4e]">
        {props.title}
      </p>
      <div className="flex flex-col gap-[28px]">
        <div className="flex flex-col gap-[27px]">
          <label className="text-[17px] pl-[14px] text-[#909090]">
            Еnter the name of survey
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={defaultValues.name}
            className="w-[623px] h-[65px] p-[15px] rounded-[20px] bg-[#4f35b6]/40"
            style={{ boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)" }}
          />
        </div>
        <div className="flex flex-col gap-[27px]">
          <label className="text-[17px] pl-[14px] text-[#909090]">
            Еnter the admin email
          </label>
          <input
            className="w-[623px] h-[65px] p-[15px] rounded-[20px] bg-[#4f35b6]/40"
            style={{ boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)" }}
            id="manager"
            name="manager"
            type="email"
            required
            defaultValue={defaultValues.manager}
          />
        </div>
        <div className="flex flex-col gap-[27px]">
          <label className="text-[17px] pl-[14px] text-[#909090]">
            Еnter the introductory message
          </label>
          <textarea
            className="w-[623px] h-[107px] p-[15px] rounded-[20px] bg-[#4f35b6]/40"
            style={{ boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)" }}
            id="introduction"
            name="introduction"
            rows={6}
            defaultValue={defaultValues.introduction!}
          />
        </div>
      </div>
      <select
        className="w-[623px] h-[56px] mt-5 px-[15px] rounded-[20px] text-black bg-[#4f35b6]/40"
        style={{ boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)" }}
        id="status"
        name="status"
        defaultValue={defaultValues.status}
      >
        <option value="DRAFT">Draft</option>
        <option value="ONGOING">Ongoing</option>
        <option value="FINISHED">Finished</option>
      </select>
      <div className="flex mt-[55px] justify-center mb-[37px]">
        <button
          className="w-[102px] h-10 rounded-xl bg-[#4f35b6]/[0.66] text-[17px] text-center text-white"
          style={{ boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)" }}
        >
          {props.buttonText}
        </button>
      </div>
    </form>
  );
}
