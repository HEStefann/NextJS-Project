"use client";
import {
  ChangeEvent,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { FaClone, FaTrash } from "react-icons/fa";
import { IoReorderThreeSharp } from "react-icons/io5";
import {
  ReactSortable,
  Sortable,
  SortableEvent,
  Store,
} from "react-sortablejs";
import Switch from "../Switch/Switch";
import { QuestionsDTO } from "@/types/QuestionDTO";
import { debounce, isNumber, noop } from "lodash";

interface SurveyQuestionListProps {
  surveyId: string;
}

export default function SurveyQuestionList({
  surveyId,
}: SurveyQuestionListProps) {
  const [questions, setQuestions] = useState<QuestionsDTO["data"]>([]);

  const getQuestions = useCallback(async () => {
    const response = await fetch(`/api/surveys/${surveyId}/questions`);
    const { data } = await response.json();
    data.forEach(
      (question: { text: string; id: SetStateAction<string | null> }) => {
        if (question.text === "") {
          setEditableId(question.id);
        }
      }
    );
    setQuestions(data);
  }, [surveyId]);

  const handleAddQuestion = async () => {
    const text = "";
    await fetch(`/api/surveys/${surveyId}/questions`, {
      method: "POST",
      body: JSON.stringify({
        text,
      }),
    });

    getQuestions();
  };
  const [questionText, setQuestionText] = useState<Record<string, string>>({});
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    setQuestionText({ ...questionText, [id]: e.target.innerText });
  };

  const handleQuestionTextChange = debounce(
    async (text: string, questionId: string) => {
      const response = await fetch(
        `/api/surveys/${surveyId}/questions/${questionId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            text: text,
          }),
        }
      );
      // remove editable id
      setEditableId("");
    },
    500
  );

  const handlePositionChange = async (event: SortableEvent) => {
    // Check if oldIndex is a number
    if (!isNumber(event.oldIndex) || !isNumber(event.newIndex)) return;

    // Create a copy of the questions array
    let newQuestions = [...questions];

    // Remove the question from its old position
    let [movedQuestion] = newQuestions.splice(event.oldIndex, 1);

    // Insert the question at its new position
    newQuestions.splice(event.newIndex, 0, movedQuestion);

    // Update the positions of all questions
    newQuestions.forEach((question, index) => {
      question.position = index;
    });

    // Set the new questions array
    setQuestions(newQuestions);

    // Send the updated questions to the server
    for (let question of newQuestions) {
      await fetch(`/api/surveys/${surveyId}/questions/${question.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          position: question.position,
        }),
      });
    }

    getQuestions();
  };

  const handleIsRequiredChange = async (
    questionId: string,
    required: boolean
  ) => {
    await fetch(`/api/surveys/${surveyId}/questions/${questionId}`, {
      method: "PATCH",
      body: JSON.stringify({
        required,
      }),
    });

    getQuestions();
  };

  const deleteQuestion = async (questionId: string) => {
    const isSureToDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );
    if (isSureToDelete) {
      await fetch(`/api/surveys/${surveyId}/questions/${questionId}`, {
        method: "DELETE",
      });
    }
    getQuestions();
  };

  const cloneQuestion = async (question: QuestionsDTO["data"][0]) => {
    const newPosition = questions.length;
    await fetch(`/api/surveys/${surveyId}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...question,
        position: newPosition,
      }),
    });

    getQuestions();
  };
  const [editableId, setEditableId] = useState<string | null>(null);

  const editQuestion = (id: string) => {
    setEditableId(id);
  };

  useEffect(() => {
    getQuestions();
  }, [getQuestions]);

  return (
    <div className="h-full mb-[100px] flex flex-col justify-center mt-[60px]">
      <div className="flex flex-col gap-[8px]">
        <ReactSortable
          list={questions}
          setList={noop}
          animation={200}
          handle=".handle"
          className="flex flex-col gap-[20px]"
          onEnd={handlePositionChange}
        >
          {questions.map((question, index) => (
            <div
              key={index}
              className="flex items-center w-[699px] gap-5 px-[25px] py-[5px] rounded-xl h-[65px]"
              style={{
                background:
                  "linear-gradient(51.34deg, rgba(79,53,182,0.4) 25.53%, rgba(79,53,182,0) 82.48%)",
                boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)",
              }}
            >
              <div className="flex gap-[10px] justify-center items-center handle cursor-move">
                <svg
                  width={12}
                  height={32}
                  viewBox="0 0 12 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-8"
                  preserveAspectRatio="none"
                >
                  <g clip-path="url(#clip0_204_1146)">
                    <path
                      d="M8 20V26H12L6 32L0 26H4V20H8ZM4 12V6H0L6 0L12 6H8V12H4Z"
                      fill="#4E4E50"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_204_1146">
                      <rect width={12} height={32} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="text-base font-medium text-black">
                  {question.position + 1}
                </p>
              </div>
              <p
                className="w-full text-base pl-[3px] font-medium text-[#4e4e4e] break-all"
                contentEditable={editableId === question.id}
                onInput={(e: ChangeEvent<HTMLInputElement>) =>
                  handleTextChange(e, question.id)
                }
                suppressContentEditableWarning={true}
                style={{
                  backgroundColor: editableId === question.id ? "white" : "",
                }}
              >
                {question.text}
              </p>
              <p className="text-sm font-medium text-right text-black">
                Required?
              </p>
              <Switch
                id={question.id}
                initialState={question.required}
                onToggle={(state) => handleIsRequiredChange(question.id, state)}
              />
              <div className="flex items-center gap-[5px]">
                {editableId !== question.id ? (
                  <>
                    <button>
                      <svg
                        width="33"
                        height="34"
                        viewBox="0 0 33 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[33px] h-[33px]"
                        preserveAspectRatio="none"
                        onClick={() => cloneQuestion(question)}
                      >
                        <path
                          d="M29.0742 1.47696C29.4633 1.4705 29.8498 1.54238 30.2105 1.68831C30.5713 1.83424 30.899 2.05125 31.1742 2.32643C31.4493 2.6016 31.6663 2.92931 31.8123 3.29006C31.9582 3.65082 32.0301 4.03724 32.0236 4.42634V21.836C32.0236 22.6056 31.7179 23.3436 31.1738 23.8878C30.6296 24.4319 29.8916 24.7376 29.122 24.7376H11.7243C10.9547 24.7376 10.2167 24.4319 9.67252 23.8878C9.12836 23.3436 8.82266 22.6056 8.82266 21.836V4.42634C8.81632 4.04129 8.88669 3.65884 9.02967 3.30127C9.17265 2.94369 9.38538 2.61816 9.65545 2.34364C9.92552 2.06912 10.2475 1.85111 10.6027 1.70231C10.9579 1.55352 11.3392 1.47691 11.7243 1.47696H29.0742Z"
                          fill="#4F35B6"
                        ></path>
                        <path
                          d="M11.7239 26.6723C10.4527 26.6535 9.23967 26.1361 8.34628 25.2315C7.45288 24.327 6.95057 23.1076 6.94758 21.8363V9.26261H3.92656C3.53644 9.2561 3.14901 9.32834 2.78745 9.47501C2.42589 9.62168 2.09762 9.83976 1.82228 10.1162C1.54695 10.3927 1.33019 10.7218 1.18498 11.084C1.03978 11.4461 0.969103 11.8338 0.977185 12.2239V29.5739C0.970726 29.963 1.0426 30.3494 1.18853 30.7102C1.33447 31.0709 1.55148 31.3986 1.82665 31.6738C2.10182 31.949 2.42953 32.166 2.79029 32.3119C3.15104 32.4579 3.53746 32.5297 3.92656 32.5233H21.3362C22.1058 32.5233 22.8438 32.2176 23.388 31.6734C23.9321 31.1292 24.2378 30.3912 24.2378 29.6217V26.6723H11.7239Z"
                          fill="#4F35B6"
                        ></path>
                      </svg>
                    </button>
                    <button>
                      <svg
                        width="33"
                        height="34"
                        viewBox="0 0 33 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-[33px] h-[33px]"
                        preserveAspectRatio="none"
                        onClick={() => editQuestion(question.id)}
                      >
                        <g clip-path="url(#clip0_293_1359)">
                          <path
                            d="M26.6705 0.541992C26.0952 0.541992 25.5189 0.758255 25.0864 1.19188L22.6185 3.65969L29.842 10.8809L32.3076 8.41309C33.1726 7.54804 33.1726 6.10885 32.3076 5.24379L28.2546 1.19188C27.822 0.758255 27.2457 0.541992 26.6705 0.541992ZM21.0652 5.21196L3.20536 23.0729C3.0857 23.1925 2.99569 23.3396 2.9397 23.5021C2.13942 25.903 0.705712 29.8242 0.0854648 32.0681C-0.135189 32.8695 0.579467 33.616 1.38963 33.4294C4.05944 32.8124 7.63272 31.348 9.99624 30.5608C10.1565 30.5082 10.3047 30.4192 10.4266 30.3018L28.2864 12.4354L21.0652 5.21196Z"
                            fill="#4F35B6"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_293_1359">
                            <rect
                              width="33"
                              height="33"
                              fill="white"
                              transform="translate(0 0.5)"
                            ></rect>
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                  </>
                ) : (
                  <button
                    className="flex justify-center items-center ml-[-11px] gap-2.5 p-[5px] rounded-xl bg-[#4f35b6]/[0.66] text-[17px] text-center text-white"
                    style={{ boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)" }}
                    onClick={() =>
                      handleQuestionTextChange(
                        questionText[question.id],
                        question.id
                      )
                    }
                  >
                    Save
                    <svg
                      width={33}
                      height={33}
                      viewBox="0 0 33 33"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[20px] h-[20px]"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <g clip-path="url(#clip0_294_1578)">
                        <path
                          d="M32.3087 11.5814L21.4187 0.691389C21.2514 0.528128 21.0542 0.398708 20.8379 0.310239C20.6129 0.218794 20.3729 0.169573 20.13 0.165039H5.61004C4.16594 0.165039 2.78098 0.738707 1.75984 1.75984C0.738707 2.78098 0.165039 4.16594 0.165039 5.61004V27.39C0.165039 28.8341 0.738707 30.2191 1.75984 31.2402C2.78098 32.2614 4.16594 32.835 5.61004 32.835H27.39C28.8341 32.835 30.2191 32.2614 31.2402 31.2402C32.2614 30.2191 32.835 28.8341 32.835 27.39V12.87C32.8364 12.6312 32.7906 12.3944 32.7003 12.1732C32.61 11.9521 32.4769 11.751 32.3087 11.5814ZM11.055 3.79504H18.315V7.42504H11.055V3.79504ZM21.945 29.205H11.055V23.76C11.055 23.2787 11.2463 22.817 11.5866 22.4766C11.927 22.1363 12.3887 21.945 12.87 21.945H20.13C20.6114 21.945 21.0731 22.1363 21.4134 22.4766C21.7538 22.817 21.945 23.2787 21.945 23.76V29.205ZM29.205 27.39C29.205 27.8714 29.0138 28.3331 28.6734 28.6734C28.3331 29.0138 27.8714 29.205 27.39 29.205H25.575V23.76C25.575 22.3159 25.0014 20.931 23.9802 19.9098C22.9591 18.8887 21.5741 18.315 20.13 18.315H12.87C11.4259 18.315 10.041 18.8887 9.01984 19.9098C7.99871 20.931 7.42504 22.3159 7.42504 23.76V29.205H5.61004C5.12867 29.205 4.66702 29.0138 4.32664 28.6734C3.98626 28.3331 3.79504 27.8714 3.79504 27.39V5.61004C3.79504 5.12867 3.98626 4.66702 4.32664 4.32664C4.66702 3.98626 5.12867 3.79504 5.61004 3.79504H7.42504V9.24004C7.42504 9.72141 7.61626 10.1831 7.95664 10.5234C8.29702 10.8638 8.75867 11.055 9.24004 11.055H20.13C20.6114 11.055 21.0731 10.8638 21.4134 10.5234C21.7538 10.1831 21.945 9.72141 21.945 9.24004V6.35419L29.205 13.6142V27.39Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_294_1578">
                          <rect width={33} height={33} fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                )}
                <button>
                  <svg
                    width="33"
                    height="34"
                    viewBox="0 0 33 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[33px] h-[33px]"
                    preserveAspectRatio="none"
                    onClick={() => deleteQuestion(question.id)}
                  >
                    <g clip-path="url(#clip0_293_1354)">
                      <path
                        d="M10.2701 10.5478H12.7229V26.5242H10.2701V10.5478ZM15.1757 10.5478H17.6285V26.5242H15.1757V10.5478ZM20.0813 10.5478H22.5341V26.5242H20.0813V10.5478ZM0.458984 4.55664H32.3452V6.55369H0.458984V4.55664Z"
                        fill="#4F35B6"
                      ></path>
                      <path
                        d="M22.452 5.55496H20.1627V3.55791C20.1627 2.9588 19.5904 2.49282 18.8546 2.49282H13.949C13.2131 2.49282 12.6408 2.9588 12.6408 3.55791V5.55496H10.3516V3.55791C10.3516 1.96027 11.9867 0.628906 13.949 0.628906H18.8546C20.8168 0.628906 22.452 1.96027 22.452 3.55791V5.55496Z"
                        fill="#4F35B6"
                      ></path>
                      <path
                        d="M23.7608 32.515H9.04408C7.08185 32.515 5.3649 31.1837 5.20138 29.586L2.91211 5.62142L5.3649 5.48828L7.65417 29.4529C7.73593 30.052 8.39 30.518 9.04408 30.518H23.7608C24.4966 30.518 25.1507 29.9854 25.1507 29.4529L27.44 5.48828L29.8928 5.62142L27.6035 29.586C27.44 31.2502 25.723 32.515 23.7608 32.515Z"
                        fill="#4F35B6"
                      ></path>
                    </g>
                    <defs>
                      <clipPath id="clip0_293_1354">
                        <rect
                          width="33"
                          height="33"
                          fill="white"
                          transform="translate(0 0.5)"
                        ></rect>
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </ReactSortable>
      </div>
      <button
        className="mt-5 flex justify-center items-center px-2.5 py-[9px] rounded-xl bg-[#4f35b6]/[0.66] text-[17px] text-center text-white"
        style={{ boxShadow: "0px 2px 12px 0 rgba(32,32,32,0.18)" }}
        onClick={handleAddQuestion}
      >
        New question
      </button>
    </div>
  );
}
