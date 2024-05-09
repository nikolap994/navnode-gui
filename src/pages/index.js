import Link from "next/link";
import path from "path";
import fs from "fs";

const ProjectsPage = ({ serverNames }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        Available Project Configurations
      </h1>
      <ul>
        {serverNames.map((serverName) => (
          <li key={serverName}>
            <Link
              className="text-blue-600 hover:underline"
              href={`/project/${encodeURIComponent(serverName)}`}
            >
              {serverName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export async function getStaticProps() {
  const deploymentsDir = path.join(process.cwd(), "config");
  const fileNames = fs.readdirSync(deploymentsDir);
  const serverNames = fileNames.map((fileName) => path.parse(fileName).name);

  return {
    props: {
      serverNames,
    },
  };
}

export default ProjectsPage;
