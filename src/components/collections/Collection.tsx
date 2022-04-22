import { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useSubsContext } from "../../MySubs";
import { loadSubredditInfo } from "../../RedditAPI";
import SubButton from "../SubButton";
import { AiOutlineCheck } from "react-icons/ai";
import CollectionOptions from "./CollectionOptions";
import {
  BsBoxArrowInUpRight,
  BsChevronDown,
  BsArrowRight,
} from "react-icons/bs";
import { useCollectionContext } from "./CollectionContext";
const CheckBox = ({ toggled }) => {
  return (
    <div
      className={
        "flex h-full border rounded-md transition-all items-center justify-center  " +
        (toggled
          ? " dark:bg-blue-600 bg-blue-400 border-blue-400 dark:border-blue-600"
          : " dark:group-hover:bg-darkBorder group-hover:bg-lightBorder border-lightBorder dark:border-darkBorder ")
      }
    >
      <AiOutlineCheck
        className={
          " transition-all text-white" + (toggled ? " scale-100 " : " scale-0")
        }
      />
    </div>
  );
};

const Collection = ({
  name = "Name",
  subreddits = [],
  icon = "",
  over_18 = false,
  owner = "",
  key_color = "",
}) => {
  const [expand, setExpand] = useState(true);
  const [toggledSubs, setToggledSubs] = useState([]);
  const [allToggled, setAllToggled] = useState(false);
  // const [sortedSubs, setSortedSubs] = useState([]);
  const mySubs: any = useSubsContext();
  const myCollections: any = useCollectionContext();
  const { selected, toggleSelected, toggleAllSelected } = myCollections;
  useEffect(() => {
    setAllToggled(
      selected?.filter((s) =>
        subreddits.find((sub) => sub?.toUpperCase() === s?.toUpperCase())
      )?.length == subreddits.length
    );
    return () => {};
  }, [selected, subreddits]);

  const toggleSub = (sub) => {
    toggleSelected(sub);
  };

  const toggleAll = () => {
    toggleAllSelected(subreddits);
  };

  const toggleExpand = () => {
    setExpand((e) => !e);
  };

  return (
    <div
      className={
        "relative  transition-colors bg-contain border border-gray-300 shadow-md bg-lightPost  dark:bg-darkBG dark:border-trueGray-700  rounded-md select-none dark:hover:border-trueGray-500 hover:border-gray-400"
      }
    >
      <div
        className={` absolute  w-full h-16 bg-cover bg-center  rounded-t-md bg-blue-400 dark:bg-red-800 `}
      ></div>
      <div className="flex flex-col mx-2 my-2 ">
        <div className="flex flex-row mt-6">
          <div className="z-20 flex-none w-16 h-16 border-2 rounded-full dark:bg-darkBG bg-lightPost">
            {icon?.includes("https://") ? (
              <>
                <Image
                  src={icon}
                  alt=""
                  height={256}
                  width={256}
                  unoptimized={true}
                  objectFit="cover"
                  className={"rounded-full "}
                />
              </>
            ) : (
              <div
                className={
                  "rounded-full bg-red-400 " +
                  " w-full h-full  text-lightText text-6xl items-center justify-center flex overflow-hidden"
                }
              >
                {" m/"}
              </div>
            )}
          </div>
          <div className="z-10 flex flex-row items-baseline gap-2 p-1 pr-4 mt-1 pl-11 -ml-9 rounded-tr-md pl-auto dark:bg-darkBG bg-lightPost ">
            <div
              className="flex flex-row items-baseline gap-2 cursor-pointer group "
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleAll();
              }}
            >
              <div className="w-6 h-6 group-hover:cursor-pointer">
                <CheckBox toggled={allToggled} />
              </div>
              <h1 className="text-base ">{name}</h1>
            </div>

            {over_18 && (
              <span className="text-xs text-red-400 text-color dark:text-red-700 pb-0.5">
                NSFW
              </span>
            )}
          </div>
        </div>
        <div className="z-30 flex flex-row pl-5 -mt-7 ml-14 ">
          <div
            className="flex flex-row flex-grow group hover:cursor-pointer "
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleExpand();
            }}
          >
            <span className="my-auto text-xs opacity-70">
              A collection of {subreddits.length} subreddits
            </span>

            <div className="flex items-center justify-center w-10 h-8 ml-auto border border-transparent rounded-md group-hover:bg-lightHighlight dark:group-hover:bg-darkHighlight group-hover:border-lightBorderHighlight dark:group-hover:border-transparent">
              <BsChevronDown
                className={
                  (expand ? "-rotate-180 " : "rotate-0 ") +
                  "transform transition duration-200"
                }
              />
            </div>
          </div>
          <div className="ml-2 "></div>
          <CollectionOptions
            subArray={selected?.filter((s) =>
              subreddits.find((sub) => sub?.toUpperCase() === s?.toUpperCase())
            )}
            currMulti={name}
          />
          <div className="mr-1 "></div>
          <Link href={`/r/${subreddits.join("+")}?m=${name}`} passHref>
            <a className="flex items-center justify-center w-10 h-8 border rounded-md border-lightBorder hover:border-lightBorderHighlight hover:dark:bg-darkHighlight dark:border-darkBorder hover:bg-lightHighlight dark:hover:border-darkBorderHighlight">
              <BsArrowRight />
            </a>
          </Link>
        </div>
        <div
          className={
            //"flex flex-row flex-wrap gap-2 transition-all  overflow-hidden    " +
            "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 overflow-hidden transition-all" +
            (expand ? " max-h-[100rem] my-2  " : " max-h-0  ")
          }
        >
          {subreddits
            ?.sort((a, b) => {
              let A = a?.toUpperCase();
              let B = b?.toUpperCase();
              return A < B ? -1 : A > B ? 1 : 0;
            })
            ?.map((sub, i) => (
              <div
                className="flex flex-row-reverse items-center text-sm border rounded-md overflow-ellipsis dark:border-darkBorder"
                key={sub + i}
              >
                <div className="flex flex-row items-center flex-none ml-auto">
                  <Link href={`/r/${sub}`} passHref>
                    <a>
                      <BsBoxArrowInUpRight className="ml-0.5 w-3 h-3 transition-transform hover:scale-125" />
                    </a>
                  </Link>

                  <div className="flex-none w-5 h-5 mx-2">
                    <SubButton
                      sub={sub}
                      miniMode={true}
                      userMode={sub?.substring(0, 2) == "u_"}
                    />
                  </div>
                </div>
                <div
                  className="flex flex-row items-center flex-grow p-2 truncate rounded-md hover:cursor-pointer group"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleSub(sub);
                  }}
                >
                  <div className="flex-none w-5 h-5 mr-1">
                    <CheckBox
                      toggled={selected.find(
                        (s) => s?.toUpperCase() === sub?.toUpperCase()
                      )}
                    />
                  </div>

                  <span title={sub} className="ml-auto truncate select-none">
                    {sub}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
