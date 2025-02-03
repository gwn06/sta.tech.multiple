import {  MarkdownData } from "./markdown-app";

interface MarkdownListProps {
    markdownList: MarkdownData[];
    updateSelectedMarkdown: (markdown: MarkdownData | null) => void;
}
export default function MarkdownList({markdownList, updateSelectedMarkdown}: MarkdownListProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between bg-gray-600 shadow-sm p-2 rounded">
        <h1 className="text-2xl font-bold  text-white ">Markdown Notes</h1>
        <button onClick={() => updateSelectedMarkdown(null)} className=" font-bold text-white border-2 border-gray-200 px-2 text-2xl rounded-md hover:bg-gray-700">
          +
        </button>
      </div>
      <ul className="text-left">
        {markdownList.map((markdown, index) => (
          <li
          onClick={() => updateSelectedMarkdown(markdown)}
            className="font-bold p-1 m-1 ml-2 hover:bg-gray-100 rounded ease-in-out duration-300 overflow-hidden whitespace-nowrap text-ellipsis"
            key={index}
          >
            {markdown.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
