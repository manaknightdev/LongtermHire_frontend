import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

// function classNames(...classes: string[]) {
//   return classes.filter(Boolean).join(" ");
// }

interface IconCardsProps {
  projects: any[];
}

export default function IconCards({ projects }: IconCardsProps) {
  return (
    <div>
      <ul
        role="list"
        className=" min-w-screen mt-3 flex w-auto flex-shrink flex-col gap-5 py-3"
      >
        {projects?.map((project) => (
          <li
            key={project?.name}
            className="col-span-1 flex w-full rounded-md shadow-sm"
          >
            <div className="flex-shrink-0 pr-2">
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
              <div className="flex-1 truncate px-4 py-2 text-sm">
                <a
                  href={project?.href}
                  className="font-medium text-gray-900 hover:text-gray-600"
                >
                  {project?.name}
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
