import Link from "next/link";

export default function ActivityListCard() {
  const activities = [
    {
      name: "Activity 1",
      slug: "activity-1",
      description: "Activity 1: Create a simple to-do list application using Supabase.",
    },
    { name: "Activity 2", slug: "activity-2", description: 'Activity 2: Google Drive "Lite"' },
    {
      name: "Activity 3",
      slug: "activity-3",
      description: "Activity 3: Food Review App",
    },
    { name: "Activity 4", slug: "activity-4", description: "Activity 4: Pokemon Review App" },
    { name: "Activity 5", slug: "activity-5", description: "Activity 5: Markdown Notes App" },
  ];

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800 ">
            Godwin V. Bardiago
          </h2>
          <h2 className="text-md font-semibold text-gray-800 ">
            Technical Worksheet
          </h2>
          <h2 className="text-md font-semibold text-gray-800 mb-2">
            Multiple Activities App
          </h2>
          <h3 className="text-sm text-gray-800 mb-4">Date: February, 2025</h3>
          <ul className="space-y-2">
            {activities.map((activity, index) => (
              <li key={index}>
                <Link href={activity.slug}>
                  <button className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 ease-in-out rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <span className="text-gray-800">
                       {activity.description}
                    </span>
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
